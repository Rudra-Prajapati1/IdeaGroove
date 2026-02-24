import React, { useEffect, useState } from "react";
import Input from "../../components/auth/Input";
import { Eye, EyeClosed } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [adminData, setAdminData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleData = (field, value) => {
    setAdminData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "admin") {
      // Redirect to dashboard, or the page they were trying to access
      const origin = location.state?.from?.pathname || "/admin/dashboard";
      navigate(origin, { replace: true });
    }
  }, [navigate, location]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!adminData.username || !adminData.password) {
      return toast.error("Please enter all required fields.");
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/admin/login",
        adminData,
        { withCredentials: true },
      );

      if (data.success) {
        toast.success(data.message || "Login Successful!");

        localStorage.setItem(
          "user",
          JSON.stringify({
            role: "admin",
            username: data.admin?.username || adminData.username,
            // Add token if your backend provides it for stateless requests
            token: data.token || null,
          }),
        );

        setAdminData({ username: "", password: "" });

        setTimeout(() => {
          navigate("/admin/dashboard", { replace: true });
        }, 500);
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-primary min-h-screen flex flex-col gap-4 justify-center items-center">
      <h1 className="text-4xl font-poppins text-secondary">Admin Login</h1>
      <div className="flex bg-white justify-between gap-10 p-6 rounded-2xl items-center">
        <img src="/DarkLogo.png" alt="Logo" className="w-50 h-50" />

        <form onSubmit={handleLogin} className="flex flex-col gap-10">
          <Input
            label="Username"
            placeholder="Enter username"
            value={adminData.username}
            onChange={(v) => handleData("username", v)}
          />

          <label className="text-lg font-semibold text-primary">
            Password
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={adminData.password}
                placeholder="Enter password"
                onChange={(e) => handleData("password", e.target.value)}
                className="w-full text-sm border-2 border-gray-300 rounded-xl outline-none
                 transition-colors duration-300 focus:border-primary/60 p-3"
                required
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer
                 hover:bg-primary/10 p-1 rounded-2xl"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <Eye className="w-5 h-5 text-primary" />
                ) : (
                  <EyeClosed className="w-5 h-5 text-primary" />
                )}
              </span>
            </div>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-lg
                 hover:bg-primary/80 transition-colors"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
