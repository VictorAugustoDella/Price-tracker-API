import { formatPrice } from "../../utils/formatters";
function ProductStats({ stats }) {
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

  return (
    <div>
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
  );
}

export default ProductStats;
