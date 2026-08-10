
import { useEffect, useState } from "react";
import { getMaterials } from "../services/api";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search
  const [search, setSearch] = useState("");

  // Sort
  const [sortBy, setSortBy] = useState("id_asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ========================================
  // Load Materials
  // ========================================

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getMaterials();

        if (result.success) {
          setMaterials(result.data);
        } else {
          setError("ไม่สามารถโหลดข้อมูล Material ได้");
        }
      } catch (err) {
        console.error("Load materials error:", err);
        setError("ไม่สามารถเชื่อมต่อกับ Backend ได้");
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // ========================================
  // Search + Sort
  // ========================================

  const filteredMaterials = materials
    .filter((material) => {
      const keyword = search.toLowerCase().trim();

      if (!keyword) {
        return true;
      }

      return (
        String(material.id).includes(keyword) ||
        material.code?.toLowerCase().includes(keyword) ||
        material.name?.toLowerCase().includes(keyword)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "id_asc":
          return a.id - b.id;

        case "id_desc":
          return b.id - a.id;

        case "name_az":
          return (a.name || "").localeCompare(b.name || "", "en");

        case "name_za":
          return (b.name || "").localeCompare(a.name || "", "en");

        case "name_th":
          return (a.name || "").localeCompare(b.name || "", "th");

        case "name_th_desc":
          return (b.name || "").localeCompare(a.name || "", "th");

        case "status":
          return (a.status || "").localeCompare(
            b.status || "",
            "en"
          );

        default:
          return 0;
      }
    });

  // ========================================
  // Pagination
  // ========================================

  const totalPages = Math.ceil(
    filteredMaterials.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentMaterials = filteredMaterials.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ========================================
  // Reset Page เมื่อ Search / Sort
  // ========================================

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, sortBy]);

  // ========================================
  // Loading
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            กำลังโหลด Materials...
          </div>

          <p className="mt-2 text-sm text-slate-400">
            Loading Material data
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // Error
  // ========================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white p-8 text-center shadow">
          <p className="text-red-500">{error}</p>
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

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
              Material List
            </h1>

            <p className="mt-2 text-slate-500">
              รายการวัตถุดิบจากระบบ
            </p>
          </div>

          {/* Summary */}
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Materials
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {materials.length}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                วัตถุดิบทั้งหมด
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Active Materials
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {
                  materials.filter(
                    (material) => material.status === "ACTIVE"
                  ).length
                }
              </p>

              <p className="mt-1 text-sm text-slate-400">
                วัตถุดิบที่ใช้งานอยู่
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Showing
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-700">
                {filteredMaterials.length}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                ผลลัพธ์จากการค้นหา
              </p>
            </div>

          </div>

          {/* Search & Sort */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* Search */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  ค้นหาวัตถุดิบ
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    🔍
                  </span>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ค้นหา ID, Code หรือชื่อวัตถุดิบ..."
                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-11 pr-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />

                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  เรียงข้อมูล
                </label>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  <option value="id_asc">
                    ID: น้อย → มาก
                  </option>

                  <option value="id_desc">
                    ID: มาก → น้อย
                  </option>

                  <option value="name_az">
                    Name: A → Z
                  </option>

                  <option value="name_za">
                    Name: Z → A
                  </option>

                  <option value="name_th">
                    ชื่อภาษาไทย: ก → ฮ
                  </option>

                  <option value="name_th_desc">
                    ชื่อภาษาไทย: ฮ → ก
                  </option>

                  <option value="status">
                    Status
                  </option>
                </select>
              </div>

            </div>

          </div>

          {/* Material Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">
                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      ID
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Code
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Material
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Emission Factor
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Unit
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {currentMaterials.length > 0 ? (

                    currentMaterials.map((material) => (

                      <tr
                        key={material.id}
                        className="transition hover:bg-green-50"
                      >

                        {/* ID */}
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          {material.id}
                        </td>

                        {/* Code */}
                        <td className="px-6 py-4">

                          <span className="rounded-md bg-slate-100 px-3 py-1 font-mono text-sm font-semibold text-slate-700">
                            {material.code}
                          </span>

                        </td>

                        {/* Material */}
                        <td className="px-6 py-4">

                          <p className="font-medium text-slate-800">
                            {material.name}
                          </p>

                        </td>

                        {/* Emission Factor */}
                        <td className="px-6 py-4">
                        {material.emission_factor !== null ? (
                            <div>
                            <p className="font-semibold text-green-600">
                                {material.emission_factor}
                            </p>

                            <p className="text-xs text-slate-400">
                                {material.emission_factor_unit || "-"}
                            </p>
                            </div>
                        ) : (
                            <span className="text-sm text-slate-400">
                            ไม่มีข้อมูล EF
                            </span>
                        )}
                        </td>

                        {/* Unit */}
                        <td className="px-6 py-4 text-sm text-slate-600">
                        {material.default_unit || "-"}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              material.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {material.status}
                          </span>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        ไม่พบข้อมูลวัตถุดิบ
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* Pagination */}
          {totalPages > 1 && (

            <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">

              <p className="text-sm text-slate-500">
                แสดง{" "}
                <span className="font-semibold text-slate-700">
                  {startIndex + 1}
                </span>{" "}
                -{" "}
                <span className="font-semibold text-slate-700">
                  {Math.min(
                    startIndex + itemsPerPage,
                    filteredMaterials.length
                  )}
                </span>{" "}
                จาก{" "}
                <span className="font-semibold text-slate-700">
                  {filteredMaterials.length}
                </span>{" "}
                รายการ
              </p>

              <div className="flex items-center gap-2">

                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => page - 1)
                  }
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← ก่อนหน้า
                </button>

                <span className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white">
                  {currentPage}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => page + 1)
                  }
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ถัดไป →
                </button>

              </div>

            </div>

          )}

        </main>
      </div>
    </div>
  );
}

export default Materials;

