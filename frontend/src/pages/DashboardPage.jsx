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

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10 animate-[fade-in_0.4s_ease-out_both]">
      {/* Header */}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Meus produtos
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Acompanhe o histórico de preços dos produtos que você monitora.
          </p>
        </div>
        {!loading && (
          <span className="badge">
            {products.length} {products.length === 1 ? "produto" : "produtos"}
          </span>
        )}
      </header>

      {/* Add product card */}
      <section className="card-base p-5 sm:p-6 mb-6 animate-[slide-up_0.5s_ease-out_both]">
        <h2 className="text-sm font-semibold text-foreground mb-4">Adicionar novo produto</h2>
        <ProductForm
          product={product}
          url={url}
          creating={creating}
          onProductChange={setProduct}
          onUrlChange={setUrl}
          onSubmit={handleCreateProduct}
        />
      </section>

      {error && <div className="alert-error mb-6">{error}</div>}

      {/* List */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card-base p-5 space-y-3">
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-4 w-2/3" />
              <div className="skeleton h-9 w-full mt-4" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="card-base p-10 text-center animate-[scale-in_0.4s_ease-out_both]">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l6-6 4 4 8-8" />
              <path d="M14 7h7v7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground">Nenhum produto cadastrado</h3>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-sm mx-auto">
            Cole a URL de um produto no formulário acima para começar a monitorar seu preço.
          </p>
        </div>
      ) : (
        <ProductList
          products={products}
          onDelete={handleDeleteProduct}
          onUpdate={handleUpdateProduct}
        />
      )}
    </main>
  );
}

export default DashboardPage;
