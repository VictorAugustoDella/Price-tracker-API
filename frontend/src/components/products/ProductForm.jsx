function ProductForm({
  product,
  url,
  creating,
  onProductChange,
  onUrlChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end">
      <div>
        <label className="label-base" htmlFor="pf-product">Nome do produto</label>
        <input
          id="pf-product"
          type="text"
          placeholder="Ex: Tênis preto"
          value={product}
          onChange={(e) => onProductChange(e.target.value)}
          required
          className="input-base"
        />
      </div>
      <div>
        <label className="label-base" htmlFor="pf-url">URL</label>
        <input
          id="pf-url"
          type="url"
          placeholder="https://..."
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          required
          className="input-base"
        />
      </div>
      <button type="submit" disabled={creating} className="btn btn-primary sm:min-w-[180px]">
        {creating ? (<><span className="spinner" /> Buscando...</>) : "Adicionar produto"}
      </button>
    </form>
  );
}

export default ProductForm;
