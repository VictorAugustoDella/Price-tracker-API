function StatsFilters({
  statsOptions,
  selectedStatsFields,
  onSelectedStatsFieldsChange,
  onApplyFilter,
}) {
  return (
    <section className="card-base p-5 sm:p-6 animate-[slide-up_0.4s_ease-out_both]">
      <h3 className="text-sm font-semibold text-foreground mb-4">Métricas</h3>
      <div className="space-y-2 mb-5">
        {statsOptions.map((option) => {
          const checked = selectedStatsFields.includes(option.value);
          return (
            <label
              key={option.value}
              className={`flex items-center gap-3 rounded-md border px-3 py-2 cursor-pointer transition-colors ${
                checked
                  ? "border-primary/40 bg-accent-soft"
                  : "border-border hover:bg-muted/60"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) =>
                  e.target.checked
                    ? onSelectedStatsFieldsChange([
                        ...selectedStatsFields,
                        option.value,
                      ])
                    : onSelectedStatsFieldsChange(
                        selectedStatsFields.filter((item) => item !== option.value),
                      )
                }
                className="h-4 w-4 accent-[var(--color-primary)] cursor-pointer"
              />
              <span className="text-sm text-foreground">{option.label}</span>
            </label>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onApplyFilter}
        disabled={selectedStatsFields.length === 0}
        className="btn btn-primary w-full"
      >
        Aplicar filtros
      </button>
    </section>
  );
}

export default StatsFilters;
