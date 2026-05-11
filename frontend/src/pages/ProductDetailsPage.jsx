import { useParams } from "react-router-dom";
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

  if (loading) return <h1>Carregando produto...</h1>;

  if (error) return <h1>{error}</h1>;

  if (!product) return <h1>Produto não encontrado.</h1>;

  return (
    <main>
      <ProductInfo
        product={product}
        refreshing={refreshing}
        onRefresh={handleRefreshPrice}
      />

      <PriceHistory prices={prices} />

      <div>
        <h2>Estatísticas</h2>

        <StatsFilters
          statsOptions={statsOptions}
          selectedStatsFields={selectedStatsFields}
          onSelectedStatsFieldsChange={setSelectedStatsFields}
          onApplyFilter={handleApplyFilter}
        />

        <ProductStats stats={stats} />
      </div>
    </main>
  );
}

export default ProductDetailsPage;
