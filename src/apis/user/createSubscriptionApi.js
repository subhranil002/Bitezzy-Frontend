import toast from "react-hot-toast";

import axiosInstance from "../../configs/axiosConfig";

export default async function createSubscriptionApi(data) {
  const res = axiosInstance.post("/payment/create-subscription", data);
  toast.promise(res, {
    loading: "Creating subscription...",
    error: (err) => {
      return err?.response?.data?.message;
    },
  });

  return (await res).data;
}
