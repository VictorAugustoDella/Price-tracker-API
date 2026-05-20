import { formatDate } from "../../utils/formatters";

function ProductInfo({ product, refreshing, onRefresh }) {
  return (
    <section className="card-base card-glow p-6 sm:p-8 animate-[slide-up_0.4s_ease-out_both] relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl" />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {product.site && <span className="badge mb-3">{product.site}</span>}
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-tight">
            {product.product}
          </h1>
          {product.scraped_name && (
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{product.scraped_name}</p>
          )}
          <a
            href={product.url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gradient hover:opacity-80 transition-opacity"
          >
            Abrir produto na loja
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="oklch(0.66 0.22 295)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7"/><path d="M8 7h9v9"/>
            </svg>
          </a>
        </div>
        <button onClick={onRefresh} disabled={refreshing} className="btn btn-primary">
          {refreshing ? (<><span className="spinner" /> Atualizando...</>) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>
              </svg>
              Atualizar preço
            </>
          )}
        </button>
      </div>

      <dl className="relative mt-7 grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-5 text-sm">
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Adicionado em</dt>
          <dd className="mt-1.5 text-foreground font-medium">{formatDate(product.added_at)}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Última mudança</dt>
          <dd className="mt-1.5 text-foreground font-medium">{formatDate(product.last_change)}</dd>
        </div>
      </dl>
    </section>
  );
}

export default ProductInfo;
