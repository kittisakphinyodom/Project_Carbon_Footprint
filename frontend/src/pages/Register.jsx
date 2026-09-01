import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const {
            first_name,
            last_name,
            username,
            email,
            password,
            confirmPassword,
        } = formData;

        // ตรวจสอบข้อมูล
        if (
            !first_name ||
            !last_name ||
            !username ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            setError("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        // ตรวจสอบ Password
        if (password !== confirmPassword) {
            setError("Password และ Confirm Password ไม่ตรงกัน");
            return;
        }

        setLoading(true);

        try {
            await register({
                first_name,
                last_name,
                username,
                email,
                password,
            });

            setSuccess("สมัครสมาชิกสำเร็จ กำลังไปหน้า Login...");

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "สมัครสมาชิกไม่สำเร็จ"
            );
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 py-10">

            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-6">

                    <h1 className="text-3xl font-bold text-green-700">
                        สมัครสมาชิก
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Hotel Carbon Footprint
                    </p>

                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
                        {success}
                    </div>
                )}

                <form
                    onSubmit={handleRegister}
                    className="space-y-4"
                >

                    {/* First Name */}
                    <div>
                        <label className="block mb-2 font-medium">
                            First Name
                        </label>

                        <input
                            type="text"
                            name="first_name"
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="กรอกชื่อ"
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block mb-2 font-medium">
                            Last Name
                        </label>

                        <input
                            type="text"
                            name="last_name"
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="กรอกนามสกุล"
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block mb-2 font-medium">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="กรอก Username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="กรอก Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="กรอกรหัสผ่าน"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block mb-2 font-medium">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="กรอกรหัสผ่านอีกครั้ง"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded-lg transition disabled:opacity-50"
                    >
                        {loading
                            ? "กำลังสมัครสมาชิก..."
                            : "สมัครสมาชิก"}
                    </button>

                </form>

                {/* Login */}
                <div className="text-center mt-6">

                    <p className="text-sm text-gray-500">
                        มีบัญชีอยู่แล้ว?
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="mt-2 text-green-600 font-semibold hover:text-green-700"
                    >
                        เข้าสู่ระบบ
                    </button>

                </div>

                <div className="text-center mt-6 text-sm text-gray-500">
                    Carbon Footprint Management System
                </div>

            </div>

        </div>
    );
}