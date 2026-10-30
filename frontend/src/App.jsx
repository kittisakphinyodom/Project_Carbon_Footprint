import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import Materials from "./pages/Materials";
import ProtectedRoute from "./components/ProtectedRoute";
import Report from "./pages/Report";

const ManagerRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const rawRole =
    typeof user?.role === "string"
      ? user.role
      : typeof user?.role === "object"
      ? user.role?.name
      : typeof user?.Role === "object"
      ? user.Role?.name
      : user?.role_name || "";

  const userRole = String(rawRole || "").toUpperCase();

  if (userRole !== "MANAGER") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public Routes (ใครก็เข้าได้) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 2. Common Protected Routes (เข้าได้ทุก Role: ADMIN, MANAGER, USER) */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "USER","STAFF"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activities" element={<Activities />} />
        </Route>

        {/* 3. Admin & Manager Only Routes (เข้าได้เฉพาะ ADMIN และ MANAGER เท่านั้น) */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN", "MANAGER","STAFF"]} />}>
          <Route path="/materials" element={<Materials />} />
        </Route>

        <Route
        path="/report"
        element={
          <ManagerRoute>
            <Report />
          </ManagerRoute>
        }
      />

      </Routes>
    </BrowserRouter>
  );
}

export default App;