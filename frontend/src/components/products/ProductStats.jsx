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

  function valueClass(field, value) {
    if (field === "variation_percent" && typeof value === "number") {
      if (value > 0) return "text-[oklch(0.78_0.18_22)]";
      if (value < 0) return "text-[oklch(0.78_0.17_158)]";
    }
    if (field === "is_best_price" && value) return "text-[oklch(0.78_0.17_158)]";
    return "text-foreground";
  }

  const hasStats = stats && Object.keys(stats).length > 0;

  return (
    <section className="card-base p-5 sm:p-6 animate-[slide-up_0.5s_ease-out_both]">
      <h3 className="text-sm font-semibold text-foreground mb-4 tracking-tight">Estatísticas</h3>
      {hasStats ? (
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {Object.entries(stats).map(([field, value]) => (
            <div
              key={field}
              className="relative rounded-lg border border-white/[0.06] bg-white/[0.025] px-4 py-3.5 transition-all hover:bg-white/[0.05] hover:border-primary/25"
            >
              <dt className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                {statsLabels[field] || field}
              </dt>
              <dd className={`mt-1.5 text-lg font-semibold tabular-nums ${valueClass(field, value)}`}>
                {formatStatValue(field, value)}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-muted-foreground">Estatísticas indisponíveis.</p>
      )}
    </section>
  );
}

export default ProductStats;
