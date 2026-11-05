import { useState } from "react";
import { Activity } from "lucide-react";
function LoginView({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await onLogin(credentials);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3ECE4] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl border border-[#E5D8CA] shadow-lg p-6 space-y-5">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-[#5E7A67] flex items-center justify-center text-white">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="mt-3 text-lg font-bold text-slate-900">Stein Pilates</h1>
          <p className="text-xs text-slate-500 mt-1">Acesse a gestão do estúdio</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Usuário</label>
          <input
            required
            value={credentials.username}
            onChange={(event) => setCredentials({ ...credentials, username: event.target.value })}
            className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#5E7A67] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Senha</label>
          <input
            required
            type="password"
            value={credentials.password}
            onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
            className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#5E7A67] focus:outline-none"
          />
        </div>
        {error && <p className="text-xs text-rose-600">{error}</p>}
        <button
          disabled={isSubmitting}
          className="w-full bg-[#5E7A67] hover:bg-[#486050] disabled:opacity-60 text-white rounded-xl py-2.5 text-sm font-semibold"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export default LoginView;
