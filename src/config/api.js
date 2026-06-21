import "dotenv/config";
import axios from "axios";

export const csMarketApi = axios.create({
  baseURL: "https://market.csgo.com/api/v2",
  timeout: 10000,
});

export const steamMarketApi = axios.create({
  baseURL: "https://steamcommunity.com/market",
  headers: {
    Accept: "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    Cookie: `steamLoginSecure=${process.env.steamLoginSecure}; sessionid=${process.env.sessionid};`,
  },
});
