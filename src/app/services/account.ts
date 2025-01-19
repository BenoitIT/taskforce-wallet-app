import { walletApi } from "./axios";
import { cashAccountInfo } from "@/interfaces/accounts";
export const cashAccountBaseEndpoint = "/accounts";
export const createCashaccount = async (data: cashAccountInfo) => {
  try {
    const response = await walletApi.post(cashAccountBaseEndpoint, data);
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.error(err);
  }
};

export const getCashaccount = async (user: number) => {
  try {
    const response = await walletApi.get(
      `${cashAccountBaseEndpoint}?user=${user}`
    );
    return { data: response.data.data, status: response.data.status };
  } catch (err) {
    console.error(err);
  }
};

export const deleteCashAccount = async (id: number) => {
  try {
    const response = await walletApi.delete(cashAccountBaseEndpoint + `/${id}`);
    return response.data.message;
  } catch (err) {
    console.error(err);
  }
};
export const getAccount = async (id: number) => {
  try {
    const response = await walletApi.get(
      `${cashAccountBaseEndpoint}/${id}`
    );
    return { data: response.data.data, status: response.data.status };
  } catch (err) {
    console.error(err);
  }
};
export const UpdateAccount = async (id: number,data:cashAccountInfo) => {
  try {
    const response = await walletApi.put(
      `${cashAccountBaseEndpoint}/${id}`,data
    );
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.error(err);
  }
};
