export const INITIAL_STUDENTS = [
  {
    id: '1',
    name: 'Carolina Silva',
    phone: '(11) 98765-4321',
    email: 'carolina.silva@email.com',
    status: 'Ativo',
    phase: 'Convertido',
    plan: '2x por semana',
    monthlyFee: 320,
    dueDate: 5,
    healthNotes: 'Hérnia de disco L4-L5, evitar hiperflexão lombar.',
    reposicoesLeft: 2,
    joinDate: '2023-08-15',
  },
  {
    id: '2',
    name: 'Roberto Mendes',
    phone: '(11) 97654-3210',
    email: 'roberto.mendes@email.com',
    status: 'Ativo',
    phase: 'Convertido',
    plan: '3x por semana',
    monthlyFee: 450,
    dueDate: 10,
    healthNotes: 'Sintomas de dor ciática na perna direita. Fortalecimento de core.',
    reposicoesLeft: 0,
    joinDate: '2023-11-01',
  },
  {
    id: '3',
    name: 'Mariana Costa',
    phone: '(11) 96543-2109',
    email: 'mariana.costa@email.com',
    status: 'Prospecção',
    phase: 'Aula Experimental',
    plan: '1x por semana',
    monthlyFee: 200,
    dueDate: 15,
    healthNotes: 'Gestante (20 semanas). Aulas voltadas para mobilidade e assoalho pélvico.',
    reposicoesLeft: 1,
    joinDate: '2024-02-10',
  },
  {
    id: '4',
    name: 'Fernanda Lima',
    phone: '(11) 95432-1098',
    email: 'fernanda.lima@email.com',
    status: 'Prospecção',
    phase: 'Lead',
    plan: 'A definir',
    monthlyFee: 0,
    dueDate: 1,
    healthNotes: 'Buscando melhora da postura no trabalho e diminuição de estresse.',
    reposicoesLeft: 0,
    joinDate: '2024-02-20',
  },
  {
    id: '5',
    name: 'Lucas Prado',
    phone: '(11) 94321-0987',
    email: 'lucas.prado@email.com',
    status: 'Inativo',
    phase: 'Inativo',
    plan: '2x por semana',
    monthlyFee: 320,
    dueDate: 20,
    healthNotes: 'Pós-operatório de joelho esquerdo (LCA - 6 meses).',
    reposicoesLeft: 0,
    joinDate: '2023-01-10',
  },
];

export const TODAY_DATE = new Date();
export const TODAY_STR = TODAY_DATE.toISOString().split('T')[0];
export const TIME_OPTIONS = Array.from({ length: 24 }, (_, hour) =>
  `${String(hour).padStart(2, "0")}:00`,
);

export const getRelativeDateStr = (daysOffset) => {
  const d = new Date(TODAY_DATE);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const INITIAL_CLASSES = [
  {
    id: 'c1',
    date: TODAY_STR,
    time: '07:00',
    type: 'Reformer',
    studentIds: ['1', '2'],
    status: 'Concluída',
  },
  {
    id: 'c2',
    date: TODAY_STR,
    time: '08:00',
    type: 'Studio',
    studentIds: ['3'],
    status: 'Agendada',
  },
  {
    id: 'c3',
    date: TODAY_STR,
    time: '09:00',
    type: 'Reposição',
    studentIds: ['1'],
    status: 'Agendada',
  },
  {
    id: 'c4',
    date: TODAY_STR,
    time: '17:00',
    type: 'Solo',
    studentIds: ['2', '3'],
    status: 'Agendada',
  },
  {
    id: 'c5',
    date: getRelativeDateStr(1),
    time: '08:00',
    type: 'Reformer',
    studentIds: ['1'],
    status: 'Agendada',
  },
  {
    id: 'c6',
    date: getRelativeDateStr(2),
    time: '10:00',
    type: 'Studio',
    studentIds: ['2', '5'],
    status: 'Agendada',
  },
  {
    id: 'c7',
    date: getRelativeDateStr(-2),
    time: '09:00',
    type: 'Avaliação',
    studentIds: ['4'],
    status: 'Concluída',
  },
  {
    id: 'c8',
    date: getRelativeDateStr(-1),
    time: '18:00',
    type: 'Studio',
    studentIds: ['1', '3'],
    status: 'Concluída',
  },
];

export const INITIAL_PAYMENTS = [
  {
    id: 'p1',
    studentId: '1',
    studentName: 'Carolina Silva',
    amount: 320,
    dueDate: `${TODAY_STR.substring(0, 7)}-05`,
    paymentDate: `${TODAY_STR.substring(0, 7)}-04`,
    status: 'Pago',
    method: 'PIX',
    nfStatus: 'Emitida',
    nfNumber: 'NF-2024-089',
  },
  {
    id: 'p2',
    studentId: '2',
    studentName: 'Roberto Mendes',
    amount: 450,
    dueDate: `${TODAY_STR.substring(0, 7)}-10`,
    paymentDate: `${TODAY_STR.substring(0, 7)}-10`,
    status: 'Pago',
    method: 'Cartão de Crédito',
    nfStatus: 'Pendente de Emissão',
    nfNumber: '',
  },
  {
    id: 'p3',
    studentId: '3',
    studentName: 'Mariana Costa',
    amount: 200,
    dueDate: `${TODAY_STR.substring(0, 7)}-15`,
    paymentDate: null,
    status: 'Pendente',
    method: 'A combinar',
    nfStatus: 'Isenta',
    nfNumber: '',
  },
  {
    id: 'p4',
    studentId: '5',
    studentName: 'Lucas Prado',
    amount: 320,
    dueDate: `${TODAY_STR.substring(0, 7)}-01`,
    paymentDate: null,
    status: 'Atrasado',
    method: 'Boleto',
    nfStatus: 'Pendente de Emissão',
    nfNumber: '',
  },
];

export const INITIAL_ATTENDANCE = [
  { id: 'a1', classId: 'c1', studentId: '1', status: 'Presente', date: TODAY_STR },
  { id: 'a2', classId: 'c1', studentId: '2', status: 'Presente', date: TODAY_STR },
  { id: 'a3', classId: 'c7', studentId: '4', status: 'Presente', date: getRelativeDateStr(-2) },
  { id: 'a4', classId: 'c8', studentId: '1', status: 'Falta Justificada', date: getRelativeDateStr(-1) },
  { id: 'a5', classId: 'c8', studentId: '3', status: 'Presente', date: getRelativeDateStr(-1) },
];

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
