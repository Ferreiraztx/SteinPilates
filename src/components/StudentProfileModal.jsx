/* eslint-disable no-unused-vars */
import { useState } from "react";
import { X, ShieldAlert } from "lucide-react";
import { TODAY_STR } from "../shared/appData.js";
function StudentProfileModal({
  student,
  payments,
  onClose,
}) {
  const studentPayments = payments.filter((p) => p.studentId === student.id);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-lg">
                {student.name}
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  student.status === "Ativo"
                    ? "bg-emerald-100 text-emerald-800"
                    : student.status === "Prospecção"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-200 text-slate-700"
                }`}
              >
                {student.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cadastrado em {student.joinDate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <h4 className="font-bold text-slate-800 text-xs border-b border-slate-200/60 pb-1">
              Dados de Contato & Plano
            </h4>
            <p>
              <strong className="text-slate-700">Telefone:</strong>{" "}
              {student.phone}
            </p>
            <p>
              <strong className="text-slate-700">E-mail:</strong>{" "}
              {student.email}
            </p>
            <p>
              <strong className="text-slate-700">Plano:</strong> {student.plan}{" "}
              (R$ {student.monthlyFee}/mês)
            </p>
            <p>
              <strong className="text-slate-700">Dia de Vencimento:</strong> Dia{" "}
              {student.dueDate}
            </p>
          </div>

          <div className="space-y-2 bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/60">
            <h4 className="font-bold text-amber-900 text-xs border-b border-amber-200/60 pb-1 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" /> Anamnese &
              Observações
            </h4>
            <p className="text-slate-700 leading-relaxed">
              {student.healthNotes || "Sem restrições físicas cadastradas."}
            </p>
            <div className="pt-1">
              <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md text-[11px]">
                Créditos de Reposição: {student.reposicoesLeft}
              </span>
            </div>
          </div>
        </div>

        {/* Financial History */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-800 text-xs">
            Histórico de Mensalidades
          </h4>
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
                      <td className="px-3 py-2 font-bold text-slate-800">
                        R$ {p.amount}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            p.status === "Pago"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
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
export default StudentProfileModal;
