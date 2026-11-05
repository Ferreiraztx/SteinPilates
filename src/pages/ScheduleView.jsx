/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";
import { Users, Calendar as CalendarIcon, CheckCircle2, Clock, DollarSign, FileText, Plus, Search, Filter, UserPlus, Activity, AlertCircle, TrendingUp, ChevronLeft, ChevronRight, FileCheck, List, Grid, Eye, Sparkles, Phone, Mail, ShieldAlert, CalendarDays, CalendarRange, Menu, PieChart, BarChart3, X } from "lucide-react";
import { TIME_OPTIONS, TODAY_STR } from "../shared/appData.js";
function ScheduleView({
  classes,
  students,
  onOpenScheduleModal,
  onEditClass,
  onDeleteClass,
  onUpdateClassStatus,
  allowedClassTypes = [],
}) {
  const [selectedDate, setSelectedDate] = useState(TODAY_STR);

  const classesForDate = useMemo(() => {
    return classes.filter((c) => c.date === selectedDate && allowedClassTypes.includes(c.type));
  }, [classes, selectedDate, allowedClassTypes]);

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
          Aulas do Dia - {selectedDate.split("-").reverse().join("/")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TIME_OPTIONS.map((timeSlot) => {
            const classInSlot = classesForDate.find((c) => c.time === timeSlot);

            return (
              <div
                key={timeSlot}
                className={`p-4 rounded-xl border transition ${
                  classInSlot
                    ? classInSlot.status === "Concluída"
                      ? "border-emerald-300 bg-emerald-50/70"
                      : classInSlot.status === "Cancelada"
                        ? "border-rose-300 bg-rose-50/70"
                        : classInSlot.status === "Reposição"
                          ? "border-amber-300 bg-amber-50/70"
                          : "border-blue-300 bg-blue-50/70"
                    : "border-dashed border-slate-200 bg-slate-50/40 hover:bg-slate-100/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    {timeSlot}
                  </span>

                  {classInSlot && (
                    <select
                      value={classInSlot.status}
                      onChange={(e) =>
                        onUpdateClassStatus(classInSlot.id, e.target.value)
                      }
                      className={`text-xs rounded-lg px-2 py-1 font-semibold bg-white border ${
                        classInSlot.status === "Concluída"
                          ? "border-emerald-300 text-emerald-800"
                          : classInSlot.status === "Cancelada"
                            ? "border-rose-300 text-rose-800"
                            : classInSlot.status === "Reposição"
                              ? "border-amber-300 text-amber-800"
                              : "border-blue-300 text-blue-800"
                      }`}
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
                          .join(", ")}
                      </span>
                      <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                        {classInSlot.type}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => onEditClass(classInSlot)}
                        className="text-xs text-[#435B4B] hover:underline font-medium"
                      >
                        Editar aula
                      </button>
                      <button
                        onClick={() => onDeleteClass(classInSlot.id)}
                        className="text-xs text-rose-600 hover:underline font-medium"
                      >
                        Remover
                      </button>
                    </div>

                    {/* Restricted Health Warnings */}
                    {students
                      .filter(
                        (s) =>
                          classInSlot.studentIds.includes(s.id) &&
                          s.healthNotes,
                      )
                      .map((s) => (
                        <p
                          key={s.id}
                          className="text-[11px] text-[#D9826C] bg-amber-50 p-1.5 rounded border border-amber-200 font-medium"
                        >
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
export default ScheduleView;
