import { formatDate, formatPrice } from "../../utils/formatters";
function PriceHistory({ prices }) {
  return (
    <div>
      <h2>Histórico de preços</h2>

      {prices.length === 0 ? (
        <p>Nenhum preço registrado ainda.</p>
      ) : (
        <ul>
          {prices.map((item) => (
            <li key={item.id}>
              <p>Preço: {formatPrice(item.price)}</p>
              <p>Coletado em: {formatDate(item.collected_at)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PriceHistory;
