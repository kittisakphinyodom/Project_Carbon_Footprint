import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  th: {
    translation: {
      // Sidebar
      menu: "เมนูหลัก",
      dashboard: "แดชบอร์ด",
      activities: "กิจกรรม (Activities)",
      scope3_materials: "Scope3 : รายชื่อวัตถุดิบ",

      // Header
      overview_subtitle: "ภาพรวม Hotel Carbon Footprint Overview",
      logout: "ออกจากระบบ",

      // หน้า Activities Page
      activities_title: "กิจกรรม (Activities)",
      activities_subtitle: "รายการกิจกรรมที่ใช้ในการคำนวณ Carbon Footprint",
      add_activity_btn: "+ เพิ่มกิจกรรม",

      // หัวตาราง Activities
      col_activity_name: "ชื่อกิจกรรม",
      col_material: "วัตถุดิบ (Material)",
      col_scope: "ขอบเขต (Scope)",
      col_category: "หมวดหมู่ (Category)",
      col_quantity: "ปริมาณ (Quantity)",
      col_carbon: "คาร์บอน (Carbon)",
      col_status: "สถานะ",
      col_action: "จัดการ"
    }
  },
  en: {
    translation: {
      // Sidebar
      menu: "MENU",
      dashboard: "Dashboard",
      activities: "Activities",
      scope3_materials: "Scope3 : Materials List",

      // Header
      overview_subtitle: "Hotel Carbon Footprint Overview",
      logout: "Logout",

      // Activities Page
      activities_title: "Activities",
      activities_subtitle: "Activity list used for Carbon Footprint calculation",
      add_activity_btn: "+ Add Activity",

      // Table Headers
      col_activity_name: "Activity Name",
      col_material: "Material",
      col_scope: "Scope",
      col_category: "Category",
      col_quantity: "Quantity",
      col_carbon: "Carbon",
      col_status: "Status",
      col_action: "Action"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "th",
    fallbackLng: "th",
    interpolation: { escapeValue: false }
  });

export default i18n;