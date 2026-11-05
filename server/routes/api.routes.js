export const handleApiRequest = async (request, response, context) => {
  const {
    adminUser, bootstrap, cookie, getSession, parseCookies, prisma, randomBytes,
    randomUUID, requireSession, send, sessions, today, validate, readBody,
    verifyPassword, hashPassword,
  } = context;
  try {
    const parts = new URL(request.url, `http://${request.headers.host}`).pathname.split("/").filter(Boolean);
    const resource = parts[1];
    const id = parts[2];
    const body = request.method === "GET" ? {} : await readBody(request);
if (resource === "auth" && id === "login" && request.method === "POST") {
  const credential = await prisma.adminCredential.findUnique({ where: { id: "admin" } });
  if (body.username !== adminUser || typeof body.password !== "string"
    || !credential || !verifyPassword(body.password, credential.passwordHash)) {
    send(response, 401, { error: "Usuário ou senha inválidos." });
    return;
  }
  const sessionId = randomUUID();
  const csrfToken = randomBytes(32).toString("hex");
  sessions.set(sessionId, { username: adminUser, csrfToken, createdAt: Date.now() });
  response.setHeader("Set-Cookie", [
    cookie("stein_session", sessionId, { secure: process.env.NODE_ENV === "production" }),
    cookie("stein_csrf", csrfToken, { secure: process.env.NODE_ENV === "production" }).replace("HttpOnly; ", ""),
  ]);
  send(response, 200, { username: adminUser });
  return;
}

if (resource === "auth" && id === "me" && request.method === "GET") {
  const session = getSession(request);
  if (!session) {
    send(response, 401, { error: "Não autenticado." });
    return;
  }
  send(response, 200, { username: session.username });
  return;
}

if (resource === "auth" && id === "logout" && request.method === "POST") {
  const sessionId = parseCookies(request.headers.cookie).stein_session;
  if (sessionId) sessions.delete(sessionId);
  response.setHeader("Set-Cookie", [
    cookie("stein_session", "", { maxAge: 0 }),
    cookie("stein_csrf", "", { maxAge: 0 }).replace("HttpOnly; ", ""),
  ]);
  send(response, 200, { ok: true });
  return;
}

if (!requireSession(request, response)) return;

if (resource === "auth" && id === "password" && request.method === "PATCH") {
  if (typeof body.currentPassword !== "string" || typeof body.newPassword !== "string"
    || body.newPassword.length < 12) {
    throw new Error("A nova senha deve ter pelo menos 12 caracteres.");
  }
  const credential = await prisma.adminCredential.findUnique({ where: { id: "admin" } });
  if (!credential || !verifyPassword(body.currentPassword, credential.passwordHash)) {
    send(response, 401, { error: "Senha atual inválida." });
    return;
  }
  await prisma.adminCredential.update({
    where: { id: "admin" },
    data: { passwordHash: hashPassword(body.newPassword) },
  });
  sessions.clear();
  send(response, 200, { ok: true });
  return;
}

if (request.method === "GET" && resource === "bootstrap") {
  send(response, 200, await bootstrap());
  return;
}

if (request.method === "GET" && resource === "settings") {
  send(response, 200, await prisma.studioSetting.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  }));
  return;
}

if (request.method === "POST" && resource === "settings") {
  if (!["plan", "classType"].includes(body.category) || !body.name?.trim() || !body.value?.trim()) {
    throw new Error("Configuração inválida.");
  }
  const category = body.category;
  const name = body.name.trim();
  const existing = await prisma.studioSetting.findUnique({
    where: { category_name: { category, name } },
  });
  if (existing) {
    send(response, 409, { error: `O item "${name}" já está cadastrado nesta categoria.` });
    return;
  }
  const setting = await prisma.studioSetting.create({
    data: {
      id: randomUUID(),
      category: body.category,
      name,
      value: body.value.trim(),
      active: body.active !== false,
    },
  });
  send(response, 201, setting);
  return;
}

if (request.method === "PATCH" && resource === "settings") {
  const setting = await prisma.studioSetting.update({
    where: { id },
    data: {
      ...(body.name !== undefined ? { name: body.name.trim() } : {}),
      ...(body.value !== undefined ? { value: body.value.trim() } : {}),
      ...(body.active !== undefined ? { active: Boolean(body.active) } : {}),
    },
  });
  send(response, 200, setting);
  return;
}

if (request.method === "DELETE" && resource === "settings") {
  await prisma.studioSetting.delete({ where: { id } });
  send(response, 200, { id });
  return;
}

if (request.method === "POST" && resource === "students") {
  validate("students", body);
  const student = await prisma.student.create({ data: { ...body, phase: body.phase || "Sem fase" } });
  send(response, 201, student);
  return;
}

