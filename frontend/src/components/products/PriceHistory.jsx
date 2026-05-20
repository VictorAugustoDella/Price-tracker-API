import { formatDate, formatPrice } from "../../utils/formatters";

function PriceHistory({ prices }) {
  return (
    <section className="card-base p-6 sm:p-7 animate-[slide-up_0.45s_ease-out_both]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-primary/30 to-accent/30 text-foreground border border-primary/20">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-5"/>
            </svg>
          </span>
          <h2 className="text-base font-semibold text-foreground tracking-tight">Histórico de preços</h2>
        </div>
        {prices.length > 0 && <span className="badge">{prices.length} registros</span>}
      </div>

      {prices.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground border border-white/[0.06]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-5"/>
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">Nenhum preço registrado ainda.</p>
        </div>
      ) : (
        <ul className="divide-y divide-white/[0.06] max-h-[460px] overflow-y-auto -mx-2">
          {prices.map((item, idx) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 px-3 py-3.5 rounded-md hover:bg-white/[0.04] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className={`h-1.5 w-1.5 rounded-full ${idx === 0 ? "bg-gradient-to-br from-primary to-accent shadow-[0_0_8px_oklch(0.66_0.22_295/0.6)]" : "bg-muted-foreground/40"}`} />
                <span className="text-base font-semibold text-foreground tabular-nums">
                  {formatPrice(item.price)}
                </span>
              </div>
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
