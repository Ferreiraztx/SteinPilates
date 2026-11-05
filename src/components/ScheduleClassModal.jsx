import { useState } from "react";
import { X } from "lucide-react";
import { TIME_OPTIONS, TODAY_STR } from "../shared/appData.js";
function ScheduleClassModal({ students, classItem, onClose, onAdd, onSave, classTypes = [], timeOptions = [] }) {
  const [formData, setFormData] = useState(() => classItem ? {
    date: classItem.date,
    time: classItem.time,
    type: classItem.type,
    studentIds: classItem.studentIds,
    status: classItem.status,
  } : {
    date: TODAY_STR,
    time: "08:00",
    type: classTypes[0]?.name || "",
    studentIds: [],
    status: "Agendada",
    recurring: false,
    recurrenceMonth: TODAY_STR.slice(0, 7),
    recurrenceWeekday: String(new Date(`${TODAY_STR}T12:00:00`).getDay()),
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!classTypes.length || !classTypes.some((item) => item.name === formData.type)) {
      setError("Selecione um tipo de aula ativo em Configurações.");
      return;
    }
    if (formData.studentIds.length === 0) {
      setError("Selecione ao menos um aluno para agendar a aula.");
      return;
    }
    setError("");

    if (classItem) onSave(classItem.id, formData);
    else onAdd({
      id: "c_" + Date.now(),
      ...formData,
      status: "Agendada",
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">
            {classItem ? "Editar Aula" : "Agendar Nova Aula"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {error && <p role="alert" className="rounded-xl bg-rose-50 p-2 text-xs text-rose-700">{error}</p>}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Data
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67]"
              />
            </div>

            {classItem && (
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67]"
                >
                  <option value="Agendada">Agendada</option>
                  <option value="Concluída">Concluída</option>
                  <option value="Cancelada">Cancelada</option>
                  <option value="Reposição">Reposição</option>
                </select>
              </div>
            )}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Horário
              </label>
              <select
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67]"
              >
                {(timeOptions.length ? timeOptions.map((item) => item.value) : TIME_OPTIONS).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!classItem && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
              <label className="flex items-center gap-2 font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.recurring}
                  onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                  className="rounded text-[#5E7A67]"
                />
                Repetir aula durante o mês
              </label>
              {formData.recurring && (
                <div className="grid grid-cols-2 gap-2">
                  <label className="font-medium text-slate-700">
                    Mês
                    <input
                      type="month"
                      required
                      value={formData.recurrenceMonth}
                      onChange={(e) => setFormData({ ...formData, recurrenceMonth: e.target.value })}
                      className="mt-1 w-full border border-slate-300 rounded-xl p-2.5"
                    />
                  </label>
                  <label className="font-medium text-slate-700">
                    Dia da semana
                    <select
                      value={formData.recurrenceWeekday}
                      onChange={(e) => setFormData({ ...formData, recurrenceWeekday: e.target.value })}
                      className="mt-1 w-full border border-slate-300 rounded-xl p-2.5"
                    >
                      <option value="0">Domingo</option>
                      <option value="1">Segunda-feira</option>
                      <option value="2">Terça-feira</option>
                      <option value="3">Quarta-feira</option>
                      <option value="4">Quinta-feira</option>
                      <option value="5">Sexta-feira</option>
                      <option value="6">Sábado</option>
                    </select>
                  </label>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Tipo de Aula
            </label>
            <select
              value={formData.type}
              required
              disabled={!classTypes.length}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-[#5E7A67]"
            >
              {classTypes.map((type) => <option key={type.id} value={type.name}>{type.value}</option>)}
            </select>
            {!classTypes.length && <p className="mt-1 text-amber-700">Cadastre um tipo de aula em Configurações antes de agendar.</p>}
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Alunos Participantes
            </label>
            <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1">
              {students.map((st) => (
                <label
                  key={st.id}
                  className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.studentIds.includes(st.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          studentIds: [...formData.studentIds, st.id],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          studentIds: formData.studentIds.filter(
                            (id) => id !== st.id,
                          ),
                        });
                      }
                    }}
                    className="rounded text-[#5E7A67]"
                  />
                  <span className="text-slate-800 font-medium">{st.name}</span>
                </label>
              ))}
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
              {classItem ? "Salvar alterações" : "Confirmar Agendamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScheduleClassModal;
