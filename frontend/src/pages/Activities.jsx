import { useEffect, useState } from "react";

import {
  getActivities,
  getMaterials,
  createActivity,
  getScopes,
  getActivityTypes,
} from "../services/api";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";


function Activities() {
  const [activities, setActivities] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [scopes, setScopes] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [activityName, setActivityName] = useState("");
  const [description, setDescription] = useState("");

  const [items, setItems] = useState([
    {
      activity_type_id: "",
      material_id: "",
      quantity: "",
    },
  ]);

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

  const fetchMaterials = async () => {
    try {
      const result = await getMaterials();
      if (result.success) setMaterials(result.data || []);
    } catch (err) {
      console.error("Load materials error:", err);
    }
  };

  const fetchScopes = async () => {
    try {
      const result = await getScopes();
      if (result.success) setScopes(result.data || []);
    } catch (err) {
      console.error("Load scopes error:", err);
    }
  };

  const fetchActivityTypes = async () => {
    try {
      const result = await getActivityTypes();
      if (result.success) setActivityTypes(result.data || []);
    } catch (err) {
      console.error("Load activity types error:", err);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchMaterials();
    fetchScopes();
    fetchActivityTypes();
  }, []);
  
  const getItemCalculations = (item) => {
    const selectedActivityType = activityTypes.find(
      (a) => String(a.id) === String(item.activity_type_id)
    );

    const selectedScope = scopes.find((scope) =>
      scope.categories?.some(
        (cat) => String(cat.id) === String(selectedActivityType?.category_id)
      )
    );

    const availableMaterials = materials.filter(
      (m) => Number(m.category_id) === Number(selectedActivityType?.category_id)
    );

    const selectedMaterial = materials.find(
      (m) => String(m.id) === String(item.material_id)
    );

    const quantity = Number(item.quantity) || 0;
    const emissionFactor = Number(selectedMaterial?.emission_factor) || 0;
    const carbon = quantity * emissionFactor;

    return {
      selectedActivityType,
      selectedScope,
      availableMaterials,
      selectedMaterial,
      carbon,
    };
  };

  const totalCarbonFootprint = items.reduce((sum, item) => {
    const { carbon } = getItemCalculations(item);
    return sum + carbon;
  }, 0);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        activity_type_id: "",
        material_id: "",
        quantity: "",
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      if (field === "activity_type_id") {
        updated[index].material_id = "";
      }
      return updated;
    });
    setError("");
  };

  const handleOpenModal = () => {
    setActivityName("");
    setDescription("");
    setItems([
      {
        activity_type_id: "",
        material_id: "",
        quantity: "",
      },
    ]);
    setError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (!saving) {
      setShowModal(false);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!activityName.trim()) {
      setError("กรุณาระบุชื่อกิจกรรม");
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.activity_type_id) {
        setError(`กรุณาเลือก Activity Type ในรายการที่ ${i + 1}`);
        return;
      }
      if (!item.material_id) {
        setError(`กรุณาเลือก Material ในรายการที่ ${i + 1}`);
        return;
      }
      if (!item.quantity || Number(item.quantity) <= 0) {
        setError(`กรุณาระบุ Quantity ในรายการที่ ${i + 1} ให้ถูกต้อง`);
        return;
      }
    }

    try {
      setSaving(true);
      setError("");

      const detailsPayload = items.map((item) => {
        const { selectedActivityType, selectedScope, selectedMaterial, carbon } =
          getItemCalculations(item);

        return {
          activity_type_id: Number(item.activity_type_id),
          category_id: Number(selectedActivityType?.category_id),
          scope_id: Number(selectedScope?.id),
          material_id: Number(item.material_id),
          quantity: Number(item.quantity),
          unit: selectedMaterial?.default_unit || "",
          carbon_footprint: carbon,
        };
      });

      const activityData = {
        name: activityName.trim(),
        description: description.trim(),
        activity_date: new Date().toISOString().split("T")[0],
        data_source: "OTHER",
        details: detailsPayload,

        scope_id: detailsPayload[0]?.scope_id,
        category_id: detailsPayload[0]?.category_id,
        activity_type_id: detailsPayload[0]?.activity_type_id,
        material_id: detailsPayload[0]?.material_id,
        quantity: detailsPayload[0]?.quantity,
        unit: detailsPayload[0]?.unit,
      };

      const result = await createActivity(activityData);

      if (result.success) {
        setShowModal(false);
        await fetchActivities();
      } else {
        setError(result.message || "ไม่สามารถเพิ่ม Activity ได้");
      }
    } catch (err) {
      console.error("Create activity error:", err);
      setError(
        err.response?.data?.message || "ไม่สามารถเชื่อมต่อกับ Backend ได้"
      );
    } finally {
      setSaving(false);
    }
  };

  const getScopeStyle = (scopeCode) => {
    switch (scopeCode) {
      case "SCOPE_1":
        return {
          badge: "bg-sky-50 text-sky-700 border-sky-300",
          dot: "bg-sky-500",
        };
      case "SCOPE_2":
        return {
          badge: "bg-green-50 text-green-700 border-green-300",
          dot: "bg-green-500",
        };
      case "SCOPE_3":
        return {
          badge: "bg-orange-50 text-orange-700 border-orange-300",
          dot: "bg-orange-500",
        };
      default:
        return {
          badge: "bg-slate-50 text-slate-700 border-slate-300",
          dot: "bg-slate-400",
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64">
        <Header />

        <main className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Activities</h1>
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

          {error && !showModal && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <p className="text-slate-500">กำลังโหลดข้อมูล Activity...</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        ชื่อกิจกรรม
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        วัตถุดิบ
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        สโคป
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        ประเภทกิจกรรม
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                        จำนวน
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                        ปริมาณคาร๋บอน
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                        สถานะ
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                       
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {activities.length > 0 ? (
                      activities.map((activity) => {
                        const totalCarbon =
                          activity.calculations?.reduce(
                            (total, calculation) =>
                              total + Number(calculation.total_co2e || 0),
                            0
                          ) || 0;

                        const details =
                          activity.details || activity.activity_details || [];

                        return (
                          <tr key={activity.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 align-top">
                              <div>
                                <p className="font-semibold text-slate-800">
                                  {activity.name || `Activity #${activity.id}`}
                                </p>
                                {activity.description && (
                                  <p className="mt-0.5 text-xs text-slate-400">
                                    {activity.description}
                                  </p>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-4 align-top">
                              {details.length > 0 ? (
                                <div className="space-y-1.5">
                                  {details.map((det, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-1.5"
                                    >
                                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium text-slate-700">
                                          {det.material?.name ||
                                            `Material #${det.material_id}`}
                                        </p>
                                        {det.material?.code && (
                                          <p className="text-[10px] text-slate-400">
                                            {det.material.code}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div>
                                  <p className="text-sm font-medium text-slate-700">
                                    {activity.material?.name ||
                                      `Material #${activity.material_id}`}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {activity.material?.code || "-"}
                                  </p>
                                </div>
                              )}
                            </td>

                            <td className="px-6 py-4 align-top">
                              {(() => {
                                const scopeCode =
                                  activity.scope?.code ||
                                  (details[0]?.scope_id
                                    ? `SCOPE_${details[0].scope_id}`
                                    : null);
                                const scopeStyle = getScopeStyle(scopeCode);

                                return (
                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${scopeStyle.badge}`}
                                  >
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${scopeStyle.dot}`}
                                    />
                                    {scopeCode || `Scope ${activity.scope_id}`}
                                  </span>
                                );
                              })()}
                            </td>

                            <td className="px-6 py-4 align-top">
                              <div>
                                <p className="text-sm font-medium text-slate-700">
                                  {activity.category?.name ||
                                    `Category ${activity.category_id}`}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {activity.category?.code || "-"}
                                </p>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-right align-top">
                              {details.length > 0 ? (
                                <div className="space-y-1.5">
                                  {details.map((det, idx) => (
                                    <div key={idx}>
                                      <span className="font-medium text-slate-700 text-sm">
                                        {Number(
                                          det.quantity || 0
                                        ).toLocaleString()}
                                      </span>
                                      <span className="ml-1 text-xs text-slate-400">
                                        {det.unit || det.material?.default_unit}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div>
                                  <span className="font-medium text-slate-700 text-sm">
                                    {Number(
                                      activity.quantity || 0
                                    ).toLocaleString()}
                                  </span>
                                  <span className="ml-1 text-xs text-slate-400">
                                    {activity.unit}
                                  </span>
                                </div>
                              )}
                            </td>

                            <td className="px-6 py-4 text-right align-top">
                              <p className="font-bold text-green-600">
                                {totalCarbon.toFixed(2)}
                              </p>
                              <p className="text-xs text-slate-400">kgCO₂e</p>
                            </td>

                            <td className="px-6 py-4 text-center align-top">
                              <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                                {activity.status || "PENDING"}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-center align-top">
                              <div className="flex justify-center gap-2">
                                <button className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100">
                                  Edit
                                </button>
                                <button className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100">
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Add Activity
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  เพิ่มกิจกรรมสำหรับคำนวณ Carbon Footprint (รองรับหลายรายการย่อย)
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

            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    ชื่อกิจกรรมหลัก <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={activityName}
                    onChange={(e) => {
                      setActivityName(e.target.value);
                      setError("");
                    }}
                    placeholder="เช่น กิจกรรมประจำเดือนกันยายน 2569"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    รายละเอียดเพิ่มเติม (ถ้ามี)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="เช่น การใช้พลังงานและเชื้อเพลิงในครัว A"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>

              <hr className="border-slate-200" />

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800">
                    รายการกิจกรรมย่อย ({items.length} รายการ)
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    เพิ่มรายการย่อย
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item, index) => {
                    const {
                      selectedScope,
                      availableMaterials,
                      selectedMaterial,
                      carbon,
                    } = getItemCalculations(item);

                    const scopeStyle = selectedScope
                      ? getScopeStyle(selectedScope.code)
                      : null;

                    return (
                      <div
                        key={index}
                        className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-5 shadow-sm"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-600">
                            รายการที่ #{index + 1}
                          </span>
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                            >
                              <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              ลบรายการ
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          {/* 1. Activity Type + Scope Badge ฉบับปรับปรุง */}
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                              Activity Type
                            </label>
                            <select
                              value={item.activity_type_id}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "activity_type_id",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
                            >
                              <option value="">-- เลือก Activity Type --</option>
                              {activityTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.name}
                                </option>
                              ))}
                            </select>

                            {/* Badge แสดง Scope ขนาดใหญ่ขึ้น และระบุชื่อ Scope */}
                            {selectedScope && (
                              <div className="mt-2">
                                <span
                                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-xs ${scopeStyle?.badge}`}
                                >
                                  <span
                                    className={`h-2 w-2 rounded-full ${scopeStyle?.dot}`}
                                  />
                                  <span>
                                    {selectedScope.code ||
                                      `SCOPE_${selectedScope.id}`}
                                    {selectedScope.name
                                      ? ` : ${selectedScope.name}`
                                      : ""}
                                  </span>
                                </span>
                              </div>
                            )}
                          </div>

                          {/* 2. Material */}
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                              วัตถุดิบ (Material)
                            </label>
                            <select
                              value={item.material_id}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "material_id",
                                  e.target.value
                                )
                              }
                              disabled={!item.activity_type_id}
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-500 disabled:bg-slate-100"
                            >
                              <option value="">
                                {!item.activity_type_id
                                  ? "-- เลือก Activity Type ก่อน --"
                                  : availableMaterials.length === 0
                                  ? "-- ไม่พบ Material --"
                                  : "-- เลือก Material --"}
                              </option>
                              {availableMaterials.map((mat) => (
                                <option key={mat.id} value={mat.id}>
                                  {mat.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* 3. Quantity & Carbon */}
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                              Quantity & Carbon
                            </label>
                            <div className="flex gap-2">
                              <div className="flex flex-1">
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                  className="w-full rounded-l-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
                                />
                                <span className="flex items-center rounded-r-lg border border-l-0 border-slate-300 bg-slate-100 px-2 text-xs text-slate-500">
                                  {selectedMaterial?.default_unit || "unit"}
                                </span>
                              </div>

                              <div className="flex min-w-[90px] flex-col items-end justify-center rounded-lg bg-green-50 px-2 text-right">
                                <span className="text-xs font-bold text-green-700">
                                  {carbon.toFixed(2)}
                                </span>
                                <span className="text-[9px] text-green-600">
                                  kgCO₂e
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-green-200 bg-green-50/60 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  รวม Carbon Footprint ทั้งหมดของกิจกรรมนี้
                </p>
                <p className="mt-1 text-3xl font-extrabold text-green-600">
                  {totalCarbonFootprint.toFixed(2)}{" "}
                  <span className="text-sm font-normal text-slate-500">
                    kgCO₂e
                  </span>
                </p>
              </div>

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
                  {saving ? "Saving..." : "Save Activity"}
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