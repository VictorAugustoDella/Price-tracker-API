import { getProducts } from "../services/productService";
import { useEffect, useState } from "react";

function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    fetchProducts();
  }, []);

  if (loading) return <h1>Carregando produtos...</h1>;

  if (error) return <h1>{error}</h1>;

  if (products.length === 0) return <h1>Nenhum produto cadastrado ainda.</h1>;

  return (
    <main>
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
    </main>
  );
}

export default DashboardPage;
