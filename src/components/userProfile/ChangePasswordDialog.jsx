import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import { FaKey, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

import changePasswordApi from "../../apis/user/changePasswordApi";
import { PASSWORD_REGEX } from "../../constants";

/**
 * Utility function to generate Tailwind classes for inputs.
 * Adds error-specific styling when validation fails.
 */
const getInputClasses = (error) => `
  input input-bordered w-full bg-gray-50 focus:bg-white 
  border-gray-200 focus:border-orange-400 focus:ring-4 
  focus:ring-orange-100/50 rounded-xl transition-all
  ${error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""}
`;

export default function ChangePasswordDialog() {
  // Reference to the dialog element for programmatic control
  const dlgRef = useRef(null);

  /**
   * react-hook-form setup
   */
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Watch new password field for confirm-password validation
  const newPassword = watch("newPassword");

  // Local state for toggling password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * Helper function to close dialog and reset form state
   */
  const closeDialog = () => {
    reset();
    dlgRef.current?.close();
  };

  /**
   * Handles form submission
   */
  const onSubmit = async (data) => {
    dlgRef.current?.close();
    await changePasswordApi(data);
    reset();
  };

  return (
    <dialog
      id="change-password"
      ref={dlgRef}
      className="modal backdrop-blur-sm"
    >
      <div className="modal-box w-full max-w-md bg-white shadow-2xl border border-orange-100 rounded-3xl p-0 overflow-hidden">
        {/* Header Section */}
        <div className="bg-linear-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
          <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
            <FaLock className="text-orange-500" />
            Security
          </h3>

          {/* Close Dialog Button */}
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost text-gray-500 hover:bg-orange-100 hover:text-orange-600"
            onClick={() => {
              reset();
              dlgRef.current?.close();
            }}
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Informational text about password security */}
            <p className="text-sm text-gray-500 mb-2">
              Ensure your account is using a long, random password to stay
              secure.
            </p>

            {/* Current Password Field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-gray-700">
                  Current Password
                </span>
              </label>

              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  className={getInputClasses(errors.oldPassword)}
                  placeholder="••••••••"
                  {...register("oldPassword", {
                    required: "Current password is required",
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
                />

                {/* Toggle password visibility */}
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute z-10 right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 focus:outline-none transition-colors"
                >
                  {!showOldPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>

              {/* Validation Error Message */}
              {errors.oldPassword && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.oldPassword.message}
                </span>
              )}
            </div>

            {/* Divider between current and new password */}
            <div className="divider opacity-50"></div>

            {/* New Password Field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-gray-700">
                  New Password
                </span>
              </label>

              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className={getInputClasses(errors.newPassword)}
                  placeholder="••••••••"
                  {...register("newPassword", {
                    required: "New password is required",
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
                />

                {/* Toggle new password visibility */}
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute z-10 right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 focus:outline-none transition-colors"
                >
                  {!showNewPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>

              {/* Validation Error */}
              {errors.newPassword && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.newPassword.message}
                </span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-gray-700">
                  Confirm New Password
                </span>
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={getInputClasses(errors.confirmPassword)}
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                />

                {/* Toggle confirm password visibility */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute z-10 right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 focus:outline-none transition-colors"
                >
                  {!showConfirmPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>

              {/* Validation Error */}
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-orange-50 mt-4">
              {/* Cancel Button */}
              <button
                type="button"
                className="btn btn-ghost hover:bg-gray-100 rounded-xl"
                onClick={() => closeDialog()}
              >
                Cancel
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn border-none text-white shadow-lg transition-all rounded-xl gap-2 px-8 bg-linear-to-r from-orange-500 to-red-500 hover:shadow-orange-200 hover:-translate-y-0.5"
              >
                <FaKey className="text-sm" />
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
