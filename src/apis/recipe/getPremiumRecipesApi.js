import axiosInstance from "../../configs/axiosConfig";

export default async function getPremiumRecipesApi(limit = 10) {
  const res = await axiosInstance.get("/recipes/premium", {
    params: { limit },
  });
  return res.data;
}
