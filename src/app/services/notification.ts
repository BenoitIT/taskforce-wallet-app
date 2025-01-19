import { walletApi } from "./axios";
export const categoryBaseEndpoint = "/notification";
export const getNotifications = async (user: number) => {
  try {
    const response = await walletApi.get(
      `${categoryBaseEndpoint}?user=${user}`
    );
    return { data: response.data.data, status: response.data.status };
  } catch (err) {
    console.error(err);
  }
};
export const getNotificationsNumber = async (user: number) => {
  try {
    const response = await walletApi.get(
      `${categoryBaseEndpoint}/count?user=${user}`
    );
    return { data: response.data.data, status: response.data.status };
  } catch (err) {
    console.error(err);
  }
};
export const markNotificationAsRead = async (user: number) => {
  try {
    const response = await walletApi.put(
      `${categoryBaseEndpoint}?user=${user}`
    );
    return { message: response.data.message, status: response.data.status };
  } catch (err) {
    console.error(err);
  }
};
