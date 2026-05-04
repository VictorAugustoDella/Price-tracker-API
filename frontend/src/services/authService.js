export async function login(email, password) {
  const response = await fetch("http://localhost:5000/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: email, password: password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Erro no login");
  }
  const data = await response.json();
  return data;
}
