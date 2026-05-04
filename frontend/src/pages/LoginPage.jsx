import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function handleSubmit(event) {
    event.preventDefault();
    const data = await login(email, password);
    localStorage.setItem("token", data.access_token);
    navigate("/");
  }

  return (
    <main>
      <form action="" method="post" onSubmit={handleSubmit}>
        <input
          type="text"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </main>
  );
}

export default LoginPage;
