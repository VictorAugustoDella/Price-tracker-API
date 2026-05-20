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
      <button type="submit" disabled={creating} className="btn btn-primary sm:min-w-[190px]">
        {creating ? (<><span className="spinner" /> Buscando...</>) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Adicionar produto
          </>
        )}
      </button>
    </form>
  );
}

export default ProductForm;
