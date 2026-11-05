/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";
import { Users, Calendar as CalendarIcon, CheckCircle2, Clock, DollarSign, FileText, Plus, Search, Filter, UserPlus, Activity, AlertCircle, TrendingUp, ChevronLeft, ChevronRight, FileCheck, List, Grid, Eye, Sparkles, Phone, Mail, ShieldAlert, CalendarDays, CalendarRange, Menu, PieChart, BarChart3, X } from "lucide-react";
import { TODAY_STR } from "../shared/appData.js";
function FinancialView({
  payments,
  onMarkPaid,
  onUpdateStatus,
  onOpenPaymentModal,
}) {
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [filterPeriod, setFilterPeriod] = useState("Todos");
  const [filterDate, setFilterDate] = useState(TODAY_STR);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const paymentDate = (payment) => payment.paymentDate || payment.dueDate;

  const filteredPayments = useMemo(() => {
    const now = new Date();
    return payments.filter((payment) => {
      if (filterStatus !== "Todos" && payment.status !== filterStatus) return false;
      const date = paymentDate(payment);
      if (filterPeriod === "Todos") return true;
      if (filterPeriod === "Dia") return date === filterDate;
      if (filterPeriod === "Mês") return date.startsWith(filterDate.slice(0, 7));
      if (filterPeriod === "Ano") return date.startsWith(filterDate.slice(0, 4));
      if (filterPeriod === "Personalizado") {
        return (!customStart || date >= customStart) && (!customEnd || date <= customEnd);
      }
      return date === now.toISOString().slice(0, 10);
    });
  }, [payments, filterStatus, filterPeriod, filterDate, customStart, customEnd]);

  const paymentMethods = useMemo(() => {
    const paid = filteredPayments.filter((payment) => payment.status === "Pago");
    const totals = paid.reduce((result, payment) => {
      const method = payment.method || "Não informado";
      result[method] = (result[method] || 0) + 1;
      return result;
    }, {});
    return Object.entries(totals).sort(([, first], [, second]) => second - first);
  }, [filteredPayments]);

  const monthlyRevenue = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let index = 5; index >= 0; index -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
      const key = date.toISOString().slice(0, 7);
      months.push({
        key,
        label: date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
        total: filteredPayments
          .filter((payment) => payment.status === "Pago" && payment.paymentDate?.startsWith(key))
          .reduce((total, payment) => total + payment.amount, 0),
      });
    }
    return months;
  }, [filteredPayments]);

  const maxRevenue = Math.max(...monthlyRevenue.map((month) => month.total), 1);
  const methodColors = ["#5E7A67", "#D9826C", "#C49A6C", "#8B9AAF", "#A78BBA"];
  const methodTotal = paymentMethods.reduce((total, [, count]) => total + count, 0);
  let donutOffset = 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#5E7A67]" />
                Pagamentos recebidos
              </h3>
              <p className="text-xs text-slate-500 mt-1">Distribuição por forma de pagamento</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">{methodTotal} recebidos</span>
          </div>
          <div className="flex items-center gap-6 pt-5">
            <div
              className="relative w-32 h-32 rounded-full shrink-0"
              style={{
                background: methodTotal
                  ? `conic-gradient(${paymentMethods.map(([, count], index) => {
                    const start = donutOffset;
                    donutOffset += (count / methodTotal) * 100;
                    return `${methodColors[index % methodColors.length]} ${start}% ${donutOffset}%`;
                  }).join(", ")})`
                  : "#E2E8F0",
              }}
            >
              <div className="absolute inset-5 rounded-full bg-white flex items-center justify-center">
                <span className="text-lg font-bold text-slate-900">{methodTotal}</span>
              </div>
            </div>
            <div className="space-y-2 min-w-0">
              {paymentMethods.length === 0 ? (
                <p className="text-xs text-slate-400">Nenhum pagamento recebido ainda.</p>
              ) : paymentMethods.map(([method, count], index) => (
                <div key={method} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: methodColors[index % methodColors.length] }} />
                  <span className="text-slate-600 truncate">{method}</span>
                  <strong className="text-slate-900">{count}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#5E7A67]" />
              Faturamento
            </h3>
            <p className="text-xs text-slate-500 mt-1">Recebimentos confirmados nos últimos 6 meses</p>
          </div>
          <div className="flex items-end gap-3 h-40 pt-5">
            {monthlyRevenue.map((month) => (
              <div key={month.key} className="flex-1 h-full flex flex-col items-center justify-end gap-2">
                <span className="text-[10px] font-semibold text-slate-500">
                  {month.total > 0 ? `R$ ${month.total.toLocaleString("pt-BR")}` : "—"}
                </span>
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-lg bg-[#5E7A67] min-h-1 transition-all"
                    style={{ height: `${Math.max((month.total / maxRevenue) * 100, month.total ? 8 : 2)}%` }}
                    title={`${month.label}: R$ ${month.total.toLocaleString("pt-BR")}`}
                  />
                </div>
                <span className="text-[10px] text-slate-500 capitalize">{month.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {["Todos", "Pago", "Pendente", "Atrasado", "Cancelado"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterStatus === st ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
          <select
            value={filterPeriod}
            onChange={(event) => setFilterPeriod(event.target.value)}
            className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-700"
            aria-label="Filtrar período"
          >
            <option value="Todos">Todos os períodos</option>
            <option value="Dia">Dia</option>
            <option value="Mês">Mês</option>
            <option value="Ano">Ano</option>
            <option value="Personalizado">Período personalizado</option>
          </select>
          {filterPeriod && filterPeriod !== "Todos" && filterPeriod !== "Personalizado" && (
            <input
              type={filterPeriod === "Ano" ? "number" : filterPeriod === "Mês" ? "month" : "date"}
              value={filterPeriod === "Ano" ? filterDate.slice(0, 4) : filterPeriod === "Mês" ? filterDate.slice(0, 7) : filterDate}
              onChange={(event) => setFilterDate(filterPeriod === "Ano" ? `${event.target.value}-01-01` : event.target.value)}
              className="border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700"
              min={filterPeriod === "Ano" ? "2000" : undefined}
              max={filterPeriod === "Ano" ? "2100" : undefined}
              aria-label={`Filtrar por ${filterPeriod.toLowerCase()}`}
            />
          )}
          {filterPeriod === "Personalizado" && (
            <>
              <input type="date" value={customStart} onChange={(event) => setCustomStart(event.target.value)} className="border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700" aria-label="Data inicial" />
              <span className="text-xs text-slate-400">até</span>
              <input type="date" value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} className="border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700" aria-label="Data final" />
            </>
          )}
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
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {p.studentName}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800">
                    R$ {p.amount}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.dueDate}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {p.paymentDate || "-"}
                  </td>
                  <td className="px-4 py-3">{p.method}</td>
                  <td className="px-4 py-3">
                    <select
                      value={p.status}
                      onChange={(e) => onUpdateStatus(p.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                        p.status === "Pago"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : p.status === "Pendente"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : p.status === "Cancelado"
                              ? "bg-slate-200 text-slate-700 border-slate-300"
                              : "bg-rose-100 text-rose-800 border-rose-200"
                      }`}
                    >
                      <option value="Pago">Pago</option>
                      <option value="Pendente">Pendente</option>
                      <option value="Atrasado">Atrasado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.status !== "Pago" && (
                      <button
                        onClick={() => onMarkPaid(p.id, "PIX")}
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
export default FinancialView;
