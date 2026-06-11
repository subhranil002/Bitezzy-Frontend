import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import {
  FaBriefcase,
  FaCamera,
  FaGlobe,
  FaGraduationCap,
  FaLink,
  FaMoneyBillWave,
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
      <span className="truncate max-w-[15ch] sm:max-w-[25ch] text-sm font-medium">
        {children}
      </span>

      <button
        type="button"
        className="ml-1 btn btn-circle btn-ghost btn-xs text-current opacity-60 hover:opacity-100"
        onClick={onRemove}
        aria-label="Remove chip"
      >
        <FaTrash className="w-3 h-3" />
      </button>
    </span>
  );
}

const EMPLOYMENT_TYPE_OPTIONS = [
  "full-time",
  "part-time",
  "contract",
  "freelance",
  "internship",
  "temporary",
  "apprenticeship",
  "other",
];

const emptyEducation = () => ({
  institution: "",
  degree: "",
  fieldOfStudy: "",
  startYear: "",
  endYear: "",
  description: "",
});

const emptyExperience = () => ({
  title: "",
  employmentType: "",
  companyOrOrganization: "",
  isCurrentlyWorking: false,
  startYear: "",
  endYear: "",
  description: "",
});

const normalizeText = (value) => (value ?? "").toString().trim();

const isBlankEducationRow = (item) =>
  !(
    normalizeText(item?.institution) ||
    normalizeText(item?.degree) ||
    normalizeText(item?.fieldOfStudy) ||
    normalizeText(item?.startYear) ||
    normalizeText(item?.endYear) ||
    normalizeText(item?.description)
  );

const isBlankExperienceRow = (item) =>
  !(
    normalizeText(item?.title) ||
    normalizeText(item?.employmentType) ||
    normalizeText(item?.companyOrOrganization) ||
    normalizeText(item?.startYear) ||
    normalizeText(item?.endYear) ||
    normalizeText(item?.description) ||
    item?.isCurrentlyWorking
  );

/**
 * Dialog component for editing a chef's profile.
 * Education and work experience are editable rows.
 * Add buttons only create new blank rows.
 */