if (request.method === "DELETE" && resource === "students") {
  await prisma.$transaction(async (transaction) => {
    await transaction.attendance.deleteMany({ where: { studentId: id } });
    await transaction.classStudent.deleteMany({ where: { studentId: id } });
    await transaction.payment.deleteMany({ where: { studentId: id } });
    await transaction.student.delete({ where: { id } });
  });
  send(response, 200, { id });
  return;
}

if (request.method === "POST" && resource === "classes") {
  validate("classes", body);
  const { studentIds, recurring, recurrenceMonth, recurrenceWeekday, ...classData } = body;
  const dates = [];
  if (recurring) {
    if (!/^\d{4}-\d{2}$/.test(recurrenceMonth) || !/^[0-6]$/.test(String(recurrenceWeekday))) {
      throw new Error("Recorrência mensal inválida.");
    }
    const [year, month] = recurrenceMonth.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, 1));
    while (date.getUTCMonth() === month - 1) {
      if (date.getUTCDay() === Number(recurrenceWeekday)) dates.push(date.toISOString().slice(0, 10));
      date.setUTCDate(date.getUTCDate() + 1);
    }
  } else {
    dates.push(classData.date);
  }
  const items = await prisma.$transaction(async (transaction) => Promise.all(dates.map(async (date, index) => {
    const item = await transaction.class.create({
      data: {
        ...classData,
        date,
        id: dates.length === 1 ? classData.id : `${classData.id}_${index + 1}`,
        students: { create: studentIds.map((studentId) => ({ student: { connect: { id: studentId } } })) },
      },
      include: { students: true },
    });
    return { ...classData, date, id: item.id, studentIds: item.students.map(({ studentId }) => studentId) };
  })),
  );
  send(response, 201, { items });
  return;
}

if (request.method === "PATCH" && resource === "classes") {
  const { studentIds, ...classData } = body;
  validate("classes", { ...classData, studentIds }, true);
  const item = await prisma.$transaction(async (transaction) => {
    await transaction.class.update({ where: { id }, data: classData });
    if (studentIds) {
      await transaction.classStudent.deleteMany({ where: { classId: id } });
      await transaction.classStudent.createMany({
        data: studentIds.map((studentId) => ({ classId: id, studentId })),
      });
    }
    return transaction.class.findUniqueOrThrow({
      where: { id },
      include: { students: true },
    });
  });
  send(response, 200, {
    ...classData,
    id: item.id,
    studentIds: item.students.map(({ studentId }) => studentId),
  });
  return;
}

if (request.method === "DELETE" && resource === "classes") {
  await prisma.class.delete({ where: { id } });
  send(response, 200, { id });
  return;
}

if (request.method === "POST" && resource === "payments") {
  validate("payments", body);
  const payment = await prisma.payment.create({ data: body });
  send(response, 201, payment);
  return;
}

if (request.method === "PATCH" && resource === "students") {
  validate("students", body, true);
  const student = await prisma.student.update({ where: { id }, data: body });
  send(response, 200, student);
  return;
}

if (request.method === "PATCH" && resource === "payments") {
  validate("payments", body, true);
  const payment = await prisma.payment.update({ where: { id }, data: body });
  send(response, 200, payment);
  return;
}

if (request.method === "PATCH" && resource === "attendance") {
  const result = await prisma.$transaction(async (transaction) => {
    const existing = await transaction.attendance.findUnique({
      where: { classId_studentId: { classId: body.classId, studentId: body.studentId } },
    });
    const attendance = await transaction.attendance.upsert({
      where: { classId_studentId: { classId: body.classId, studentId: body.studentId } },
      update: { status: body.status, date: body.date || today() },
      create: { id: `a_${Date.now()}`, classId: body.classId, studentId: body.studentId, status: body.status, date: body.date || today() },
    });
    if (body.status === "Falta Justificada" && existing?.status !== body.status) {
      await transaction.student.update({ where: { id: body.studentId }, data: { reposicoesLeft: { increment: 1 } } });
    } else if (existing?.status === "Falta Justificada" && body.status !== existing.status) {
      const student = await transaction.student.findUniqueOrThrow({ where: { id: body.studentId } });
      await transaction.student.update({
        where: { id: body.studentId },
        data: { reposicoesLeft: Math.max(0, student.reposicoesLeft - 1) },
      });
    }
    return attendance;
  });
  send(response, 200, { ...(await bootstrap()), updatedAttendance: result });
  return;
}

send(response, 404, { error: "Rota não encontrada" });
  } catch (error) {
    const status = error.code === "P2025" ? 404 : error.code === "P2002" ? 409 : 400;
    const message = error.code === "P2002"
      ? "Já existe um plano com esse nome. Escolha outro nome."
      : error.message;
    send(response, status, { error: message });
  }
};
