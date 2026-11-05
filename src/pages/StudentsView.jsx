/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";
import { Users, Calendar as CalendarIcon, CheckCircle2, Clock, DollarSign, FileText, Plus, Search, Filter, UserPlus, Activity, AlertCircle, TrendingUp, ChevronLeft, ChevronRight, FileCheck, List, Grid, Eye, Sparkles, Phone, Mail, ShieldAlert, CalendarDays, CalendarRange, Menu, PieChart, BarChart3, X } from "lucide-react";
import { TODAY_STR } from "../shared/appData.js";
function StudentsView({
  students,
  onOpenNewStudentModal,
  onSelectStudent,
  onEditStudent,
  onMoveStudentPhase,
  onDeleteStudent,
}) {
  const [filterTab, setFilterTab] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'funnel'

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase());

      if (filterTab === "Todos") return matchesSearch;
      if (filterTab === "Ativos") return matchesSearch && s.status === "Ativo";
      if (filterTab === "Inativos")
        return matchesSearch && s.status === "Inativo";
      if (filterTab === "Prospecção")
        return matchesSearch && s.status === "Prospecção";
      return matchesSearch;
    });
  }, [students, filterTab, searchQuery]);

  // Phase change for Funnel Drag or Click
  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {["Todos", "Ativos", "Prospecção", "Inativos"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterTab === tab
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
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
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg ${viewMode === "list" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500"}`}
              title="Visão em Lista"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("funnel")}
              className={`p-1.5 rounded-lg ${viewMode === "funnel" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500"}`}
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
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-semibold text-slate-500 tracking-wider">
                <tr>
                  <th className="px-4 py-3">Aluno</th>
                  <th className="px-4 py-3">Contato</th>
                  <th className="px-4 py-3">Plano</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Restrições / Saúde</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-400">
                      Nenhum aluno encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/60 transition"
                    >
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {student.name}
                      </td>
                      <td className="px-4 py-3 space-y-0.5">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Phone className="w-3 h-3 text-slate-400" />{" "}
                          {student.phone}
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" />{" "}
                          {student.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-800">
                          {student.plan}
                        </span>
                        <p className="text-[11px] text-slate-400">
                          R$ {student.monthlyFee}/mês
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            student.status === "Ativo"
                              ? "bg-emerald-100 text-emerald-800"
                              : student.status === "Prospecção"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate text-slate-500">
                        {student.healthNotes || "Nenhuma restrição registrada."}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ver Perfil
                        </button>
                        <button
                          onClick={() => onEditStudent(student)}
                          className="mt-1 text-[#435B4B] hover:underline text-xs font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDeleteStudent(student)}
                          className="mt-1 ml-3 text-rose-600 hover:underline text-xs font-medium"
                        >
                          Excluir
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
      {viewMode === "funnel" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              phase: "Lead",
              label: "1. Novos Leads / Contatos",
              color: "bg-blue-50 border-blue-200",
            },
            {
              phase: "Aula Experimental",
              label: "2. Aula Experimental Agendada",
              color: "bg-amber-50 border-amber-200",
            },
            {
              phase: "Convertido",
              label: "3. Convertido / Matriculado",
              color: "bg-emerald-50 border-emerald-200",
            },
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
                        <span className="font-semibold text-slate-900 text-xs">
                          {st.name}
                        </span>
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
                          {col.phase !== "Lead" && (
                            <button
                              onClick={() =>
                                onMoveStudentPhase(
                                  st.id,
                                  col.phase === "Convertido"
                                    ? "Aula Experimental"
                                    : "Lead",
                                )
                              }
                              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                            >
                              &larr; Voltar
                            </button>
                          )}
                          {col.phase !== "Convertido" && (
                            <button
                              onClick={() =>
                                onMoveStudentPhase(
                                  st.id,
                                  col.phase === "Lead"
                                    ? "Aula Experimental"
                                    : "Convertido",
                                )
                              }
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
export default StudentsView;
