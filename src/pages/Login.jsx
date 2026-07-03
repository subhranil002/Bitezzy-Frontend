import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { FloatingIcons } from "../components/FloatingFoodIcons";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../constants";
import { login } from "../redux/slices/authSlice";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || location.state?.from || "/";
  const { isLoggedIn, isLoading } = useSelector((state) => state.auth);

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  const floatingIconsRef = useRef(FloatingIcons);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-linear-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Floating background icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIconsRef.current}
      </div>

      {/* Decorative glowing background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-linear-to-r from-orange-300/30 to-amber-200/40 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-linear-to-r from-red-300/30 to-pink-200/30 rounded-full blur-3xl animate-pulse-slow delay-2000"></div>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden animate-fadeIn">
        <div className="text-center py-10 border-b border-white/40 bg-linear-to-r from-orange-500/10 via-amber-300/10 to-red-500/10">
          <h1 className="text-4xl font-extrabold bg-linear-to-r from-orange-500 via-red-500 to-amber-500 bg-clip-text text-transparent animate-linear-x">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-2 text-sm font-medium">
            Sign in to your Bitezzy account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {/* Email field */}
          <div>
            <label className="label">
              <span className="label-text font-semibold text-gray-700">
                Email
              </span>
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: EMAIL_REGEX,
                  message: "Invalid email address",
                },
              })}
              className="input input-bordered w-full placeholder-gray-400 text-gray-800 focus:outline-none focus:shadow-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password field with visibility toggle */}
          <div>
            <label className="label">
              <span className="label-text font-semibold text-gray-700">
                Password
              </span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: PASSWORD_REGEX,
                    message:
                      "Must include uppercase, number, and special character",
                  },
                })}
                className="input input-bordered w-full placeholder-gray-400 text-gray-800 focus:outline-none focus:shadow-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 pr-10"
                placeholder="Enter your password"
              />

              {/* Toggle button for password visibility */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-10 right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {!showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">
              {isLoading ? "Logging in..." : "Continue"}
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* Navigation links */}
          <div className="text-center text-sm text-gray-600 mt-6 space-y-2">
            <p>
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-orange-500 font-semibold hover:text-red-500 transition-colors duration-300 hover:underline"
              >
                Sign up
              </Link>
            </p>
            <p>
              <Link
                to="/forgotpassword"
                className="text-orange-500 font-semibold hover:text-red-500 transition-colors duration-300 hover:underline"
              >
                Forgot password?
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
