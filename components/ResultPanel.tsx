export function ResultPanel({
  gradient,
  stats,
}: {
  gradient: string;
  stats: { label: string; value: string; primary?: boolean }[];
}) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg`}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map((s) => (
          <div key={s.label} className={s.primary ? "sm:col-span-2" : ""}>
            <div className="text-xs font-medium uppercase tracking-wide text-white/70">{s.label}</div>
            <div className={s.primary ? "mt-1 text-3xl font-bold sm:text-4xl" : "mt-1 text-xl font-semibold"}>
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
