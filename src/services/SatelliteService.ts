import axios, { AxiosError } from "axios";
import {
  ErrorMessage,
  SatelliteTLEResponse,
} from "./types/satelliteTleResponse";

const axiosInstance = axios.create({
  timeout: 3000,
});

const BASE_URL = process.env.REACT_APP_TLE_API_URL ?? "";

export const getSatelliteByID = async (id: number) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data as SatelliteTLEResponse;
  } catch (error) {
    console.log(error);
    const axiosError = error as AxiosError;
    const response: ErrorMessage = {
      code: axiosError.code!,
      message: axiosError.message,
    };

    return response;
  }
};
