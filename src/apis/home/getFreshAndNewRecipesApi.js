import axiosInstance from "../../configs/axiosConfig";

export default async function getFreshAndNewRecipes(limit = 10) {
  const res = await axiosInstance.get("/recipes/fresh", {
    params: { limit },
  });
  return res.data;
}
