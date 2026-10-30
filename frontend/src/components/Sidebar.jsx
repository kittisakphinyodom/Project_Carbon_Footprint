import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  // ดึงข้อมูล User จาก localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ดึงค่า Role อย่างปลอดภัย (รองรับทั้ง String, Object, role_name, และ Role.name)
  const rawRole =
    typeof user?.role === "string"
      ? user.role
      : typeof user?.role === "object"
      ? user.role?.name
      : typeof user?.Role === "object"
      ? user.Role?.name
      : user?.role_name || "";

  const userRole = String(rawRole || "").toUpperCase();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "" },
    { path: "/activities", label: "Activities", icon: "" },
    { path: "/materials", label: "Materials List", icon: "" },
  ];

  // แสดงเมนู Report เฉพาะผู้ใช้ที่เป็น MANAGER
  if (userRole === "MANAGER") {
    menuItems.push({ path: "/report", label: "Report", icon: "" });
  }

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen fixed left-0 top-0 p-6 flex flex-col justify-between print:hidden">
      <div>
        <div className="mb-8">
          <h1 className="text-xl font-bold text-green-400">Hotel Carbon</h1>
          <p className="text-xs text-slate-400">Footprint System</p>
        </div>

        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Menu
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-green-600 text-white font-semibold shadow-lg shadow-green-600/30"
                    : "hover:bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;