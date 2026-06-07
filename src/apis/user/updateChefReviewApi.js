import toast from "react-hot-toast";

import axiosInstance from "../../configs/axiosConfig";

export default async function updateChefReviewApi(chefId, reviewData) {
  const res = axiosInstance.put(`/user/${chefId}/reviews`, reviewData);
  toast.promise(res, {
    loading: "Updating review...",
    success: (data) => {
      return data?.data?.message || "Review updated successfully";
    },
    error: (err) => {
      return err?.response?.data?.message || "Failed to update review";
    },
  });

  return (await res).data;
}
