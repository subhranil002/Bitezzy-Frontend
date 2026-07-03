import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import { FiEye, FiEyeOff, FiUpload, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { FloatingIcons } from "../components/FloatingFoodIcons";
import {
  ALLERGEN_OPTIONS,
  CUISINE_OPTIONS,
  DIETARY_OPTIONS,
  EMAIL_REGEX,
  PASSWORD_REGEX,
} from "../constants";
import { registerUser } from "../redux/slices/authSlice";

/* Signup page with form handling, file upload preview, and optional preferences */
export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm();

  // ref for decorative floating icons (render-only)
  const floatingIconsRef = useRef(FloatingIcons);

  // password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // local state for allergen search input
  const [allergenSearch, setAllergenSearch] = useState("");

  const password = watch("password");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || location.state?.from || "/";
  const { isLoggedIn, isLoading } = useSelector((state) => state.auth);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  // redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-6">
      {/* Decorative floating icons (pointer-events-none so they don't block UI) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIconsRef.current}
      </div>

      <div className="relative z-10 w-full max-w-4xl bg-white/70 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden">
        <div className="text-center py-10 border-b border-white/40 bg-linear-to-r from-orange-500/10 via-amber-300/10 to-red-500/10">
          <h1 className="text-4xl font-extrabold bg-linear-to-r from-orange-500 via-red-500 to-amber-500 bg-clip-text text-transparent animate-linear-x">
            Create Account
          </h1>
          <p className="text-gray-600 mt-2 text-sm font-medium">
            Sign up and make every meal a masterpiece!
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Left column: avatar, name, email */}
          <div className="space-y-6">
            {/* Avatar upload & preview */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Profile Avatar
              </label>
              <Controller
                control={control}
                name="avatar"
                defaultValue={null}
                render={({ field, fieldState: { error } }) => {
                  const file = field.value?.[0];
                  const previewUrl = file ? URL.createObjectURL(file) : null;

                  return (
                    <div className="flex flex-col items-center">
                      {/* Preview when a file is selected */}
                      {previewUrl ? (
                        <div className="relative group">
                          <img
                            src={previewUrl}
                            alt="Avatar preview"
                            className="w-24 h-24 rounded-full object-cover border-4 border-orange-300 shadow-lg"
                          />
                          {/* clear selected file */}
                          <button
                            type="button"
                            onClick={() => field.onChange(null)}
                            className="absolute -top-2 -right-2 btn btn-xs btn-error"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        /* placeholder when no file chosen */
                        <div className="w-24 h-24 flex items-center justify-center rounded-full bg-linear-to-br from-orange-200 to-red-200 border-4 border-orange-100 shadow-lg">
                          <FiUpload className="text-orange-400 text-2xl" />
                        </div>
                      )}

                      {/* file input (hidden) */}
                      <label className="mt-3 cursor-pointer">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          className="hidden"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files[0]) field.onChange(files);
                          }}
                        />
                        <span className="btn btn-outline btn-sm mt-2">
                          {previewUrl ? "Change Avatar" : "Upload Avatar"}
                        </span>
                      </label>

                      {/* show validation error */}
                      {error && (
                        <p className="text-red-500 text-xs mt-1">
                          {error.message}
                        </p>
                      )}
                    </div>
                  );
                }}
              />
            </div>

            {/* Profile name input */}
            <div>
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Name
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                {...register("profile_name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className="input input-bordered w-full focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              {errors.profile_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.profile_name.message}
                </p>
              )}
            </div>

            {/* Email input with pattern validation */}
            <div>
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Email
                </span>
              </label>
              <input
                type="email"
                placeholder="Enter email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: EMAIL_REGEX,
                    message: "Invalid email format",
                  },
                })}
                className="input input-bordered w-full focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Right column: passwords, cuisine, allergens, dietary */}
          <div className="space-y-6">
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
                  placeholder="Enter password"
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
                  className="input input-bordered w-full focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 pr-10"
                />
                {/* toggle button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-10 right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 focus:outline-none transition-colors"
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

            {/* Confirm password with validation against password */}
            <div>
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Confirm Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  {...register("confirmPassword", {
                    required: "Please confirm password",
                    validate: (v) => v === password || "Passwords do not match",
                  })}
                  className="input input-bordered w-full focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 pr-10"
                />
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
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Favorite cuisine select */}
            <div>
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Favorite Cuisine
                </span>
              </label>
              <select
                {...register("profile_cuisine", {
                  required: "Cuisine is required",
                })}
                className="select select-bordered w-full uppercase focus:outline-none focus:shadow-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 border-gray-200"
              >
                <option value="">Select cuisine</option>
                {CUISINE_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.profile_cuisine && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.profile_cuisine.message}
                </p>
              )}
            </div>

            {/* Allergens selector (search + chips) */}
            <div>
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Allergens (Optional)
                </span>
              </label>
              <Controller
                control={control}
                name="profile_allergens"
                defaultValue={[]}
                render={({ field }) => {
                  const selectedAllergens = field.value || [];

                  const handleSelect = (allergen) => {
                    if (!selectedAllergens.includes(allergen)) {
                      field.onChange([...selectedAllergens, allergen]);
                    }
                    setAllergenSearch("");
                  };

                  const handleRemove = (allergenToRemove) => {
                    field.onChange(
                      selectedAllergens.filter((a) => a !== allergenToRemove),
                    );
                  };

                  // suggestions filtered by input and excluding selected items
                  const filteredSuggestions = ALLERGEN_OPTIONS.filter(
                    (allergen) =>
                      allergen
                        .toLowerCase()
                        .includes(allergenSearch.toLowerCase()) &&
                      !selectedAllergens.includes(allergen),
                  );

                  return (
                    <div className="relative">
                      {/* Selected items shown as removable chips */}
                      <div className="flex flex-wrap gap-2 mb-2 uppercase">
                        {selectedAllergens.map((item) => (
                          <span
                            key={item}
                            className="badge badge-warning gap-1 p-3 text-white font-medium"
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() => handleRemove(item)}
                              className="hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <FiX />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* search input for allergens */}
                      <input
                        type="text"
                        value={allergenSearch}
                        onChange={(e) => setAllergenSearch(e.target.value)}
                        placeholder={
                          selectedAllergens.length > 0
                            ? "Add more..."
                            : "Type to search allergies..."
                        }
                        className="input input-bordered w-full focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      />

                      {/* dropdown suggestions on input */}
                      {allergenSearch && filteredSuggestions.length > 0 && (
                        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-48 overflow-y-auto uppercase">
                          {filteredSuggestions.map((allergen) => (
                            <li
                              key={allergen}
                              onClick={() => handleSelect(allergen)}
                              className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-gray-700 transition-colors"
                            >
                              {allergen}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                }}
              />
            </div>
            {/* End allergens selector */}

            {/* Dietary preference checkboxes */}
            <div>
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Dietary Preferences (Optional)
                </span>
              </label>
              <div className="flex flex-wrap gap-3">
                {DIETARY_OPTIONS.map((pref) => (
                  <label
                    key={pref}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      value={pref}
                      {...register("profile_dietaryLabels")}
                      className="checkbox accent-orange-500"
                    />
                    <span className="uppercase">{pref}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Submit button + sign-in link */}
          <div className="col-span-1 md:col-span-2 mt-6">
            <button
              className="btn w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
              disabled={isLoading}
            >
              <span className="relative z-10">
                {isLoading ? "Signing up..." : "Sign Up"}
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
              Already a user?{" "}
              <Link
                to="/login"
                className="text-orange-500 font-semibold hover:text-red-500 transition-colors duration-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
