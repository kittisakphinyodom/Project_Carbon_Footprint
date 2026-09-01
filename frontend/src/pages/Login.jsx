import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, googleLogin } from "../services/api";

export default function Login() {
    const navigate = useNavigate();

    const googleButtonRef = useRef(null);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");

    // ========================================
    // Google Login
    // ========================================

    useEffect(() => {
        const initializeGoogle = () => {
            if (!window.google || !googleButtonRef.current) {
                return;
            }

            window.google.accounts.id.initialize({
                client_id:
                    "977957012034-ig18leef92sd2vqhesphlnpv3b5a4agk.apps.googleusercontent.com",

                callback: handleGoogleLogin,
            });

            window.google.accounts.id.renderButton(
                googleButtonRef.current,
                {
                    theme: "outline",
                    size: "large",
                    width: 360,
                    text: "signin_with",
                    shape: "rectangular",
                }
            );
        };

        if (window.google) {
            initializeGoogle();
        } else {
            const interval = setInterval(() => {
                if (window.google) {
                    clearInterval(interval);
                    initializeGoogle();
                }
            }, 100);

            return () => clearInterval(interval);
        }
    }, []);

    const handleGoogleLogin = async (response) => {
        try {
            setError("");
            setGoogleLoading(true);

            const result = await googleLogin(response.credential);

            const token = result.data.data.token;
            const user = result.data.data.user;

            // Save JWT
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/activities");

        } catch (err) {
            console.error("Google Login Error:", err);

            setError(
                err.response?.data?.message ||
                "เข้าสู่ระบบด้วย Google ไม่สำเร็จ"
            );
        } finally {
            setGoogleLoading(false);
        }
    };

    // ========================================
    // Username / Password Login
    // ========================================

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await login({
                username,
                password,
            });

            const token = response.data.data.token;
            const user = response.data.data.user;

            // Save JWT
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/activities");

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "เข้าสู่ระบบไม่สำเร็จ"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">

            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-6">

                    <h1 className="text-3xl font-bold text-green-700">
                        Hotel Carbon Footprint
                    </h1>

                    <p className="text-gray-500 mt-2">
                        ระบบคำนวณ Carbon Footprint โรงแรม
                    </p>

                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {/* Username / Password Login */}
                <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                >

                    {/* Username */}
                    <div>

                        <label className="block mb-2 font-medium">
                            Username
                        </label>

                        <input
                            type="text"
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="กรอก Username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                        />

                    </div>

                    {/* Password */}
                    <div>

                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="กรอกรหัสผ่าน"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold p-3 rounded-lg transition"
                    >
                        {loading
                            ? "กำลังเข้าสู่ระบบ..."
                            : "เข้าสู่ระบบ"}
                    </button>

                </form>

                {/* Divider */}
                <div className="flex items-center my-6">

                    <div className="flex-1 border-t"></div>

                    <span className="px-4 text-sm text-gray-400">
                        หรือ
                    </span>

                    <div className="flex-1 border-t"></div>

                </div>

                {/* Google Login */}
                <div className="flex justify-center">

                    <div
                        ref={googleButtonRef}
                        className="min-h-[44px]"
                    ></div>

                </div>

                {googleLoading && (
                    <p className="text-center text-sm text-gray-500 mt-3">
                        กำลังเข้าสู่ระบบด้วย Google...
                    </p>
                )}

                {/* Register */}
                <div className="text-center mt-6">

                    <p className="text-sm text-gray-500">
                        ยังไม่มีบัญชีใช่ไหม?
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="mt-2 text-green-600 font-semibold hover:text-green-700"
                    >
                        สมัครสมาชิก
                    </button>

                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-sm text-gray-500">
                    Carbon Footprint Management System
                </div>

            </div>

        </div>
    );
}