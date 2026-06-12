import axiosInstance from "../../configs/axiosConfig";

export default async function getChefDashboardApi() {
    const res = axiosInstance.get("/user/dashboard/chef");
    return (await res).data;
}
