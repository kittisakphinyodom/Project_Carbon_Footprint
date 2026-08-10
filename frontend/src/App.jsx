
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import Materials from "./pages/Materials";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/materials" element={<Materials />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

