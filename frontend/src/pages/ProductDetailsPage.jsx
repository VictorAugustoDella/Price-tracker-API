import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useState, useEffect } from "react";
import { getProductPrices } from "../services/priceService";

function ProductDetailsPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prices, setPrices] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productData = await getProductById(id);
        const priceData = await getProductPrices(id);
        setProduct(productData);
        setPrices(priceData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) return <h1>Carregando produto...</h1>;

  if (error) return <h1>{error}</h1>;

  if (!product) return <h1>Produto não encontrado.</h1>;

  return (
    <main>
      <div>
        <p>Produto: {product.product}</p>
        <p>Nome raspado: {product.scraped_name}</p>
        <p>Site: {product.site}</p>
        <a href={product.url} target="_blank" rel="noreferrer">
          Abrir produto na loja
        </a>
        <p>Adicionado em: {product.added_at}</p>
        <p>Última mudança: {product.last_change}</p>
      </div>
      <div>
        <h2>Histórico de preços</h2>

        {prices.length === 0 ? (
          <p>Nenhum preço registrado ainda.</p>
        ) : (
          <ul>
            {prices.map((item) => (
              <li key={item.id}>
                <p>Preço: R${item.price}</p>
                <p>Coletado em: {item.collected_at}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default ProductDetailsPage;
