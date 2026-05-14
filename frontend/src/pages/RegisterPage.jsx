import { useState, useEffect } from "react";
import { register } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { checkSession } from "../services/authService";

function RegisterPage() {
  const [name, setName] = useState("");
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
      await register(name, email, password);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-bg min-h-[calc(100vh-3.5rem)] grid lg:grid-cols-2">
      <section className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 17l6-6 4 4 8-8" />
              <path d="M14 7h7v7" />
            </svg>
          </span>
          PriceTrack
        </div>

        <div className="max-w-md animate-[slide-up_0.6s_ease-out_both]">
          <h2 className="text-4xl font-semibold tracking-tight leading-tight text-foreground">
            Crie sua conta <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              em segundos.
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground text-[15px] leading-relaxed">
            Comece a monitorar produtos hoje e nunca mais perca uma queda de
            preço.
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} PriceTrack
        </p>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="card-base w-full max-w-md p-7 sm:p-9 animate-[scale-in_0.35s_ease-out_both]">
          <div className="mb-7">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Criar conta
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Preencha os dados para começar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-base" htmlFor="reg-name">
                Nome
              </label>
              <input
                id="reg-name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-base"
              />
            </div>
            <div>
              <label className="label-base" htmlFor="reg-email">
                E-mail
              </label>
              <input
                id="reg-email"
                type="email"
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-base"
              />
            </div>
            <div>
              <label className="label-base" htmlFor="reg-password">
                Senha
              </label>
              <input
                id="reg-password"
                type="password"
                placeholder="Crie uma senha segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-base"
              />
            </div>

            {error && <div className="alert-error">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="spinner" /> Registrando...
                </>
              ) : (
                "Criar conta"
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground text-center">
            Já tem conta?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary-hover transition-colors"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;
