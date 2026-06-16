import axios from "axios";

export const csMarketApi = axios.create({
  baseURL: "https://market.csgo.com/api/v2",
  timeout: 10000,
});
