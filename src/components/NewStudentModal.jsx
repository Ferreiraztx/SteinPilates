import { useState } from "react";
import { X } from "lucide-react";
import { TODAY_STR } from "../shared/appData.js";
function NewStudentModal({ student, onClose, onAdd, onSave, planOptions = [] }) {
  const [formData, setFormData] = useState(() => student ? {
    name: student.name,
    phone: student.phone,
    email: student.email,
    status: student.status,
    plan: planOptions.some((plan) => plan.name === student.plan) ? student.plan : "",
    monthlyFee: student.monthlyFee,
    dueDate: student.dueDate,
    healthNotes: student.healthNotes,
  } : {
    name: "",
    phone: "",
    email: "",
    status: "Prospecção",
    plan: "",
    monthlyFee: 320,
    dueDate: 5,
    healthNotes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.plan) return;

    if (student) onSave(student.id, { ...formData, monthlyFee: Number(formData.monthlyFee), dueDate: Number(formData.dueDate) });
    else onAdd({
      id: "st_" + Date.now(),
      ...formData,
      reposicoesLeft: 0,
      joinDate: TODAY_STR,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">
            {student ? "Editar Aluno" : "Cadastrar Novo Aluno"}
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
              Nome Completo
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Maria Oliveira"
              className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="(11) 99999-9999"
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="maria@email.com"
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Status Inicial
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67] focus:outline-none"
              >
                <option value="Prospecção">Prospecção (Lead)</option>
                <option value="Ativo">Ativo (Matriculado)</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Plano Pretendido
              </label>
              <select
                value={formData.plan}
                onChange={(e) =>
                  setFormData({ ...formData, plan: e.target.value })
                }
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67] focus:outline-none"
              >
                <option value="" disabled>
                  {planOptions.length ? "Selecione um plano" : "Configure um plano primeiro"}
                </option>
                {planOptions.map((plan) => <option key={plan.id} value={plan.name}>{plan.name}</option>)}
              </select>
            </div>
          </div>

          {!planOptions.length && (
            <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-2">
              Configure pelo menos um plano no menu Configurações antes de cadastrar um aluno.
            </p>
          )}

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Restrições / Observações de Saúde
            </label>
            <textarea
              rows="2"
              value={formData.healthNotes}
              onChange={(e) =>
                setFormData({ ...formData, healthNotes: e.target.value })
              }
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
              disabled={!formData.plan}
              className="px-4 py-2 rounded-xl text-white bg-[#5E7A67] hover:bg-[#486050] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {student ? "Salvar alterações" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewStudentModal;
