// import React, { useState } from "react";

// const AddActivityModal = ({ activityTypes = [], materials = [], onClose, onSave }) => {
//   // 1. สร้าง State สำหรับเก็บค่าที่ผู้ใช้เลือก
//   const [selectedActivityTypeId, setSelectedActivityTypeId] = useState("");
//   const [selectedMaterialId, setSelectedMaterialId] = useState("");
//   const [quantity, setQuantity] = useState("");

//   // 2. ฟังก์ชัน Filter กรอง Material ที่มี activity_type_id ตรงกับ Activity Type ที่เลือก
//   const availableMaterials = materials.filter(
//     (item) => Number(item.activity_type_id) === Number(selectedActivityTypeId)
//   );

//   // 3. ฟังก์ชันจัดการเมื่อผู้ใช้เปลี่ยน Activity Type
//   const handleActivityTypeChange = (e) => {
//     const typeId = e.target.value;
//     setSelectedActivityTypeId(typeId);
//     setSelectedMaterialId(""); // รีเซ็ตค่า Material ที่เคยเลือกไว้ทันที
//   };

//   // 4. หายูนิตตั้งต้นของ Material ที่ถูกเลือกมาแสดงผลอัตโนมัติ
//   const currentMaterial = availableMaterials.find(
//     (m) => Number(m.id) === Number(selectedMaterialId)
//   );

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave({
//       activity_type_id: selectedActivityTypeId,
//       material_id: selectedMaterialId,
//       quantity,
//     });
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>Add Activity</h2>
//         <form onSubmit={handleSubmit}>
          
//           {/* --- ช่องที่ 1: เลือก Activity Type --- */}
//           <div className="form-group">
//             <label>1. Activity Type</label>
//             <select
//               value={selectedActivityTypeId}
//               onChange={handleActivityTypeChange}
//               required
//             >
//               <option value="">-- เลือกประเภทกิจกรรม --</option>
//               {activityTypes.map((type) => (
//                 <option key={type.id} value={type.id}>
//                   {type.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* --- ช่องที่ 2: เลือก Material / Fuel (จะแสดงเฉพาะที่สัมพันธ์กับ ช่องที่ 1) --- */}
//           <div className="form-group">
//             <label>2. Material / Fuel</label>
//             <select
//               value={selectedMaterialId}
//               onChange={(e) => setSelectedMaterialId(e.target.value)}
//               disabled={!selectedActivityTypeId} // ปิดไว้จนกว่าจะเลือก Activity Type
//               required
//             >
//               <option value="">
//                 {!selectedActivityTypeId
//                   ? "-- กรุณาเลือก Activity Type ก่อน --"
//                   : availableMaterials.length === 0
//                   ? "-- ไม่พบรายการ Material ในประเภทนี้ --"
//                   : "-- เลือกเชื้อเพลิง / วัสดุ --"}
//               </option>
//               {availableMaterials.map((mat) => (
//                 <option key={mat.id} value={mat.id}>
//                   {mat.name} ({mat.default_unit})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* --- ช่องที่ 3: กรอกจำนวน --- */}
//           <div className="form-group">
//             <label>3. Quantity</label>
//             <div className="input-with-unit">
//               <input
//                 type="number"
//                 value={quantity}
//                 onChange={(e) => setQuantity(e.target.value)}
//                 placeholder="0.00"
//                 disabled={!selectedMaterialId}
//                 required
//               />
//               <span>{currentMaterial?.default_unit || "Unit"}</span>
//             </div>
//           </div>

//           <div className="modal-actions">
//             <button type="button" onClick={onClose}>Cancel</button>
//             <button type="submit" disabled={!selectedMaterialId || !quantity}>
//               Save Activity
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddActivityModal;