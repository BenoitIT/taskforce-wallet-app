import { walletApi } from "./axios";
export const reportBaseEndpoint = "/reportinfo";

export const getStatistics = async (
  user: number,
  startdate: string,
  enddate: string
) => {
  try {
    const response = await walletApi.get(
      `${reportBaseEndpoint}?user=${user}&startDate=${startdate}&endDate=${enddate}`
    );
    return { data: response.data.data, status: response.data.status };
  } catch (err) {
    console.error(err);
  }
};
