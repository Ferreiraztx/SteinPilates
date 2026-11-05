import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  Users, Calendar as CalendarIcon, CheckCircle2, Clock, DollarSign,
  UserPlus, Activity, FileCheck, CalendarDays, Menu, X, Settings,
} from "lucide-react";
import {
  INITIAL_STUDENTS, INITIAL_CLASSES, INITIAL_PAYMENTS, INITIAL_ATTENDANCE,
  TODAY_STR, apiFetch,
} from "./shared/appData.js";
import LoginView from "./components/LoginView.jsx";
import NewStudentModal from "./components/NewStudentModal.jsx";
import ScheduleClassModal from "./components/ScheduleClassModal.jsx";
import RecordPaymentModal from "./components/RecordPaymentModal.jsx";
import StudentProfileModal from "./components/StudentProfileModal.jsx";
import DashboardView from "./pages/DashboardView.jsx";
import StudentsView from "./pages/StudentsView.jsx";
import ScheduleView from "./pages/ScheduleView.jsx";
import AttendanceReportsView from "./pages/AttendanceReportsView.jsx";
import FinancialView from "./pages/FinancialView.jsx";
import InvoicesView from "./pages/InvoicesView.jsx";
import SettingsView from "./pages/SettingsView.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";
export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  // Global State
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const routeTab = location.pathname.replace("/", "") || "dashboard";
  const activeTab = ["dashboard", "alunos", "agenda", "relatorios", "financeiro", "nfs", "configuracoes"].includes(routeTab)
    ? routeTab
    : "dashboard";
  const setActiveTab = (tab) => navigate(`/${tab}`);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [settings, setSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [isScheduleClassModalOpen, setIsScheduleClassModalOpen] =
    useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedStudentForView, setSelectedStudentForView] = useState(null);
  const [studentBeingEdited, setStudentBeingEdited] = useState(null);
  const [classBeingEdited, setClassBeingEdited] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Quick Notification Toast
  const [toastMessage, setToastMessage] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    apiFetch("auth/me")
      .then((currentUser) => {
        setUser(currentUser);
        return apiFetch("bootstrap");
      })
      .then((data) => {
        if (!data) return;
        setStudents(data.students);
        setClasses(data.classes);
        setPayments(data.payments);
        setAttendance(data.attendance);
        setSettings(data.settings || []);
      })
      .catch(() => setUser(null))
      .finally(() => {
        setAuthLoading(false);
        setIsLoading(false);
      });
  }, []);

  const handleApiError = (error) => showToast(`Erro: ${error.message}`);

  const handleLogin = async (credentials) => {
    const currentUser = await apiFetch("auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setUser(currentUser);
    const data = await apiFetch("bootstrap");
    setStudents(data.students);
    setClasses(data.classes);
    setPayments(data.payments);
    setAttendance(data.attendance);
  };

  const handleLogout = async () => {
    await apiFetch("auth/logout", { method: "POST" });
    setUser(null);
  };

  // State Updates Handlers
  const handleAddStudent = async (newStudent) => {
    try {
      const student = await apiFetch("students", { method: "POST", body: JSON.stringify(newStudent) });
      setStudents((prev) => [student, ...prev.filter((item) => item.id !== student.id)]);
      showToast(`Aluno ${student.name} cadastrado com sucesso!`);
      setIsNewStudentModalOpen(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleUpdateStudent = async (studentId, changes) => {
    try {
      const student = await apiFetch(`students/${studentId}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
      });
      setStudents((prev) => prev.map((item) => item.id === student.id ? student : item));
      setSelectedStudentForView((current) => current?.id === student.id ? student : current);
      setStudentBeingEdited(null);
      showToast(`Dados de ${student.name} atualizados!`);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDeleteStudent = async (student) => {
    try {
      await apiFetch(`students/${student.id}`, { method: "DELETE" });
      setStudents((prev) => prev.filter((item) => item.id !== student.id));
      setClasses((prev) => prev.map((item) => ({
        ...item,
        studentIds: item.studentIds.filter((studentId) => studentId !== student.id),
      })));
      setAttendance((prev) => prev.filter((item) => item.studentId !== student.id));
      setPayments((prev) => prev.filter((item) => item.studentId !== student.id));
      setSelectedStudentForView((current) => current?.id === student.id ? null : current);
      setStudentBeingEdited((current) => current?.id === student.id ? null : current);
      showToast(`Aluno ${student.name} excluído com sucesso.`);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleScheduleClass = async (newClass) => {
    try {
      const data = await apiFetch("classes", { method: "POST", body: JSON.stringify(newClass) });
      const scheduledClasses = data.items || [data];
      setClasses((prev) => [...prev, ...scheduledClasses]);
      showToast(scheduledClasses.length > 1
        ? `${scheduledClasses.length} aulas agendadas com sucesso!`
        : "Aula agendada com sucesso!");
      setIsScheduleClassModalOpen(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleAddSetting = async (setting) => {
    try {
      const created = await apiFetch("settings", { method: "POST", body: JSON.stringify(setting) });
      setSettings((prev) => [...prev, created]);
      showToast("Configuração adicionada.");
    } catch (error) { handleApiError(error); }
  };

  const handleUpdateSetting = async (id, changes) => {
    try {
      const updated = await apiFetch(`settings/${id}`, { method: "PATCH", body: JSON.stringify(changes) });
      setSettings((prev) => prev.map((item) => item.id === updated.id ? updated : item));
    } catch (error) { handleApiError(error); }
  };

  const handleDeleteSetting = async (id) => {
    try {
      await apiFetch(`settings/${id}`, { method: "DELETE" });
      setSettings((prev) => prev.filter((item) => item.id !== id));
      showToast("Configuração removida.");
    } catch (error) { handleApiError(error); }
  };

  const handleChangePassword = async (passwords) => {
    try {
      await apiFetch("auth/password", { method: "PATCH", body: JSON.stringify(passwords) });
      setUser(null);
      showToast("Senha alterada. Faça login novamente.");
    } catch (error) { handleApiError(error); }
  };

  const handleUpdateClass = async (classId, changes) => {
    try {
      const updatedClass = await apiFetch(`classes/${classId}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
      });
      setClasses((prev) => prev.map((item) => item.id === updatedClass.id ? updatedClass : item));
      setClassBeingEdited(null);
      showToast("Aula atualizada com sucesso!");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      await apiFetch(`classes/${classId}`, { method: "DELETE" });
      setClasses((prev) => prev.filter((item) => item.id !== classId));
      setAttendance((prev) => prev.filter((item) => item.classId !== classId));
      setClassBeingEdited((current) => current?.id === classId ? null : current);
      showToast("Aula removida da agenda.");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleRecordPayment = async (newPayment) => {
    try {
      const payment = await apiFetch("payments", { method: "POST", body: JSON.stringify(newPayment) });
      setPayments((prev) => [payment, ...prev.filter((item) => item.id !== payment.id)]);
      showToast("Pagamento registrado com sucesso!");
      setIsPaymentModalOpen(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleMarkPaymentAsPaid = async (payId, method) => {
    try {
      const payment = await apiFetch(`payments/${payId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "Pago", paymentDate: TODAY_STR, method: method || "PIX" }),
      });
      setPayments((prev) => prev.map((item) => item.id === payment.id ? payment : item));
      showToast("Status do pagamento atualizado para PAGO!");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleUpdatePaymentStatus = async (payId, status) => {
    try {
      const payment = await apiFetch(`payments/${payId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
          paymentDate: status === "Pago" ? TODAY_STR : null,
        }),
      });
      setPayments((prev) => prev.map((item) => item.id === payment.id ? payment : item));
      showToast("Status financeiro atualizado!");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleUpdateNF = async (payId, nfNumber, nfStatus) => {
    try {
      const payment = await apiFetch(`payments/${payId}`, {
        method: "PATCH",
        body: JSON.stringify({ nfNumber, nfStatus }),
      });
      setPayments((prev) => prev.map((item) => item.id === payment.id ? payment : item));
      showToast("Informações de Nota Fiscal atualizadas!");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleToggleAttendance = async (classId, studentId, status) => {
    try {
      const data = await apiFetch("attendance", {
        method: "PATCH",
        body: JSON.stringify({ classId, studentId, status }),
      });
      setAttendance(data.attendance);
      setStudents(data.students);
      showToast(status === "Falta Justificada" ? "1 crédito de reposição foi adicionado ao aluno." : "Frequência registrada!");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleMoveStudentPhase = async (studentId, newPhase) => {
    const student = students.find((item) => item.id === studentId);
    if (!student) return;
    const newStatus = newPhase === "Convertido" ? "Ativo" : "Prospecção";
    try {
      const updatedStudent = await apiFetch(`students/${studentId}`, {
        method: "PATCH",
        body: JSON.stringify({ phase: newPhase, status: newStatus }),
      });
      setStudents((prev) => prev.map((item) => item.id === updatedStudent.id ? updatedStudent : item));
    } catch (error) {
      handleApiError(error);
    }
  };

  // Helper Metrics for Dashboard
  const metrics = useMemo(() => {
    const ativos = students.filter((s) => s.status === "Ativo").length;
    const leads = students.filter((s) => s.status === "Prospecção").length;
    const totalProspection = students.filter(
      (s) => s.status === "Prospecção" || s.phase === "Convertido",
    ).length;
    const converted = students.filter((s) => s.phase === "Convertido").length;
    const conversionRate =
      totalProspection > 0
        ? Math.round((converted / totalProspection) * 100)
        : 0;

    const totalRevenueMonth = payments
      .filter((p) => p.status === "Pago")
      .reduce((acc, p) => acc + p.amount, 0);

    const pendingPayments = payments.filter(
      (p) => p.status === "Pendente" || p.status === "Atrasado",
    ).length;
    const pendingNF = payments.filter(
      (p) => p.status === "Pago" && p.nfStatus === "Pendente de Emissão",
    ).length;

    return {
      ativos,
      leads,
      conversionRate,
      totalRevenueMonth,
      pendingPayments,
      pendingNF,
    };
  }, [students, payments]);

  if (authLoading) {
    return <div className="min-h-screen bg-[#F3ECE4] flex items-center justify-center text-sm text-slate-600">Verificando sessão...</div>;
  }

  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

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
                { id: "dashboard", label: "Painel Principal", icon: Activity },
                {
                  id: "alunos",
                  label: "Alunos (CRM)",
                  icon: Users,
                  badge: students.filter((s) => s.status === "Prospecção")
                    .length,
                },
                { id: "agenda", label: "Agenda Rápida", icon: Clock },
                {
                  id: "relatorios",
                  label: "Aulas & Frequência",
                  icon: CalendarDays,
                },
                {
                  id: "financeiro",
                  label: "Financeiro",
                  icon: DollarSign,
                  badge: metrics.pendingPayments,
                },
                {
                  id: "nfs",
                  label: "Notas Fiscais",
                  icon: FileCheck,
                  badge: metrics.pendingNF,
                },
                { id: "configuracoes", label: "Configurações", icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#E7D8C8] text-[#735C49] font-semibold"
                        : "text-slate-600 hover:bg-[#E9DDD0] hover:text-[#5F4B3A]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 ${isActive ? "text-[#806A56]" : "text-slate-400"}`}
                      />
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
                <p className="text-sm font-medium text-slate-900 truncate">
                  Prof Ada
                </p>
                <p className="text-xs text-slate-500 truncate">
                  Instrutora de Pilates
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="ml-auto text-xs text-slate-500 hover:text-slate-900"
              >
                Sair
              </button>
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
                  {activeTab === "dashboard" && "Painel Principal"}
                  {activeTab === "alunos" && "Gestão de Alunos & Prospecção"}
                  {activeTab === "agenda" && "Agenda Rápida do Estúdio"}
                  {activeTab === "relatorios" &&
                    "Aulas, Calendário Interativo & Frequência"}
                  {activeTab === "financeiro" &&
                    "Gestão Financeira & Mensalidades"}
                  {activeTab === "nfs" && "Controle de Emissão de NFs"}
                  {activeTab === "configuracoes" && "Configurações do Estúdio"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hoje é{" "}
                  {new Date().toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex items-center gap-2 md:hidden">
                <button
                  type="button"
                  aria-label="Abrir menu"
                  aria-expanded={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen((open) => !open)}
                  className="p-2 rounded-xl bg-white border border-slate-300 text-slate-700 shadow-xs"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isMobileMenuOpen && (
              <nav className="md:hidden w-full grid grid-cols-2 gap-2 pt-1">
                {[
                  ["dashboard", "Painel Principal"],
                  ["alunos", "Alunos (CRM)"],
                  ["agenda", "Agenda Rápida"],
                  ["relatorios", "Aulas & Frequência"],
                  ["financeiro", "Financeiro"],
                  ["nfs", "Notas Fiscais"],
                  ["configuracoes", "Configurações"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setActiveTab(id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`rounded-xl px-3 py-2 text-left text-xs font-semibold ${
                      activeTab === id
                        ? "bg-[#E7D8C8] text-[#735C49]"
                        : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            )}

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
            {isLoading && (
              <div className="rounded-xl border border-[#E5D8CA] bg-[#F3ECE4] px-4 py-2 text-xs text-[#735C49]">
                Sincronizando dados do estúdio...
              </div>
            )}
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
              <DashboardView
                metrics={metrics}
                students={students}
                classes={classes}
                payments={payments}
                allowedClassTypes={settings.filter((item) => item.category === "classType" && item.active).map((item) => item.name)}
                onSelectStudent={(st) => setSelectedStudentForView(st)}
                onOpenScheduleModal={() => setIsScheduleClassModalOpen(true)}
                onOpenStudentModal={() => setIsNewStudentModalOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
              } />

              <Route path="/alunos" element={
              <StudentsView
                students={students}
                onOpenNewStudentModal={() => setIsNewStudentModalOpen(true)}
                onSelectStudent={(st) => setSelectedStudentForView(st)}
                onEditStudent={(st) => setStudentBeingEdited(st)}
                onMoveStudentPhase={handleMoveStudentPhase}
                onDeleteStudent={(student) => setConfirmation({
                  title: "Excluir aluno",
                  message: `Tem certeza que deseja excluir "${student.name}"? O aluno, pagamentos e frequências relacionados serão removidos.`,
                  action: () => handleDeleteStudent(student),
                })}
              />
              } />

              <Route path="/agenda" element={
              <ScheduleView
                classes={classes}
                students={students}
                allowedClassTypes={settings.filter((item) => item.category === "classType" && item.active).map((item) => item.name)}
                onOpenScheduleModal={() => setIsScheduleClassModalOpen(true)}
                onEditClass={(item) => setClassBeingEdited(item)}
                onDeleteClass={(classId) => setConfirmation({
                  title: "Remover aula",
                  message: "Deseja remover esta aula da agenda? Essa ação não pode ser desfeita.",
                  action: () => handleDeleteClass(classId),
                })}
                onUpdateClassStatus={(classId, status) => handleUpdateClass(classId, { status })}
              />
              } />

              <Route path="/relatorios" element={
              <AttendanceReportsView
                classes={classes}
                students={students}
                allowedClassTypes={settings.filter((item) => item.category === "classType" && item.active).map((item) => item.name)}
                attendance={attendance}
                onToggleAttendance={handleToggleAttendance}
                onOpenScheduleModal={() => setIsScheduleClassModalOpen(true)}
                onEditClass={(item) => setClassBeingEdited(item)}
                onDeleteClass={(classId) => setConfirmation({
                  title: "Remover aula",
                  message: "Deseja remover esta aula da agenda? Essa ação não pode ser desfeita.",
                  action: () => handleDeleteClass(classId),
                })}
                onUpdateClassStatus={(classId, status) => handleUpdateClass(classId, { status })}
              />
              } />

              <Route path="/financeiro" element={
              <FinancialView
                payments={payments}
                onMarkPaid={handleMarkPaymentAsPaid}
                onUpdateStatus={handleUpdatePaymentStatus}
                onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
              />
              } />

              <Route path="/nfs" element={
              <InvoicesView payments={payments} onUpdateNF={handleUpdateNF} />
              } />
              <Route path="/configuracoes" element={
                <SettingsView settings={settings} onAdd={handleAddSetting} onUpdate={handleUpdateSetting} onDelete={handleDeleteSetting} onChangePassword={handleChangePassword} />
              } />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* MODAL 1: Novo Aluno */}
      {isNewStudentModalOpen && (
        <NewStudentModal
          planOptions={settings.filter((item) => item.category === "plan" && item.active)}
          onClose={() => setIsNewStudentModalOpen(false)}
          onAdd={handleAddStudent}
        />
      )}

      {studentBeingEdited && (
        <NewStudentModal
          planOptions={settings.filter((item) => item.category === "plan" && item.active)}
          student={studentBeingEdited}
          onClose={() => setStudentBeingEdited(null)}
          onSave={handleUpdateStudent}
        />
      )}

      {/* MODAL 2: Agendar Aula */}
      {isScheduleClassModalOpen && (
        <ScheduleClassModal
          students={students}
          classTypes={settings.filter((item) => item.category === "classType" && item.active)}
          onClose={() => setIsScheduleClassModalOpen(false)}
          onAdd={handleScheduleClass}
        />
      )}

      {classBeingEdited && (
        <ScheduleClassModal
          students={students}
          classTypes={settings.filter((item) => item.category === "classType" && item.active)}
          classItem={classBeingEdited}
          onClose={() => setClassBeingEdited(null)}
          onSave={handleUpdateClass}
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
          payments={payments}
          onClose={() => setSelectedStudentForView(null)}
        />
      )}
      {confirmation && (
        <ConfirmDialog
          title={confirmation.title}
          message={confirmation.message}
          onCancel={() => setConfirmation(null)}
          onConfirm={() => {
            const action = confirmation.action;
            setConfirmation(null);
            action();
          }}
        />
      )}
    </div>
  );
}

// ==========================================
// COMPONENT 1: DASHBOARD VIEW
// ==========================================
