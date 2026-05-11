import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatters";

function ProductCard({ product, onDelete, onUpdate }) {
  return (
    <li className="card-base p-5 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)] animate-[slide-up_0.4s_ease-out_both]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-foreground leading-snug truncate">
            {product.product}
          </h3>
          {product.scraped_name && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {product.scraped_name}
            </p>
          )}
        </div>
        {product.site && <span className="badge shrink-0">{product.site}</span>}
      </div>

      {/* External link */}
      <a
        href={product.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover transition-colors w-fit"
      >
        Abrir produto
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17L17 7" /><path d="M8 7h9v9" />
        </svg>
      </a>

      {/* Meta */}
      <dl className="grid grid-cols-2 gap-3 text-xs border-t border-border pt-4">
        <div>
          <dt className="text-muted-foreground">Adicionado</dt>
          <dd className="mt-0.5 text-foreground font-medium">{formatDate(product.added_at)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Última mudança</dt>
          <dd className="mt-0.5 text-foreground font-medium">{formatDate(product.last_change)}</dd>
        </div>
      </dl>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 mt-auto">
        <Link
          to={`/products/${product.id}`}
          className="btn btn-primary flex-1 !py-2 text-sm"
        >
          Ver detalhes
        </Link>
        <button
          type="button"
          onClick={() => onUpdate(product.id, product.product)}
          className="btn btn-secondary !py-2 !px-3 text-sm"
          aria-label="Editar nome"
          title="Editar nome"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onDelete(product.id)}
          className="btn btn-destructive !py-2 !px-3 text-sm"
          aria-label="Remover"
          title="Remover"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
    </li>
  );
}

export default ProductCard;
