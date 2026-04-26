import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// import updateRecipeApi from "../../apis/recipe/updateRecipeApi"; 
import { getRecipeById } from "../../redux/slices/recipeSlice";
import Loading from "../../components/Loading"; 

import Step1BasicDetails from "../../components/addRecipe/Step1BasicDetails";
import Step2Ingredients from "../../components/addRecipe/Step2Ingredients";
import Step3Instructions from "../../components/addRecipe/Step3Instructions";
import Step4Preview from "../../components/addRecipe/Step4Preview";
import HomeLayout from "../../layouts/HomeLayout";

const STEPS = [
  {
    id: 1,
    title: "Recipe Details",
    description: "Update basic information",
  },
  {
    id: 2,
    title: "Ingredients",
    description: "Modify ingredients or quantities",
  },
  {
    id: 3,
    title: "Instructions",
    description: "Edit cooking instructions",
  },
  {
    id: 4,
    title: "Preview",
    description: "Review changes before saving",
  },
];

const cuisineOptions = [
  "indian", "italian", "chinese", "mexican", "thai", "japanese",
  "french", "mediterranean", "american", "korean", "vietnamese",
  "middle-eastern", "british", "spanish", "german", "greek",
];

const dietaryOptions = [
  "vegetarian", "vegan", "keto", "paleo", "gluten-free", "dairy-free",
  "low-carb", "high-protein", "sugar-free", "organic", "raw",
  "mediterranean", "low-fat",
];

