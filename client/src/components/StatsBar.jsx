export default function StatsBar({ stats }) {
  return (
    <div className="flex items-center gap-6 text-sm">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-500 inline-block" />
        <span className="text-slate-600">
          <span className="font-semibold text-slate-900">{stats.active}</span>{" "}
          active
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
        <span className="text-slate-600">
          <span className="font-semibold text-slate-900">{stats.completed}</span>{" "}
          completed
        </span>
      </div>
      <div className="text-slate-400">
        <span className="font-semibold text-slate-600">{stats.total}</span> total
      </div>
    </div>
  );
}
