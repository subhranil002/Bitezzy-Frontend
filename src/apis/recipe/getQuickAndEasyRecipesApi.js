import axiosInstance from "../../configs/axiosConfig";

export default async function getQuickAndEasyRecipesApi(limit = 10) {
  const res = await axiosInstance.get("/recipes/quick", {
    params: { limit },
  });
  return res.data;
}
