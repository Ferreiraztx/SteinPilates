import { useState } from "react";

function ChangePasswordForm({ onSubmit }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (newPassword !== confirmation) {
      setError("A confirmação da nova senha não confere.");
      return;
    }
    setError("");
    onSubmit({ currentPassword, newPassword });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmation("");
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <h4 className="font-semibold text-slate-900 text-sm">Alterar senha</h4>
      <p className="text-xs text-slate-500">A nova senha deve ter pelo menos 12 caracteres.</p>
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-2 text-xs text-rose-700">{error}</p>}
      <input type="password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Senha atual" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs" />
      <input type="password" required minLength="12" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Nova senha" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs" />
      <input type="password" required minLength="12" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Confirme a nova senha" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs" />
      <button className="bg-[#5E7A67] text-white rounded-xl px-4 py-2 text-xs font-medium">Atualizar senha</button>
    </form>
  );
}

export default ChangePasswordForm;
