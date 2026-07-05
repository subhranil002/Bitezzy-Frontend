import { useFieldArray, useFormContext } from "react-hook-form";
import { FaPlus, FaTrash, FaExclamationCircle } from "react-icons/fa";

const Step2Ingredients = ({ unitOptions = [] }) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  return (
    <div className="space-y-8 p-1 relative z-0">
      {/* Cool Background Graphic */}
      <div className="absolute -inset-6 md:-inset-10 bg-[url('https://res.cloudinary.com/dpoqek1ce/image/upload/food_tjm7b4.png')] opacity-40 mix-blend-overlay pointer-events-none -z-10 bg-repeat bg-[length:800px] rounded-3xl"></div>
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-base-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-base-content">Ingredients</h2>
          <p className="text-sm text-base-content/60 mt-1">
            List everything needed for this dish.
          </p>
        </div>
        
        <button
          type="button"
          onClick={() =>
            append({
              id: `i-${Date.now()}`,
              name: "",
              quantity: "", 
              unit: "g",
              marketPrice: "",
            })
          }
          className="btn btn-sm btn-outline rounded-full border-orange-400 text-orange-600 hover:bg-orange-500 hover:border-orange-500 hover:text-white gap-2 transition-colors"
        >
          <FaPlus className="w-3 h-3" />
          Add Ingredient
        </button>
      </div>

      {/* --- Ingredients List --- */}
      <div className="space-y-4">
        
        {/* Empty State */}
        {fields.length === 0 && (
          <div className="alert bg-orange-50/30 border border-dashed border-orange-200 flex flex-col items-center justify-center py-10 text-center shadow-none rounded-xl">
            <div className="text-orange-400 mb-2">
                <FaExclamationCircle className="w-6 h-6 mx-auto" />
            </div>
            <span className="text-orange-800/60 text-sm">No ingredients added yet.</span>
            <button 
                type="button"
                onClick={() => append({ id: `i-${Date.now()}`, name: "", quantity: 0, unit: "g", marketPrice: 0 })}
                className="btn btn-link btn-sm text-orange-500 no-underline hover:text-orange-600"
            >
                Add your first ingredient
            </button>
          </div>
        )}

        {/* List Items */}
        {fields.map((field, index) => (
          <div 
            key={field.id} 
            className="p-4 rounded-xl bg-base-100 border border-base-200 hover:border-base-300 transition-colors"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              
              {/* 1. Ingredient Name (5 cols) */}
              <div className="form-control md:col-span-5 w-full">
                <label className="label pt-0 pb-1.5" htmlFor={`ingredients.${index}.name`}>
                  <span className="label-text text-xs font-semibold text-base-content/80">Ingredient Name</span>
                </label>
                <input
                  id={`ingredients.${index}.name`}
                  type="text"
                  placeholder="e.g. Fresh Basil"
                  {...register(`ingredients.${index}.name`, {
                    required: "Name is required",
                  })}
                  className={`input input-sm input-bordered w-full rounded-lg focus:outline-none focus:border-orange-500 transition-colors ${
                    errors?.ingredients?.[index]?.name ? "input-error" : ""
                  }`}
                />
              </div>

              {/* 2. Quantity (2 cols) */}
              <div className="form-control md:col-span-2 w-full">
                <label className="label pt-0 pb-1.5" htmlFor={`ingredients.${index}.quantity`}>
                  <span className="label-text text-xs font-semibold text-base-content/80">Quantity</span>
                </label>
                <input
                  id={`ingredients.${index}.quantity`}
                  type="number"
                  step="0.5"
                  placeholder="0"
                  {...register(`ingredients.${index}.quantity`, {
                    required: "Req",
                    min: { value: 0.001, message: "> 0" },
                    valueAsNumber: true,
                  })}
                  className={`input input-sm input-bordered w-full rounded-lg focus:outline-none focus:border-orange-500 transition-colors ${
                    errors?.ingredients?.[index]?.quantity ? "input-error" : ""
                  }`}
                />
              </div>

              {/* 3. Unit (2 cols) */}
              <div className="form-control md:col-span-2 w-full">
                <label className="label pt-0 pb-1.5" htmlFor={`ingredients.${index}.unit`}>
                  <span className="label-text text-xs font-semibold text-base-content/80">Unit</span>
                </label>
                <select
                  id={`ingredients.${index}.unit`}
                  {...register(`ingredients.${index}.unit`, {
                    required: "Req",
                  })}
                  className={`select select-sm select-bordered w-full rounded-lg focus:outline-none focus:border-orange-500 transition-colors ${
                    errors?.ingredients?.[index]?.unit ? "select-error" : ""
                  }`}
                >
                  {unitOptions.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Market Price (2 cols) */}
              <div className="form-control md:col-span-2 w-full">
                <label className="label pt-0 pb-1.5" htmlFor={`ingredients.${index}.marketPrice`}>
                  <span className="label-text text-xs font-semibold text-base-content/80">Price (₹)</span>
                </label>
                <input
                  id={`ingredients.${index}.marketPrice`}
                  type="number"
                  placeholder="0.00"
                  {...register(`ingredients.${index}.marketPrice`, {
                    required: "Req",
                    min: { value: 0.01, message: "> 0" },
                    valueAsNumber: true,
                  })}
                  className={`input input-sm input-bordered w-full rounded-lg focus:outline-none focus:border-orange-500 transition-colors ${
                    errors?.ingredients?.[index]?.marketPrice ? "input-error" : ""
                  }`}
                />
              </div>

              {/* 5. Remove Button (1 col) */}
              <div className="md:col-span-1 flex justify-end md:justify-center pt-0 md:pt-6">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="btn btn-square btn-ghost btn-sm text-error/70 hover:text-error hover:bg-error/10 transition-colors"
                  title="Remove ingredient"
                >
                  <FaTrash className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

              {/* Error Messages Row */}
              {(errors?.ingredients?.[index]?.name || errors?.ingredients?.[index]?.quantity || errors?.ingredients?.[index]?.marketPrice) && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 px-1">
                   {errors.ingredients[index].name && (
                       <span className="text-xs text-error flex items-center gap-1"><FaExclamationCircle/> {errors.ingredients[index].name.message}</span>
                   )}
                   {errors.ingredients[index].quantity && (
                       <span className="text-xs text-error flex items-center gap-1"><FaExclamationCircle/> Qty: {errors.ingredients[index].quantity.message}</span>
                   )}
                   {errors.ingredients[index].marketPrice && (
                       <span className="text-xs text-error flex items-center gap-1"><FaExclamationCircle/> Price: {errors.ingredients[index].marketPrice.message}</span>
                   )}
                </div>
              )}
            </div>
        ))}
      </div>

      {/* Global Error (if any) */}
      {errors?.ingredients?.root && (
        <div className="alert alert-error shadow-sm py-2">
            <FaExclamationCircle />
            <span className="text-sm">{errors.ingredients.root.message}</span>
        </div>
      )}
    </div>
  );
};

export default Step2Ingredients;