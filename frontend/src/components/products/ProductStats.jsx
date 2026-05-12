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
      if (value > 0) return "text-destructive";
      if (value < 0) return "text-success";
    }
    if (field === "is_best_price" && value) return "text-success";
    return "text-foreground";
  }

  const hasStats = stats && Object.keys(stats).length > 0;

  return (
    <section className="card-base p-5 sm:p-6 animate-[slide-up_0.5s_ease-out_both]">
      <h3 className="text-sm font-semibold text-foreground mb-4">Estatísticas</h3>
      {hasStats ? (
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {Object.entries(stats).map(([field, value]) => (
            <div
              key={field}
              className="rounded-md border border-border bg-muted/40 px-4 py-3 transition-colors hover:bg-muted"
            >
              <dt className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                {statsLabels[field] || field}
              </dt>
              <dd className={`mt-1 text-lg font-semibold tabular-nums ${valueClass(field, value)}`}>
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
