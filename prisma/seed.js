import { PrismaClient } from "@prisma/client";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const prisma = new PrismaClient();
const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const jsonPath = join(root, "data", "db.json");
const today = () => new Date().toISOString().slice(0, 10);
const fallback = {
  students: [
    { id: "1", name: "Carolina Silva", phone: "(11) 98765-4321", email: "carolina.silva@email.com", status: "Ativo", phase: "Convertido", plan: "2x por semana", monthlyFee: 320, dueDate: 5, healthNotes: "Hérnia de disco L4-L5, evitar hiperflexão lombar.", reposicoesLeft: 2, joinDate: "2023-08-15" },
    { id: "2", name: "Roberto Mendes", phone: "(11) 97654-3210", email: "roberto.mendes@email.com", status: "Ativo", phase: "Convertido", plan: "3x por semana", monthlyFee: 450, dueDate: 10, healthNotes: "Sintomas de dor ciática na perna direita. Fortalecimento de core.", reposicoesLeft: 0, joinDate: "2023-11-01" },
    { id: "3", name: "Mariana Costa", phone: "(11) 96543-2109", email: "mariana.costa@email.com", status: "Prospecção", phase: "Aula Experimental", plan: "1x por semana", monthlyFee: 200, dueDate: 15, healthNotes: "Gestante (20 semanas). Aulas voltadas para mobilidade e assoalho pélvico.", reposicoesLeft: 1, joinDate: "2024-02-10" },
    { id: "4", name: "Fernanda Lima", phone: "(11) 95432-1098", email: "fernanda.lima@email.com", status: "Prospecção", phase: "Lead", plan: "A definir", monthlyFee: 0, dueDate: 1, healthNotes: "Buscando melhora da postura no trabalho e diminuição de estresse.", reposicoesLeft: 0, joinDate: "2024-02-20" },
    { id: "5", name: "Lucas Prado", phone: "(11) 94321-0987", email: "lucas.prado@email.com", status: "Inativo", phase: "Inativo", plan: "2x por semana", monthlyFee: 320, dueDate: 20, healthNotes: "Pós-operatório de joelho esquerdo (LCA - 6 meses).", reposicoesLeft: 0, joinDate: "2023-01-10" },
  ],
  classes: [
    { id: "c1", date: today(), time: "07:00", type: "Reformer", studentIds: ["1", "2"], status: "Concluída" },
    { id: "c2", date: today(), time: "08:00", type: "Studio", studentIds: ["3"], status: "Agendada" },
    { id: "c3", date: today(), time: "09:00", type: "Reposição", studentIds: ["1"], status: "Agendada" },
    { id: "c4", date: today(), time: "17:00", type: "Solo", studentIds: ["2", "3"], status: "Agendada" },
  ],
  payments: [
    { id: "p1", studentId: "1", studentName: "Carolina Silva", amount: 320, dueDate: `${today().slice(0, 7)}-05`, paymentDate: `${today().slice(0, 7)}-04`, status: "Pago", method: "PIX", nfStatus: "Emitida", nfNumber: "NF-2024-089" },
    { id: "p2", studentId: "2", studentName: "Roberto Mendes", amount: 450, dueDate: `${today().slice(0, 7)}-10`, paymentDate: `${today().slice(0, 7)}-10`, status: "Pago", method: "Cartão de Crédito", nfStatus: "Pendente de Emissão", nfNumber: "" },
    { id: "p3", studentId: "3", studentName: "Mariana Costa", amount: 200, dueDate: `${today().slice(0, 7)}-15`, paymentDate: null, status: "Pendente", method: "A combinar", nfStatus: "Isenta", nfNumber: "" },
    { id: "p4", studentId: "5", studentName: "Lucas Prado", amount: 320, dueDate: `${today().slice(0, 7)}-01`, paymentDate: null, status: "Atrasado", method: "Boleto", nfStatus: "Pendente de Emissão", nfNumber: "" },
  ],
  attendance: [
    { id: "a1", classId: "c1", studentId: "1", status: "Presente", date: today() },
    { id: "a2", classId: "c1", studentId: "2", status: "Presente", date: today() },
  ],
};
const source = existsSync(jsonPath)
  ? JSON.parse(readFileSync(jsonPath, "utf8"))
  : fallback;


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
