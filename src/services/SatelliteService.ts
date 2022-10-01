import axios from "axios";
import { SatelliteTLEResponse } from "./types/satelliteTleResponse";

const axiosInstance = axios.create({
  timeout: 3000,
});

const BASE_URL = process.env.REACT_APP_TLE_API_URL ?? "";

export const getSatelliteByID = async (id: number) => {
  const response = await axiosInstance.get(`${BASE_URL}/${id}`);
  return response.data as SatelliteTLEResponse;
};
