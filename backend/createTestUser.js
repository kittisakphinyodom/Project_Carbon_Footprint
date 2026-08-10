const bcrypt = require("bcrypt");
const { User } = require("./models");

async function createTestUser() {
    try {

        const password = "Test@1234";

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            role_id: 2,
            username: "teststaff",
            passwoแกrd_hash: passwordHash,
            first_name: "Test",
            last_name: "Staff",
            email: "teststaff@example.com",
            status: "ACTIVE"
        });

        console.log("=================================");
        console.log("Test user created successfully");
        console.log("=================================");
        console.log("ID:", user.id);
        console.log("Username:", user.username);
        console.log("Role ID:", user.role_id);
        console.log("Password:", password);
        console.log("=================================");

        process.exit(0);

    } catch (error) {

        console.error("Error creating test user:");

        console.error(error);

        process.exit(1);
    }
}

createTestUser();