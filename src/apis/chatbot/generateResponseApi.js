import axiosInstance from "../../configs/axiosConfig";

export default async function generateResponseApi(data) {
  const res = axiosInstance.post("/chatbot/chat", data);
  return (await res).data;
}
