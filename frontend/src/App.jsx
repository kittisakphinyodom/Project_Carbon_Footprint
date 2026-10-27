import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import Materials from "./pages/Materials";
import ProtectedRoute from "./components/ProtectedRoute";
import Report from "./pages/Report";

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

        <Route path="/report" element={<Report />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;