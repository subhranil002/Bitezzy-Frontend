import axiosInstance from "../../configs/axiosConfig";

export default async function getRecipeReviewsApi(recipeId, page = 1, limit = 10) {
  const res = await axiosInstance.get(`/recipes/${recipeId}/reviews`, {
    params: { page, limit },
  });
  return res.data;
}
