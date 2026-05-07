import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useState, useEffect } from "react";

function ProductDetailsPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productData = await getProductById(id);
        setProduct(productData);
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
      <p>Produto: {product.product}</p>
      <p>Nome raspado: {product.scraped_name}</p>
      <p>Site: {product.site}</p>
      <a href={product.url} target="_blank" rel="noreferrer">
        Abrir produto na loja
      </a>
      <p>Adicionado em: {product.added_at}</p>
      <p>Última mudança: {product.last_change}</p>
    </main>
  );
}

export default ProductDetailsPage;
