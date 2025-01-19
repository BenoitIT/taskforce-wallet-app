import { userInfo } from "@/interfaces/users";
import { walletApi } from "./axios";
export const usersBaseEndpoint = "/users";
export const createAnaccount = async (data: userInfo) => {
  try {
    const response = await walletApi.post(usersBaseEndpoint, data);
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.error(err);
  }
};
export const updatePassword = async (id: number, data: userInfo) => {
  try {
    const response = await walletApi.put(`${usersBaseEndpoint}/${id}`, data);
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.error(err);
  }
};
