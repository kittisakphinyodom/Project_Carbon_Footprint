// backend/createAdmin.js
const bcrypt = require("bcrypt");
const { User, Role } = require("./models"); 
const { Op } = require("sequelize");

const createAdminAccount = async () => {
  try {
    const adminEmail = "admin@hotel.com";
    const rawPassword = "Admin1234!";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 1. ค้นหา role_id ของ ADMIN จากคอลัมน์ name ในตาราง Role
    let roleId = 1; // ค่าเริ่มต้นสำรอง
    if (Role) {
      const adminRole = await Role.findOne({
        where: {
          name: {
            [Op.like]: "%ADMIN%"
          }
        }
      });
      if (adminRole) {
        roleId = adminRole.id;
      }
    }

    // 2. ค้นหาหรือสร้าง User
    const [user, created] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        username: "admin",
        email: adminEmail,
        password_hash: hashedPassword,
        first_name: "System",
        last_name: "Admin",
        role_id: roleId,
        status: "ACTIVE"
      }
    });

    if (created) {
      console.log("\n==========================================");
      console.log("🎉 สร้างบัญชี Admin ใหม่สำเร็จแล้ว!");
      console.log(`Username : admin`);
      console.log(`Email    : ${adminEmail}`);
      console.log(`Password : ${rawPassword}`);
      console.log(`Role ID  : ${roleId}`);
      console.log("==========================================\n");
    } else {
      await user.update({
        password_hash: hashedPassword,
        role_id: roleId
      });
      console.log(`\nบัญชี ${adminEmail} มีอยู่แล้ว -> อัปเดตรหัสผ่านและ role_id เรียบร้อยแล้ว!`);
    }

  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการสร้างบัญชี:", error.message);
  } finally {
    process.exit();
  }
};

createAdminAccount();