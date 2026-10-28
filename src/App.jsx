import React, { useState, useMemo } from 'react';
import {
  Users,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Plus,
  Search,
  Filter,
  UserPlus,
  Activity,
  AlertCircle,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  List,
  Grid,
  Eye,
  Sparkles,
  Phone,
  Mail,
  ShieldAlert,
  CalendarDays,
  CalendarRange,
  X
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
const INITIAL_STUDENTS = [
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

const TODAY_DATE = new Date();
const TODAY_STR = TODAY_DATE.toISOString().split('T')[0];

const getRelativeDateStr = (daysOffset) => {
  const d = new Date(TODAY_DATE);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

const INITIAL_CLASSES = [
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

const INITIAL_PAYMENTS = [
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

const INITIAL_ATTENDANCE = [
  { id: 'a1', classId: 'c1', studentId: '1', status: 'Presente', date: TODAY_STR },
  { id: 'a2', classId: 'c1', studentId: '2', status: 'Presente', date: TODAY_STR },
  { id: 'a3', classId: 'c7', studentId: '4', status: 'Presente', date: getRelativeDateStr(-2) },
  { id: 'a4', classId: 'c8', studentId: '1', status: 'Falta Justificada', date: getRelativeDateStr(-1) },
  { id: 'a5', classId: 'c8', studentId: '3', status: 'Presente', date: getRelativeDateStr(-1) },
];

export default function App() {
  // Global State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);

  // Modals
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [isScheduleClassModalOpen, setIsScheduleClassModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedStudentForView, setSelectedStudentForView] = useState(null);

  // Quick Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // State Updates Handlers
  const handleAddStudent = (newStudent) => {
    setStudents((prev) => [newStudent, ...prev]);
    showToast(`Aluno ${newStudent.name} cadastrado com sucesso!`);
    setIsNewStudentModalOpen(false);
  };

  const handleScheduleClass = (newClass) => {
    setClasses((prev) => [...prev, newClass]);
    showToast('Aula agendada com sucesso!');
    setIsScheduleClassModalOpen(false);
  };

  const handleRecordPayment = (newPayment) => {
    setPayments((prev) => [newPayment, ...prev]);
    showToast('Pagamento registrado com sucesso!');
    setIsPaymentModalOpen(false);
  };

  const handleMarkPaymentAsPaid = (payId, method) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === payId
          ? { ...p, status: 'Pago', paymentDate: TODAY_STR, method: method || 'PIX' }
          : p
      )
    );
    showToast('Status do pagamento atualizado para PAGO!');
  };

  const handleUpdateNF = (payId, nfNumber, nfStatus) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === payId ? { ...p, nfNumber, nfStatus } : p))
    );
    showToast('Informações de Nota Fiscal atualizadas!');
  };

  const handleToggleAttendance = (classId, studentId, status) => {
    setAttendance((prev) => {
      const existing = prev.find((a) => a.classId === classId && a.studentId === studentId);
      if (existing) {
        return prev.map((a) => (a.id === existing.id ? { ...a, status } : a));
      } else {
        return [
          ...prev,
          { id: 'a_' + Date.now(), classId, studentId, status, date: TODAY_STR },
        ];
      }
    });

    // Handle replacement credits balance update if Falta Justificada
    if (status === 'Falta Justificada') {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? { ...s, reposicoesLeft: s.reposicoesLeft + 1 }
            : s
        )
      );
      showToast('1 crédito de reposição foi adicionado ao aluno.');
    } else {
      showToast('Frequência registrada!');
    }
  };

  // Helper Metrics for Dashboard
  const metrics = useMemo(() => {
    const ativos = students.filter((s) => s.status === 'Ativo').length;
    const leads = students.filter((s) => s.status === 'Prospecção').length;
    const totalProspection = students.filter(
      (s) => s.status === 'Prospecção' || s.phase === 'Convertido'
    ).length;
    const converted = students.filter((s) => s.phase === 'Convertido').length;
    const conversionRate = totalProspection > 0 ? Math.round((converted / totalProspection) * 100) : 0;

    const totalRevenueMonth = payments
      .filter((p) => p.status === 'Pago')
      .reduce((acc, p) => acc + p.amount, 0);

    const pendingPayments = payments.filter((p) => p.status === 'Pendente' || p.status === 'Atrasado').length;
    const pendingNF = payments.filter((p) => p.status === 'Pago' && p.nfStatus === 'Pendente de Emissão').length;

    return {
      ativos,
      leads,
      conversionRate,
      totalRevenueMonth,
      pendingPayments,
      pendingNF,
    };
  }, [students, payments]);

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#5E7A67] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#F3ECE4] border-r border-[#E5D8CA] flex flex-col justify-between shrink-0 hidden md:flex">
          <div>
            {/* Logo Brand */}
            <div className="p-6 border-b border-[#E5D8CA] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5E7A67] flex items-center justify-center text-white shadow-sm">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-semibold text-lg text-slate-900 tracking-tight leading-none">
                  Stein Pilates
                </h1>
                <p className="text-xs text-slate-500 mt-1">Gestão de Estúdio</p>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="p-4 space-y-1">
              {[
                { id: 'dashboard', label: 'Painel Principal', icon: Activity },
                { id: 'alunos', label: 'Alunos (CRM)', icon: Users, badge: students.filter(s => s.status === 'Prospecção').length },
                { id: 'agenda', label: 'Agenda Rápida', icon: Clock },
                { id: 'relatorios', label: 'Aulas & Frequência', icon: CalendarDays },
                { id: 'financeiro', label: 'Financeiro', icon: DollarSign, badge: metrics.pendingPayments },
                { id: 'nfs', label: 'Notas Fiscais', icon: FileCheck, badge: metrics.pendingNF },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#E7D8C8] text-[#735C49] font-semibold'
                        : 'text-slate-600 hover:bg-[#E9DDD0] hover:text-[#5F4B3A]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[#806A56]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge > 0 && (
                      <span className="bg-[#D9826C] text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-[#E5D8CA] bg-[#EDE2D6]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#5E7A67]/20 border border-[#5E7A67]/30 flex items-center justify-center font-bold text-[#435B4B]">
                PA
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-slate-900 truncate">Prof Ada</p>
                <p className="text-xs text-slate-500 truncate">Instrutora de Pilates</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-[#F3ECE4]">
          {/* Top Bar Header */}
          <header className="bg-[#F8F3EE] border-b border-[#E5D8CA] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div>
                <h2 className="text-xl font-bold text-slate-900 capitalize">
                  {activeTab === 'dashboard' && 'Painel Principal'}
                  {activeTab === 'alunos' && 'Gestão de Alunos & Prospecção'}
                  {activeTab === 'agenda' && 'Agenda Rápida do Estúdio'}
                  {activeTab === 'relatorios' && 'Aulas, Calendário Interativo & Frequência'}
                  {activeTab === 'financeiro' && 'Gestão Financeira & Mensalidades'}
                  {activeTab === 'nfs' && 'Controle de Emissão de NFs'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hoje é {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex items-center gap-2 md:hidden">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="bg-slate-100 border border-slate-300 rounded-lg text-xs p-2 font-medium"
                >
                  <option value="dashboard">Painel</option>
                  <option value="alunos">Alunos</option>
                  <option value="agenda">Agenda</option>
                  <option value="relatorios">Aulas & Calendário</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="nfs">Notas Fiscais</option>
                </select>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsNewStudentModalOpen(true)}
                className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-xs font-medium transition shadow-xs"
              >
                <UserPlus className="w-4 h-4 text-[#5E7A67]" />
                <span>Novo Aluno</span>
              </button>

              <button
                onClick={() => setIsScheduleClassModalOpen(true)}
                className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-xs font-medium transition shadow-xs"
              >
                <CalendarIcon className="w-4 h-4 text-[#5E7A67]" />
                <span>Agendar Aula</span>
              </button>

              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="flex items-center gap-2 bg-[#5E7A67] hover:bg-[#486050] text-white px-3.5 py-2 rounded-xl text-xs font-medium transition shadow-xs"
              >
                <DollarSign className="w-4 h-4" />
                <span>Registrar Pagamento</span>
              </button>
            </div>
          </header>

          {/* View Container */}
          <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <DashboardView
                metrics={metrics}
                students={students}
                classes={classes}
                payments={payments}
                onSelectStudent={(st) => setSelectedStudentForView(st)}
                onOpenScheduleModal={() => setIsScheduleClassModalOpen(true)}
                onOpenStudentModal={() => setIsNewStudentModalOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {/* TAB: ALUNOS (CRM) */}
            {activeTab === 'alunos' && (
              <StudentsView
                students={students}
                onOpenNewStudentModal={() => setIsNewStudentModalOpen(true)}
                onSelectStudent={(st) => setSelectedStudentForView(st)}
                setStudents={setStudents}
              />
            )}

            {/* TAB: AGENDA DE AULAS */}
            {activeTab === 'agenda' && (
              <ScheduleView
                classes={classes}
                students={students}
                onOpenScheduleModal={() => setIsScheduleClassModalOpen(true)}
                setClasses={setClasses}
              />
            )}

            {/* TAB: AULAS, CALENDÁRIO & RELATÓRIOS */}
            {activeTab === 'relatorios' && (
              <AttendanceReportsView
                classes={classes}
                students={students}
                attendance={attendance}
                onToggleAttendance={handleToggleAttendance}
                onOpenScheduleModal={() => setIsScheduleClassModalOpen(true)}
              />
            )}

            {/* TAB: FINANCEIRO */}
            {activeTab === 'financeiro' && (
              <FinancialView
                payments={payments}
                students={students}
                onMarkPaid={handleMarkPaymentAsPaid}
                onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
              />
            )}

            {/* TAB: NOTAS FISCAIS */}
            {activeTab === 'nfs' && (
              <InvoicesView
                payments={payments}
                onUpdateNF={handleUpdateNF}
              />
            )}
          </main>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* MODAL 1: Novo Aluno */}
      {isNewStudentModalOpen && (
        <NewStudentModal
          onClose={() => setIsNewStudentModalOpen(false)}
          onAdd={handleAddStudent}
        />
      )}

      {/* MODAL 2: Agendar Aula */}
      {isScheduleClassModalOpen && (
        <ScheduleClassModal
          students={students}
          onClose={() => setIsScheduleClassModalOpen(false)}
          onAdd={handleScheduleClass}
        />
      )}

      {/* MODAL 3: Registrar Pagamento */}
      {isPaymentModalOpen && (
        <RecordPaymentModal
          students={students}
          onClose={() => setIsPaymentModalOpen(false)}
          onAdd={handleRecordPayment}
        />
      )}

      {/* MODAL 4: Perfil do Aluno */}
      {selectedStudentForView && (
        <StudentProfileModal
          student={selectedStudentForView}
          classes={classes}
          attendance={attendance}
          payments={payments}
          onClose={() => setSelectedStudentForView(null)}
        />
      )}
    </div>
  );
}

// ==========================================
// COMPONENT 1: DASHBOARD VIEW
// ==========================================
function DashboardView({
  metrics,
  students,
  classes,
  payments,
  onSelectStudent,
  onOpenScheduleModal,
  onNavigateTab,
}) {
  const todayClasses = classes.filter((c) => c.date === TODAY_STR);
  const pendingPaymentsList = payments.filter((p) => p.status === 'Atrasado' || p.status === 'Pendente');

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alunos Ativos</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.ativos}</p>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Base estável</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#5E7A67]/15 flex items-center justify-center text-[#435B4B]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Leads & Prospecção</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.leads}</p>
            <p className="text-xs text-slate-500 mt-2">Taxa de Conversão: <strong className="text-slate-800">{metrics.conversionRate}%</strong></p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-700">
            <UserPlus className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faturamento (Mês)</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">R$ {metrics.totalRevenueMonth.toLocaleString('pt-BR')}</p>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Recebidos</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-700">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pendências NF-e</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.pendingNF}</p>
            <p className="text-xs text-[#D9826C] font-medium mt-2">Aguardando emissão</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-700">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Section: Agenda do Dia + Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agenda de Hoje (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#5E7A67]" />
              <h3 className="font-semibold text-slate-900">Agenda de Hoje</h3>
              <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full font-medium">
                {todayClasses.length} aulas
              </span>
            </div>
            <button
              onClick={onOpenScheduleModal}
              className="text-xs font-medium text-[#435B4B] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Agendar Horário
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {todayClasses.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <CalendarIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma aula agendada para hoje.</p>
              </div>
            ) : (
              todayClasses.map((c) => {
                const assignedStudents = students.filter((s) => c.studentIds.includes(s.id));
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/60 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-center font-bold text-slate-800 text-sm shadow-xs">
                        {c.time}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm">
                            {assignedStudents.map((s) => s.name).join(', ') || 'Sem alunos'}
                          </span>
                          <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.2 rounded-md">
                            {c.type}
                          </span>
                        </div>
                        {assignedStudents.some((s) => s.healthNotes) && (
                          <p className="text-xs text-[#D9826C] mt-0.5 flex items-center gap-1 font-medium">
                            <ShieldAlert className="w-3 h-3" /> Atenção a restrições de saúde
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          c.status === 'Concluída'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'Agendada'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Alertas Rápido & Ações Pendentes */}
        <div className="space-y-6">
          {/* Pagamentos Pendentes Alert Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-[#D9826C]" /> Mensalidades Pendentes
              </h3>
              <button
                onClick={() => onNavigateTab('financeiro')}
                className="text-xs text-[#435B4B] font-medium hover:underline"
              >
                Ver tudo
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {pendingPaymentsList.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">Todos os pagamentos em dia!</p>
              ) : (
                pendingPaymentsList.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-rose-100 bg-rose-50/40 text-xs"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{p.studentName}</p>
                      <p className="text-slate-500">Venc: {p.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">R$ {p.amount}</p>
                      <span className="text-[10px] text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded font-medium">
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reposições Pendentes por Aluno */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-amber-500" /> Saldo de Reposições
              </h3>
              <button
                onClick={() => onNavigateTab('relatorios')}
                className="text-xs text-[#435B4B] font-medium hover:underline"
              >
                Gerenciar
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {students
                .filter((s) => s.reposicoesLeft > 0)
                .map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onSelectStudent(s)}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer text-xs"
                  >
                    <span className="font-medium text-slate-800">{s.name}</span>
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                      {s.reposicoesLeft} crédito(s)
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT 2: ALUNOS (CRM & FUNIL)
// ==========================================
function StudentsView({ students, onOpenNewStudentModal, onSelectStudent, setStudents }) {
  const [filterTab, setFilterTab] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'funnel'

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase());

      if (filterTab === 'Todos') return matchesSearch;
      if (filterTab === 'Ativos') return matchesSearch && s.status === 'Ativo';
      if (filterTab === 'Inativos') return matchesSearch && s.status === 'Inativo';
      if (filterTab === 'Prospecção') return matchesSearch && s.status === 'Prospecção';
      return matchesSearch;
    });
  }, [students, filterTab, searchQuery]);

  // Phase change for Funnel Drag or Click
  const handleMovePhase = (studentId, newPhase) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          let newStatus = s.status;
          if (newPhase === 'Convertido') newStatus = 'Ativo';
          if (newPhase === 'Lead' || newPhase === 'Aula Experimental') newStatus = 'Prospecção';
          return { ...s, phase: newPhase, status: newStatus };
        }
        return s;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {['Todos', 'Ativos', 'Prospecção', 'Inativos'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterTab === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* View Toggle & Search */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar aluno, e-mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#5E7A67]"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}
              title="Visão em Lista"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('funnel')}
              className={`p-1.5 rounded-lg ${viewMode === 'funnel' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}
              title="Funil de Prospecção"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenNewStudentModal}
            className="bg-[#5E7A67] hover:bg-[#486050] text-white px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-slate-500 tracking-wider">
                <tr>
                  <th className="px-4 py-3">Aluno</th>
                  <th className="px-4 py-3">Contato</th>
                  <th className="px-4 py-3">Plano</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Fase CRM</th>
                  <th className="px-4 py-3">Restrições / Saúde</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-slate-400">
                      Nenhum aluno encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {student.name}
                      </td>
                      <td className="px-4 py-3 space-y-0.5">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Phone className="w-3 h-3 text-slate-400" /> {student.phone}
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" /> {student.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-800">{student.plan}</span>
                        <p className="text-[11px] text-slate-400">R$ {student.monthlyFee}/mês</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            student.status === 'Ativo'
                              ? 'bg-emerald-100 text-emerald-800'
                              : student.status === 'Prospecção'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {student.phase}
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate text-slate-500">
                        {student.healthNotes || 'Nenhuma restrição registrada.'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ver Perfil
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: FUNNEL / KANBAN BOARD */}
      {viewMode === 'funnel' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { phase: 'Lead', label: '1. Novos Leads / Contatos', color: 'bg-blue-50 border-blue-200' },
            { phase: 'Aula Experimental', label: '2. Aula Experimental Agendada', color: 'bg-amber-50 border-amber-200' },
            { phase: 'Convertido', label: '3. Convertido / Matriculado', color: 'bg-emerald-50 border-emerald-200' },
          ].map((col) => {
            const listInPhase = students.filter((s) => s.phase === col.phase);
            return (
              <div
                key={col.phase}
                className={`p-4 rounded-2xl border ${col.color} flex flex-col min-h-[400px]`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    {col.label}
                  </h4>
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-slate-700 shadow-xs">
                    {listInPhase.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {listInPhase.map((st) => (
                    <div
                      key={st.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2 hover:border-[#5E7A67] transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-xs">{st.name}</span>
                        <button
                          onClick={() => onSelectStudent(st)}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-500">{st.phone}</p>

                      {st.healthNotes && (
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100 italic">
                          "{st.healthNotes}"
                        </p>
                      )}

                      {/* Advance Stage Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                        <span className="text-slate-400">Avançar fase:</span>
                        <div className="flex items-center gap-1">
                          {col.phase !== 'Lead' && (
                            <button
                              onClick={() => handleMovePhase(st.id, col.phase === 'Convertido' ? 'Aula Experimental' : 'Lead')}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                            >
                              &larr; Voltar
                            </button>
                          )}
                          {col.phase !== 'Convertido' && (
                            <button
                              onClick={() => handleMovePhase(st.id, col.phase === 'Lead' ? 'Aula Experimental' : 'Convertido')}
                              className="px-2 py-0.5 bg-[#5E7A67] hover:bg-[#486050] text-white rounded font-medium flex items-center gap-0.5"
                            >
                              <span>Avançar</span> &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ==========================================
// COMPONENT 3: AGENDA DE AULAS RÁPIDA
// ==========================================
function ScheduleView({ classes, students, onOpenScheduleModal, setClasses }) {
  const [selectedDate, setSelectedDate] = useState(TODAY_STR);

  const classesForDate = useMemo(() => {
    return classes.filter((c) => c.date === selectedDate);
  }, [classes, selectedDate]);

  const handleUpdateStatus = (classId, newStatus) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, status: newStatus } : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Date Header & Quick Nav */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5E7A67]"
          />
          <button
            onClick={() => setSelectedDate(TODAY_STR)}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-medium"
          >
            Hoje
          </button>
        </div>

        <button
          onClick={onOpenScheduleModal}
          className="bg-[#5E7A67] hover:bg-[#486050] text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Agendar Nova Aula
        </button>
      </div>

      {/* Grid View of Time Slots */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#5E7A67]" />
          Aulas do Dia - {selectedDate.split('-').reverse().join('/')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['07:00', '08:00', '09:00', '10:00', '16:00', '17:00', '18:00', '19:00'].map((timeSlot) => {
            const classInSlot = classesForDate.find((c) => c.time === timeSlot);

            return (
              <div
                key={timeSlot}
                className={`p-4 rounded-xl border transition ${
                  classInSlot
                    ? 'border-[#5E7A67]/30 bg-emerald-50/20'
                    : 'border-dashed border-slate-200 bg-slate-50/40 hover:bg-slate-100/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    {timeSlot}
                  </span>

                  {classInSlot && (
                    <select
                      value={classInSlot.status}
                      onChange={(e) => handleUpdateStatus(classInSlot.id, e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1 font-semibold bg-white"
                    >
                      <option value="Agendada">Agendada</option>
                      <option value="Concluída">Concluída</option>
                      <option value="Cancelada">Cancelada</option>
                      <option value="Reposição">Reposição</option>
                    </select>
                  )}
                </div>

                {classInSlot ? (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {students
                          .filter((s) => classInSlot.studentIds.includes(s.id))
                          .map((s) => s.name)
                          .join(', ')}
                      </span>
                      <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                        {classInSlot.type}
                      </span>
                    </div>

                    {/* Restricted Health Warnings */}
                    {students
                      .filter((s) => classInSlot.studentIds.includes(s.id) && s.healthNotes)
                      .map((s) => (
                        <p key={s.id} className="text-[11px] text-[#D9826C] bg-amber-50 p-1.5 rounded border border-amber-200 font-medium">
                          ⚠️ {s.name}: {s.healthNotes}
                        </p>
                      ))}
                  </div>
                ) : (
                  <div className="mt-3 text-center py-2">
                    <button
                      onClick={onOpenScheduleModal}
                      className="text-xs text-slate-400 hover:text-[#435B4B] font-medium"
                    >
                      + Horário livre
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT 4: AULAS, CALENDÁRIO INTERATIVO & FREQUÊNCIA
// ==========================================
function AttendanceReportsView({ classes, students, attendance, onToggleAttendance, onOpenScheduleModal }) {
  const [calendarView, setCalendarView] = useState('month'); // 'month', 'week', 'day', 'agenda'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedClassForAttendance, setSelectedClassForAttendance] = useState(null);
  
  // Quick Filters
  const [filterType, setFilterType] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');

  // Filtered Classes for Calendar
  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      const matchType = filterType === 'Todos' || c.type === filterType;
      const matchStatus = filterStatus === 'Todos' || c.status === filterStatus;
      return matchType && matchStatus;
    });
  }, [classes, filterType, filterStatus]);

  // Calendar Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrev = () => {
    const d = new Date(currentDate);
    if (calendarView === 'month') d.setMonth(d.getMonth() - 1);
    else if (calendarView === 'week') d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (calendarView === 'month') d.setMonth(d.getMonth() + 1);
    else if (calendarView === 'week') d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Month Days calculation
  const monthDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Padding for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Days of current month
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dayNumber: d, dateStr });
    }
    return days;
  }, [year, month]);

  // Week Days calculation
  const weekDays = useMemo(() => {
    const curr = new Date(currentDate);
    const first = curr.getDate() - curr.getDay(); // Sunday
    const days = [];
    for (let i = 0; i < 7; i++) {
      const next = new Date(curr.setDate(first + i));
      const dateStr = next.toISOString().split('T')[0];
      days.push({
        dayName: next.toLocaleDateString('pt-BR', { weekday: 'short' }),
        dayNumber: next.getDate(),
        dateStr,
      });
    }
    return days;
  }, [currentDate]);

  // Attendance metrics summary
  const totalCompleted = attendance.filter((a) => a.status === 'Presente').length;
  const totalJustified = attendance.filter((a) => a.status === 'Falta Justificada').length;
  const totalUnjustified = attendance.filter((a) => a.status === 'Falta Sem Justificativa').length;
  const totalReplacementsPending = students.reduce((acc, s) => acc + s.reposicoesLeft, 0);

  return (
    <div className="space-y-6">
      {/* Calendar Toolbar & Filter Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button onClick={handlePrev} className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={handleToday} className="px-2.5 py-1 text-xs font-semibold hover:bg-white rounded-lg text-slate-700 transition">
                Hoje
              </button>
              <button onClick={handleNext} className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-bold text-slate-900 text-base capitalize">
              {calendarView === 'month' && currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              {calendarView === 'week' && `Semana de ${weekDays[0]?.dayNumber} a ${weekDays[6]?.dayNumber} de ${currentDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}`}
              {calendarView === 'day' && currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              {calendarView === 'agenda' && 'Lista / Agenda Completa'}
            </h3>
          </div>

          {/* View Switcher & Actions */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'month', label: 'Mês', icon: CalendarDays },
                { id: 'week', label: 'Semana', icon: CalendarRange },
                { id: 'day', label: 'Dia', icon: Clock },
                { id: 'agenda', label: 'Agenda', icon: List },
              ].map((v) => {
                const Icon = v.icon;
                return (
                  <button
                    key={v.id}
                    onClick={() => setCalendarView(v.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      calendarView === v.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-[#5E7A67]" />
                    <span>{v.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={onOpenScheduleModal}
              className="bg-[#5E7A67] hover:bg-[#486050] text-white px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Nova Aula
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filtrar por:
            </span>

            {/* Type Filter */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Modalidade:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-medium text-slate-700"
              >
                <option value="Todos">Todas Modalidades</option>
                <option value="Studio">Studio</option>
                <option value="Reformer">Reformer</option>
                <option value="Solo">Solo</option>
                <option value="Reposição">Reposição</option>
                <option value="Avaliação">Avaliação</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-medium text-slate-700"
              >
                <option value="Todos">Todos os Status</option>
                <option value="Agendada">Agendada</option>
                <option value="Concluída">Concluída</option>
                <option value="Cancelada">Cancelada</option>
                <option value="Reposição">Reposição</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Concluída</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Agendada</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Reposição</span>
          </div>
        </div>

        {/* ================= CALENDAR VIEWS ================= */}

        {/* 1. MONTH VIEW */}
        {calendarView === 'month' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            {/* Days Header */}
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center font-bold text-xs py-2 text-slate-600">
              <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
            </div>

            {/* Grid Days */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-white">
              {monthDays.map((d, index) => {
                if (!d) return <div key={`empty-${index}`} className="min-h-[100px] bg-slate-50/40"></div>;

                const dayClasses = filteredClasses.filter((c) => c.date === d.dateStr);
                const isToday = d.dateStr === TODAY_STR;

                return (
                  <div
                    key={d.dateStr}
                    className={`min-h-[110px] p-2 flex flex-col justify-between transition hover:bg-slate-50/80 ${
                      isToday ? 'bg-amber-50/30 font-bold' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          isToday ? 'bg-[#5E7A67] text-white shadow-xs' : 'text-slate-700'
                        }`}
                      >
                        {d.dayNumber}
                      </span>
                      {dayClasses.length > 0 && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.2 rounded-full">
                          {dayClasses.length} a.
                        </span>
                      )}
                    </div>

                    {/* Class Events in Day Cell */}
                    <div className="space-y-1 flex-1 overflow-y-auto max-h-[80px]">
                      {dayClasses.map((c) => {
                        const classStudents = students.filter((s) => c.studentIds.includes(s.id));
                        return (
                          <div
                            key={c.id}
                            onClick={() => setSelectedClassForAttendance(c)}
                            className={`p-1.5 rounded-lg text-[10px] font-medium cursor-pointer transition shadow-2xs border ${
                              c.status === 'Concluída'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                                : c.type === 'Reposição'
                                ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
                                : 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold">
                              <span>{c.time}</span>
                              <span className="text-[9px] opacity-80">{c.type}</span>
                            </div>
                            <div className="truncate font-semibold mt-0.5">
                              {classStudents.map((s) => s.name.split(' ')[0]).join(', ')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. WEEK VIEW */}
        {calendarView === 'week' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center py-2.5">
              {weekDays.map((wd) => (
                <div key={wd.dateStr} className={`text-xs ${wd.dateStr === TODAY_STR ? 'font-bold text-[#5E7A67]' : 'text-slate-600'}`}>
                  <p className="uppercase text-[10px] font-semibold text-slate-400">{wd.dayName}</p>
                  <p className={`text-sm mt-0.5 inline-block px-2 py-0.5 rounded-full ${wd.dateStr === TODAY_STR ? 'bg-[#5E7A67] text-white' : ''}`}>
                    {wd.dayNumber}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 divide-x divide-slate-100 min-h-[350px]">
              {weekDays.map((wd) => {
                const dayClasses = filteredClasses.filter((c) => c.date === wd.dateStr);
                return (
                  <div key={wd.dateStr} className="p-2 space-y-2 bg-slate-50/20">
                    {dayClasses.map((c) => {
                      const classStudents = students.filter((s) => c.studentIds.includes(s.id));
                      return (
                        <div
                          key={c.id}
                          onClick={() => setSelectedClassForAttendance(c)}
                          className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs cursor-pointer hover:border-[#5E7A67] transition"
                        >
                          <span className="text-xs font-bold text-slate-900">{c.time}</span>
                          <p className="text-[11px] font-medium text-slate-700 truncate mt-0.5">
                            {classStudents.map((s) => s.name).join(', ')}
                          </p>
                          <span className="inline-block mt-1 text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                            {c.type}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. DAY VIEW */}
        {calendarView === 'day' && (
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Horários de {currentDate.toLocaleDateString('pt-BR')}
            </h4>

            {['07:00', '08:00', '09:00', '10:00', '16:00', '17:00', '18:00', '19:00'].map((timeSlot) => {
              const dateStr = currentDate.toISOString().split('T')[0];
              const slotClasses = filteredClasses.filter((c) => c.date === dateStr && c.time === timeSlot);

              return (
                <div key={timeSlot} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <span className="font-bold text-slate-800 text-xs w-16 bg-white py-1 px-2.5 rounded-lg border border-slate-200 text-center">
                    {timeSlot}
                  </span>

                  <div className="flex-1">
                    {slotClasses.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">Livre</span>
                    ) : (
                      slotClasses.map((c) => {
                        const classStudents = students.filter((s) => c.studentIds.includes(s.id));
                        return (
                          <div
                            key={c.id}
                            onClick={() => setSelectedClassForAttendance(c)}
                            className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between cursor-pointer hover:border-[#5E7A67]"
                          >
                            <div>
                              <p className="font-bold text-slate-900 text-xs">
                                {classStudents.map((s) => s.name).join(', ')}
                              </p>
                              <p className="text-[11px] text-slate-500">{c.type} • Status: {c.status}</p>
                            </div>
                            <button className="text-xs bg-[#5E7A67] text-white px-2.5 py-1 rounded-md font-medium">
                              Frequência
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. AGENDA VIEW */}
        {calendarView === 'agenda' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Horário</th>
                  <th className="px-4 py-3">Alunos</th>
                  <th className="px-4 py-3">Modalidade</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClasses.map((c) => {
                  const classStudents = students.filter((s) => c.studentIds.includes(s.id));
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">{c.date}</td>
                      <td className="px-4 py-3 font-bold">{c.time}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {classStudents.map((s) => s.name).join(', ')}
                      </td>
                      <td className="px-4 py-3">{c.type}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedClassForAttendance(c)}
                          className="text-[#435B4B] font-semibold hover:underline"
                        >
                          Lançar Frequência
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reports Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Presenças Registradas</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{totalCompleted}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Faltas Justificadas</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{totalJustified}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Faltas Não Justificadas</p>
          <p className="text-2xl font-bold text-rose-700 mt-1">{totalUnjustified}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Reposições Pendentes</p>
          <p className="text-2xl font-bold text-[#5E7A67] mt-1">{totalReplacementsPending}</p>
        </div>
      </div>

      {/* QUICK ATTENDANCE DRAWER / MODAL */}
      {selectedClassForAttendance && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Lançar Frequência</h3>
                <p className="text-xs text-slate-500">
                  {selectedClassForAttendance.date} às {selectedClassForAttendance.time} • {selectedClassForAttendance.type}
                </p>
              </div>
              <button onClick={() => setSelectedClassForAttendance(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {students
                .filter((s) => selectedClassForAttendance.studentIds.includes(s.id))
                .map((student) => {
                  const att = attendance.find(
                    (a) => a.classId === selectedClassForAttendance.id && a.studentId === student.id
                  );
                  const currentStatus = att ? att.status : 'Pendente';

                  return (
                    <div key={student.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{student.name}</span>
                        {student.healthNotes && (
                          <span className="text-[10px] text-amber-700 font-semibold">⚠️ Restrição registrada</span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-1 text-[11px]">
                        {[
                          { label: 'Presente', color: 'bg-emerald-600' },
                          { label: 'Falta Justificada', color: 'bg-amber-600' },
                          { label: 'Falta Sem Justificativa', color: 'bg-rose-600' },
                        ].map((btn) => (
                          <button
                            key={btn.label}
                            onClick={() => onToggleAttendance(selectedClassForAttendance.id, student.id, btn.label)}
                            className={`p-1.5 rounded-lg text-[10px] font-semibold text-center transition ${
                              currentStatus === btn.label
                                ? `${btn.color} text-white shadow-xs`
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {btn.label === 'Falta Justificada' ? 'Falta Justif.' : btn.label === 'Falta Sem Justificativa' ? 'Falta N.J.' : 'Presente'}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedClassForAttendance(null)}
                className="px-4 py-2 bg-[#5E7A67] text-white rounded-xl font-semibold text-xs"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// COMPONENT 5: FINANCEIRO & MENSALIDADES
// ==========================================
function FinancialView({ payments, students, onMarkPaid, onOpenPaymentModal }) {
  const [filterStatus, setFilterStatus] = useState('Todos');

  const filteredPayments = useMemo(() => {
    if (filterStatus === 'Todos') return payments;
    return payments.filter((p) => p.status === filterStatus);
  }, [payments, filterStatus]);

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {['Todos', 'Pago', 'Pendente', 'Atrasado'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterStatus === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenPaymentModal}
          className="bg-[#5E7A67] hover:bg-[#486050] text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2"
        >
          <DollarSign className="w-4 h-4" /> Registrar Novo Pagamento
        </button>
      </div>

      {/* Financial Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-4 py-3">Aluno</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Vencimento</th>
                <th className="px-4 py-3">Data Pagamento</th>
                <th className="px-4 py-3">Forma PGTO</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-semibold text-slate-900">{p.studentName}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">R$ {p.amount}</td>
                  <td className="px-4 py-3 text-slate-600">{p.dueDate}</td>
                  <td className="px-4 py-3 text-slate-500">{p.paymentDate || '-'}</td>
                  <td className="px-4 py-3">{p.method}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        p.status === 'Pago'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'Pendente'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.status !== 'Pago' && (
                      <button
                        onClick={() => onMarkPaid(p.id, 'PIX')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-medium"
                      >
                        Baixar Pago
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT 6: NOTAS FISCAIS
// ==========================================
function InvoicesView({ payments, onUpdateNF }) {
  const [editingNfId, setEditingNfId] = useState(null);
  const [nfInput, setNfInput] = useState('');

  const paidPayments = useMemo(() => {
    return payments.filter((p) => p.status === 'Pago');
  }, [payments]);

  const handleSaveNf = (payId) => {
    onUpdateNF(payId, nfInput, 'Emitida');
    setEditingNfId(null);
    setNfInput('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#5E7A67]" />
          Controle de Emissão de Notas Fiscais (NFs)
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Acompanhe os pagamentos confirmados e vincule o número da Nota Fiscal emitida.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-4 py-3">Aluno</th>
                <th className="px-4 py-3">Valor Pago</th>
                <th className="px-4 py-3">Data PGTO</th>
                <th className="px-4 py-3">Status NF</th>
                <th className="px-4 py-3">Número / Código NF</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paidPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-slate-400">
                    Nenhum pagamento baixado para emissão de nota.
                  </td>
                </tr>
              ) : (
                paidPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-semibold text-slate-900">{p.studentName}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">R$ {p.amount}</td>
                    <td className="px-4 py-3">{p.paymentDate}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          p.nfStatus === 'Emitida'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.nfStatus === 'Isenta'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.nfStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700">
                      {editingNfId === p.id ? (
                        <input
                          type="text"
                          placeholder="Ex: NF-2024-001"
                          value={nfInput}
                          onChange={(e) => setNfInput(e.target.value)}
                          className="border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-[#5E7A67]"
                        />
                      ) : (
                        p.nfNumber || '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editingNfId === p.id ? (
                        <button
                          onClick={() => handleSaveNf(p.id)}
                          className="bg-[#5E7A67] hover:bg-[#486050] text-white px-2.5 py-1 rounded text-xs font-medium"
                        >
                          Salvar
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingNfId(p.id);
                            setNfInput(p.nfNumber || '');
                          }}
                          className="text-[#435B4B] hover:underline font-medium text-xs"
                        >
                          {p.nfStatus === 'Emitida' ? 'Editar NF' : 'Vincular NF'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODALS
// ==========================================

// MODAL: NOVO ALUNO
function NewStudentModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    status: 'Prospecção',
    phase: 'Lead',
    plan: '2x por semana',
    monthlyFee: 320,
    dueDate: 5,
    healthNotes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    onAdd({
      id: 'st_' + Date.now(),
      ...formData,
      reposicoesLeft: 0,
      joinDate: TODAY_STR,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">Cadastrar Novo Aluno</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Nome Completo</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Maria Oliveira"
              className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="maria@email.com"
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Status Inicial</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67] focus:outline-none"
              >
                <option value="Prospecção">Prospecção (Lead)</option>
                <option value="Ativo">Ativo (Matriculado)</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Plano Pretendido</label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67] focus:outline-none"
              >
                <option value="1x por semana">1x por semana</option>
                <option value="2x por semana">2x por semana</option>
                <option value="3x por semana">3x por semana</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Restrições / Observações de Saúde</label>
            <textarea
              rows="2"
              value={formData.healthNotes}
              onChange={(e) => setFormData({ ...formData, healthNotes: e.target.value })}
              placeholder="Hérnias, lesões, histórico cirúrgico..."
              className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67] focus:outline-none"
            ></textarea>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-white bg-[#5E7A67] hover:bg-[#486050] font-medium"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// MODAL: AGENDAR AULA
function ScheduleClassModal({ students, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    date: TODAY_STR,
    time: '08:00',
    type: 'Studio',
    studentIds: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.studentIds.length === 0) return alert('Selecione ao menos um aluno.');

    onAdd({
      id: 'c_' + Date.now(),
      ...formData,
      status: 'Agendada',
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">Agendar Nova Aula</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Data</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67]"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Horário</label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67]"
              >
                {['07:00', '08:00', '09:00', '10:00', '16:00', '17:00', '18:00', '19:00'].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Tipo de Aula</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67]"
            >
              <option value="Studio">Studio (max 3)</option>
              <option value="Reformer">Reformer</option>
              <option value="Solo">Solo</option>
              <option value="Reposição">Reposição</option>
              <option value="Avaliação">Avaliação</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Alunos Participantes</label>
            <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1">
              {students.map((st) => (
                <label key={st.id} className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.studentIds.includes(st.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, studentIds: [...formData.studentIds, st.id] });
                      } else {
                        setFormData({
                          ...formData,
                          studentIds: formData.studentIds.filter((id) => id !== st.id),
                        });
                      }
                    }}
                    className="rounded text-[#5E7A67]"
                  />
                  <span className="text-slate-800 font-medium">{st.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-white bg-[#5E7A67] hover:bg-[#486050] font-medium"
            >
              Confirmar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// MODAL: REGISTRAR PAGAMENTO
function RecordPaymentModal({ students, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    studentId: students[0]?.id || '',
    amount: 320,
    dueDate: TODAY_STR,
    method: 'PIX',
    status: 'Pago',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const st = students.find((s) => s.id === formData.studentId);

    onAdd({
      id: 'p_' + Date.now(),
      studentId: formData.studentId,
      studentName: st ? st.name : 'Aluno',
      amount: Number(formData.amount),
      dueDate: formData.dueDate,
      paymentDate: formData.status === 'Pago' ? TODAY_STR : null,
      method: formData.method,
      status: formData.status,
      nfStatus: 'Pendente de Emissão',
      nfNumber: '',
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">Registrar Lançamento Financeiro</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Aluno</label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67]"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Valor (R$)</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67]"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Data de Vencimento</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Forma de Pagamento</label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67]"
              >
                <option value="PIX">PIX</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Boleto">Boleto</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67]"
              >
                <option value="Pago">Pago</option>
                <option value="Pendente">Pendente</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-white bg-[#5E7A67] hover:bg-[#486050] font-medium"
            >
              Registrar Pagamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// MODAL: PERFIL DO ALUNO
function StudentProfileModal({ student, classes, attendance, payments, onClose }) {
  const studentPayments = payments.filter((p) => p.studentId === student.id);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-lg">{student.name}</h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  student.status === 'Ativo'
                    ? 'bg-emerald-100 text-emerald-800'
                    : student.status === 'Prospecção'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {student.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Cadastrado em {student.joinDate}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <h4 className="font-bold text-slate-800 text-xs border-b border-slate-200/60 pb-1">Dados de Contato & Plano</h4>
            <p><strong className="text-slate-700">Telefone:</strong> {student.phone}</p>
            <p><strong className="text-slate-700">E-mail:</strong> {student.email}</p>
            <p><strong className="text-slate-700">Plano:</strong> {student.plan} (R$ {student.monthlyFee}/mês)</p>
            <p><strong className="text-slate-700">Dia de Vencimento:</strong> Dia {student.dueDate}</p>
          </div>

          <div className="space-y-2 bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/60">
            <h4 className="font-bold text-amber-900 text-xs border-b border-amber-200/60 pb-1 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" /> Anamnese & Observações
            </h4>
            <p className="text-slate-700 leading-relaxed">{student.healthNotes || 'Sem restrições físicas cadastradas.'}</p>
            <div className="pt-1">
              <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md text-[11px]">
                Créditos de Reposição: {student.reposicoesLeft}
              </span>
            </div>
          </div>
        </div>

        {/* Financial History */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-800 text-xs">Histórico de Mensalidades</h4>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-slate-500 text-[10px]">
                <tr>
                  <th className="px-3 py-2">Vencimento</th>
                  <th className="px-3 py-2">Valor</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Forma PGTO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentPayments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-slate-400">
                      Nenhum histórico de lançamento para este aluno.
                    </td>
                  </tr>
                ) : (
                  studentPayments.map((p) => (
                    <tr key={p.id}>
                      <td className="px-3 py-2 text-slate-800">{p.dueDate}</td>
                      <td className="px-3 py-2 font-bold text-slate-800">R$ {p.amount}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            p.status === 'Pago'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-600">{p.method}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}