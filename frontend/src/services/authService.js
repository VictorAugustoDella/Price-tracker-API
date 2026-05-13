export async function login(email, password) {
  const response = await fetch("http://localhost:5000/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro desconhecido ao fazer login");
  }

  return data;
}

export async function register(name, email, password) {
  const response = await fetch("http://localhost:5000/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro desconhecido ao fazer cadastro");
  }

  return data;
}


export async function refreshAccessToken() {
  const refresh_token = localStorage.getItem("refresh_token")

  const response = await fetch("http://localhost:5000/api/v1/auth/refresh", {
    method: "POST",
    headers: {"Authorization": `Bearer ${refresh_token}` },
  });
  
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro desconhecido com autenticação");
  }

  localStorage.setItem("token", data.access_token)

  return data.access_token
}