const unitOptions = [
  "g", "kg", "ml", "l", "cup", "tbsp", "tsp", "pc", "oz", "lb",
];

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { recipe } = useSelector((state) => state.recipe);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
      cuisine: "",
      servings: "",
      prepMinutes: "",
      cookMinutes: "",
      isPremium: false,
      dietaryLabels: [],
      ingredients: [],
      steps: [],
      thumbnailFile: null,
      externalMediaLinks: [],
    },
  });

  const {
    handleSubmit,
    trigger,
    getValues,
    watch,
    setError,
    setValue,
    reset,
    register,
    control,
    formState: { errors },
  } = methods;

  // 1. Fetch data on mount
  useEffect(() => {
    if (id) {
      dispatch(getRecipeById(id));
    }
  }, [id, dispatch]);

  // 2. Populate form when data arrives
  useEffect(() => {
    if (recipe && recipe._id === id) {
      reset({
        title: recipe.title || "",
        description: recipe.description || "",
        cuisine: recipe.cuisine || "",
        servings: recipe.servings || "",
        prepMinutes: recipe.prepMinutes || "",
        cookMinutes: recipe.cookMinutes || recipe.totalCookingTime || "",
        isPremium: recipe.isPremium || false,
        dietaryLabels: recipe.dietaryLabels || [],
        ingredients: recipe.ingredients?.map((ing, idx) => ({
          id: `i-${idx}`,
          name: ing.name || "",
          quantity: ing.quantity || "",
          unit: ing.unit || "g",
          marketPrice: ing.marketPrice || ""
        })) || [],
        steps: recipe.steps?.map((step, idx) => ({
          id: `s-${idx}`,
          text: step.instruction || "",
          imageFile: null // null, backend should keep old image if no new one is provided
        })) || [],
        thumbnailFile: null, // null unless user uploads a new one
        externalMediaLinks: recipe.externalMediaLinks || [],
      });
    }
  }, [recipe, id, reset]);

  const nextStep = async () => {
    let fieldsToValidate = [];
    const values = getValues();

    if (currentStep === 1) {
      fieldsToValidate = [
        "title",
        "description",
        "cuisine",
        "servings",
        "prepMinutes",
        "cookMinutes",
      ];
      // Notice: "thumbnailFile" is removed here. We don't force a new upload on edit.

      const extLinks = values.externalMediaLinks || [];
      if (extLinks.length) {
        fieldsToValidate.push(
          ...extLinks.map((_, i) => `externalMediaLinks.${i}.name`),
          ...extLinks.map((_, i) => `externalMediaLinks.${i}.url`)
        );
      }
    } else if (currentStep === 2) {
      if (!values.ingredients || values.ingredients.length === 0) {
        setError("ingredients", { message: "At least one ingredient is required" });
        return;
      }
      fieldsToValidate = values.ingredients.flatMap((_, i) => [
        `ingredients.${i}.name`,
        `ingredients.${i}.quantity`,
        `ingredients.${i}.unit`,
        `ingredients.${i}.marketPrice`,
      ]);
    } else if (currentStep === 3) {
      if (!values.steps || values.steps.length === 0) {
        setError("steps", { message: "At least one step is required" });
        return;
      }
      fieldsToValidate = values.steps.flatMap((_, i) => [`steps.${i}.text`]);
    }

    const ok = fieldsToValidate.length ? await trigger(fieldsToValidate) : true;
    if (ok) setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const totalCookingTime =
        (Number(data.prepMinutes) || 0) + (Number(data.cookMinutes) || 0);

      const ingredients = (data.ingredients || []).map((ing) => ({
        name: ing.name?.trim(),
        quantity: Number(ing.quantity),
        unit: ing.unit,
        marketPrice: Number(ing.marketPrice),
      }));

      const steps = (data.steps || []).map((step, index) => ({
        stepNo: index + 1,
        instruction: step.text?.trim(),
      }));

      const dietaryLabels =
        Array.isArray(data.dietaryLabels) && data.dietaryLabels.length > 0
          ? data.dietaryLabels
          : undefined;

      const externalMediaLinks =
        Array.isArray(data.externalMediaLinks) &&
        data.externalMediaLinks.length > 0
          ? data.externalMediaLinks.map((link) => ({
              name: link.name?.trim(),
              url: link.url,
            }))
          : undefined;

      const thumbnailFile = data.thumbnailFile || null;
      const stepImages = (data.steps || [])
        .map((step) => step.imageFile || null)
        .filter(Boolean);

      const formData = new FormData();

      formData.append("title", data.title?.trim() || "");
      formData.append("description", data.description?.trim() || "");
      formData.append("cuisine", data.cuisine);
      formData.append("servings", String(Number(data.servings) || 0));
      formData.append("totalCookingTime", String(totalCookingTime));
      formData.append("isPremium", data.isPremium ? "true" : "false");

      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("steps", JSON.stringify(steps));

      if (dietaryLabels) {
        formData.append("dietaryLabels", JSON.stringify(dietaryLabels));
      }

      if (externalMediaLinks) {
        formData.append("externalMediaLinks", JSON.stringify(externalMediaLinks));
      }

      // Only append files if the user actually selected new ones
      if (thumbnailFile) {
        formData.append("thumbnailFile", thumbnailFile);
      }

      stepImages.forEach((imgFile) => {
        if (imgFile) formData.append("stepImages", imgFile);
      });

      // Submit the update
      await updateRecipeApi(id, formData);

      // Redirect back to the recipe detail page upon success
      navigate(`/recipe/${id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!recipe || recipe._id !== id) {
    return <Loading />; 
  }

  return (
    <HomeLayout>
      <FormProvider
        {...{
          register,
          watch,
          setValue,
          control,
          formState: { errors },
        }}
      >
        <form className="container mx-auto px-4 py-8 max-w-4xl">
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Edit Recipe</h1>
            <p className="text-gray-500 mt-2">Updating: {recipe.title}</p>
          </div>

          {/* --- Stepper & Progress Bar --- */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              {/* Steps */}
              {STEPS.map((step) => {
                const isCompleted = currentStep > step.id;
                const isActive = currentStep === step.id;

                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center relative z-10"
                  >
                    <div
                      className={`btn btn-circle btn-md transition-all duration-300 border-2 ${
                        isActive
                          ? "bg-orange-500 text-white border-orange-500 shadow-md scale-110"
                          : isCompleted
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-base-100 text-base-content/30 border-base-200 hover:border-orange-300"
                      }`}
                    >
                      {isCompleted ? (
                        <FaCheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="font-bold">{step.id}</span>
                      )}
                    </div>

                    <div
                      className={`mt-3 text-center transition-colors duration-300 ${
                        isActive ? "text-orange-600" : "text-base-content/50"
                      }`}
                    >
                      <div className="text-sm font-bold">{step.title}</div>
                      <div className="text-[10px] font-medium hidden sm:block opacity-80">
                        {step.description}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Background Line */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-base-200 -z-10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 transition-all duration-500 ease-in-out"
                  style={{
                    width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* --- Main Form Content --- */}
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body p-6 md:p-8">
              {currentStep === 1 && (
                <Step1BasicDetails
                  cuisineOptions={cuisineOptions}
                  dietaryOptions={dietaryOptions}
                />
              )}
              {currentStep === 2 && (
                <Step2Ingredients unitOptions={unitOptions} />
              )}
              {currentStep === 3 && <Step3Instructions />}
              {currentStep === 4 && <Step4Preview />}
            </div>
          </div>

          {/* --- Navigation Buttons --- */}
          <div className="flex justify-between mt-8 pt-4 border-t border-transparent">
            {/* Back Button */}
            {currentStep === 1 ? (
              <button
                type="button"
                onClick={() => navigate(`/recipe/${id}`)} 
                className="btn btn-ghost text-base-content/50 hover:text-error hover:bg-error/10 gap-2 transition-all"
              >
                <FaHome className="w-4 h-4" /> Cancel Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={prevStep}
                className="btn btn-outline border-base-300 text-base-content/60 hover:bg-base-200 hover:border-base-300 hover:text-base-content gap-2 transition-all"
              >
                <FaChevronLeft className="w-3 h-3" /> Back
              </button>
            )}

            {/* Next / Submit Button */}
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn bg-orange-500 hover:bg-orange-600 text-white border-orange-500 hover:border-orange-600 gap-2 px-8 shadow-sm hover:shadow-md"
              >
                Next Step <FaChevronRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                className="btn gap-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 px-8 shadow-sm hover:shadow-md"
              >
                {!isSubmitting && <FaCheckCircle className="w-4 h-4" />}
                {isSubmitting ? "Saving Updates..." : "Save Updates"}
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </HomeLayout>
  );
}