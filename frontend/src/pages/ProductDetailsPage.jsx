import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useState, useEffect } from "react";
import {
  getProductPrices,
  getProductStats,
  refreshProductPrice,
} from "../services/priceService";
import { formatPrice, formatDate } from "../utils/formatters";

const statsLabels = {
  current: "Preço atual",
  lowest: "Menor preço",
  highest: "Maior preço",
  average: "Preço médio",
  total: "Quantidade de coletas",
  variation_percent: "Variação",
  is_best_price: "Melhor preço",
  last_30_days_average: "Média dos últimos 30 dias",
  price_trend: "Tendência",
};

function formatStatValue(field, value) {
  if (value === null || value === undefined) return "-";

  if (
    field === "current" ||
    field === "lowest" ||
    field === "highest" ||
    field === "average" ||
    field === "last_30_days_average"
  ) {
    return formatPrice(value);
  }

  if (field === "variation_percent") {
    return `${value}%`;
  }

  if (field === "is_best_price") {
    return value ? "Sim" : "Não";
  }

  return value;
}

function ProductDetailsPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prices, setPrices] = useState([]);
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const statsOptions = [
    { value: "current", label: "Preço atual" },
    { value: "lowest", label: "Menor preço" },
    { value: "highest", label: "Maior preço" },
    { value: "average", label: "Preço médio" },
    { value: "total", label: "Quantidade de coletas" },
    { value: "variation_percent", label: "Variação" },
    { value: "is_best_price", label: "Melhor preço" },
    { value: "last_30_days_average", label: "Média dos últimos 30 dias" },
    { value: "price_trend", label: "Tendência" },
  ];

  const [selectedStatsFields, setSelectedStatsFields] = useState([
    "current",
    "lowest",
    "highest",
  ]);

  async function handleApplyFilter() {
    setError(null);

    try {
      const productStatsData = await getProductStats(id, selectedStatsFields);
      setStats(productStatsData);
    } catch (err) {
      setError(err.message);
    }
  }

  const { id } = useParams();

  async function fetchProductDetails() {
    const productData = await getProductById(id);
    const priceData = await getProductPrices(id);
    const statsData = await getProductStats(id, selectedStatsFields);
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

        <h3>Metricas</h3>
        {statsOptions.map((option) => (
          <div key={option.value}>
            <input
              type="checkbox"
              checked={selectedStatsFields.includes(option.value)}
              onChange={(e) =>
                e.target.checked
                  ? setSelectedStatsFields([
                      ...selectedStatsFields,
                      option.value,
                    ])
                  : setSelectedStatsFields(
                      selectedStatsFields.filter(
                        (item) => item !== option.value,
                      ),
                    )
              }
            />
            <span>{option.label}</span>
          </div>
        ))}
        <button
          type="button"
          onClick={handleApplyFilter}
          disabled={selectedStatsFields.length === 0}
        >
          Aplicar filtros
        </button>

        {stats && Object.keys(stats).length > 0 ? (
          Object.entries(stats).map(([field, value]) => (
            <p key={field}>
              {statsLabels[field] || field}: {formatStatValue(field, value)}
            </p>
          ))
        ) : (
          <p>Estatísticas indisponíveis.</p>
        )}
      </div>
    </main>
  );
}

export default ProductDetailsPage;
