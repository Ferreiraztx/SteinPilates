import { PrismaClient } from "@prisma/client";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { handleApiRequest } from "../server/routes/api.routes.js";

const prisma = new PrismaClient();
const sessions = globalThis.__steinSessions || new Map();
globalThis.__steinSessions = sessions;

const adminUser = process.env.ADMIN_USER;
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

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

const cookie = (name, value, options = {}) => [
  `${name}=${value}`,
  "Path=/",
  "HttpOnly",
  "SameSite=Strict",
  options.maxAge === 0 ? "Max-Age=0" : `Max-Age=${options.maxAge || 86400}`,
  "Secure",
].filter(Boolean).join("; ");

const parseCookies = (header = "") => Object.fromEntries(
  header.split(";").map((part) => part.trim().split("=")).filter(([key, value]) => key && value),
);

const securityHeaders = (response, origin) => {
  if (origin) response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Vary", "Origin");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "same-origin");
};

const send = (response, status, body) => {
  securityHeaders(response, response.req?.headers.origin);
  response.status(status).json(body);
};

const readBody = (request) => new Promise((resolve, reject) => {
  if (request.body && typeof request.body === "object") {
    resolve(request.body);
    return;
  }
  let content = "";
  request.on("data", (chunk) => { content += chunk; });
  request.on("end", () => {
    try {
      resolve(content ? JSON.parse(content) : {});
    } catch {
      reject(new Error("JSON inválido"));
    }
  });
  request.on("error", reject);
});

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
  if (request.method !== "GET" && csrfToken !== session.csrfToken
    && request.headers["x-csrf-token"] !== session.csrfToken) {
    send(response, 403, { error: "Token CSRF inválido." });
    return null;
  }
  return session;
};

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
      data: { id: "admin", passwordHash: hashPassword(process.env.ADMIN_PASSWORD) },
    });
  }
};

export default async function handler(request, response) {
  const origin = request.headers.origin;
  if (request.method === "OPTIONS") {
    if (origin && allowedOrigins.length && !allowedOrigins.includes(origin)) {
      response.status(403).json({ error: "Origem não autorizada." });
      return;
    }
    response.setHeader("Access-Control-Allow-Origin", origin || allowedOrigins[0] || "*");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token");
    response.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.status(204).end();
    return;
  }

  try {
    await ensureAdminCredential();
    await handleApiRequest(request, response, {
      adminPassword: process.env.ADMIN_PASSWORD,
      adminUser,
      bootstrap,
      cookie,
      getSession,
      parseCookies,
      prisma,
      randomBytes,
      randomUUID,
      requireSession,
      send,
      sessions,
      timingSafeEqual,
      today,
      validate: (resource, body, partial = false) => {
        const required = (fields) => fields.every((field) => partial || body[field] !== undefined);
        if (resource === "students" && !required(["name", "status", "joinDate"])) throw new Error("Dados obrigatórios do aluno ausentes.");
        if (resource === "classes" && (!required(["date", "time", "type", "status"]) || !Array.isArray(body.studentIds))) throw new Error("Dados inválidos da aula.");
        if (resource === "payments" && (!required(["studentId", "studentName", "amount", "dueDate", "status", "method", "nfStatus"])
          || (body.amount !== undefined && typeof body.amount !== "number"))) throw new Error("Dados inválidos do pagamento.");
      },
      readBody,
      verifyPassword,
      hashPassword,
    });
  } catch (error) {
    console.error(error);
    if (!response.headersSent) response.status(500).json({ error: "Erro interno do servidor." });
  }
}
