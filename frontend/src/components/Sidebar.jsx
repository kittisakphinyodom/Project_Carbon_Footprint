
import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: "",
    },
    {
      name: "Activities",
      path: "/activities",
      icon: "",
    },
    {
      name: "Scope3 : Materials List",
      path: "/materials",
      icon: "",
    },
    
      
    
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white">
      {/* Logo */}
      <div className="border-b border-slate-700 p-6">
        <h1 className="text-xl font-bold text-green-400">
          Hotel Carbon
        </h1>

        <p className="text-sm text-slate-400">
          Footprint System
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Menu
        </div>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>

              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;

