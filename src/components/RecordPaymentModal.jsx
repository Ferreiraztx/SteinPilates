import { useState } from "react";
import { X } from "lucide-react";
import { TODAY_STR } from "../shared/appData.js";
function RecordPaymentModal({ students, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    studentId: students[0]?.id || "",
    amount: 320,
    dueDate: TODAY_STR,
    method: "PIX",
    status: "Pago",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const st = students.find((s) => s.id === formData.studentId);

    onAdd({
      id: "p_" + Date.now(),
      studentId: formData.studentId,
      studentName: st ? st.name : "Aluno",
      amount: Number(formData.amount),
      dueDate: formData.dueDate,
      paymentDate: formData.status === "Pago" ? TODAY_STR : null,
      method: formData.method,
      status: formData.status,
      nfStatus: "Pendente de Emissão",
      nfNumber: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">
            Registrar Lançamento Financeiro
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Aluno
            </label>
            <select
              value={formData.studentId}
              onChange={(e) =>
                setFormData({ ...formData, studentId: e.target.value })
              }
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
              <label className="block font-medium text-slate-700 mb-1">
                Valor (R$)
              </label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67]"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Data de Vencimento
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Forma de Pagamento
              </label>
              <select
                value={formData.method}
                onChange={(e) =>
                  setFormData({ ...formData, method: e.target.value })
                }
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67]"
              >
                <option value="PIX">PIX</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Boleto">Boleto</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
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

export default RecordPaymentModal;
