import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthed = typeof window !== "undefined" && !!localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token")
    navigate("/login");
  }

  const linkBase =
    "relative px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150";
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to={"/"}
          className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-foreground"
        >
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l6-6 4 4 8-8" />
              <path d="M14 7h7v7" />
            </svg>
          </span>
          PriceTrack
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to={"/"}
            className={`${linkBase} ${isActive("/") ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
          >
            Dashboard
          </Link>
          {!isAuthed && (
            <>
              <Link
                to={"/login"}
                className={`${linkBase} ${isActive("/login") ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
              >
                Login
              </Link>
              <Link
                to={"/register"}
                className={`${linkBase} ${isActive("/register") ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
              >
                Register
              </Link>
            </>
          )}
          <button type="button" onClick={handleLogout} className="btn btn-ghost ml-1 !py-1.5 !px-3 text-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
