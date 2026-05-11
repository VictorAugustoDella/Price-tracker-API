import { getProductById } from "../services/productService";
import { useState, useEffect } from "react";
import {
  getProductPrices,
  getProductStats,
  refreshProductPrice,
} from "../services/priceService";

export function useProductDetails(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prices, setPrices] = useState([]);
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const statsOptions = [
    { value: "current", label: "Preço atual" },
    { value: "lowest", label: "Menor preço" },
    { value: "highest", label: "Maior preço" },
    { value: "average", label: "Preço médio" },
    { value: "total", label: "Quantidade de coletas" },
    { value: "variation_percent", label: "Variação" },
    { value: "is_best_price", label: "Melhor preço" },
    { value: "last_30_days_average", label: "Média dos últimos 30 dias" },
    { value: "price_trend", label: "Tendência" },
  ];

  const [selectedStatsFields, setSelectedStatsFields] = useState([
    "current",
    "lowest",
    "highest",
  ]);

  async function handleApplyFilter() {
    setError(null);

    try {
      const productStatsData = await getProductStats(id, selectedStatsFields);
      setStats(productStatsData);
    } catch (err) {
      setError(err.message);
    }
  }

  async function fetchProductDetails() {
    const productData = await getProductById(id);
    const priceData = await getProductPrices(id);
    const statsData = await getProductStats(id, selectedStatsFields);
    setProduct(productData);
    setPrices(priceData);
    setStats(statsData);
  }

  useEffect(() => {
    async function fetchProduct() {
      try {
        await fetchProductDetails();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  async function handleRefreshPrice() {
    setError(null);
    setRefreshing(true);
    try {
      await refreshProductPrice(id);
      await fetchProductDetails();
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  }

  return {
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
  };
}
