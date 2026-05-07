import { Link } from "react-router-dom";

function ProductCard({ product, onDelete, onUpdate }) {
  return (
    <li>
      <p>Produto: {product.product}</p>
      <p>Nome raspado: {product.scraped_name}</p>
      <p>Site: {product.site}</p>

      <a href={product.url} target="_blank" rel="noreferrer">
        Abrir produto
      </a>

      <p>Adicionado as: {product.added_at}</p>
      <p>Última mudança: {product.last_change}</p>

      <button type="button" onClick={() => onDelete(product.id)}>
        Remover
      </button>

      <button
        type="button"
        onClick={() => onUpdate(product.id, product.product)}
      >
        Editar nome
      </button>

      <Link to={`/products/${product.id}`}>Detalhes do produto</Link>
    </li>
  );
}

export default ProductCard;