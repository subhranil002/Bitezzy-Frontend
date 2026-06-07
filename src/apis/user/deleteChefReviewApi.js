import toast from "react-hot-toast";

import axiosInstance from "../../configs/axiosConfig";

export default async function deleteChefReviewApi(chefId) {
  const res = axiosInstance.delete(`/user/${chefId}/reviews`);
  toast.promise(res, {
    loading: "Deleting review...",
    success: (data) => {
      return data?.data?.message || "Review deleted successfully";
    },
    error: (err) => {
      return err?.response?.data?.message || "Failed to delete review";
    },
  });

  return (await res).data;
}
