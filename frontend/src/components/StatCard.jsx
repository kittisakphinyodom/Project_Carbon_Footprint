function StatCard({
  title,
  value,
  unit,
  description,
  // icon
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">
              {value}
            </span>

            {unit && (
              <span className="text-sm text-slate-500">
                {unit}
              </span>
            )}
          </div>

          {description && (
            <p className="mt-2 text-xs text-slate-400">
              {description}
            </p>
          )}
        </div>

        {/* <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-2xl">
          {icon}
        </div> */}
      </div>
    </div>
  );
}

export default StatCard;