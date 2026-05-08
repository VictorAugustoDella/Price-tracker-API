export async function getProductPrices(productId) {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `http://localhost:5000/api/v1/products/${productId}/prices`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Erro desconhecido ao buscar historico de precos",
    );
  }

  return data;
}

export async function getProductStats(productId) {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5000/api/v1/products/${productId}/prices/stats`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Error desconhecido ao buscar estatísticas do produto",
    );
  }

  return data;
}
