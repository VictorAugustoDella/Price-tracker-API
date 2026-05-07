import ProductCard from "./ProductCard";

function ProductList({ products, onDelete, onUpdate }) {
  return (
    <ul>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}

export default ProductList;