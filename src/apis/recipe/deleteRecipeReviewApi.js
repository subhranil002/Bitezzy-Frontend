import toast from "react-hot-toast";

import axiosInstance from "../../configs/axiosConfig";

export default async function deleteRecipeReviewApi(recipeId) {
  const res = axiosInstance.delete(`/recipes/${recipeId}/reviews`);
  toast.promise(res, {
    loading: "Deleting review...",
    success: (data) => {
      return data?.data?.message || "Review deleted successfully";
    },
    error: (err) => {
      return err?.response?.data?.message || "Failed to delete review";
    },
  });

  return (await res).data;
}
