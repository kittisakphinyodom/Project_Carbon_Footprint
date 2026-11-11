
import { useState, useEffect } from "react";
import { getCarbonSummary } from "../services/api";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";

// Map ชื่อหมวดหมู่ประเภทกิจกรรมภาษาไทย
const CATEGORY_NAMES = {
  1: "การเผาไหม้แบบอยู่กับที่ (Stationary Combustion)",
  2: "การเผาไหม้ที่มีการเคลื่อนที่ (Mobile Combustion)",
  3: "การรั่วไหลของสารจากอุปกรณ์ต่างๆ (Fugitive Emissions)",
  4: "พลังงานไฟฟ้าที่ซื้อมาใช้งาน (Purchased Electricity)",
  5: "พลังงานไอน้ำที่ซื้อมาใช้งาน (Purchased Steam)",
  6: "พลังงานความร้อนที่ซื้อมาใช้งาน (Purchased Heat)",
  7: "พลังงานความเย็นที่ซื้อมาใช้งาน (Purchased Cooling)",
  8: "การซื้อวัตถุดิบและบริการ (Purchased Goods and Service)",
  9: "การขนส่งและกระจายสินค้า (Upstream Transportation)",
  10: "ขยะอินทรีย์และอาหารเหลือทิ้ง (Food Waste)"
};

// 🟢 Map ข้อความอธิบายความหมายของแต่ละ Scope ภาษาไทย
const SCOPE_DESCRIPTIONS = {
  1: "การปล่อยทางตรง (Direct Emissions)",
  2: "การปล่อยทางอ้อมจากการใช้พลังงาน (Energy Indirect Emissions)",
  3: "การปล่อยทางอ้อมอื่นๆ (Other Indirect Emissions)"
};

