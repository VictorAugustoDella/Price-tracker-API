import { authenticatedFetch } from "./apiClient";

export async function getProductPrices(productId) {
  const response = await authenticatedFetch(
    `http://localhost:5000/api/v1/products/${productId}/prices`,
    {
      method: "GET",
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

export async function getProductStats(productId, fields = []) {
  let url = `http://localhost:5000/api/v1/products/${productId}/prices/stats`;

  if (Array.isArray(fields) && fields.length > 0) {
    url += `?fields=${fields.join(",")}`;
  }

  const response = await authenticatedFetch(url, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Error desconhecido ao buscar estatísticas do produto",
    );
  }

  return data;
}

export async function refreshProductPrice(productId) {
  const response = await authenticatedFetch(
    `http://localhost:5000/api/v1/products/${productId}/prices/refresh`,
    {
      method: "POST",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro desconhecido ao atualizar preço");
  }

  return data;
}
