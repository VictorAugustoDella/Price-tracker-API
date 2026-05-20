function StatsFilters({
  statsOptions,
  selectedStatsFields,
  onSelectedStatsFieldsChange,
  onApplyFilter,
}) {
  return (
    <section className="card-base p-5 sm:p-6 animate-[slide-up_0.4s_ease-out_both]">
      <h3 className="text-sm font-semibold text-foreground mb-4 tracking-tight">Métricas</h3>
      <div className="space-y-2 mb-5">
        {statsOptions.map((option) => {
          const checked = selectedStatsFields.includes(option.value);
          return (
            <label
              key={option.value}
              className={`flex items-center gap-3 rounded-md border px-3 py-2.5 cursor-pointer transition-all ${
                checked
                  ? "border-primary/40 bg-gradient-to-r from-primary/15 to-accent/10 shadow-[0_0_0_1px_oklch(0.62_0.20_268/0.25)]"
                  : "border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
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
