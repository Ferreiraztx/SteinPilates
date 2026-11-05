import { handleApiRequest } from "./server/routes/api.routes.js";
import { PrismaClient } from "@prisma/client";
import { createServer } from "node:http";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = fileURLToPath(new URL(".", import.meta.url));
const prisma = new PrismaClient();
const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || "127.0.0.1";
const adminUser = process.env.ADMIN_USER;
const adminPassword = process.env.ADMIN_PASSWORD;
const allowedOrigins = (process.env.FRONTEND_ORIGIN || `http://${host}:${port}`)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const sessions = new Map();
const today = () => new Date().toISOString().slice(0, 10);
const hashPassword = (password) => {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
};
const verifyPassword = (password, storedHash) => {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
};

if (!adminUser || !adminPassword || adminPassword.length < 12) {
  throw new Error("Configure ADMIN_USER e ADMIN_PASSWORD (mínimo 12 caracteres) no arquivo .env.");
}

const securityHeaders = (response, origin = allowedOrigins[0]) => {
  response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Vary", "Origin");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "same-origin");
  response.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'");
};

const send = (response, status, body, origin) => {
  securityHeaders(response, origin);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body));
};

const parseCookies = (header = "") => Object.fromEntries(
  header.split(";").map((part) => part.trim().split("=")).filter(([key, value]) => key && value),
);

const cookie = (name, value, options = {}) => [
  `${name}=${value}`,
  "Path=/",
  "HttpOnly",
  "SameSite=Strict",
  options.maxAge === 0 ? "Max-Age=0" : `Max-Age=${options.maxAge || 86400}`,
  options.secure ? "Secure" : "",
].filter(Boolean).join("; ");

const getSession = (request) => {
  const sessionId = parseCookies(request.headers.cookie).stein_session;
  return sessionId ? sessions.get(sessionId) : null;
};

const requireSession = (request, response) => {
  const session = getSession(request);
  if (!session) {
    send(response, 401, { error: "Autenticação necessária." });
    return null;
  }
  const csrfToken = parseCookies(request.headers.cookie).stein_csrf;
  if (request.method !== "GET" && request.method !== "HEAD" && csrfToken !== session.csrfToken
    && request.headers["x-csrf-token"] !== session.csrfToken) {
    send(response, 403, { error: "Token CSRF inválido." });
    return null;
  }
  return session;
};

const validate = (resource, body, partial = false) => {
  const required = (fields) => fields.every((field) => partial || body[field] !== undefined);
  if (resource === "students" && !required(["name", "status", "joinDate"])) throw new Error("Dados obrigatórios do aluno ausentes.");
  if (resource === "classes" && (!required(["date", "time", "type", "status"]) || !Array.isArray(body.studentIds))) throw new Error("Dados inválidos da aula.");
  if (resource === "payments" && (!required(["studentId", "studentName", "amount", "dueDate", "status", "method", "nfStatus"])
    || (body.amount !== undefined && typeof body.amount !== "number"))) throw new Error("Dados inválidos do pagamento.");
};

const readBody = (request) => new Promise((resolve, reject) => {
  let body = "";
  request.on("data", (chunk) => { body += chunk; });
  request.on("end", () => {
    try {
      resolve(body ? JSON.parse(body) : {});
    } catch {
      reject(new Error("JSON inválido"));
    }
  });
  request.on("error", reject);
});

const bootstrap = async () => {
  const [students, classes, payments, attendance, settings] = await Promise.all([
    prisma.student.findMany(),
    prisma.class.findMany({ include: { students: true } }),
    prisma.payment.findMany(),
    prisma.attendance.findMany(),
    prisma.studioSetting.findMany({
      where: { category: { in: ["plan", "classType"] } },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    }),
  ]);
  return {
    students,
    classes: classes.map(({ students: participants, ...item }) => ({
      ...item,
      studentIds: participants.map(({ studentId }) => studentId),
    })),
    payments,
    attendance,
    settings,
  };

};

const ensureAdminCredential = async () => {
  const credential = await prisma.adminCredential.findUnique({ where: { id: "admin" } });
  if (!credential) {
    await prisma.adminCredential.create({
      data: { id: "admin", passwordHash: hashPassword(adminPassword) },
    });
  }
};

const serveFrontend = (request, response) => {
  const requestedPath = new URL(request.url, "http://localhost").pathname;
  const filePath = join(root, "dist", requestedPath === "/" ? "index.html" : requestedPath);
  const fallbackPath = join(root, "dist", "index.html");
  const target = existsSync(filePath) ? filePath : fallbackPath;
  if (!existsSync(target)) {
    send(response, 404, { error: "Frontend não compilado. Execute npm run build." });
    return;
  }
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon",
  };
  securityHeaders(response);
  response.writeHead(200, { "Content-Type": mimeTypes[extname(target)] || "application/octet-stream" });
  response.end(readFileSync(target));
};

const api = createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    const origin = request.headers.origin;
    if (origin && !allowedOrigins.includes(origin)) {
      send(response, 403, { error: "Origem não autorizada." });
      return;
    }
    response.writeHead(204, {
      "Access-Control-Allow-Origin": origin || allowedOrigins[0],
      "Access-Control-Allow-Headers": "Content-Type, X-CSRF-Token",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Credentials": "true",
    });
    response.end();
    return;
  }
  if (!request.url?.startsWith("/api/")) {
    serveFrontend(request, response);
    return;
  }

  await handleApiRequest(request, response, {
    adminPassword, adminUser, bootstrap, cookie, getSession, parseCookies, prisma, randomBytes,
    randomUUID, requireSession, send, sessions, timingSafeEqual, today, validate, readBody,
    verifyPassword, hashPassword,
  });
});

let vite;
const shutdown = async () => {
  if (vite) vite.kill("SIGTERM");
  await prisma.$disconnect();
};

api.on("error", (error) => {
  console.error(`Não foi possível iniciar a API em ${host}:${port}: ${error.message}`);
  process.exitCode = 1;
});

ensureAdminCredential().then(() => api.listen(port, host, () => {
  console.log(`API Stein Pilates disponível em http://${host}:${port}`);
  if (process.argv.includes("--dev")) {
    vite = spawn("npm", ["run", "client", "--", "--host", "127.0.0.1"], {
      stdio: "inherit",
      shell: true,
    });
  }
})).catch((error) => {
  console.error(`Não foi possível preparar a credencial administrativa: ${error.message}`);
  process.exitCode = 1;
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
