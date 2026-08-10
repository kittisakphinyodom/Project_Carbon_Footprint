function Header() {
  return (
    <header className="h-20 border-b bg-white flex items-center justify-between px-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h2>

        <p className="text-sm text-slate-500">
          Hotel Carbon Footprint Overview
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-medium text-slate-700">
          Carbon Footprint System
        </p>

        <p className="text-xs text-slate-400">
          Activity Based Calculation
        </p>
      </div>
    </header>
  );
}

export default Header;