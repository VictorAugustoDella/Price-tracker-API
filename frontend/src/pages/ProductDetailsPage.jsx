import { useParams } from "react-router-dom";
import { formatPrice, formatDate } from "../utils/formatters";
import { useProductDetails } from "../hooks/useProductDetails";
import ProductInfo from "../components/products/ProductInfo";

function ProductDetailsPage() {
  const { id } = useParams();

  const {
    product,
    loading,
    error,
    prices,
    stats,
    refreshing,
    statsOptions,
    selectedStatsFields,
    setSelectedStatsFields,
    handleApplyFilter,
    handleRefreshPrice,
  } = useProductDetails(id);
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

  if (loading) return <h1>Carregando produto...</h1>;

  if (error) return <h1>{error}</h1>;

  if (!product) return <h1>Produto não encontrado.</h1>;

  return (
    <main>
      <ProductInfo product={product} refreshing={refreshing} onRefresh={handleRefreshPrice}/>

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
