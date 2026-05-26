import axiosInstance from "../../configs/axiosConfig";

export default async function getTrendingRecipesApi(limit = 10) {
  const res = await axiosInstance.get("/recipes/trending", {
    params: { limit },
  });
  return res.data;
}
