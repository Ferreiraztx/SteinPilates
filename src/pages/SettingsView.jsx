import { useMemo, useState } from "react";
import { Plus, Settings, Trash2 } from "lucide-react";
import ChangePasswordForm from "../components/ChangePasswordForm.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

const categories = [
  ["plan", "Planos de aulas"],
  ["classType", "Tipos de aula"],
];

function SettingsView({ settings, onAdd, onUpdate, onDelete, onChangePassword }) {
  const [category, setCategory] = useState("plan");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const grouped = useMemo(() => categories.map(([key, label]) => ({
    key, label, items: settings.filter((item) => item.category === key),
  })), [settings]);

  const addSetting = (event) => {
    event.preventDefault();
    if (!name.trim() || !value.trim()) return;
    const currentItems = settings.filter((item) => item.category === category);
    if (currentItems.some((item) => item.name.trim().toLocaleLowerCase() === name.trim().toLocaleLowerCase())) {
      event.currentTarget.querySelector("input").setCustomValidity("Esse plano já está cadastrado.");
      event.currentTarget.querySelector("input").reportValidity();
      return;
    }
    onAdd({ category, name, value });
    setName("");
    setValue("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#5E7A67]" /> Configurações do estúdio
        </h3>
        <p className="text-xs text-slate-500 mt-1">Gerencie os planos de aulas disponíveis para os alunos.</p>
        <form onSubmit={addSetting} className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="border border-slate-300 rounded-xl px-3 py-2 text-xs">
            {categories.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
          <input value={name} onChange={(event) => { event.target.setCustomValidity(""); setName(event.target.value); }} placeholder="Nome exibido" className="border border-slate-300 rounded-xl px-3 py-2 text-xs" required />
          <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Valor ou descrição" className="border border-slate-300 rounded-xl px-3 py-2 text-xs" required />
          <button className="bg-[#5E7A67] text-white rounded-xl px-3 py-2 text-xs font-medium flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Adicionar</button>
        </form>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <ChangePasswordForm onSubmit={onChangePassword} />
      </div>
      {grouped.map((group) => <section key={group.key} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <h4 className="font-semibold text-slate-900 text-sm">{group.label}</h4>
          <div className="mt-3 space-y-2">
            {group.items.length === 0 && <p className="text-xs text-slate-400">Nenhuma opção configurada.</p>}
            {group.items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 border border-slate-100 rounded-xl p-2">
                <input defaultValue={item.name} onBlur={(event) => event.target.value.trim() && event.target.value !== item.name && onUpdate(item.id, { name: event.target.value })} className="min-w-0 flex-1 border border-slate-200 rounded-lg px-2 py-1 text-xs" />
                <input defaultValue={item.value} onBlur={(event) => event.target.value.trim() && event.target.value !== item.value && onUpdate(item.id, { value: event.target.value })} className="w-32 border border-slate-200 rounded-lg px-2 py-1 text-xs" />
                <label className="text-xs text-slate-500 flex items-center gap-1"><input type="checkbox" checked={item.active} onChange={(event) => onUpdate(item.id, { active: event.target.checked })} /> Ativo</label>
                <button onClick={() => setPendingDelete(item)} className="text-rose-600 hover:text-rose-800" aria-label={`Excluir ${item.name}`}><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {pendingDelete && (
              <ConfirmDialog
                title="Excluir plano"
                message={`Tem certeza que deseja excluir "${pendingDelete.name}"? Alunos já cadastrados não serão alterados.`}
                onCancel={() => setPendingDelete(null)}
                onConfirm={() => { onDelete(pendingDelete.id); setPendingDelete(null); }}
              />
            )}
          </div>
      </section>)}
    </div>
  );
}

export default SettingsView;
