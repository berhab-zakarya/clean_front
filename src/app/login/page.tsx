"use client";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import SimpleButton from "@/components/common/SimpleButton";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  validateLoginFormWithToast,
  handleLoginErrorWithToast,
  showSuccessToast,
} from "@/utils/handle_errors";
import { useStore } from "@/hooks/useStore";
import Header from "@/components/common/Header";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const { checkStoreExistence } = useStore();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form inputs with toast notification
    if (!validateLoginFormWithToast(formData.email, formData.password)) {
      return;
    }

    try {
      // Attempt login
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      // Handle remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      // إضافة console.log للتأكد من النتيجة
      console.log('Login successful:', result);

      // Check if user has a store
      const hasStore = await checkStoreExistence();
      
      // إضافة console.log للتحقق من نتيجة فحص المتجر
      console.log('Has store:', hasStore);

      // Show success toast
      showSuccessToast("Login successful!");

      // تعديل التوجيه مع إضافة await
      if (hasStore) {
        console.log('Redirecting to dashboard');
        await router.push("/dashboard");
      } else {
        console.log('Redirecting to store setup');
        await router.push("/dashboard/StoreSetupGuide");
      }
    } catch (err) {
      console.error('Login error:', err);
      handleLoginErrorWithToast(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5fa] flex flex-col">
      {/* Toast Container - place this once at the top level of your component */}
      <ToastContainer />

      <Header />

      <main className="flex-1 flex items-center">
        <div className="max-w-[1500px] mx-auto w-full grid md:grid-cols-2 gap-8 px-6">
          {/* Decorative left side */}
          <div className="hidden md:flex relative ">
            <Image src={"/assets/images/auth_group.png"} fill alt={"group"} />
          </div>

          {/* Login form */}
          <div className="flex flex-col justify-center max-w-md mx-auto w-full">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-blue-800">Welcome back</h1>
              <p className="text-gray-500 mt-2">
                We've missed you! Please sign in to catch up on what you've
                missed
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-blue-800 font-medium block"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="example@mail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-800"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-blue-800 font-medium block"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-800"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="remember"
                        className="sr-only"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                      <div className="w-5 h-5 border border-gray-300 rounded-full"></div>
                      <div
                        className={`absolute w-3 h-3 bg-blue-800 rounded-full top-1 left-1 transform transition-transform duration-200 ease-in-out ${
                          rememberMe ? "scale-100" : "scale-0"
                        }`}
                      ></div>
                    </div>
                    <span className="ml-2 text-blue-800">Remember Me</span>
                  </label>
                </div>
                <Link
                  href="/login/reset-password"
                  className="text-blue-800 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="flex justify-center">
                <div className="flex justify-center">
                  <SimpleButton
                    type="submit"
                    title={loading ? "Logging in..." : "Log In"}
                    className="w-[360px] h-[56px] text-[16px] bg-[#1E3A8A] text-white rounded-full py-3 text-base font-medium hover:bg-blue-700 transition-colors"
                    onClick={handleSubmit}
                    disabled={loading}
                  />
                </div>
              </div>
            </form>

            <div className="mt-6 text-center">
              <span className="text-gray-500">Don't have an account yet? </span>
              <Link
                href="/singup"
                className="text-blue-800 font-medium hover:underline"
              >
                Sign up
              </Link>
              <span className="text-gray-500"> now to join our community.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