export default function EditChefProfileDialog() {
  const dlgRef = useRef(null);

  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);

  const profile = userData?.profile;
  const chefProfile = userData?.chefProfile;

  const [previewUrl, setPreviewUrl] = useState(null);
  const [dietaryDraft, setDietaryDraft] = useState("");
  const [allergenDraft, setAllergenDraft] = useState("");
  const [linkDraft, setLinkDraft] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    clearErrors,
    reset,
    formState: { errors, isDirty },
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: profile?.name || "",
      bio: profile?.bio || "",
      avatar: null,
      cuisine: profile?.cuisine || "",
      dietaryLabels: profile?.dietaryLabels?.map((v) => ({ value: v })) ?? [],
      allergens: profile?.allergens?.map((v) => ({ value: v })) ?? [],
      speciality: chefProfile?.speciality || "",
      subscriptionPrice: chefProfile?.subscriptionPrice ?? "",
      education:
        chefProfile?.education?.map((item) => ({
          institution: item?.institution ?? "",
          degree: item?.degree ?? "",
          fieldOfStudy: item?.fieldOfStudy ?? "",
          startYear: item?.startYear ?? "",
          endYear: item?.endYear ?? "",
          description: item?.description ?? "",
        })) || [],
      experience:
        chefProfile?.experience?.map((item) => ({
          title: item?.title ?? "",
          employmentType: item?.employmentType ?? "",
          companyOrOrganization: item?.companyOrOrganization ?? "",
          isCurrentlyWorking: Boolean(item?.isCurrentlyWorking ?? false),
          startYear: item?.startYear ?? "",
          endYear: item?.endYear ?? "",
          description: item?.description ?? "",
        })) || [],
      externalLinks:
        chefProfile?.externalLinks?.map((v) => ({ value: v })) ?? [],
    },
  });

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

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: workFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: "externalLinks",
  });

  const watchedFileList = watch("avatar");

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

  const avatarUrl = useMemo(() => {
    if (previewUrl) return previewUrl;

    const url = profile?.avatar?.secure_url;
    if (!url) return null;

    return url.replace("/upload/", "/upload/ar_1:1,c_auto,g_auto,w_500/r_max/");
  }, [previewUrl, profile]);

  const ensureUniqueAppend = (
    name,
    valueToAdd,
    appendFn,
    keyName = "value",
  ) => {
    if (!valueToAdd) return;

    const currentItems = getValues(name) || [];

    const exists = currentItems.some(
      (item) =>
        (item?.[keyName] ?? "").toString().toLowerCase() ===
        valueToAdd.toString().toLowerCase(),
    );

    if (!exists) {
      appendFn({ value: valueToAdd });
    }
  };

  const handleAddChip = (fieldName, draft, appendFn, clearFn) => {
    if (!draft) return;

    ensureUniqueAppend(fieldName, draft, appendFn);
    clearFn("");
  };

  const handleAddEducationRow = () => {
    appendEducation(emptyEducation());
  };

  const handleAddExperienceRow = () => {
    appendExperience(emptyExperience());
  };

  const handleAddLink = () => {
    if (!linkDraft.trim()) return;

    let url = linkDraft.trim();

    const flexibleUrlRegex =
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

    if (!flexibleUrlRegex.test(url)) {
      setError("externalLinks", {
        type: "manual",
        message: "Please enter a valid website link",
      });
      return;
    }

    ensureUniqueAppend("externalLinks", url, appendLink);
    clearErrors("externalLinks");
    setLinkDraft("");
  };

  const onSubmit = async (data) => {
    try {
      const cleanedEducation = (data.education || [])
        .filter((item) => !isBlankEducationRow(item))
        .map((item) => ({
          institution: normalizeText(item.institution),
          degree: normalizeText(item.degree),
          fieldOfStudy: normalizeText(item.fieldOfStudy),
          startYear: normalizeText(item.startYear),
          endYear: normalizeText(item.endYear),
          description: normalizeText(item.description),
        }));

      const cleanedExperience = (data.experience || [])
        .filter((item) => !isBlankExperienceRow(item))
        .map((item) => ({
          title: normalizeText(item.title),
          employmentType: normalizeText(item.employmentType),
          companyOrOrganization: normalizeText(item.companyOrOrganization),
          isCurrentlyWorking: !!item.isCurrentlyWorking,
          startYear: normalizeText(item.startYear),
          endYear: item.isCurrentlyWorking
            ? "Present"
            : normalizeText(item.endYear),
          description: normalizeText(item.description),
        }));

      const payload = {
        avatar: data.avatar?.[0] || null,
        name: normalizeText(data.name),
        bio: normalizeText(data.bio),
        cuisine: normalizeText(data.cuisine),
        dietaryLabels: (data.dietaryLabels || []).map((i) =>
          normalizeText(i.value).toLowerCase(),
        ),
        allergens: (data.allergens || []).map((i) =>
          normalizeText(i.value).toLowerCase(),
        ),
        speciality: normalizeText(data.speciality),
        subscriptionPrice: Number(data.subscriptionPrice) || 0,
        education: cleanedEducation,
        experience: cleanedExperience,
        externalLinks: (data.externalLinks || []).map((i) =>
          normalizeText(i.value),
        ),
      };

      dlgRef.current?.close();

      await dispatch(updateProfile(payload)).unwrap();

      reset({
        ...data,
        avatar: null,
        education: cleanedEducation,
        experience: cleanedExperience,
      });
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const handleClose = () => {
    reset();
    dlgRef.current?.close();
  };

  return (
    <dialog
      id="edit-chef-profile"
      ref={dlgRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-chef-profile-title"
      className="modal backdrop-blur-sm"
    >
      <div className="modal-box w-full max-w-3xl bg-white shadow-2xl border border-orange-100 rounded-3xl p-0 overflow-hidden">
        <div className="bg-linear-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
          <h3
            id="edit-chef-profile-title"
            className="font-bold text-xl text-gray-800 flex items-center gap-2"
          >
            <FaUser className="text-orange-500" />
            Edit Chef Profile
          </h3>

          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost text-gray-500 hover:bg-orange-100 hover:text-orange-600"
            onClick={handleClose}
            aria-label="Close dialog"
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-orange-50 ring-2 ring-orange-100">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-orange-300 font-bold">
                        {profile?.name?.charAt(0)}
                      </div>
                    )}
                  </div>

                  <label
                    htmlFor="avatar-upload"
                    aria-label="Upload avatar"
                    className="absolute bottom-1 right-1 bg-gray-800 text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition cursor-pointer border-2 border-white"
                  >
                    <FaCamera className="w-4 h-4" />
                  </label>

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

              <div className="flex-1 space-y-4 w-full">
                <div className="form-control w-full">
                  <label className="label pt-0">
                    <span className="label-text font-bold text-gray-700">
                      Display Name
                    </span>
                  </label>

                  <input
                    placeholder="Chef Name"
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

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold text-gray-700">
                      Bio
                    </span>
                  </label>

                  <textarea
                    rows={3}
                    placeholder="Share your culinary journey..."
                    className="textarea textarea-bordered w-full bg-gray-50 focus:bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 rounded-xl"
                    {...register("bio", { maxLength: 500 })}
                  />
                </div>
              </div>
            </div>

            <div className="divider"></div>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-4">
                  <FaUtensils className="text-orange-500" />
                  Food Preferences
                </h4>
              </div>

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

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-gray-700">
                    Dietary Preferences
                  </span>
                </label>

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

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-gray-700">
                    Allergens
                  </span>
                </label>

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

            <div className="divider"></div>

            <section className="space-y-6">
              <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <FaBriefcase className="text-orange-500" />
                Professional Background
              </h4>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold text-gray-600 flex items-center gap-2">
                    <FaUtensils /> Culinary Speciality
                  </span>
                </label>

                <select
                  className="select select-bordered w-full border-gray-200 focus:border-orange-400 rounded-xl uppercase"
                  {...register("speciality")}
                >
                  <option value="">Select Speciality</option>
                  {CUISINE_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold text-gray-600 flex items-center gap-2">
                    <FaMoneyBillWave /> Subscription Price (₹ / month)
                  </span>
                </label>

                <input
                  type="number"
                  min="0"
                  className="input input-bordered w-full border-gray-200 focus:border-orange-400 rounded-xl"
                  {...register("subscriptionPrice", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Price cannot be negative" },
                  })}
                  placeholder="e.g. 499"
                />

                {errors.subscriptionPrice && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.subscriptionPrice.message}
                  </span>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label flex items-center justify-between mb-3">
                  <span className="label-text font-semibold text-gray-600 flex items-center gap-2">
                    <FaGraduationCap /> Education / Certification
                  </span>

                  <button
                    type="button"
                    className="btn btn-sm bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-200"
                    onClick={handleAddEducationRow}
                  >
                    <FaPlus />
                    Add Education
                  </button>
                </label>

                <div className="flex flex-col gap-3">
                  {educationFields.length === 0 && (
                    <p className="text-xs text-gray-400 italic">
                      No education added yet. Click “Add Education” to create a
                      row.
                    </p>
                  )}

                  {educationFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl"
                    >
                      <div className="flex justify-between items-start gap-3 mb-3">
                        <div className="font-semibold text-gray-800">
                          Education #{idx + 1}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeEducation(idx)}
                          className="btn btn-xs btn-circle bg-red-50 text-red-500 hover:bg-red-100 border-none"
                          aria-label="Remove education row"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          className="input input-bordered w-full bg-gray-50 focus:bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 rounded-xl"
                          placeholder="Institution Name"
                          {...register(`education.${idx}.institution`)}
                        />

                        <input
                          className="input input-bordered w-full bg-gray-50 focus:bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 rounded-xl"
                          placeholder="Degree"
                          {...register(`education.${idx}.degree`)}
                        />

                        <input
                          className="input input-bordered w-full bg-gray-50 focus:bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 rounded-xl"
                          placeholder="Field of Study"
                          {...register(`education.${idx}.fieldOfStudy`)}
                        />

                        <div className="flex gap-2">
                          <input
                            type="number"
                            className="input input-bordered w-full bg-gray-50 focus:bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 rounded-xl"
                            placeholder="Start Year"
                            {...register(`education.${idx}.startYear`, {
                              valueAsNumber: true,
                            })}
                          />

                          <input
                            type="number"
                            className="input input-bordered w-full bg-gray-50 focus:bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 rounded-xl"
                            placeholder="End Year"
                            {...register(`education.${idx}.endYear`, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>

                        <textarea
                          className="textarea textarea-bordered w-full bg-gray-50 focus:bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 rounded-xl md:col-span-2"
                          placeholder="Description"
                          {...register(`education.${idx}.description`)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-control w-full">
                <label className="label flex items-center justify-between mb-3">
                  <span className="label-text font-semibold text-gray-600 flex items-center gap-2">
                    <FaBriefcase /> Work Experience
                  </span>

                  <button
                    type="button"
                    className="btn btn-sm bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-200"
                    onClick={handleAddExperienceRow}
                  >
                    <FaPlus />
                    Add Work Experience
                  </button>
                </label>

                <div className="flex flex-col gap-3">
                  {workFields.length === 0 && (
                    <p className="text-xs text-gray-400 italic">
                      No work experience added yet. Click “Add Work Experience”
                      to create a row.
                    </p>
                  )}

                  {workFields.map((field, idx) => {
                    const isWorking = watch(
                      `experience.${idx}.isCurrentlyWorking`,
                    );

                    return (
                      <div
                        key={field.id}
                        className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl"
                      >
                        <div className="flex justify-between items-start gap-3 mb-3">
                          <div className="font-semibold text-gray-800">
                            Experience #{idx + 1}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeExperience(idx)}
                            className="btn btn-xs btn-circle bg-red-50 text-red-500 hover:bg-red-100 border-none"
                            aria-label="Remove work experience row"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            className="input input-bordered w-full bg-gray-50 focus:bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 rounded-xl"
                            placeholder="Title"
                            {...register(`experience.${idx}.title`)}
                          />

                          <select
                            className="select select-bordered w-full bg-gray-50 focus:bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 rounded-xl uppercase"
                            {...register(`experience.${idx}.employmentType`)}
                          >
                            <option value="">Select Employment Type</option>
                            {EMPLOYMENT_TYPE_OPTIONS.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>

                          <input
                            className="input input-bordered w-full bg-gray-50 focus:bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 rounded-xl md:col-span-2"
                            placeholder="Company or Organization"
                            {...register(
                              `experience.${idx}.companyOrOrganization`,
                            )}
                          />

                          <label className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 md:col-span-2 cursor-pointer">
                            <span className="text-sm font-medium text-gray-700">
                              Currently working here
                            </span>

                            <input
                              type="checkbox"
                              className="toggle toggle-warning toggle-sm"
                              {...register(
                                `experience.${idx}.isCurrentlyWorking`,
                              )}
                            />
                          </label>

                          <input
                            type="number"
                            className="input input-bordered w-full bg-gray-50 focus:bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 rounded-xl"
                            placeholder="Start Year"
                            {...register(`experience.${idx}.startYear`, {
                              valueAsNumber: true,
                            })}
                          />

                          {!isWorking ? (
                            <input
                              type="number"
                              className="input input-bordered w-full bg-gray-50 focus:bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 rounded-xl"
                              placeholder="End Year"
                              {...register(`experience.${idx}.endYear`, {
                                valueAsNumber: true,
                              })}
                            />
                          ) : (
                            <div className="hidden md:block" />
                          )}

                          <textarea
                            className="textarea textarea-bordered w-full bg-gray-50 focus:bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 rounded-xl md:col-span-2"
                            placeholder="Description"
                            {...register(`experience.${idx}.description`)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold text-gray-600 flex items-center gap-2">
                    <FaGlobe /> Website & Social Links
                  </span>
                </label>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      className={`input input-bordered w-full pl-5 border-gray-200 focus:border-orange-400 rounded-xl ${
                        errors.externalLinks ? "input-error" : ""
                      }`}
                      placeholder="https://portfolio.com"
                      value={linkDraft}
                      onChange={(e) => {
                        setLinkDraft(e.target.value);
                        clearErrors("externalLinks");
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-200"
                    onClick={handleAddLink}
                  >
                    <FaPlus />
                  </button>
                </div>

                {errors.externalLinks && (
                  <span className="text-red-500 text-xs mt-1 ml-1">
                    {errors.externalLinks.message}
                  </span>
                )}

                <div className="flex flex-col gap-2 mt-3">
                  {linkFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group hover:border-orange-200 transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-orange-500">
                          <FaGlobe className="w-4 h-4" />
                        </div>

                        <span className="text-sm text-gray-600 truncate">
                          {field.value}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeLink(idx)}
                        className="btn btn-xs btn-circle btn-ghost text-red-400 hover:bg-red-50 hover:text-red-600"
                        aria-label="Remove link"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}

                  {linkFields.length === 0 && (
                    <p className="text-xs text-gray-400 italic">
                      No links added yet.
                    </p>
                  )}
                </div>
              </div>
            </section>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-orange-100">
              <button
                type="button"
                className="btn btn-ghost hover:bg-gray-100 rounded-xl"
                onClick={handleClose}
              >
                Cancel
              </button>

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
