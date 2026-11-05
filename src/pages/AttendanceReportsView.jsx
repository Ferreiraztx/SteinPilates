/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";
import { Users, Calendar as CalendarIcon, CheckCircle2, Clock, DollarSign, FileText, Plus, Search, Filter, UserPlus, Activity, AlertCircle, TrendingUp, ChevronLeft, ChevronRight, FileCheck, List, Grid, Eye, Sparkles, Phone, Mail, ShieldAlert, CalendarDays, CalendarRange, Menu, PieChart, BarChart3, X } from "lucide-react";
import { TIME_OPTIONS, TODAY_STR } from "../shared/appData.js";
function AttendanceReportsView({
  classes,
  students,
  attendance,
  onToggleAttendance,
  onOpenScheduleModal,
  onEditClass,
  onDeleteClass,
  onUpdateClassStatus,
  allowedClassTypes = [],
}) {
  const [calendarView, setCalendarView] = useState("month"); // 'month', 'week', 'day', 'agenda'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedClassForAttendance, setSelectedClassForAttendance] =
    useState(null);

  // Quick Filters
  const [filterType, setFilterType] = useState("Todos");
  const [filterStatus, setFilterStatus] = useState("Todos");

  // Filtered Classes for Calendar
  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      const configuredType = allowedClassTypes.includes(c.type);
      const matchType = filterType === "Todos" || c.type === filterType;
      const matchStatus = filterStatus === "Todos" || c.status === filterStatus;
      return configuredType && matchType && matchStatus;
    });
  }, [classes, filterType, filterStatus, allowedClassTypes]);

  // Calendar Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrev = () => {
    const d = new Date(currentDate);
    if (calendarView === "month") d.setMonth(d.getMonth() - 1);
    else if (calendarView === "week") d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (calendarView === "month") d.setMonth(d.getMonth() + 1);
    else if (calendarView === "week") d.setDate(d.getDate() + 7);
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
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
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
      const dateStr = next.toISOString().split("T")[0];
      days.push({
        dayName: next.toLocaleDateString("pt-BR", { weekday: "short" }),
        dayNumber: next.getDate(),
        dateStr,
      });
    }
    return days;
  }, [currentDate]);

  const visibleClasses = useMemo(() => {
    if (calendarView === "agenda") return filteredClasses;

    const visibleDates = calendarView === "month"
      ? new Set(monthDays.filter(Boolean).map((day) => day.dateStr))
      : calendarView === "week"
        ? new Set(weekDays.map((day) => day.dateStr))
        : new Set([currentDate.toISOString().split("T")[0]]);

    return filteredClasses.filter((classItem) => visibleDates.has(classItem.date));
  }, [calendarView, currentDate, filteredClasses, monthDays, weekDays]);

  // Summary cards reflect only classes displayed by the current calendar view.
  const visibleClassIds = new Set(visibleClasses.map((classItem) => classItem.id));
  const visibleAttendance = attendance.filter((item) => visibleClassIds.has(item.classId));
  const totalCompleted = visibleAttendance.filter((item) => item.status === "Presente").length;
  const totalJustified = visibleAttendance.filter((item) => item.status === "Falta Justificada").length;
  const totalUnjustified = visibleAttendance.filter((item) => item.status === "Falta Sem Justificativa").length;
  const totalReplacementsPending = visibleClasses.filter((classItem) => classItem.status === "Reposição").length;

  return (
    <div className="space-y-6">
      {/* Calendar Toolbar & Filter Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={handlePrev}
                className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleToday}
                className="px-2.5 py-1 text-xs font-semibold hover:bg-white rounded-lg text-slate-700 transition"
              >
                Hoje
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-bold text-slate-900 text-base capitalize">
              {calendarView === "month" &&
                currentDate.toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              {calendarView === "week" &&
                `Semana de ${weekDays[0]?.dayNumber} a ${weekDays[6]?.dayNumber} de ${currentDate.toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}`}
              {calendarView === "day" &&
                currentDate.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              {calendarView === "agenda" && "Lista / Agenda Completa"}
            </h3>
          </div>

          {/* View Switcher & Actions */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              {[
                { id: "month", label: "Mês", icon: CalendarDays },
                { id: "week", label: "Semana", icon: CalendarRange },
                { id: "day", label: "Dia", icon: Clock },
                { id: "agenda", label: "Agenda", icon: List },
              ].map((v) => {
                const Icon = v.icon;
                return (
                  <button
                    key={v.id}
                    onClick={() => setCalendarView(v.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      calendarView === v.id
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
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
                {allowedClassTypes.map((type) => <option key={type} value={type}>{type}</option>)}
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
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>{" "}
              Concluída
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>{" "}
              Agendada
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>{" "}
              Reposição
            </span>
          </div>
        </div>

        {/* ================= CALENDAR VIEWS ================= */}

        {/* 1. MONTH VIEW */}
        {calendarView === "month" && (
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            {/* Days Header */}
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center font-bold text-xs py-2 text-slate-600">
              <div>Dom</div>
              <div>Seg</div>
              <div>Ter</div>
              <div>Qua</div>
              <div>Qui</div>
              <div>Sex</div>
              <div>Sáb</div>
            </div>

            {/* Grid Days */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-white">
              {monthDays.map((d, index) => {
                if (!d)
                  return (
                    <div
                      key={`empty-${index}`}
                      className="min-h-[100px] bg-slate-50/40"
                    ></div>
                  );

                const dayClasses = filteredClasses.filter(
                  (c) => c.date === d.dateStr,
                );
                const isToday = d.dateStr === TODAY_STR;

                return (
                  <div
                    key={d.dateStr}
                    className={`min-h-[110px] p-2 flex flex-col justify-between transition hover:bg-slate-50/80 ${
                      isToday ? "bg-amber-50/30 font-bold" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          isToday
                            ? "bg-[#5E7A67] text-white shadow-xs"
                            : "text-slate-700"
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
                        const classStudents = students.filter((s) =>
                          c.studentIds.includes(s.id),
                        );
                        return (
                          <div
                            key={c.id}
                            onClick={() => setSelectedClassForAttendance(c)}
                            className={`p-1.5 rounded-lg text-[10px] font-medium cursor-pointer transition shadow-2xs border ${
                              c.status === "Concluída"
                                ? "bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100"
                                : c.status === "Cancelada"
                                  ? "bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100"
                                  : c.status === "Reposição"
                                    ? "bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100"
                                    : "bg-blue-50 border-blue-300 text-blue-900 hover:bg-blue-100"
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold">
                              <span>{c.time}</span>
                              <span className="text-[9px] opacity-80">
                                {c.type}
                              </span>
                            </div>
                            <div className="truncate font-semibold mt-0.5">
                              {classStudents
                                .map((s) => s.name.split(" ")[0])
                                .join(", ")}
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
        {calendarView === "week" && (
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center py-2.5">
              {weekDays.map((wd) => (
                <div
                  key={wd.dateStr}
                  className={`text-xs ${wd.dateStr === TODAY_STR ? "font-bold text-[#5E7A67]" : "text-slate-600"}`}
                >
                  <p className="uppercase text-[10px] font-semibold text-slate-400">
                    {wd.dayName}
                  </p>
                  <p
                    className={`text-sm mt-0.5 inline-block px-2 py-0.5 rounded-full ${wd.dateStr === TODAY_STR ? "bg-[#5E7A67] text-white" : ""}`}
                  >
                    {wd.dayNumber}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 divide-x divide-slate-100 min-h-[350px]">
              {weekDays.map((wd) => {
                const dayClasses = filteredClasses.filter(
                  (c) => c.date === wd.dateStr,
                );
                return (
                  <div
                    key={wd.dateStr}
                    className="p-2 space-y-2 bg-slate-50/20"
                  >
                    {dayClasses.map((c) => {
                      const classStudents = students.filter((s) =>
                        c.studentIds.includes(s.id),
                      );
                      return (
                        <div
                          key={c.id}
                          onClick={() => setSelectedClassForAttendance(c)}
                          className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs cursor-pointer hover:border-[#5E7A67] transition"
                        >
                          <span className="text-xs font-bold text-slate-900">
                            {c.time}
                          </span>
                          <p className="text-[11px] font-medium text-slate-700 truncate mt-0.5">
                            {classStudents.map((s) => s.name).join(", ")}
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
        {calendarView === "day" && (
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Horários de {currentDate.toLocaleDateString("pt-BR")}
            </h4>

            {TIME_OPTIONS.map((timeSlot) => {
              const dateStr = currentDate.toISOString().split("T")[0];
              const slotClasses = filteredClasses.filter(
                (c) => c.date === dateStr && c.time === timeSlot,
              );

              return (
                <div
                  key={timeSlot}
                  className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50"
                >
                  <span className="font-bold text-slate-800 text-xs w-16 bg-white py-1 px-2.5 rounded-lg border border-slate-200 text-center">
                    {timeSlot}
                  </span>

                  <div className="flex-1">
                    {slotClasses.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">
                        Livre
                      </span>
                    ) : (
                      slotClasses.map((c) => {
                        const classStudents = students.filter((s) =>
                          c.studentIds.includes(s.id),
                        );
                        return (
                          <div
                            key={c.id}
                            onClick={() => setSelectedClassForAttendance(c)}
                            className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between cursor-pointer hover:border-[#5E7A67]"
                          >
                            <div>
                              <p className="font-bold text-slate-900 text-xs">
                                {classStudents.map((s) => s.name).join(", ")}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {c.type} • Status: {c.status}
                              </p>
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
        {calendarView === "agenda" && (
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
                  const classStudents = students.filter((s) =>
                    c.studentIds.includes(s.id),
                  );
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {c.date}
                      </td>
                      <td className="px-4 py-3 font-bold">{c.time}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {classStudents.map((s) => s.name).join(", ")}
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
          <p className="text-xs text-slate-500 font-semibold uppercase">
            Presenças Registradas
          </p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {totalCompleted}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">
            Faltas Justificadas
          </p>
          <p className="text-2xl font-bold text-amber-700 mt-1">
            {totalJustified}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">
            Faltas Não Justificadas
          </p>
          <p className="text-2xl font-bold text-rose-700 mt-1">
            {totalUnjustified}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">
            Reposições Pendentes
          </p>
          <p className="text-2xl font-bold text-[#5E7A67] mt-1">
            {totalReplacementsPending}
          </p>
        </div>
      </div>

      {/* QUICK ATTENDANCE DRAWER / MODAL */}
      {selectedClassForAttendance && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Lançar Frequência
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedClassForAttendance.date} às{" "}
                  {selectedClassForAttendance.time} •{" "}
                  {selectedClassForAttendance.type}
                </p>
              </div>
              <button
                onClick={() => setSelectedClassForAttendance(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <select
                  value={selectedClassForAttendance.status}
                  onChange={(event) => {
                    onUpdateClassStatus(selectedClassForAttendance.id, event.target.value);
                    setSelectedClassForAttendance({
                      ...selectedClassForAttendance,
                      status: event.target.value,
                    });
                  }}
                  className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold ${
                    selectedClassForAttendance.status === "Concluída"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                      : selectedClassForAttendance.status === "Cancelada"
                        ? "border-rose-300 bg-rose-50 text-rose-800"
                        : selectedClassForAttendance.status === "Reposição"
                          ? "border-amber-300 bg-amber-50 text-amber-800"
                          : "border-blue-300 bg-blue-50 text-blue-800"
                  }`}
                >
                  <option value="Agendada">Agendada</option>
                  <option value="Concluída">Concluída</option>
                  <option value="Cancelada">Cancelada</option>
                  <option value="Reposição">Reposição</option>
                </select>
                <button
                  type="button"
                  onClick={() => { onEditClass(selectedClassForAttendance); setSelectedClassForAttendance(null); }}
                  className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => { onDeleteClass(selectedClassForAttendance.id); setSelectedClassForAttendance(null); }}
                  className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700"
                >
                  Remover
                </button>
              </div>
              {students
                .filter((s) =>
                  selectedClassForAttendance.studentIds.includes(s.id),
                )
                .map((student) => {
                  const att = attendance.find(
                    (a) =>
                      a.classId === selectedClassForAttendance.id &&
                      a.studentId === student.id,
                  );
                  const currentStatus = att ? att.status : "Pendente";

                  return (
                    <div
                      key={student.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">
                          {student.name}
                        </span>
                        {student.healthNotes && (
                          <span className="text-[10px] text-amber-700 font-semibold">
                            ⚠️ Restrição registrada
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-1 text-[11px]">
                        {[
                          { label: "Presente", color: "bg-emerald-600" },
                          { label: "Falta Justificada", color: "bg-amber-600" },
                          {
                            label: "Falta Sem Justificativa",
                            color: "bg-rose-600",
                          },
                        ].map((btn) => (
                          <button
                            key={btn.label}
                            onClick={() =>
                              onToggleAttendance(
                                selectedClassForAttendance.id,
                                student.id,
                                btn.label,
                              )
                            }
                            className={`p-1.5 rounded-lg text-[10px] font-semibold text-center transition ${
                              currentStatus === btn.label
                                ? `${btn.color} text-white shadow-xs`
                                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {btn.label === "Falta Justificada"
                              ? "Falta Justif."
                              : btn.label === "Falta Sem Justificativa"
                                ? "Falta N.J."
                                : "Presente"}
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
export default AttendanceReportsView;
