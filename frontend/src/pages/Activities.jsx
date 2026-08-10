import { useEffect, useState } from "react";

import {
  getActivities,
  getMaterials,
  createActivity,
  getScopes,
  getActivityTypesByCategory,
} from "../services/api";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Activities() {
  // ==========================================
  // State
  // ==========================================

  const [activities, setActivities] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [scopes, setScopes] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);

  const [selectedScopeId, setSelectedScopeId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedActivityTypeId, setSelectedActivityTypeId] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    material_id: "",
    quantity: "",
  });

  // ==========================================
  // Load Activities
  // ==========================================

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getActivities();

      if (result.success) {
        setActivities(result.data || []);
      } else {
        setError("ไม่สามารถโหลดข้อมูล Activity ได้");
      }
    } catch (err) {
      console.error("Load activities error:", err);

      setError("ไม่สามารถเชื่อมต่อกับ Backend ได้");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Load Materials
  // ==========================================

  const fetchMaterials = async () => {
    try {
      const result = await getMaterials();

      if (result.success) {
        setMaterials(result.data || []);
      }
    } catch (err) {
      console.error("Load materials error:", err);
    }
  };

  // ==========================================
  // Load Scopes
  // ==========================================

  const fetchScopes = async () => {
    try {
      const result = await getScopes();

      console.log("Scopes:", result);

      if (result.success) {
        setScopes(result.data || []);
      } else {
        setError("ไม่สามารถโหลดข้อมูล Scope ได้");
      }
    } catch (err) {
      console.error("Load scopes error:", err);

      setError("ไม่สามารถโหลดข้อมูล Scope ได้");
    }
  };

  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    fetchActivities();
    fetchMaterials();
    fetchScopes();
  }, []);

  // ==========================================
  // Selected Scope
  // ==========================================

  const selectedScope = scopes.find(
    (scope) =>
      String(scope.id) === String(selectedScopeId)
  );
  

  // ==========================================
  // Selected Material
  // ==========================================

  const selectedMaterial = materials.find(
    (material) =>
      String(material.id) ===
      String(formData.material_id)
  );

  // ==========================================
  // Selected Activity Type
  // ==========================================

  const selectedActivityType = activityTypes.find(
    (activityType) =>
      String(activityType.id) ===
      String(selectedActivityTypeId)
  );

  // ==========================================
  // Calculate Carbon Preview
  // ==========================================

  const quantity =
    Number(formData.quantity) || 0;

  const emissionFactor =
    Number(selectedMaterial?.emission_factor) || 0;

  const carbon =
    quantity * emissionFactor;

  // ==========================================
  // Scope Change
  // ==========================================

  const handleScopeChange = (e) => {
    const scopeId = e.target.value;

    setSelectedScopeId(scopeId);

    // Reset Category
    setSelectedCategoryId("");

    // Reset Activity Type
    setSelectedActivityTypeId("");
    setActivityTypes([]);

    setError("");
  };

  // ==========================================
  // Category Change
  // ==========================================

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;

    setSelectedCategoryId(categoryId);

    // Reset Activity Type
    setSelectedActivityTypeId("");
    setActivityTypes([]);

    setError("");

    if (!categoryId) {
      return;
    }

    try {
      const result =
        await getActivityTypesByCategory(categoryId);

      console.log(
        "Activity Types:",
        result
      );

      if (result.success) {
        setActivityTypes(
          result.data || []
        );
      } else {
        setError(
          "ไม่สามารถโหลด Activity Type ได้"
        );
      }
    } catch (err) {
      console.error(
        "Load activity types error:",
        err
      );

      setError(
        "ไม่สามารถโหลด Activity Type ได้"
      );
    }
  };

  // ==========================================
  // Activity Type Change
  // ==========================================

  const handleActivityTypeChange = (e) => {
    setSelectedActivityTypeId(
      e.target.value
    );

    setError("");
  };

  // ==========================================
  // Open Modal
  // ==========================================

  const handleOpenModal = () => {
    setFormData({
      material_id: "",
      quantity: "",
    });

    setSelectedScopeId("");
    setSelectedCategoryId("");
    setSelectedActivityTypeId("");

    setActivityTypes([]);

    setError("");

    setShowModal(true);
  };

  // ==========================================
  // Close Modal
  // ==========================================

  const handleCloseModal = () => {
    if (!saving) {
      setShowModal(false);
      setError("");
    }
  };

  // ==========================================
  // Form Change
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ==========================================
  // Save Activity
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------------------------------
    // Validation
    // -------------------------------

    if (!selectedScopeId) {
      setError("กรุณาเลือก Scope");
      return;
    }

    if (!selectedCategoryId) {
      setError("กรุณาเลือก Category");
      return;
    }

    if (!selectedActivityTypeId) {
      setError("กรุณาเลือก Activity Type");
      return;
    }

    if (!formData.material_id) {
      setError("กรุณาเลือก Material");
      return;
    }

    if (
      !formData.quantity ||
      Number(formData.quantity) <= 0
    ) {
      setError(
        "กรุณาระบุ Quantity ให้ถูกต้อง"
      );
      return;
    }

    if (!selectedMaterial) {
      setError("ไม่พบข้อมูล Material");
      return;
    }

    // -------------------------------
    // Create Activity
    // -------------------------------

    try {
      setSaving(true);
      setError("");

      const activityData = {
        user_id: 1,

        scope_id:
          Number(selectedScopeId),

        category_id:
          Number(selectedCategoryId),

        activity_type_id:
          Number(selectedActivityTypeId),

        material_id:
          Number(formData.material_id),

        activity_date:
          new Date()
            .toISOString()
            .split("T")[0],

        quantity:
          Number(formData.quantity),

        unit:
          selectedMaterial.default_unit,

        data_source: "OTHER",

        status: "DRAFT",
      };

      console.log(
        "Creating activity:",
        activityData
      );

      const result =
        await createActivity(
          activityData
        );

      console.log(
        "Create activity result:",
        result
      );

      if (result.success) {
        // Close Modal
        setShowModal(false);

        // Reset Form
        setFormData({
          material_id: "",
          quantity: "",
        });

        setSelectedScopeId("");
        setSelectedCategoryId("");
        setSelectedActivityTypeId("");

        setActivityTypes([]);

        // Reload Activities
        await fetchActivities();
      } else {
        setError(
          result.message ||
            "ไม่สามารถเพิ่ม Activity ได้"
        );
      }
    } catch (err) {
      console.error(
        "Create activity error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "ไม่สามารถเชื่อมต่อกับ Backend ได้"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}

      <div className="ml-64">

        <Header />

        <main className="p-8">

          {/* ==================================
              Page Header
          ================================== */}

          <div className="mb-8 flex items-center justify-between">

            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Activities
              </h1>

              <p className="mt-2 text-slate-500">
                รายการกิจกรรมที่ใช้ในการคำนวณ Carbon Footprint
              </p>
            </div>

            <button
              onClick={handleOpenModal}
              className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700"
            >
              + Add Activity
            </button>

          </div>

          {/* ==================================
              Error
          ================================== */}

          {error && !showModal && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {/* ==================================
              Loading
          ================================== */}

          {loading ? (

            <div className="rounded-xl bg-white p-10 text-center shadow-sm">

              <p className="text-slate-500">
                กำลังโหลดข้อมูล Activity...
              </p>

            </div>

          ) : (

            /* ==================================
               Activities Table
            ================================== */

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Material
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Scope
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Category
                      </th>

                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                        Quantity
                      </th>

                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                        Carbon
                      </th>

                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                        Status
                      </th>

                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {activities.length > 0 ? (

                      activities.map(
                        (activity) => {

                          const totalCarbon =
                            activity.calculations?.reduce(
                              (
                                total,
                                calculation
                              ) =>
                                total +
                                Number(
                                  calculation.total_co2e ||
                                    0
                                ),
                              0
                            ) || 0;

                          return (

                            <tr
                              key={activity.id}
                              className="hover:bg-slate-50"
                            >

                              {/* Material */}

                              <td className="px-6 py-4">

                                <div>

                                  <p className="font-medium text-slate-800">
                                    {activity.material?.name ||
                                      `Material #${activity.material_id}`}
                                  </p>

                                  <p className="text-xs text-slate-400">
                                    {activity.material?.code ||
                                      "-"}
                                  </p>

                                </div>

                              </td>

                              {/* Scope */}

                              <td className="px-6 py-4">

                                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600">
                                  {activity.scope?.code ||
                                    `Scope ${activity.scope_id}`}
                                </span>

                              </td>

                              {/* Category */}

                              <td className="px-6 py-4">

                                <div>

                                  <p className="text-sm font-medium text-slate-700">
                                    {activity.category?.name ||
                                      `Category ${activity.category_id}`}
                                  </p>

                                  <p className="text-xs text-slate-400">
                                    {activity.category?.code ||
                                      "-"}
                                  </p>

                                </div>

                              </td>

                              {/* Quantity */}

                              <td className="px-6 py-4 text-right">

                                <span className="font-medium text-slate-700">
                                  {Number(
                                    activity.quantity
                                  ).toLocaleString()}
                                </span>

                                <span className="ml-1 text-sm text-slate-400">
                                  {activity.unit}
                                </span>

                              </td>

                              {/* Carbon */}

                              <td className="px-6 py-4 text-right">

                                <p className="font-bold text-green-600">
                                  {totalCarbon.toFixed(
                                    2
                                  )}
                                </p>

                                <p className="text-xs text-slate-400">
                                  kgCO₂e
                                </p>

                              </td>

                              {/* Status */}

                              <td className="px-6 py-4 text-center">

                                <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                                  {activity.status}
                                </span>

                              </td>

                              {/* Action */}

                              <td className="px-6 py-4 text-center">

                                <div className="flex justify-center gap-2">

                                  <button
                                    className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-600 transition hover:bg-blue-100"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 transition hover:bg-red-100"
                                  >
                                    Delete
                                  </button>

                                </div>

                              </td>

                            </tr>

                          );
                        }
                      )

                    ) : (

                      <tr>

                        <td
                          colSpan="7"
                          className="px-6 py-10 text-center text-slate-400"
                        >
                          ยังไม่มีข้อมูล Activity
                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </main>

      </div>

      {/* ==========================================
          Add Activity Modal
      ========================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  Add Activity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  เพิ่มกิจกรรมสำหรับคำนวณ Carbon Footprint
                </p>

              </div>

              <button
                onClick={handleCloseModal}
                disabled={saving}
                className="text-2xl text-slate-400 hover:text-slate-600 disabled:opacity-50"
              >
                ×
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* ==================================
                  Modal Error
              ================================== */}

              {error && (

                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>

              )}

              {/* ==================================
                  Scope
              ================================== */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Scope
                </label>

                <select
                  value={selectedScopeId}
                  onChange={handleScopeChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >

                  <option value="">
                    -- เลือก Scope --
                  </option>

                  {scopes.map(
                    (scope) => (

                      <option
                        key={scope.id}
                        value={scope.id}
                      >
                        {scope.code} - {scope.name}
                      </option>

                    )
                  )}

                </select>

              </div>

              {/* ==================================
                  Category
              ================================== */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  value={selectedCategoryId}
                  onChange={handleCategoryChange}
                  disabled={!selectedScope}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100 disabled:text-slate-400"
                >

                  <option value="">
                    {!selectedScope
                      ? "-- เลือก Scope ก่อน --"
                      : "-- เลือก Category --"}
                  </option>

                  {selectedScope?.categories?.map(
                    (category) => (

                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.code} - {category.name}
                      </option>

                    )
                  )}

                </select>

              </div>

              {/* ==================================
                  Activity Type
              ================================== */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Activity Type
                </label>

                <select
                  value={selectedActivityTypeId}
                  onChange={
                    handleActivityTypeChange
                  }
                  disabled={!selectedCategoryId}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100 disabled:text-slate-400"
                >

                  <option value="">
                    {!selectedCategoryId
                      ? "-- เลือก Category ก่อน --"
                      : activityTypes.length === 0
                      ? "-- ไม่พบ Activity Type --"
                      : "-- เลือก Activity Type --"}
                  </option>

                  {activityTypes.map(
                    (activityType) => (

                      <option
                        key={activityType.id}
                        value={activityType.id}
                      >
                        {activityType.code
                          ? `${activityType.code} - ${activityType.name}`
                          : activityType.name}
                      </option>

                    )
                  )}

                </select>

              </div>

              {/* ==================================
                  Selected Activity Information
              ================================== */}

              {selectedActivityType && (

                <div className="rounded-lg bg-blue-50 p-4">

                  <p className="text-xs text-blue-500">
                    Selected Activity Type
                  </p>

                  <p className="mt-1 font-medium text-blue-700">
                    {selectedActivityType.name}
                  </p>

                  {selectedActivityType.description && (

                    <p className="mt-1 text-xs text-blue-600">
                      {selectedActivityType.description}
                    </p>

                  )}

                </div>

              )}

              {/* ==================================
                  Material
              ================================== */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Material
                </label>

            <select
                name="material_id"
                value={formData.material_id}
                onChange={handleChange}
                disabled={
                    !selectedScopeId ||
                    !selectedCategoryId ||
                    !selectedActivityTypeId
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none
                    focus:border-green-500 focus:ring-2 focus:ring-green-100
                    disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                >
                <option value="">
                    {!selectedScopeId ||
                    !selectedCategoryId ||
                    !selectedActivityTypeId
                    ? "-- กรุณาเลือก Scope, Category และ Activity Type ก่อน --"
                    : "-- เลือก Material --"}
                </option>

                {materials.map((material) => (
                    <option
                    key={material.id}
                    value={material.id}
                    >
                    {material.name} ({material.code})
                    </option>
                ))}
            </select>

              </div>

              {/* ==================================
                  Material Information
              ================================== */}

              {selectedMaterial && (

                <div className="rounded-lg bg-slate-50 p-4">

                  <div className="grid grid-cols-2 gap-4">

                    {/* Unit */}

                    <div>

                      <p className="text-xs text-slate-400">
                        Unit
                      </p>

                      <p className="font-medium text-slate-700">
                        {selectedMaterial.default_unit}
                      </p>

                    </div>

                    {/* Emission Factor */}

                    <div>

                      <p className="text-xs text-slate-400">
                        Emission Factor
                      </p>

                      <p className="font-medium text-green-600">
                        {emissionFactor}{" "}
                        kgCO₂e/
                        {selectedMaterial.default_unit}
                      </p>

                    </div>

                  </div>

                </div>

              )}

              {/* ==================================
                  Quantity
              ================================== */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Quantity
                </label>

                <div className="flex">

                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="เช่น 150"
                    className="w-full rounded-l-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />

                  <div className="flex items-center rounded-r-lg border border-l-0 border-slate-300 bg-slate-50 px-4 text-slate-500">
                    {selectedMaterial?.default_unit ||
                      "unit"}
                  </div>

                </div>

              </div>

              {/* ==================================
                  Carbon Preview
              ================================== */}

              {selectedMaterial &&
                formData.quantity &&
                Number(formData.quantity) > 0 && (

                  <div className="rounded-xl bg-green-50 p-5">

                    <p className="text-sm text-green-700">
                      Estimated Carbon Footprint
                    </p>

                    <p className="mt-1 text-3xl font-bold text-green-600">
                      {carbon.toFixed(2)}
                    </p>

                    <p className="text-sm text-green-600">
                      kgCO₂e
                    </p>

                    <p className="mt-2 text-xs text-green-700">
                      {quantity} ×{" "}
                      {emissionFactor}
                    </p>

                  </div>

                )}

              {/* ==================================
                  Buttons
              ================================== */}

              <div className="flex justify-end gap-3 border-t pt-5">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Activity"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Activities;