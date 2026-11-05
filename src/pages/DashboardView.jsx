/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";
import { Users, Calendar as CalendarIcon, CheckCircle2, Clock, DollarSign, FileText, Plus, Search, Filter, UserPlus, Activity, AlertCircle, TrendingUp, ChevronLeft, ChevronRight, FileCheck, List, Grid, Eye, Sparkles, Phone, Mail, ShieldAlert, CalendarDays, CalendarRange, Menu, PieChart, BarChart3, X } from "lucide-react";
import { TODAY_STR } from "../shared/appData.js";
function DashboardView({
  metrics,
  students,
  classes,
  payments,
  allowedClassTypes = [],
  onSelectStudent,
  onOpenScheduleModal,
  onNavigateTab,
}) {
  const todayClasses = classes.filter(
    (c) => c.date === TODAY_STR && allowedClassTypes.includes(c.type),
  );
  const pendingPaymentsList = payments.filter(
    (p) => p.status === "Atrasado" || p.status === "Pendente",
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Alunos Ativos
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {metrics.ativos}
            </p>
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Leads & Prospecção
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {metrics.leads}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Taxa de Conversão:{" "}
              <strong className="text-slate-800">
                {metrics.conversionRate}%
              </strong>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-700">
            <UserPlus className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Faturamento (Mês)
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              R$ {metrics.totalRevenueMonth.toLocaleString("pt-BR")}
            </p>
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pendências NF-e
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {metrics.pendingNF}
            </p>
            <p className="text-xs text-[#D9826C] font-medium mt-2">
              Aguardando emissão
            </p>
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
                const assignedStudents = students.filter((s) =>
                  c.studentIds.includes(s.id),
                );
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
                            {assignedStudents.map((s) => s.name).join(", ") ||
                              "Sem alunos"}
                          </span>
                          <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.2 rounded-md">
                            {c.type}
                          </span>
                        </div>
                        {assignedStudents.some((s) => s.healthNotes) && (
                          <p className="text-xs text-[#D9826C] mt-0.5 flex items-center gap-1 font-medium">
                            <ShieldAlert className="w-3 h-3" /> Atenção a
                            restrições de saúde
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          c.status === "Concluída"
                            ? "bg-emerald-100 text-emerald-800"
                            : c.status === "Agendada"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
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
                <AlertCircle className="w-4 h-4 text-[#D9826C]" /> Mensalidades
                Pendentes
              </h3>
              <button
                onClick={() => onNavigateTab("financeiro")}
                className="text-xs text-[#435B4B] font-medium hover:underline"
              >
                Ver tudo
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {pendingPaymentsList.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">
                  Todos os pagamentos em dia!
                </p>
              ) : (
                pendingPaymentsList.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-rose-100 bg-rose-50/40 text-xs"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {p.studentName}
                      </p>
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
                <Sparkles className="w-4 h-4 text-amber-500" /> Saldo de
                Reposições
              </h3>
              <button
                onClick={() => onNavigateTab("relatorios")}
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
export default DashboardView;