// ฟังก์ชั่นช่วยเลือกสี Badge ของแต่ละ Scope
const getScopeBadgeStyle = (scopeNum) => {
  switch (Number(scopeNum)) {
    case 1:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case 2:
      return "bg-green-100 text-green-800 border-green-200";
    case 3:
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ========================================
  // Load Summary
  // ========================================

  const loadSummary = async (start = "", end = "") => {
    try {
      setLoading(true);
      setError("");

      const result = await getCarbonSummary(start, end);

      if (result.success) {
        setSummary(result.data);
      } else {
        setError("ไม่สามารถโหลดข้อมูล Carbon Footprint ได้");
      }
    } catch (err) {
      console.error("Carbon Summary Error:", err);
      setError("ไม่สามารถเชื่อมต่อกับ Backend ได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  // ========================================
  // Filter & Reset
  // ========================================

  const handleFilter = async () => {
    await loadSummary(startDate, endDate);
  };

  const handleReset = async () => {
    setStartDate("");
    setEndDate("");
    await loadSummary();
  };

  // ตัวช่วยแปลงรูปแบบตัวเลข
  const formatNumber = (val) => {
    return Number(val || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  };

  // ========================================
  // Loading & Error States
  // ========================================

  if (loading && summary === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-700">
            กำลังโหลด Dashboard...
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Loading Carbon Footprint data
          </p>
        </div>
      </div>
    );
  }

  if (error && summary === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-red-600">
            เกิดข้อผิดพลาด
          </h2>
          <p className="mt-3 text-slate-600">{error}</p>
          <button
            onClick={() => loadSummary()}
            className="mt-5 rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700 cursor-pointer"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  // ========================================
  // Render Dashboard
  // ========================================

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="ml-64">
        <Header />

        <main className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
              Carbon Footprint Dashboard
            </h1>
            <p className="mt-2 text-slate-500">
              ภาพรวมการปล่อยก๊าซเรือนกระจกของโรงแรม
            </p>
          </div>

          {/* Date Filter */}
          <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800">
              Filter Carbon Footprint
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Start Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-green-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-green-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-end gap-3">
                <button
                  onClick={handleFilter}
                  disabled={loading}
                  className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "กำลังโหลด..." : "Filter"}
                </button>

                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="rounded-lg bg-slate-200 px-6 py-2 font-medium text-slate-700 hover:bg-slate-300 disabled:opacity-50 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <StatCard
              title="ปริมาณการปล่อยก๊าซเรือนกระจกทั้งหมด"
              value={formatNumber(summary?.total_co2e)}
              unit="kgCO₂e"
              description=""
              icon=""
            />

            <StatCard
              title="จำนวนกิจกรรมที่บันทึก"
              value={summary?.total_activities ?? 0}
              unit="กิจกรรม"
              description=""
              icon=""
            />

            
          </div>

          {/* Summary Breakdown Details */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Scope Summary (🟢 เพิ่มคำอธิบายประเภท Scope) */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                SCOPE
              </h2>
              <div className="space-y-3">
                {summary?.scope_summary?.length > 0 ? (
                  summary.scope_summary.map((item) => (
                    <div
                     key={item.scope_id}
          className="flex items-center justify-between rounded-lg bg-slate-50 p-4 border border-slate-100 gap-3"
        >
          {/* ฝั่งซ้าย: Badge Scope + คำอธิบาย */}
          <div className="flex items-center gap-3 min-w-0">
            {/* 🟢 เพิ่ม shrink-0 และ whitespace-nowrap ป้องกัน Badge ยืดทรงบวม */}
            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold border shrink-0 whitespace-nowrap ${getScopeBadgeStyle(item.scope_id)}`}>
              Scope {item.scope_id}
            </span>
            <span className="text-xs text-slate-600 font-medium leading-snug">
              {SCOPE_DESCRIPTIONS[item.scope_id] || item.scope_name}
            </span>
          </div>

          {/* ฝั่งขวา: ปริมาณคาร์บอน */}
          <p className="font-bold text-green-600 text-right shrink-0 whitespace-nowrap ml-2">
            {formatNumber(item.total_co2e)} kgCO₂e
          </p>
        </div>
      ))
    ) : (
      <p className="text-sm text-slate-400 py-4 text-center">
        ไม่มีข้อมูล
      </p>
    )}
  </div>
</div>

        {/* Category Summary */}
<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
  <h2 className="text-lg font-bold text-slate-800 mb-4">
    ประเภทกิจกรรม
  </h2>
  <div className="space-y-3">
    {summary?.category_summary?.length > 0 ? (
      summary.category_summary.map((item) => (
        <div
          key={item.category_id}
          className="flex items-center justify-between rounded-lg bg-slate-50 p-4 border border-slate-100"
        >
          <div>
            {/* 🟢 ดึงชื่อภาษาไทยจาก CATEGORY_NAMES ผ่าน item.category_id */}
            <p className="text-sm font-semibold text-slate-700">
              {CATEGORY_NAMES[item.category_id] || item.category_name}
            </p>
          </div>
          <p className="font-bold text-green-600 text-right ml-2 whitespace-nowrap">
            {formatNumber(item.total_co2e)} kgCO₂e
          </p>
        </div>
      ))
    ) : (
      <p className="text-sm text-slate-400 py-4 text-center">
        ไม่มีข้อมูล
      </p>
    )}
  </div>
</div>

            {/* Top Carbon Material by Scope */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-bold text-slate-800">
      สูงสุดของแต่ละ Scope
    </h2>
    <span className="text-xs text-slate-400">
      
    </span>
  </div>

  <div className="space-y-3">
    {summary?.material_summary?.length > 0 ? (
      summary.material_summary.map((item) => (
        <div
          key={item.material_id}
          className="flex items-center justify-between rounded-lg bg-slate-50 p-4 border border-slate-100 gap-3"
        >
          {/* ฝั่งซ้าย: Badge Scope + ชื่อวัตถุดิบ */}
          <div className="flex items-center gap-3 min-w-0">
            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold border shrink-0 whitespace-nowrap ${getScopeBadgeStyle(item.scope_id)}`}>
              Scope {item.scope_id}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 leading-snug">
                {item.material_name}
              </p>
              {item.unit && (
                <p className="text-xs text-slate-400 mt-0.5">
                  หน่วย: {item.unit}
                </p>
              )}
            </div>
          </div>

          {/* ฝั่งขวา: ปริมาณคาร์บอน */}
          <p className="font-bold text-green-600 text-right shrink-0 whitespace-nowrap ml-2">
            {formatNumber(item.total_co2e)} kgCO₂e
          </p>
        </div>
      ))
    ) : (
      <p className="text-sm text-slate-400 py-4 text-center">
        ไม่มีข้อมูล
      </p>
    )}
  </div>
</div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;