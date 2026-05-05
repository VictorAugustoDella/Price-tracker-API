import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <nav>
      <Link to={"/"}>Dashboard</Link>
      <Link to={"/login"}>Login</Link>
      <Link to={"/register"}>Register</Link>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
