type TopKControlProps = {
  value: number;
  onChange: (value: number) => void;
};

const TopKControl = ({ value, onChange }: TopKControlProps) => {
  return (
    <label className="flex min-w-[160px] flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Suggestions</span>
      <div className="flex items-center gap-3 rounded-2xl border border-plum-100 bg-white px-4 py-3 shadow-sm">
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          className="w-full accent-plum-600"
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <span className="rounded-xl bg-plum-50 px-3 py-1 text-sm font-semibold text-plum-700">{value}</span>
      </div>
    </label>
  );
};

export default TopKControl;
