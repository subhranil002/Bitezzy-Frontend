import axiosInstance from "../../configs/axiosConfig";

export default async function getRecommendedRecipesApi(limit = 10) {
  const res = await axiosInstance.get("/recipes/recommended", {
    params: { limit },
  });
  return res.data;
}
