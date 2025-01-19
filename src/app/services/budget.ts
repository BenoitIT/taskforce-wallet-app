import { BudgetInfo } from "@/interfaces/budget";
import { walletApi } from "./axios";
export const budgetBaseEndpoint = "/budget";
export const createBuget = async (data: BudgetInfo) => {
  try {
    const response = await walletApi.post(budgetBaseEndpoint, data);
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.log(err);
  }
};

export const getBudgets = async (user: number) => {
  try {
    const response = await walletApi.get(`${budgetBaseEndpoint}?user=${user}`);
    return { data: response.data.data, status: response.data.status };
  } catch (err) {
    console.error(err);
  }
};

export const deleteBudget = async (id: number) => {
  try {
    const response = await walletApi.delete(budgetBaseEndpoint + `/${id}`);
    return response.data.message;
  } catch (err) {
    console.log(err);
  }
};

export const getBudget = async (id: number) => {
  try {
    const response = await walletApi.get(budgetBaseEndpoint + `/${id}`);
    return { data: response.data.data, status: response.data.status };
  } catch (err) {
    console.log(err);
  }
}; 

export const updateBuget = async (data: BudgetInfo,id:number) => {
  try {
    const response = await walletApi.put(`${budgetBaseEndpoint}/${id}`, data);
    return { message: response.data.message, status: response.data.status }
  } catch (err) {
    console.log(err);
  }
};