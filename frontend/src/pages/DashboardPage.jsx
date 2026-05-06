import { getProducts, createProduct } from "../services/productService";
import { useEffect, useState } from "react";

function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [product, setProduct] = useState("");
  const [url, setUrl] = useState("");
  const [creating, setCreating] = useState(false);

  async function fetchProducts() {
    try {
      const allProducts = await getProducts();
      setProducts(allProducts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProduct(event) {
    event.preventDefault();
    setError(null);
    setCreating(true);

    try {
      await createProduct(product, url);
      await fetchProducts();
      setProduct("");
      setUrl("");
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <h1>Carregando produtos...</h1>;

  return (
    <main>
      <form onSubmit={handleCreateProduct}>
        <input
          type="text"
          placeholder="Produto"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="Url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit" disabled={creating}>
          {creating ? "Buscando dados do produto..." : "Adicionar"}
        </button>
      </form>
      {error && <h1>{error}</h1>}
      <ul>
        {products.map((item) => (
          <li key={item.id}>
            <p>Produto: {item.product}</p>
            <p>Nome raspado: {item.scraped_name}</p>
            <p>Site: {item.site}</p>
            <a href={item.url} target="_blank" rel="noreferrer">
              Abrir produto
            </a>
            <p>Adicionado as: {item.added_at}</p>
            <p>Última mudança: {item.last_change}</p>
          </li>
        ))}
      </ul>
      {products.length === 0 && <h1>Nenhum produto cadastrado ainda.</h1>}
    </main>
  );
}

export default DashboardPage;
