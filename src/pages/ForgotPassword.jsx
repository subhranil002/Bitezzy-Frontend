// Finalized

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";

import forgotPasswordApi from "../apis/user/forgotPasswordApi";
import { FloatingIcons } from "../components/FloatingFoodIcons";
import { EMAIL_REGEX } from "../constants";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Send reset link request and clear form
  const onSubmit = async (data) => {
    reset();
    await forgotPasswordApi(data);
  };

  // Decorative floating icons reference
  const floatingIconsRef = useRef(FloatingIcons);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-linear-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Floating background icons */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {floatingIconsRef.current}
      </div>

      {/* Ambient glowing background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-linear-to-r from-orange-300/30 to-amber-200/40 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-linear-to-r from-red-300/30 to-pink-200/30 rounded-full blur-3xl animate-pulse-slow delay-2000"></div>
      </div>

      {/* Reset card */}
      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="text-center py-8 border-b border-white/40 bg-linear-to-r from-orange-500/10 via-amber-300/10 to-red-500/10">
          <div className="mx-auto w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <FiMail className="text-3xl text-orange-500" />
          </div>

          <h1 className="text-3xl font-extrabold bg-linear-to-r from-orange-500 via-red-500 to-amber-500 bg-clip-text text-transparent animate-linear-x">
            Forgot Password?
          </h1>

          <p className="text-gray-600 mt-2 text-sm font-medium px-6">
            Don&apos;t worry! It happens. Please enter the email associated with
            your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {/* Email input */}
          <div>
            <label className="label">
              <span className="label-text font-semibold text-gray-700">
                Email Address
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

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* Back to login link */}
          <div className="text-center mt-4">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors duration-300"
            >
              <FiArrowLeft className="mr-2" />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
