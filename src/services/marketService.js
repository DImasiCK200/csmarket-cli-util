import { csMarketApi } from "../config/api.js";
import { convertPriceArrays, summarizeDailyPrices } from "../utils/prices.js";

export const getItemId = async (marketHashName) => {
  const response = await csMarketApi.get("full-history/all.json");

  return response.data.history[marketHashName];
};

export const getPriceHistory = async (marketHashName) => {
  const itemId = await getItemId(marketHashName);
  const response = await csMarketApi.get(`full-history/${itemId}.json`);

  const prices = response.data.data.history.map((priceInfo) => {
    return convertPriceArrays(priceInfo);
  });

  return summarizeDailyPrices(prices);
};
