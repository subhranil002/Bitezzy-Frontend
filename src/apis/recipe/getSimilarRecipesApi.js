import axiosInstance from "../../configs/axiosConfig";

export default async function getSimilarRecipesApi(id, limit = 5) {
  const res = await axiosInstance.get(`/recipes/similar/${id}`, {
    params: { limit },
  });

  return res.data;
}