import toast from "react-hot-toast";

import axiosInstance from "../../configs/axiosConfig";

export default async function addChefReviewApi(chefId, reviewData) {
  const res = axiosInstance.post(`/user/${chefId}/reviews`, reviewData);
  toast.promise(res, {
    loading: "Submitting review...",
    success: (data) => {
      return data?.data?.message;
    },
    error: (err) => {
      return err?.response?.data?.message;
    },
  });

  return (await res).data;
}
