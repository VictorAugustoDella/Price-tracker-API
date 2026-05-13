import { authenticatedFetch } from "./apiClient";

export async function getProducts() {
  const response = await authenticatedFetch(
    "http://localhost:5000/api/v1/products",
    {
      method: "GET",
    },
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro desconhecido ao buscar produtos");
  }

  return data;
}

export async function createProduct(product, url) {
  const response = await authenticatedFetch(
    "http://localhost:5000/api/v1/products",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product, url }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro desconhecido ao adicionar produto");
  }

  return data;
}

export async function deleteProduct(id) {
  const response = await authenticatedFetch(
    `http://localhost:5000/api/v1/products/${id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Erro desconhecido ao remover produto");
  }
}

export async function updateProduct(id, product) {
  const response = await authenticatedFetch(
    `http://localhost:5000/api/v1/products/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro desconhecido ao editar produto");
  }

  return data;
}

export async function getProductById(id) {
  const response = await authenticatedFetch(
    `http://localhost:5000/api/v1/products/${id}`,
    {
      method: "GET",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Erro desconhecido ao acessar detalhes do produto",
    );
  }

  return data;
}
