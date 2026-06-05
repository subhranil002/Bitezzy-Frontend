import axiosInstance from "../../configs/axiosConfig";

export default async function getRecipeByIdApi(id) {
  const res = await axiosInstance.get(`/recipes/${id}`);
  return res.data;
}
