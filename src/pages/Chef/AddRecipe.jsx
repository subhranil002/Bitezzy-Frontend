import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import addRecipeApi from "../../apis/recipe/addRecipeApi";
import Step1BasicDetails from "../../components/addRecipe/Step1BasicDetails";
import Step2Ingredients from "../../components/addRecipe/Step2Ingredients";
import Step3Instructions from "../../components/addRecipe/Step3Instructions";
import Step4Preview from "../../components/addRecipe/Step4Preview";
import { CUISINE_OPTIONS, DIETARY_OPTIONS, UNIT_OPTIONS } from "../../constants";
import HomeLayout from "../../layouts/HomeLayout";

const STEPS = [
  {
    id: 1,
    title: "Recipe Details",
    description: "Basic information about your recipe",
  },
  {
    id: 2,
    title: "Ingredients",
    description: "List all ingredients with quantities",
  },
  {
    id: 3,
    title: "Instructions",
    description: "Step-by-step cooking instructions",
  },
  {
    id: 4,
    title: "Preview",
    description: "Review your recipe before publishing",
  },
];

export default function AddRecipe() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
      cuisine: "",
      servings: "",
      cookMinutes: "",
      isPremium: false,
      dietaryLabels: [],
      ingredients: [
        { id: "i-1", name: "", quantity: "", unit: "g", marketPrice: "" },
      ],
      steps: [{ id: "s-1", text: "", imageFile: null }],
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

  const nextStep = async () => {
    let fieldsToValidate = [];
    const values = getValues();

    if (currentStep === 1) {
      fieldsToValidate = [
        "title",
        "description",
        "cuisine",
        "servings",
        "cookMinutes",
        "thumbnailFile",
      ];

      const extLinks = values.externalMediaLinks || [];
      if (extLinks.length) {
        fieldsToValidate.push(
          ...extLinks.map((_, i) => `externalMediaLinks.${i}.name`),
          ...extLinks.map((_, i) => `externalMediaLinks.${i}.url`)
        );
      }
    } else if (currentStep === 2) {
      if (!values.ingredients || values.ingredients.length === 0) {
        setError("ingredients", {
          message: "At least one ingredient is required",
        });
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
        setError("steps", {
          message: "At least one step is required",
        });
        return;
      }
      fieldsToValidate = values.steps.flatMap((_, i) => [
        `steps.${i}.text`,
        `steps.${i}.imageFile`,
      ]);
    }

    const ok = fieldsToValidate.length ? await trigger(fieldsToValidate) : true;
    if (ok) setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const totalCookingTime = Number(data.cookMinutes) || 0;

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
        formData.append(
          "externalMediaLinks",
          JSON.stringify(externalMediaLinks)
        );
      }

      if (thumbnailFile) {
        formData.append("thumbnailFile", thumbnailFile);
      }

      stepImages.forEach((imgFile) => {
        formData.append("stepImages", imgFile);
      });

      await addRecipeApi(formData);

      reset();
      setCurrentStep(1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HomeLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 py-8">
        <FormProvider
          {...{
            register,
            watch,
            setValue,
            control,
            formState: { errors },
          }}
        >
          <form className="container mx-auto px-4 max-w-4xl">
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
              <div className="absolute top-6 left-0 right-0 h-1 bg-base-200 z-0 rounded-full overflow-hidden">
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
          <div className={`card bg-base-100 shadow-lg rounded-3xl transition-all duration-500 ${
            currentStep === 1 ? 'border border-orange-100 border-t-4 border-t-orange-500' :
            currentStep === 2 ? 'border border-orange-100 border-t-4 border-r-4 border-t-orange-500 border-r-orange-500' :
            currentStep === 3 ? 'border border-orange-100 border-t-4 border-r-4 border-b-4 border-t-orange-500 border-r-orange-500 border-b-orange-500' :
            'border-4 border-orange-500'
          }`}>
            <div className="card-body p-6 md:p-10">
              {currentStep === 1 && (
                <Step1BasicDetails
                  cuisineOptions={CUISINE_OPTIONS}
                  dietaryOptions={DIETARY_OPTIONS}
                />
              )}
              {currentStep === 2 && (
                <Step2Ingredients unitOptions={UNIT_OPTIONS} />
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
                onClick={() => navigate("/")} // Navigate back to home
                className="btn border-none bg-base-200 text-base-content/60 hover:text-error hover:bg-error/10 gap-2 transition-all rounded-2xl"
              >
                <FaHome className="w-4 h-4" /> Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={prevStep}
                className="btn border-none bg-base-200 text-base-content/60 hover:text-base-content hover:bg-base-300 gap-2 transition-all rounded-2xl"
              >
                <FaChevronLeft className="w-3 h-3" /> Back
              </button>
            )}

            {/* Next / Submit Button */}
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn bg-orange-500 hover:bg-orange-600 text-white border-orange-500 hover:border-orange-600 gap-2 px-8 rounded-2xl shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transition-all"
              >
                Next Step <FaChevronRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                className="btn gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 px-10 rounded-2xl shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transition-all"
              >
                {!isSubmitting && <FaCheckCircle className="w-4 h-4" />}
                {isSubmitting ? "Publishing Recipe..." : "Publish Recipe"}
              </button>
            )}
          </div>
        </form>
      </FormProvider>
      </div>
    </HomeLayout>
  );
}
