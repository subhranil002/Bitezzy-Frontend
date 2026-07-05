import { useFieldArray, useFormContext } from "react-hook-form";
import {
  FaClock,
  FaImage,
  FaPlus,
  FaTimes,
  FaUpload,
  FaUsers,
} from "react-icons/fa";

const formatLabel = (str) =>
  str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const Step1BasicDetails = ({ cuisineOptions, dietaryOptions }) => {
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext();

  const onAddLabel = (label) => {
    const t = label.trim().toLowerCase();
    const current = watch("dietaryLabels") || [];
    if (!current.includes(t)) {
      setValue("dietaryLabels", [...current, t], { shouldDirty: true });
    }
  };

  const onRemoveLabel = (label) => {
    const current = watch("dietaryLabels") || [];
    setValue(
      "dietaryLabels",
      current.filter((l) => l !== label),
      { shouldDirty: true }
    );
  };

  const dietaryLabels = watch("dietaryLabels") || [];

  // Watch for both the new file and the existing DB URL
  const thumbnailFile = watch("thumbnailFile");
  const existingThumbnailUrl = watch("existingThumbnailUrl");

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: "externalMediaLinks",
  });

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0] || null;
    setValue("thumbnailFile", file, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  // Determine what to show in the preview box
  let previewUrl = null;
  let displayFileName = "";

  if (thumbnailFile instanceof File) {
    previewUrl = URL.createObjectURL(thumbnailFile);
    displayFileName = thumbnailFile.name;
  } else if (existingThumbnailUrl) {
    previewUrl = existingThumbnailUrl;
    displayFileName = "Current Image"; // Fallback text for DB images
  }

  return (
    <div className="space-y-8 p-1 relative z-0">
      {/* Cool Background Graphic */}
      <div className="absolute -inset-6 md:-inset-10 bg-[url('https://res.cloudinary.com/dpoqek1ce/image/upload/food_tjm7b4.png')] opacity-30 mix-blend-overlay pointer-events-none -z-10 bg-repeat bg-[length:800px] rounded-3xl"></div>

      {/* Header */}
      <div className="border-b pb-4 border-base-200">
        <h2 className="text-2xl font-bold text-base-content">Recipe Details</h2>
        <p className="text-sm text-base-content/60 mt-1">
          Tell us the basics about your dish.
        </p>
      </div>

      {/* Title + Cuisine */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Title */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold text-base-content/80">Recipe Title *</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Grandma's Secret Pasta"
            {...register("title", {
              required: "Recipe title is required",
              minLength: { value: 3, message: "At least 3 characters" },
              maxLength: { value: 100, message: "Max 100 characters" },
            })}
            className={`input input-bordered w-full rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all ${errors.title ? "input-error" : ""
              }`}
          />
          {errors.title && (
            <span className="text-xs text-error mt-1 ml-1">{errors.title.message}</span>
          )}
        </div>

        {/* Cuisine */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold text-base-content/80">Cuisine *</span>
          </label>
          <select
            {...register("cuisine", { required: "Please select a cuisine" })}
            className={`select select-bordered w-full rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all ${errors.cuisine ? "select-error" : ""
              }`}
          >
            <option value="">Select cuisine type</option>
            {cuisineOptions.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {formatLabel(cuisine)}
              </option>
            ))}
          </select>
          {errors.cuisine && (
            <span className="text-xs text-error mt-1 ml-1">{errors.cuisine.message}</span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold text-base-content/80">Description *</span>
        </label>
        <textarea
          rows={4}
          placeholder="Describe the taste, texture, and story behind your recipe..."
          {...register("description", {
            required: "Description is required",
            minLength: { value: 10, message: "At least 10 characters" },
            maxLength: { value: 1000, message: "Max 1000 characters" },
          })}
          className={`textarea textarea-bordered w-full rounded-xl text-base focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all ${errors.description ? "textarea-error" : ""
            }`}
        />
        {errors.description && (
          <span className="text-xs text-error mt-1 ml-1">{errors.description.message}</span>
        )}
      </div>

      {/* Servings + Cook */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-30">

        {/* Servings */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold text-base-content/80">Servings *</span>
          </label>
          <div className={`input input-bordered flex items-center gap-3 rounded-xl focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 ${errors.servings ? "input-error" : ""}`}>
            <FaUsers className="text-orange-500/70" />
            <input
              type="number"
              min="1"
              placeholder="0"
              className="grow"
              {...register("servings", {
                required: "Required",
                min: { value: 1, message: "Min 1" },
                valueAsNumber: true,
              })}
            />
          </div>
          {errors.servings && (
            <span className="text-xs text-error mt-1 ml-1">{errors.servings.message}</span>
          )}
        </div>



        {/* Cook Time */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold text-base-content/80">Cook Time (min) *</span>
          </label>
          <div className={`input input-bordered flex items-center gap-3 rounded-xl focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 ${errors.cookMinutes ? "input-error" : ""}`}>
            <FaClock className="text-orange-500/70" />
            <input
              type="number"
              min="1"
              placeholder="0"
              className="grow"
              {...register("cookMinutes", {
                required: "Required",
                min: { value: 1, message: "Min 1" },
                valueAsNumber: true,
              })}
            />
          </div>
          {errors.cookMinutes && (
            <span className="text-xs text-error mt-1 ml-1">{errors.cookMinutes.message}</span>
          )}
        </div>
      </div>

      {/* Premium Toggle */}
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            {...register("isPremium")}
            className="checkbox checkbox-warning border-orange-400 checked:border-orange-500 checked:bg-orange-500"
          />
          <span className="label-text font-semibold text-base-content">
            Mark as Premium Recipe
          </span>
        </label>
      </div>

      {/* Thumbnail Upload */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold text-base-content/80">Thumbnail Image *</span>
        </label>

        <input
          type="file"
          accept="image/*"
          id="thumbnailFile"
          className="hidden"
          {...register("thumbnailFile", {
            validate: (v) => {
              if (v instanceof File || thumbnailFile instanceof File) return true;
              if (existingThumbnailUrl) return true;
              return "Thumbnail image is required";
            }
          })}
          onChange={handleThumbnailChange}
        />
        <label
          htmlFor="thumbnailFile"
          className={`relative flex flex-col items-center justify-center border-2 rounded-xl cursor-pointer transition-all duration-200 overflow-hidden w-full h-64
            ${previewUrl ? 'border-solid border-base-200' : 'border-dashed border-base-300 hover:border-orange-400 hover:bg-orange-50/50'}
            ${errors.thumbnailFile && !previewUrl ? 'border-error bg-error/5' : ''}
          `}
        >
          {previewUrl ? (
            // Replaced aspect-video with w-full h-full
            <div className="w-full h-full relative group bg-base-200">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />

              {/* Dark Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-2">
                <FaImage className="w-8 h-8 mb-1" />
                <span className="font-semibold tracking-wide">Click to change thumbnail</span>
                <span className="text-sm opacity-80 max-w-[80%] truncate">{displayFileName}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full text-center gap-2">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-full mb-1">
                <FaUpload className="w-6 h-6" />
              </div>
              <p className="font-semibold text-base-content">Click to upload thumbnail</p>
              <p className="text-xs text-base-content/60">SVG, PNG, JPG (Landscape recommended)</p>
            </div>
          )}
        </label>

        {errors.thumbnailFile && (
          <span className="text-xs text-error mt-1 ml-1">{errors.thumbnailFile.message}</span>
        )}
      </div>

      {/* Dietary Labels */}
      <div className="space-y-4">
        <label className="label pb-0">
          <span className="label-text font-semibold text-base-content/80">Dietary Labels</span>
        </label>

        <div className="bg-base-100 p-4 rounded-xl border border-base-200">
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((label) => {
              const active = dietaryLabels.includes(label);
              return (
                <button
                  type="button"
                  key={label}
                  onClick={() => active ? onRemoveLabel(label) : onAddLabel(label)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer transition-all duration-300 border rounded-lg
                    ${active
                      ? "bg-amber-400 text-amber-950 border-amber-400 font-medium hover:bg-amber-500 hover:border-amber-500 hover:-translate-y-0.5 hover:shadow-md"
                      : "bg-white text-base-content/70 border-base-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 hover:-translate-y-0.5 hover:shadow-sm"
                    }`}
                >
                  {active && <FaTimes className="w-3 h-3 transition-transform hover:rotate-90" />}
                  {formatLabel(label)}
                  {!active && <FaPlus className="w-3 h-3 opacity-40 transition-transform group-hover:rotate-180" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Summary */}
        {dietaryLabels.length > 0 && (
          <div className="flex items-center gap-3 text-sm text-base-content/70 ml-1">
            <span className="font-semibold text-orange-600">Selected:</span>
            <div className="flex flex-wrap gap-1">
              {dietaryLabels.map((l, i) => (
                <span key={l}>{formatLabel(l)}{i < dietaryLabels.length - 1 ? ", " : ""}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* External Links */}
      <div className="space-y-4 pt-4 border-t border-base-200">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <label className="label-text font-semibold text-base-content/80 text-lg">
              External Media
            </label>
            <span className="text-xs text-base-content/50">Add links to YouTube videos or blogs</span>
          </div>
          <button
            type="button"
            onClick={() => appendLink({ name: "", url: "" })}
            className="btn btn-sm btn-outline rounded-full border-orange-400 text-orange-600 hover:bg-orange-500 hover:border-orange-500 hover:text-white gap-2 transition-colors"
          >
            <FaPlus className="w-3 h-3" />
            Add Link
          </button>
        </div>

        {linkFields.length === 0 && (
          <div className="text-center py-6 bg-base-100 rounded-xl border border-dashed border-base-300 text-base-content/40 text-sm">
            No external links added yet.
          </div>
        )}

        <div className="space-y-3">
          {linkFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 rounded-xl bg-base-100 border border-base-200 hover:border-base-300 transition-colors"
            >
              <div className="grid md:grid-cols-12 gap-5 items-start">
                {/* Name */}
                <div className="md:col-span-4 form-control">
                  <label className="label-text text-xs font-semibold mb-1.5 ml-1 text-base-content/80">
                    Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Video Tutorial"
                    {...register(`externalMediaLinks.${index}.name`, {
                      required: "Label is required",
                    })}
                    className={`input input-bordered w-full rounded-lg focus:outline-none focus:border-orange-500 transition-colors ${errors?.externalMediaLinks?.[index]?.name ? "input-error" : ""
                      }`}
                  />
                </div>

                {/* URL */}
                <div className="md:col-span-7 form-control">
                  <label className="label-text text-xs font-semibold mb-1.5 ml-1 text-base-content/80">
                    URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    {...register(`externalMediaLinks.${index}.url`, {
                      required: "URL is required",
                      pattern: {
                        value: /^https?:\/\/.+$/i,
                        message: "Valid URL required",
                      },
                    })}
                    className={`input input-bordered w-full rounded-lg focus:outline-none focus:border-orange-500 transition-colors ${errors?.externalMediaLinks?.[index]?.url ? "input-error" : ""
                      }`}
                  />
                </div>

                {/* Remove Button */}
                <div className="md:col-span-1 flex justify-end md:justify-center md:pt-6">
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="btn btn-square btn-ghost btn-sm text-error/70 hover:text-error hover:bg-error/10 transition-colors"
                    title="Remove link"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Field specific errors display */}
              {(errors?.externalMediaLinks?.[index]?.name || errors?.externalMediaLinks?.[index]?.url) && (
                <div className="mt-2 text-xs text-error flex gap-4">
                  <span>{errors?.externalMediaLinks?.[index]?.name?.message}</span>
                  <span>{errors?.externalMediaLinks?.[index]?.url?.message}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Step1BasicDetails;