import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useState, useEffect } from "react";
import {
  getProductPrices,
  getProductStats,
  refreshProductPrice,
} from "../services/priceService";
import { formatPrice, formatDate } from "../utils/formatters";

function ProductDetailsPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prices, setPrices] = useState([]);
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const { id } = useParams();

  async function fetchProductDetails() {
    const productData = await getProductById(id);
    const priceData = await getProductPrices(id);
    const statsData = await getProductStats(id);
    setProduct(productData);
    setPrices(priceData);
    setStats(statsData);
  }

  useEffect(() => {
    async function fetchProduct() {
      try {
        await fetchProductDetails();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  async function handleRefreshPrice() {
    setError(null);
    setRefreshing(true);
    try {
      await refreshProductPrice(id);
      await fetchProductDetails();
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) return <h1>Carregando produto...</h1>;

  if (error) return <h1>{error}</h1>;

  if (!product) return <h1>Produto não encontrado.</h1>;

  return (
    <main>
      <div>
        <p>Produto: {product.product}</p>
        <p>Nome raspado: {product.scraped_name}</p>
        <p>Site: {product.site}</p>
        <a href={product.url} target="_blank" rel="noreferrer">
          Abrir produto na loja
        </a>
        <p>Adicionado em: {formatDate(product.added_at)}</p>
        <p>Última mudança: {formatDate(product.last_change)}</p>
        <button onClick={handleRefreshPrice} disabled={refreshing}>
          {refreshing ? "Atualizando preço..." : "Atualizar preço"}
        </button>
      </div>
      <div>
        <h2>Histórico de preços</h2>

        {prices.length === 0 ? (
          <p>Nenhum preço registrado ainda.</p>
        ) : (
          <ul>
            {prices.map((item) => (
              <li key={item.id}>
                <p>Preço: {formatPrice(item.price)}</p>
                <p>Coletado em: {formatDate(item.collected_at)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h2>Estatísticas</h2>

        <p>Preço atual: {formatPrice(stats.current)}</p>
        <p>Menor preço: {formatPrice(stats.lowest)}</p>
        <p>Maior preço: {formatPrice(stats.highest)}</p>
        <p>Preço médio: {formatPrice(stats.average)}</p>
        <p>Quantidade de coletas: {stats.total}</p>
        <p>Variação: {stats.variation_percent}%</p>
        <p>Melhor preço: {stats.is_best_price ? "Sim" : "Não"}</p>
        <p>Tendência: {stats.price_trend}</p>
      </div>
    </main>
  );
}

export default ProductDetailsPage;
