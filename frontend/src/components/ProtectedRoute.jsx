import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // 1. ถ้าไม่มี Token ให้กลับไปหน้า Login
  if (!token || !storedUser) {
    return <Navigate to="/" replace />;
  }

  let user = null;
  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    return <Navigate to="/" replace />;
  }

  // 2. ดึงค่า Role และจัดการกรณีที่ไม่มีฟิลด์ role ใน Database
  let userRole = "";
  if (user && user.role) {
    userRole = typeof user.role === "object" ? user.role.name : user.role;
  }
  
  // **จุดสำคัญ**: ถ้ายังไม่ได้ทำระบบ Role ใน Backend เราจะให้สิทธิ์พื้นฐานเป็น "USER" ก่อน เพื่อให้หน้าเว็บไม่พัง
  userRole = userRole ? userRole.toUpperCase() : "USER"; 

  // 3. เช็คสิทธิ์
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.warn(`Access Denied: Required one of ${allowedRoles}, but got ${userRole}`);
    // เปลี่ยนจากเด้งไป /dashboard เป็นเด้งไปหน้า Login (หรือสร้างหน้า /unauthorized แยก) จะปลอดภัยกว่า
    return <Navigate to="/" replace />; 
  }

  // 4. เรนเดอร์หน้าเพจ
  return children ? children : <Outlet />;
};

export default ProtectedRoute;