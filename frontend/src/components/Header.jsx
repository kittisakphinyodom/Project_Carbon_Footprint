import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header = ({ user, onLogout }) => {
  const { t } = useTranslation();

  // 1. ดึงข้อมูล User (หากไม่ได้ส่ง prop user มา ให้ดึงจาก localStorage)
  const localUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUser = user && Object.keys(user).length > 0 ? user : localUser;

  // 2. ดึง Email / Username
  const displayEmail = currentUser?.email || currentUser?.username || currentUser?.name || 'Guest';

  // 3. แปลงค่า Role ให้รองรับทั้ง String ('ADMIN') และ Object ({ name: 'ADMIN' })
  const rawRole = currentUser?.role?.name || currentUser?.role;
  const displayRole = (typeof rawRole === 'string' && rawRole ? rawRole : 'STAFF').toUpperCase();

  // 4. ฟังก์ชั่นLogout ทำงานล้าง Session และพาไปหน้า Login
  const handleLogoutClick = () => {
    if (typeof onLogout === 'function') {
      onLogout();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="flex justify-between items-center px-8 py-3 bg-white border-b border-gray-100 shadow-sm">
      {/* ฝั่งซ้าย: ข้อความ Overview */}
      <div>
        <span className="text-sm text-gray-500 font-normal">
          {/* Hotel Carbon Footprint Overview */}
        </span>
      </div>

      {/* ฝั่งขวา: กล่องแสดง Profile + ปุ่ม Logout */}
      <div className="flex items-center space-x-4">
        
        {/* กล่องจัดข้อความชิดขวาแบบแนวตั้ง */}
        <div className="flex flex-col items-end">
          {/* 1. Email */}
          <span className="text-sm font-semibold text-gray-700">
            {displayEmail}
          </span>

          {/* 2. Role */}
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            {displayRole}
          </span>

          {/* 3. ปุ่มเปลี่ยนภาษา */}
          {/* <LanguageSwitcher /> */}
        </div>

        {/* ปุ่ม Logout */}
        <button
          onClick={handleLogoutClick}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
        >
          Logout
        </button>

      </div>
    </header>
  );
};

export default Header;