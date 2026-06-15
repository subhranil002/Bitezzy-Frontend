import axiosInstance from "../../configs/axiosConfig";

export default async function getDashboardApi() {
    const res = axiosInstance.get("/user/dashboard");
    return (await res).data;
}
