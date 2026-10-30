// backend/createManager.js
const bcrypt = require("bcrypt");
const { User, Role } = require("./models"); 
const { Op } = require("sequelize");

const createManagerAccount = async () => {
  try {
    const managerEmail = "manager@hotel.com";
    const rawPassword = "Manager1234";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 1. ค้นหา role_id ของ MANAGER จากตาราง Role
    let roleId = 3; // ค่าเริ่มต้นสำรอง (MANAGER)
    if (Role) {
      const managerRole = await Role.findOne({
        where: {
          name: {
            [Op.like]: "%MANAGER%"
          }
        }
      });
      if (managerRole) {
        roleId = managerRole.id;
      }
    }

    // 2. ค้นหาหรือสร้าง User
    const [user, created] = await User.findOrCreate({
      where: { email: managerEmail },
      defaults: {
        username: "manager",
        email: managerEmail,
        password_hash: hashedPassword,
        first_name: "Hotel",
        last_name: "Manager",
        role_id: roleId,
        status: "ACTIVE"
      }
    });

    if (created) {
      console.log("\n==========================================");
      console.log("🎉 สร้างบัญชี Manager ใหม่สำเร็จแล้ว!");
      console.log(`Username : manager`);
      console.log(`Email    : ${managerEmail}`);
      console.log(`Password : ${rawPassword}`);
      console.log(`Role ID  : ${roleId}`);
      console.log("==========================================\n");
    } else {
      await user.update({
        password_hash: hashedPassword,
        role_id: roleId
      });
      console.log(`\nบัญชี ${managerEmail} มีอยู่แล้ว -> อัปเดตรหัสผ่านและ role_id เรียบร้อยแล้ว!`);
    }

  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการสร้างบัญชี:", error.message);
  } finally {
    process.exit();
  }
};

createManagerAccount();