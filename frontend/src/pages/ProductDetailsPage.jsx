import { Link, useParams } from "react-router-dom";
import { useProductDetails } from "../hooks/useProductDetails";
import ProductInfo from "../components/products/ProductInfo";
import PriceHistory from "../components/products/PriceHistory";
import StatsFilters from "../components/products/StatsFilters";
import ProductStats from "../components/products/ProductStats";

function ProductDetailsPage() {
  const { id } = useParams();

  const {
    product,
    loading,
    error,
    prices,
    stats,
    refreshing,
    statsOptions,
    selectedStatsFields,
    setSelectedStatsFields,
    handleApplyFilter,
    handleRefreshPrice,
  } = useProductDetails(id);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="card-base p-6 space-y-4 animate-[fade-in_0.3s_ease-out_both]">
          <div className="skeleton h-7 w-1/2" />
          <div className="skeleton h-4 w-1/3" />
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton h-10 w-40 mt-2" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="alert-error">{error}</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="card-base p-12 text-center">
          <h1 className="text-lg font-semibold text-foreground">Produto não encontrado.</h1>
          <Link to="/" className="mt-4 inline-block text-sm font-medium text-gradient hover:opacity-80">
            ← Voltar para o dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 animate-[fade-in_0.4s_ease-out_both]">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
        </svg>
        Produtos
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ProductInfo
            product={product}
            refreshing={refreshing}
            onRefresh={handleRefreshPrice}
          />
          <PriceHistory prices={prices} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <StatsFilters
            statsOptions={statsOptions}
            selectedStatsFields={selectedStatsFields}
            onSelectedStatsFieldsChange={setSelectedStatsFields}
            onApplyFilter={handleApplyFilter}
          />
          <ProductStats stats={stats} />
        </aside>
      </div>
    </main>
  );
}

export default ProductDetailsPage;
