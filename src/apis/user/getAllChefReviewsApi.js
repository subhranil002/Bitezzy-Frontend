import axiosInstance from "../../configs/axiosConfig";

export default async function getAllChefReviewsApi(
  chefId,
  page = 1,
  limit = 4,
) {
  const res = axiosInstance.get(`/user/${chefId}/reviews`, {
    params: {
      page,
      limit,
    },
  });
  return (await res).data;
}
