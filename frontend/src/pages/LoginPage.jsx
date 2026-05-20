import { useState, useEffect } from "react";
import { login } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { checkSession } from "../services/authService";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    async function verifySession() {
      try {
        const isAuthed = await checkSession();

        if (isAuthed) {
          navigate("/");
          return;
        }
      } finally {
        setCheckingSession(false);
      }
    }

    verifySession();
  }, [navigate]);

  if (checkingSession) {
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-bg min-h-[calc(100vh-3.5rem)] grid lg:grid-cols-2">
      <section className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
        <div className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_8px_24px_-6px_oklch(0.62_0.20_268/0.6)]">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l6-6 4 4 8-8" />
              <path d="M14 7h7v7" />
            </svg>
          </span>
          PriceTrack
        </div>

        <div className="max-w-md animate-[slide-up_0.6s_ease-out_both]">
          <h2 className="text-5xl font-semibold tracking-tight leading-[1.05] text-foreground">
            Acompanhe preços. <br />
            <span className="text-gradient">Compre na hora certa.</span>
          </h2>
          <p className="mt-5 text-muted-foreground text-[15px] leading-relaxed">
            Monitore produtos das suas lojas favoritas, veja o histórico
            completo e descubra a melhor janela para comprar.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            {[
              "Histórico de preços completo",
              "Estatísticas inteligentes",
              "Atualização sob demanda",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-success-soft text-success border border-success/30">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} PriceTrack
        </p>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="card-base card-glow w-full max-w-md p-8 sm:p-10 animate-[scale-in_0.35s_ease-out_both]">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Bem-vindo de volta
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Entre com suas credenciais para continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-base" htmlFor="login-email">E-mail</label>
              <input
                id="login-email"
                type="email"
                value={email}
                placeholder="voce@email.com"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-base"
              />
            </div>
            <div>
              <label className="label-base" htmlFor="login-password">Senha</label>
              <input
                id="login-password"
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-base"
              />
            </div>

            {error && <div className="alert-error">{error}</div>}

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
              {loading ? (<><span className="spinner" /> Entrando...</>) : "Entrar"}
            </button>
          </form>

          <p className="mt-7 text-sm text-muted-foreground text-center">
            Ainda não tem conta?{" "}
            <Link to="/register" className="font-medium text-gradient hover:opacity-80 transition-opacity">
              Criar conta
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
