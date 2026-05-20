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
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14 animate-[fade-in_0.4s_ease-out_both]">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 font-medium">
            Painel
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Meus <span className="text-gradient">produtos</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl">
            Acompanhe o histórico de preços dos produtos que você monitora.
          </p>
        </div>
        {!loading && (
          <span className="badge">
            {products.length} {products.length === 1 ? "produto" : "produtos"}
          </span>
        )}
      </header>

      <section className="card-base card-glow p-6 sm:p-7 mb-8 animate-[slide-up_0.5s_ease-out_both]">
        <div className="flex items-center gap-2 mb-5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-primary/30 to-accent/30 text-foreground border border-primary/20">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </span>
          <h2 className="text-sm font-semibold text-foreground tracking-tight">Adicionar novo produto</h2>
        </div>
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
        <div className="card-base card-glow p-12 text-center animate-[scale-in_0.4s_ease-out_both]">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-foreground border border-primary/20 shadow-[var(--shadow-glow)]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l6-6 4 4 8-8" />
              <path d="M14 7h7v7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground">Nenhum produto cadastrado</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
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
