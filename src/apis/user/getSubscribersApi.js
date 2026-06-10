import toast from "react-hot-toast";

import axiosInstance from "../../configs/axiosConfig";

export default async function getSubscribersApi() {
  const res = await axiosInstance.get("/user/subscribers");

  if (!res.data.success) {
    toast.error(res?.response?.data?.message);
  }

  return res.data;
}
