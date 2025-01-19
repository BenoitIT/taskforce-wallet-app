import { walletApi } from "./axios";
import { categoriesInfo } from "@/interfaces/categories";
export const categoryBaseEndpoint = "/categories";
export const createCategory = async (data: categoriesInfo) => {
  try {
    const response = await walletApi.post(categoryBaseEndpoint, data);
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.error(err);
  }
};

export const getCategories = async (user: number) => {
  try {
    const response = await walletApi.get(
      `${categoryBaseEndpoint}?user=${user}`
    );
    return { data: response.data.data, status: response.data.status };
  } catch (err) {
    console.error(err);
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const response = await walletApi.delete(categoryBaseEndpoint + `/${id}`);
    return response.data.message;
  } catch (err) {
    console.error(err);
  }
};

export const getCategory = async (id: number) => {
  try {
    const response = await walletApi.get(
      `${categoryBaseEndpoint}/${id}`
    );
    return { data: response.data.data, status: response.data.status };
  } catch (err) {
    console.error(err);
  }
};

export const updateCategory = async (id: number,data:categoriesInfo) => {
  try {
    const response = await walletApi.put(
      `${categoryBaseEndpoint}/${id}`,data
    );
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.error(err);
  }
};