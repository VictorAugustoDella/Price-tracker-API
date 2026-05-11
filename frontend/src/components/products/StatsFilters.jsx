function StatsFilters({
  statsOptions,
  selectedStatsFields,
  onSelectedStatsFieldsChange,
  onApplyFilter,
}) {
  return (
    <div>
      <h3>Métricas</h3>
      {statsOptions.map((option) => (
        <div key={option.value}>
          <input
            type="checkbox"
            checked={selectedStatsFields.includes(option.value)}
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
          />
          <span>{option.label}</span>
        </div>
      ))}
      <button
        type="button"
        onClick={onApplyFilter}
        disabled={selectedStatsFields.length === 0}
      >
        Aplicar filtros
      </button>
    </div>
  );
}

export default StatsFilters;
