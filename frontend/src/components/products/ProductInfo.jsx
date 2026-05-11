import { formatDate } from "../../utils/formatters";

function ProductInfo({ product, refreshing, onRefresh }) {
  return (
    <div>
      <p>Produto: {product.product}</p>
      <p>Nome raspado: {product.scraped_name}</p>
      <p>Site: {product.site}</p>
      <a href={product.url} target="_blank" rel="noreferrer">
        Abrir produto na loja
      </a>
      <p>Adicionado em: {formatDate(product.added_at)}</p>
      <p>Última mudança: {formatDate(product.last_change)}</p>
      <button onClick={onRefresh} disabled={refreshing}>
        {refreshing ? "Atualizando preço..." : "Atualizar preço"}
      </button>
    </div>
  );
}

export default ProductInfo;
