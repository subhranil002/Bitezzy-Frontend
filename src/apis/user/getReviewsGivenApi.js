import axiosInstance from "../../configs/axiosConfig";

export default async function getReviewsGivenApi(page = 1, limit = 4) {
  const res = axiosInstance.get("/user/reviews-given", {
    params: {
      page,
      limit,
    },
  });
  return (await res).data;
}
