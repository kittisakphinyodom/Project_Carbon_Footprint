
import { useState } from "react";
import { getCarbonSummary } from "../services/api";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";

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

  // ========================================
  // Filter
  // ========================================

  const handleFilter = async () => {
    await loadSummary(startDate, endDate);
  };

  // ========================================
  // Reset
  // ========================================

  const handleReset = async () => {
    setStartDate("");
    setEndDate("");

    await loadSummary();
  };

  // ========================================
  // Initial Load
  // ========================================

  if (summary === null && !loading && !error) {
    loadSummary();
  }

  // ========================================
  // Loading
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

  // ========================================
  // Error
  // ========================================

  if (error && summary === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">

        <div className="rounded-xl bg-white p-8 text-center shadow-sm">

          <h2 className="text-xl font-bold text-red-600">
            เกิดข้อผิดพลาด
          </h2>

          <p className="mt-3 text-slate-600">
            {error}
          </p>

          <button
            onClick={() => loadSummary()}
            className="mt-5 rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
          >
            ลองใหม่
          </button>

        </div>

      </div>
    );
  }

  // ========================================
  // Dashboard
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
                  className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "กำลังโหลด..." : "Filter"}
                </button>

                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="rounded-lg bg-slate-200 px-6 py-2 font-medium text-slate-700 hover:bg-slate-300 disabled:opacity-50"
                >
                  Reset
                </button>

              </div>

            </div>

          </div>

          {/* Summary Cards */}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            <StatCard
              title="Total Carbon Footprint"
              value={summary?.total_co2e ?? 0}
              unit="kgCO₂e"
              description="ปริมาณการปล่อยก๊าซเรือนกระจกรวม"
              icon="🌱"
            />

            <StatCard
              title="Total Activities"
              value={summary?.total_activities ?? 0}
              unit="Activities"
              description="จำนวนกิจกรรมที่บันทึก"
              icon="📋"
            />

            <StatCard
              title="Data Status"
              value="ACTIVE"
              description="ระบบกำลังคำนวณข้อมูล"
              
            />

          </div>

          {/* Summary Details */}

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* Scope */}

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold text-slate-800">
                Carbon by Scope
              </h2>

              <div className="mt-5 space-y-4">

                {summary?.scope_summary?.length > 0 ? (

                  summary.scope_summary.map((item) => (

                    <div
                      key={item.scope_id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-4"
                    >

                      <div>

                        <p className="font-medium text-slate-700">
                          Scope {item.scope_id}
                        </p>

                        <p className="text-xs text-slate-400">
                          GHG Scope
                        </p>

                      </div>

                      <p className="font-bold text-green-600">
                        {item.total_co2e} kgCO₂e
                      </p>

                    </div>

                  ))

                ) : (

                  <p className="text-sm text-slate-400">
                    ไม่มีข้อมูล
                  </p>

                )}

              </div>

            </div>

            {/* Category */}

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold text-slate-800">
                Carbon by Category
              </h2>

              <div className="mt-5 space-y-4">

                {summary?.category_summary?.length > 0 ? (

                  summary.category_summary.map((item) => (

                    <div
                      key={item.category_id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-4"
                    >

                      <div>

                        <p className="font-medium text-slate-700">
                          Category {item.category_id}
                        </p>

                        <p className="text-xs text-slate-400">
                          Emission Category
                        </p>

                      </div>

                      <p className="font-bold text-green-600">
                        {item.total_co2e} kgCO₂e
                      </p>

                    </div>

                  ))

                ) : (

                  <p className="text-sm text-slate-400">
                    ไม่มีข้อมูล
                  </p>

                )}

              </div>

            </div>

            {/* Material */}

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold text-slate-800">
                Carbon by Material
              </h2>

              <div className="mt-5 space-y-4">

                {summary?.material_summary?.length > 0 ? (

                  summary.material_summary.map((item) => (

                    <div
                      key={item.material_id}
                      className="rounded-lg bg-slate-50 p-4"
                    >

                      <div className="flex items-center justify-between">

                        <div>

                          <p className="font-medium text-slate-700">
                            Material #{item.material_id}
                          </p>

                          <p className="text-xs text-slate-400">
                            Raw Material
                          </p>

                        </div>

                        <p className="font-bold text-green-600">
                          {item.total_co2e} kgCO₂e
                        </p>

                      </div>

                    </div>

                  ))

                ) : (

                  <p className="text-sm text-slate-400">
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

