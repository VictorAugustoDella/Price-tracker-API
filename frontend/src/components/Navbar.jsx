import { Link, useLocation, useNavigate } from "react-router-dom";
import { checkSession, logout } from "../services/authService";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifySession() {
      try {
        const isAuthed = await checkSession();
        setLogged(isAuthed);
      } catch (error) {
        setLogged(false);
      } finally {
        setLoading(false);
      }
    }
    verifySession();
  }, [location.pathname]);

  async function handleLogout() {
    await logout();
    setLogged(false);
    navigate("/login");
  }

  const isActive = (path) => location.pathname === path;
  const linkBase =
    "relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150";
  const linkActive =
    "text-foreground bg-white/[0.06] shadow-[inset_0_0_0_1px_oklch(0.62_0.20_268/0.30)]";
  const linkIdle =
    "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]";

  return (
    <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to={"/"}
          className="group flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-foreground"
        >
          <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_6px_18px_-6px_oklch(0.62_0.20_268/0.70)] transition-transform group-hover:scale-105">
            <svg
              width="15"
              height="15"
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
          <span className="hidden sm:inline">PriceTrack</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to={"/"}
            className={`${linkBase} ${isActive("/") ? linkActive : linkIdle}`}
          >
            Dashboard
          </Link>

          {!loading && !logged && (
            <>
              <Link
                to={"/login"}
                className={`${linkBase} ${isActive("/login") ? linkActive : linkIdle}`}
              >
                Login
              </Link>
              <Link
                to={"/register"}
                className={`${linkBase} ${isActive("/register") ? linkActive : linkIdle}`}
              >
                Register
              </Link>
            </>
          )}

          {!loading && logged && (
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-ghost ml-1 !py-1.5 !px-3 text-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span className="hidden sm:inline">Sair</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
