import { formatDate, formatPrice } from "../../utils/formatters";

function PriceHistory({ prices }) {
  return (
    <section className="card-base p-6 sm:p-7 animate-[slide-up_0.45s_ease-out_both]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Histórico de preços</h2>
        {prices.length > 0 && <span className="badge">{prices.length} registros</span>}
      </div>

      {prices.length === 0 ? (
        <div className="text-center py-10">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-5"/>
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">Nenhum preço registrado ainda.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border max-h-[420px] overflow-y-auto -mx-2">
          {prices.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 px-2 py-3 rounded-md hover:bg-muted/60 transition-colors"
            >
              <span className="text-base font-semibold text-foreground tabular-nums">
                {formatPrice(item.price)}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(item.collected_at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default PriceHistory;
