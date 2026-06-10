import axiosInstance from "../../configs/axiosConfig";

export default async function getTrendingPremiumRecipesApi(limit = 4) {
  const res = await axiosInstance.get("/recipes/trending-premium", {
    params: { limit },
  });
  return res.data;
}
