export async function getProducts() {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:5000/api/v1/products", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro desconhecido ao buscar produtos");
  } 

  return data;
}
