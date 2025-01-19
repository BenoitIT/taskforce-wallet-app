import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export const walletApi = axios.create({
  baseURL: `${apiUrl}/api`,

});
