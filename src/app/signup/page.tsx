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
import { showErrorToast, showSuccessToast } from "@/utils/handle_errors";
import Logo from "@/components/common/Logo";

export default function SignupPage() {
  const { signup, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirm: "",
    role: "seller", // Keep this as a fixed value, but don't show the selection
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateSignupForm = (): boolean => {
    // Check for empty fields
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        showErrorToast(
          `Please fill in your ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
        return false;
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showErrorToast("Please enter a valid email address");
      return false;
    }

    // Check if passwords match
    if (formData.password !== formData.password_confirm) {
      showErrorToast("Passwords do not match");
      return false;
    }

    // Check if password meets requirements (min 8 chars, at least 1 number and 1 letter)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      showErrorToast(
        "Password must be at least 8 characters long and contain at least one letter and one number"
      );
      return false;
    }

    // Check terms agreement
    if (!agreeTerms) {
      showErrorToast("You must agree to the Terms and Conditions");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSignupForm()) {
      return;
    }

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm,
        role: "seller",
      });

      showSuccessToast("Account created successfully!");
      router.push("/login");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create account";
      showErrorToast(errorMessage);
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5fa] flex flex-col">
      {/* Toast Container */}
      <ToastContainer />

      <header className="p-6 bg-white">
      <div className="max-w-7xl mx-auto w-full">
          <Logo />
        </div>
      </header>

      <main className="flex-1 flex items-center py-10">
        <div className="max-w-[1500px] mx-auto w-full grid md:grid-cols-2 gap-8 px-6">
          {/* Decorative left side */}
          <div className="hidden md:flex relative ">
            <Image src={"/assets/images/auth_group.png"} fill alt={"group"} />
          </div>

          {/* Signup form */}
          <div className="flex flex-col justify-center max-w-md mx-auto w-full">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-blue-800">
                Create an account
              </h1>
              <p className="text-gray-500 mt-2">
                Join our community and enjoy all the benefits of ALGECOM
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email field */}
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

              {/* Password field */}
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
                    placeholder="Create a password"
                    className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-800"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 ml-1">
                  Password must be at least 8 characters long and contain at
                  least one letter and one number
                </p>
              </div>

              {/* Confirm Password field */}
              <div className="space-y-2">
                <label
                  htmlFor="password_confirm"
                  className="text-blue-800 font-medium block"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password_confirm"
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-800"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Terms and conditions */}
              <div className="flex items-start space-x-2">
                <label className="flex items-center cursor-pointer mt-1">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      className="sr-only"
                      checked={agreeTerms}
                      onChange={() => setAgreeTerms(!agreeTerms)}
                      required
                    />
                    <div className="w-5 h-5 border border-gray-300 rounded-full"></div>
                    <div
                      className={`absolute w-3 h-3 bg-blue-800 rounded-full top-1 left-1 transform transition-transform duration-200 ease-in-out ${
                        agreeTerms ? "scale-100" : "scale-0"
                      }`}
                    ></div>
                  </div>
                </label>
                <div className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-800 hover:underline">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-800 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <SimpleButton
                  title={loading ? "Creating Account..." : "Create Account"}
                  className="w-[360px] h-[56px] py-3 text-white text-[16px] bg-[#1E3A8A] rounded-full font-medium hover:bg-blue-700 transition-colors"
                  type="submit"
                  disabled={loading}
                />
              </div>
            </form>

            <div className="mt-6 text-center">
              <span className="text-gray-500">Already have an account? </span>
              <Link
                href="/login"
                className="text-blue-800 font-medium hover:underline"
              >
                Log in
              </Link>
              <span className="text-gray-500"> instead.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
