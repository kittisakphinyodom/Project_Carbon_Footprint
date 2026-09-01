import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  return (
    <header className="h-20 border-b bg-white flex items-center justify-between px-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          {/* Dashboard */}
        </h2>

        <p className="text-sm text-slate-500">
          Hotel Carbon Footprint Overview
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-700">
            Carbon Footprint System
          </p>

          <p className="text-xs text-slate-400">
            Activity Based Calculation
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;