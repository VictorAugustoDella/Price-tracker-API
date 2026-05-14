export async function login(email, password) {
  const response = await fetch("http://localhost:5000/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro desconhecido ao fazer cadastro");
  }

  return data;
}

export function getCookie(name) {
  const cookies = document.cookie.split("; ");

  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split("=").slice(1).join("="));
}

export async function refreshAccessToken() {
  const csrfToken = getCookie("csrf_refresh_token");

  const headers = csrfToken
    ? { "X-CSRF-TOKEN": csrfToken }
    : {};

  const response = await fetch("http://localhost:5000/api/v1/auth/refresh", {
    method: "POST",
    credentials: "include",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro desconhecido com autenticação");
  }

  return data;
}

export async function logout() {
  const csrfToken = getCookie("csrf_access_token");

  const headers = csrfToken
    ? { "X-CSRF-TOKEN": csrfToken }
    : {};

  const response = await fetch("http://localhost:5000/api/v1/auth/logout", {
    method: "POST",
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    throw new Error("Erro ao realizar logout");
  }
}