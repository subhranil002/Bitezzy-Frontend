import toast from "react-hot-toast";

import axiosInstance from "../../configs/axiosConfig";

export default async function getMyRecipesApi(id) {
  const res = await axiosInstance.get(`/user/${id}/recipes`);

  if (!res.data.success) {
    toast.error(res?.response?.data?.message);
  }

  return res.data;
}
