import { useState, useEffect } from "react";
import { getMonthlyReport } from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";

function Report() {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await getMonthlyReport(year, month);
      const isSuccess = res?.success || res?.data?.success;
      const reportContent = res?.data?.data || res?.data || res;

      if (isSuccess && reportContent) {
        setReport(reportContent);
      } else if (res && !res.data) {
        setReport(res);
      }
    } catch (error) {
      console.error("Fetch Report Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [year, month]);

  const formatNum = (val) => Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      {/* 🛑 ซ่อน Sidebar ขณะพิมพ์ */}
      <div className="print:hidden">
        <Sidebar />
      </div>

      {/* 🛑 ปรับระยะ margin-left จาก 64 เป็น 0 ขณะพิมพ์ */}
      <div className="ml-64 print:ml-0">
        {/* 🛑 ซ่อน Header ขณะพิมพ์ */}
        <div className="print:hidden">
          <Header />
        </div>

        <main className="p-8 print:p-0">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Report</h1>
              <p className="text-slate-500 mt-1">รายงานสรุปและการวิเคราะห์การปล่อยคาร์บอนรายวัน</p>
            </div>

            {/* 🛑 ซ่อน Dropdown ตัวเลือกเดือน/ปี และปุ่ม Export ขณะพิมพ์ */}
            <div className="flex items-center gap-3 print:hidden">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-medium outline-none focus:border-green-500"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>เดือน {i + 1}</option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-medium outline-none focus:border-green-500"
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>

              <button
                onClick={() => window.print()}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 cursor-pointer shadow-sm"
              >
                📄 Export / Print
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:grid-cols-3">
            <StatCard
              title="คาร์บอนรวมประจำเดือน"
              value={formatNum(report?.total_monthly_co2e)}
              unit="kgCO₂e"
              // description={`ประจำเดือน ${month}/${year}`}
              // icon="🌿"
            />
            <StatCard
              title="เฉลี่ยการปล่อยต่อวัน"
              value={formatNum(report?.avg_daily_co2e)}
              unit="kgCO₂e/วัน"
              // description="ค่าเฉลี่ยตลอดทั้งเดือน"
              // icon="📊"
            />
            <StatCard
              title="วันที่มีการปล่อยสูงสุด"
              value={report?.peak_day || "-"}
              // description="วันที่ปล่อยคาร์บอนสูงสุดในเดือนนี้"
              // icon="⚠️"
            />
          </div>

          {/* Daily Detailed Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 print:border-none print:shadow-none print:p-0">
            <h2 className="text-lg font-bold text-slate-800 mb-4">ตารางแจกแจงการปล่อยคาร์บอนรายวัน</h2>
            
            {loading ? (
              <p className="text-center text-slate-500 py-8">กำลังโหลดข้อมูลรายงาน...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">วันที่</th>
                      <th className="px-4 py-3 text-right">Scope 1 (kgCO₂e)</th>
                      <th className="px-4 py-3 text-right">Scope 2 (kgCO₂e)</th>
                      <th className="px-4 py-3 text-right">Scope 3 (kgCO₂e)</th>
                      <th className="px-4 py-3 text-right">ยอดรวม (kgCO₂e)</th>
                      <th className="px-4 py-3 pl-6">ต้นเหตุหลัก (Main Contributor)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {report?.daily_reports?.map((row) => (
                      <tr key={row.date} className={row.total_co2e > 0 ? "hover:bg-slate-50" : "opacity-40 print:opacity-100"}>
                        <td className="px-4 py-3 font-medium text-slate-800">{row.date}</td>
                        <td className="px-4 py-3 text-right text-blue-600 font-medium">{formatNum(row.scope1)}</td>
                        <td className="px-4 py-3 text-right text-green-600 font-medium">{formatNum(row.scope2)}</td>
                        <td className="px-4 py-3 text-right text-orange-600 font-medium">{formatNum(row.scope3)}</td>
                        <td className="px-4 py-3 text-right font-bold text-slate-800">{formatNum(row.total_co2e)}</td>
                        <td className="px-4 py-3 pl-6">
                          <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                            {row.main_contributor}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Report;