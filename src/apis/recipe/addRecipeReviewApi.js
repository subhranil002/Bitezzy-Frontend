import toast from "react-hot-toast";

import axiosInstance from "../../configs/axiosConfig";

export default async function addRecipeReviewApi(recipeId, reviewData) {
  const res = axiosInstance.post(`/recipes/${recipeId}/reviews`, reviewData);
  toast.promise(res, {
    loading: "Submitting review...",
    success: (data) => {
      return data?.data?.message || "Review submitted successfully";
    },
    error: (err) => {
      return err?.response?.data?.message || "Failed to submit review";
    },
  });

  return (await res).data;
}
