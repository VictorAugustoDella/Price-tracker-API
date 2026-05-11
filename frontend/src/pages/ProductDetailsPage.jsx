import { useParams } from "react-router-dom";
import { formatPrice} from "../utils/formatters";
import { useProductDetails } from "../hooks/useProductDetails";
import ProductInfo from "../components/products/ProductInfo";
import PriceHistory from "../components/products/PriceHistory";
import StatsFilters from "../components/products/StatsFilters";

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
      <ProductInfo
        product={product}
        refreshing={refreshing}
        onRefresh={handleRefreshPrice}
      />

      <PriceHistory prices={prices} />

      <div>
        <h2>Estatísticas</h2>

        <StatsFilters
          statsOptions={statsOptions}
          selectedStatsFields={selectedStatsFields}
          onSelectedStatsFieldsChange={setSelectedStatsFields}
          onApplyFilter={handleApplyFilter}
        />

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
