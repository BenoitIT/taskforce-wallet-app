import { walletApi } from "./axios";
import { categoriesInfo } from "@/interfaces/categories";
export const transactionsBaseEndpoint = "/transactions";
export const createTransaction = async (data: categoriesInfo) => {
  try {
    const response = await walletApi.post(transactionsBaseEndpoint, data);
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.log(err);
  }
};

export const getTransactions = async (user: number) => {
  try {
    const response = await walletApi.get(
      `${transactionsBaseEndpoint}?user=${user}`
    );
    return { data: response.data.data, status: response.data.status };
  } catch (err) {
    console.error(err);
  }
};

export const deleteTransaction = async (id: number) => {
  try {
    const response = await walletApi.delete(transactionsBaseEndpoint + `/${id}`);
    return response.data.message;
  } catch (err) {
    console.log(err);
  }
};