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

export async function createProduct(product, url) {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:5000/api/v1/products", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ product, url }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro desconhecido ao adicionar produto");
  }

  return data;
}

export async function deleteProduct(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5000/api/v1/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || "Erro desconhecido ao remover produto");
  }

}
