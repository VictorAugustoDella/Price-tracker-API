import { useCallback, useEffect, useState } from "react";

import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../services/productService";

export function useDashboardProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [product, setProduct] = useState("");
  const [url, setUrl] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const allProducts = await getProducts();
      setProducts(allProducts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleCreateProduct(event) {
    event.preventDefault();

    const productName = product.trim();
    const productUrl = url.trim();

    if (!productName || !productUrl) {
      setError("Preencha o nome e a URL do produto.");
      return;
    }

    setError(null);
    setCreating(true);

    try {
      await createProduct(productName, productUrl);
      await fetchProducts();

      setProduct("");
      setUrl("");
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteProduct(id) {
    const confirmed = confirm("Tem certeza que deseja excluir este produto?");

    if (!confirmed) {
      return;
    }

    setError(null);

    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdateProduct(id, currentName) {
    const newName = prompt("Digite o novo nome do produto:", currentName);

    if (newName === null) {
      return;
    }

    const trimmedName = newName.trim();

    if (trimmedName === "") {
      setError("O nome do produto não pode ficar vazio.");
      return;
    }

    if (trimmedName === currentName) {
      return;
    }

    setError(null);

    try {
      await updateProduct(id, trimmedName);
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    product,
    url,
    creating,
    setProduct,
    setUrl,
    handleCreateProduct,
    handleDeleteProduct,
    handleUpdateProduct,
  };
}