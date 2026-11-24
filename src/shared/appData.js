export const TODAY_DATE = new Date();
export const TODAY_STR = TODAY_DATE.toISOString().split('T')[0];
export const TIME_OPTIONS = Array.from({ length: 24 }, (_, hour) =>
  `${String(hour).padStart(2, "0")}:00`,
);

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")[1];
}

export async function apiFetch(path, options = {}) {
  const method = options.method || "GET";
  const headers = new Headers(options.headers);
  if (method !== "GET") {
    headers.set("Content-Type", "application/json");
    const csrfToken = getCookie("stein_csrf");
    if (csrfToken) headers.set("X-CSRF-Token", csrfToken);
  }

  const response = await fetch(`/api/${path}`, {
    ...options,
    method,
    headers,
    credentials: "same-origin",
  });
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();
  if (!response.ok) {
    throw new Error(typeof payload === "string" ? payload : payload.error || "Falha na requisição");
  }
  return payload;
}
