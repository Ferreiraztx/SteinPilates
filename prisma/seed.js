import { PrismaClient } from "@prisma/client";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const prisma = new PrismaClient();
const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const jsonPath = join(root, "data", "db.json");
const source = existsSync(jsonPath)
  ? JSON.parse(readFileSync(jsonPath, "utf8"))
  : { students: [], classes: [], payments: [], attendance: [] };


for (const student of source.students) {
  await prisma.student.upsert({
    where: { id: student.id },
    update: student,
    create: student,
  });
}

for (const item of source.classes) {
  await prisma.class.upsert({
    where: { id: item.id },
    update: { date: item.date, time: item.time, type: item.type, status: item.status },
    create: { id: item.id, date: item.date, time: item.time, type: item.type, status: item.status },
  });
  await prisma.classStudent.deleteMany({ where: { classId: item.id } });
  await prisma.classStudent.createMany({
    data: item.studentIds.map((studentId) => ({ classId: item.id, studentId })),
  });
}

for (const payment of source.payments) {
  await prisma.payment.upsert({
    where: { id: payment.id },
    update: payment,
    create: payment,
  });
}

for (const item of source.attendance) {
  await prisma.attendance.upsert({
    where: { classId_studentId: { classId: item.classId, studentId: item.studentId } },
    update: { id: item.id, status: item.status, date: item.date },
    create: item,
  });
}

console.log(`Seed concluído: ${await prisma.student.count()} alunos, ${await prisma.class.count()} aulas.`);
await prisma.$disconnect();
