import toast from "react-hot-toast";

import axiosInstance from "../../configs/axiosConfig";

export default async function updateRecipeReviewApi(recipeId, reviewData) {
  const res = axiosInstance.put(`/recipes/${recipeId}/reviews`, reviewData);
  toast.promise(res, {
    loading: "Updating review...",
    success: (data) => {
      return data?.data?.message || "Review updated successfully";
    },
    error: (err) => {
      return err?.response?.data?.message || "Failed to update review";
    },
  });

  return (await res).data;
}
