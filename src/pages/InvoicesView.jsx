/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";
import { Users, Calendar as CalendarIcon, CheckCircle2, Clock, DollarSign, FileText, Plus, Search, Filter, UserPlus, Activity, AlertCircle, TrendingUp, ChevronLeft, ChevronRight, FileCheck, List, Grid, Eye, Sparkles, Phone, Mail, ShieldAlert, CalendarDays, CalendarRange, Menu, PieChart, BarChart3, X } from "lucide-react";
import { TODAY_STR } from "../shared/appData.js";
function InvoicesView({ payments, onUpdateNF }) {
  const [editingNfId, setEditingNfId] = useState(null);
  const [nfInput, setNfInput] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("Todos");
  const [filterDate, setFilterDate] = useState(TODAY_STR);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const paidPayments = useMemo(() => payments.filter((payment) => {
    if (payment.status !== "Pago") return false;
    const date = payment.paymentDate || payment.dueDate;
    if (filterPeriod === "Todos") return true;
    if (filterPeriod === "Dia") return date === filterDate;
    if (filterPeriod === "Mês") return date.startsWith(filterDate.slice(0, 7));
    if (filterPeriod === "Ano") return date.startsWith(filterDate.slice(0, 4));
    return (!customStart || date >= customStart) && (!customEnd || date <= customEnd);
  }), [payments, filterPeriod, filterDate, customStart, customEnd]);

  const handleSaveNf = (payId) => {
    onUpdateNF(payId, nfInput, "Emitida");
    setEditingNfId(null);
    setNfInput("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#5E7A67]" />
          Controle de Emissão de Notas Fiscais (NFs)
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Acompanhe os pagamentos confirmados e vincule o número da Nota Fiscal
          emitida.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 p-3">
          <label className="text-xs font-semibold text-slate-600">Período:</label>
          <select value={filterPeriod} onChange={(event) => setFilterPeriod(event.target.value)} className="border border-slate-300 rounded-xl px-3 py-2 text-xs">
            <option value="Todos">Todos</option>
            <option value="Dia">Dia</option>
            <option value="Mês">Mês</option>
            <option value="Ano">Ano</option>
            <option value="Personalizado">Personalizado</option>
          </select>
          {filterPeriod !== "Todos" && filterPeriod !== "Personalizado" && (
            <input
              type={filterPeriod === "Ano" ? "number" : filterPeriod === "Mês" ? "month" : "date"}
              value={filterPeriod === "Ano" ? filterDate.slice(0, 4) : filterPeriod === "Mês" ? filterDate.slice(0, 7) : filterDate}
              onChange={(event) => setFilterDate(filterPeriod === "Ano" ? `${event.target.value}-01-01` : event.target.value)}
              min={filterPeriod === "Ano" ? "2000" : undefined}
              max={filterPeriod === "Ano" ? "2100" : undefined}
              className="border border-slate-300 rounded-xl px-3 py-2 text-xs"
              aria-label={`Filtrar por ${filterPeriod.toLowerCase()}`}
            />
          )}
          {filterPeriod === "Personalizado" && (
            <>
              <input type="date" value={customStart} onChange={(event) => setCustomStart(event.target.value)} className="border border-slate-300 rounded-xl px-3 py-2 text-xs" aria-label="Data inicial" />
              <span className="text-xs text-slate-400">até</span>
              <input type="date" value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} className="border border-slate-300 rounded-xl px-3 py-2 text-xs" aria-label="Data final" />
            </>
          )}
        </div>

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
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {p.studentName}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">
                      R$ {p.amount}
                    </td>
                    <td className="px-4 py-3">{p.paymentDate}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          p.nfStatus === "Emitida"
                            ? "bg-emerald-100 text-emerald-800"
                            : p.nfStatus === "Isenta"
                              ? "bg-slate-200 text-slate-700"
                              : "bg-amber-100 text-amber-800"
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
                        p.nfNumber || "—"
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
                            setNfInput(p.nfNumber || "");
                          }}
                          className="text-[#435B4B] hover:underline font-medium text-xs"
                        >
                          {p.nfStatus === "Emitida"
                            ? "Editar NF"
                            : "Vincular NF"}
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

export default InvoicesView;
