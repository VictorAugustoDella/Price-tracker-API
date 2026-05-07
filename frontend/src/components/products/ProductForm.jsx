function ProductForm({
  product,
  url,
  creating,
  onProductChange,
  onUrlChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Produto"
        value={product}
        onChange={(e) => onProductChange(e.target.value)}
        required
      />

      <input
        type="url"
        placeholder="Url"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        required
      />

      <button type="submit" disabled={creating}>
        {creating ? "Buscando dados do produto..." : "Adicionar"}
      </button>
    </form>
  );
}

export default ProductForm;