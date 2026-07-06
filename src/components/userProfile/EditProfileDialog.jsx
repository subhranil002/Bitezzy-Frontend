import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import {
  FaCamera,
  FaPlus,
  FaSave,
  FaTrash,
  FaUser,
  FaUtensils,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import {
  ALLERGEN_OPTIONS,
  CUISINE_OPTIONS,
  DIETARY_OPTIONS,
} from "../../constants";
import { updateProfile } from "../../redux/slices/authSlice";

/**
 * Reusable Chip component used to display selected
 * dietary preferences or allergens.
 */
function Chip({ color, children, onRemove }) {
  const colorMap = {
    green:
      "badge-lg bg-emerald-100 border border-emerald-300 text-emerald-700 hover:text-emerald-900",
    red: "badge-lg bg-rose-100 border border-rose-300 text-rose-700 hover:text-rose-900",
    orange:
      "badge-lg bg-orange-100 border border-orange-300 text-orange-800 hover:text-orange-900",
  };

  return (
    <span className={`badge ${colorMap[color]} gap-2 p-3 h-auto`}>
      {/* Chip label */}
      <span className="truncate max-w-[15ch] sm:max-w-[25ch] text-sm font-medium">
        {children}
      </span>

      {/* Remove chip button */}
      <button
        type="button"
        className="ml-1 btn btn-circle btn-ghost btn-xs text-current opacity-60 hover:opacity-100"
        onClick={onRemove}
      >
        <FaTrash className="w-3 h-3" />
      </button>
    </span>
  );
}

export default function EditProfileDialog() {
  const dlgRef = useRef(null);
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.userProfile);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dietaryDraft, setDietaryDraft] = useState("");
  const [allergenDraft, setAllergenDraft] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: profile?.name || "",
      bio: profile?.bio || "",
      avatar: null,
      cuisine: profile?.cuisine || "",
      dietaryLabels: profile?.dietaryLabels?.map((v) => ({ value: v })) || [],
      allergens: profile?.allergens?.map((v) => ({ value: v })) || [],
    },
  });

  /**
   * useFieldArray manages dynamic lists
   */
  const {
    fields: dietaryFields,
    append: appendDietary,
    remove: removeDietary,
  } = useFieldArray({
    control,
    name: "dietaryLabels",
  });
  const {
    fields: allergenFields,
    append: appendAllergen,
    remove: removeAllergen,
  } = useFieldArray({
    control,
    name: "allergens",
  });

  // Watch avatar input to generate preview
  const watchedFileList = watch("avatar");

  /**
   * Generates a preview URL for uploaded avatar images.
   */
  useEffect(() => {
    const file = watchedFileList?.[0];

    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [watchedFileList]);

  const avatarUrl = () => {
    if (previewUrl) return previewUrl;
    const url = profile?.avatar?.secure_url;
    if (!url) return null;
    return url.replace("/upload/", "/upload/ar_1:1,c_auto,g_auto,w_500/r_max/");
  };

  /**
   * Ensures only unique items are added to a field array.
   */
  const ensureUniqueAppend = (name, valueToAdd, appendFn) => {
    if (!valueToAdd) return;

    const currentItems = watch(name) || [];

    const exists = currentItems.some(
      (item) => (item?.value ?? "").toLowerCase() === valueToAdd.toLowerCase(),
    );

    if (!exists) {
      appendFn({ value: valueToAdd });
    }
  };

  /**
   * Adds a new chip to the form field array
   */
  const handleAddChip = (fieldName, draft, appendFn, clearFn) => {
    if (!draft) return;

    ensureUniqueAppend(fieldName, draft, appendFn);
    clearFn("");
  };

  /**
   * Handles form submission.
   */
  const onSubmit = async (data) => {
    dlgRef.current?.close();

    dispatch(
      updateProfile({
        ...data,
        dietaryLabels: data.dietaryLabels.map((i) => i.value?.toLowerCase()),
        allergens: data.allergens.map((i) => i.value?.toLowerCase()),
      }),
    ).unwrap();

    reset(data);
  };

  return (
    <dialog
      id="edit-profile"
      ref={dlgRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      className="modal backdrop-blur-sm"
    >
      <div className="modal-box w-full max-w-3xl bg-white shadow-2xl border border-orange-100 rounded-3xl p-0 overflow-hidden">
        {/* Dialog Header */}
        <div className="bg-linear-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
          <h3
            id="edit-profile-title"
            className="font-bold text-xl text-gray-800 flex items-center gap-2"
          >
            <FaUser className="text-orange-500" />
            Edit Profile
          </h3>

          {/* Close dialog button */}
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost text-gray-500 hover:bg-orange-100 hover:text-orange-600"
            onClick={() => dlgRef.current?.close()}
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            {/* Avatar and Basic Information */}
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              {/* Avatar Upload Section */}
              <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-orange-50 ring-2 ring-orange-100">
                    {avatarUrl() ? (
                      <img
                        src={avatarUrl()}
                        alt="Avatar"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-orange-300 font-bold">
                        {profile?.name?.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Upload avatar trigger */}
                  <label
                    htmlFor="avatar-upload"
                    aria-label="Upload avatar"
                    className="absolute bottom-1 right-1 bg-gray-800 text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition cursor-pointer border-2 border-white"
                  >
                    <FaCamera className="w-4 h-4" />
                  </label>

                  {/* Hidden file input */}
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register("avatar", {
                      validate: {
                        fileSize: (files) =>
                          !files?.[0] ||
                          files[0].size < 2000000 ||
                          "Image must be under 2MB",
                        fileType: (files) =>
                          !files?.[0] ||
                          ["image/jpeg", "image/png", "image/webp"].includes(
                            files[0].type,
                          ) ||
                          "Only JPG, PNG, or WEBP allowed",
                      },
                    })}
                  />
                </div>
                {errors.avatar && (
                  <p className="text-red-500 text-xs mt-2 text-center max-w-[140px]">
                    {errors.avatar.message}
                  </p>
                )}
              </div>

              {/* Name and Bio Section */}
              <div className="flex-1 space-y-4 w-full">
                {/* Display Name Field */}
                <div className="form-control w-full">
                  <label className="label pt-0">
                    <span className="label-text font-bold text-gray-700">
                      Display Name
                    </span>
                  </label>

                  <input
                    placeholder="Your Name"
                    className={`input input-bordered w-full bg-gray-50 focus:bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 rounded-xl ${
                      errors.name ? "input-error" : ""
                    }`}
                    {...register("name", {
                      required: "Name is required",
                      minLength: { value: 3, message: "Min 3 chars" },
                    })}
                  />

                  {errors.name && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Bio Field */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold text-gray-700">
                      Bio
                    </span>
                  </label>

                  <textarea
                    rows={3}
                    placeholder="Tell us about your favorite foods..."
                    className="textarea textarea-bordered w-full bg-gray-50 focus:bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 rounded-xl"
                    {...register("bio", { maxLength: 500 })}
                  />
                </div>
              </div>
            </div>

            <div className="divider"></div>

            {/* Food Preferences Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-4">
                  <FaUtensils className="text-orange-500" />
                  Food Preferences
                </h4>
              </div>

              {/* Cuisine Selection */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-bold text-gray-700">
                    Favorite Cuisine
                  </span>
                </label>

                <select
                  className="select select-bordered w-full border-gray-200 focus:border-orange-400 rounded-xl uppercase"
                  {...register("cuisine")}
                >
                  {CUISINE_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dietary Preferences */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-gray-700">
                    Dietary Preferences
                  </span>
                </label>

                {/* Add dietary preference */}
                <div className="flex gap-2 mb-3">
                  <select
                    className="select select-bordered select-sm w-full rounded-lg uppercase"
                    value={dietaryDraft}
                    onChange={(e) => setDietaryDraft(e.target.value)}
                  >
                    <option value="">Select Option</option>

                    {DIETARY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="btn btn-sm btn-square bg-emerald-100 text-emerald-600 border-emerald-200 hover:bg-emerald-200"
                    onClick={() =>
                      handleAddChip(
                        "dietaryLabels",
                        dietaryDraft,
                        appendDietary,
                        setDietaryDraft,
                      )
                    }
                  >
                    <FaPlus />
                  </button>
                </div>

                {/* Selected dietary chips */}
                <div className="flex flex-wrap gap-2 uppercase">
                  {dietaryFields.map((field, idx) => (
                    <Chip
                      key={field.id}
                      color="green"
                      onRemove={() => removeDietary(idx)}
                    >
                      {field.value}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Allergens Section */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-gray-700">
                    Allergens
                  </span>
                </label>

                {/* Add allergen */}
                <div className="flex gap-2 mb-3">
                  <select
                    className="select select-bordered select-sm w-full rounded-lg uppercase"
                    value={allergenDraft}
                    onChange={(e) => setAllergenDraft(e.target.value)}
                  >
                    <option value="">Select Option</option>

                    {ALLERGEN_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="btn btn-sm btn-square bg-rose-100 text-rose-600 border-rose-200 hover:bg-rose-200"
                    onClick={() =>
                      handleAddChip(
                        "allergens",
                        allergenDraft,
                        appendAllergen,
                        setAllergenDraft,
                      )
                    }
                  >
                    <FaPlus />
                  </button>
                </div>

                {/* Selected allergen chips */}
                <div className="flex flex-wrap gap-2 uppercase">
                  {allergenFields.map((field, idx) => (
                    <Chip
                      key={field.id}
                      color="red"
                      onRemove={() => removeAllergen(idx)}
                    >
                      {field.value}
                    </Chip>
                  ))}
                </div>
              </div>
            </section>

            {/* Dialog Footer */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-orange-100">
              {/* Cancel button */}
              <button
                type="button"
                className="btn btn-ghost hover:bg-gray-100 rounded-xl"
                onClick={() => dlgRef.current?.close()}
              >
                Cancel
              </button>

              {/* Save button */}
              <button
                type="submit"
                disabled={!isDirty}
                className={`btn border-none text-white shadow-lg rounded-xl gap-2 px-8 ${
                  !isDirty
                    ? "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
                    : "bg-linear-to-r from-orange-500 to-red-500 hover:shadow-orange-200 hover:-translate-y-0.5"
                }`}
              >
                <FaSave />
                {isDirty ? "Save Changes" : "No Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
