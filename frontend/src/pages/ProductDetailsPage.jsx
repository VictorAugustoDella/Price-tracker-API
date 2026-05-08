import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useState, useEffect } from "react";
import { getProductPrices, getProductStats } from "../services/priceService";

function ProductDetailsPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prices, setPrices] = useState([]);
  const [stats, setStats] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productData = await getProductById(id);
        const priceData = await getProductPrices(id);
        const statsData = await getProductStats(id);
        setProduct(productData);
        setPrices(priceData);
        setStats(statsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

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
        <p>Adicionado em: {product.added_at}</p>
        <p>Última mudança: {product.last_change}</p>
      </div>
      <div>
        <h2>Histórico de preços</h2>

        {prices.length === 0 ? (
          <p>Nenhum preço registrado ainda.</p>
        ) : (
          <ul>
            {prices.map((item) => (
              <li key={item.id}>
                <p>Preço: R${item.price}</p>
                <p>Coletado em: {item.collected_at}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h2>Estatísticas</h2>

        <p>Preço atual: R${stats.current}</p>
        <p>Menor preço: R${stats.lowest}</p>
        <p>Maior preço: R${stats.highest}</p>
        <p>Preço médio: R${stats.average}</p>
        <p>Quantidade de coletas: {stats.total}</p>
        <p>Variação: {stats.variation_percent}%</p>
        <p>Melhor preço: {stats.is_best_price ? "Sim" : "Não"}</p>
        <p>Tendência: {stats.price_trend}</p>
      </div>
    </main>
  );
}

export default ProductDetailsPage;
