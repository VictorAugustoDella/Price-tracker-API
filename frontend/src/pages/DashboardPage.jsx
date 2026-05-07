import ProductForm from "../components/products/ProductForm";
import ProductList from "../components/products/ProductList";
import { useDashboardProducts } from "../hooks/useDashboardProducts";

function DashboardPage() {
  const {
    products,
    loading,
    error,
    product,
    url,
    creating,
    setProduct,
    setUrl,
    handleCreateProduct,
    handleDeleteProduct,
    handleUpdateProduct,
  } = useDashboardProducts();

  if (loading) return <h1>Carregando produtos...</h1>;

  return (
    <main>
      <ProductForm
        product={product}
        url={url}
        creating={creating}
        onProductChange={setProduct}
        onUrlChange={setUrl}
        onSubmit={handleCreateProduct}
      />

      {error && <h1>{error}</h1>}

      <ProductList
        products={products}
        onDelete={handleDeleteProduct}
        onUpdate={handleUpdateProduct}
      />

      {products.length === 0 && <h1>Nenhum produto cadastrado ainda.</h1>}
    </main>
  );
}

export default DashboardPage;