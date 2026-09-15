import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher'; // 👈 นำเข้า LanguageSwitcher

const Header = ({ user, onLogout }) => {
  const { t } = useTranslation();

  return (
    <header className="flex justify-between items-center px-8 py-3 bg-white border-b border-gray-100 shadow-sm">
      {/* ฝั่งซ้าย: ข้อความ Overview */}
      <div>
        <span className="text-sm text-gray-500 font-normal">
          Hotel Carbon Footprint Overview
        </span>
      </div>

      {/* ฝั่งขวา: กล่องแสดง Profile + ปุ่ม Logout */}
      <div className="flex items-center space-x-4">
        
        {/* กล่องจัดข้อความชิดขวาแบบแนวตั้ง (flex-col) */}
        <div className="flex flex-col items-end">
          {/* 1. Email */}
          <span className="text-sm font-semibold text-gray-700">
            {user?.email || 'kittisak@gmail.com'}
          </span>

          {/* 2. Role: STAFF */}
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            {user?.role || 'STAFF'}
          </span>

          {/* 3. 👈 ปุ่มเปลี่ยนภาษา (อยู่ใต้ STAFF) */}
          {/* <LanguageSwitcher /> */}
        </div>

        {/* ปุ่ม Logout */}
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
        >
          Logout
        </button>

      </div>
    </header>
  );
};

export default Header;