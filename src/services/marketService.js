import { csMarketApi } from "../config/api.js";
import { convertPriceArrays, summarizeDailyPrices } from "../utils/prices.js";
import { getFollowedItemId } from "./storageService.js";

export const getItemId = async (marketHashName) => {
  const response = await csMarketApi.get("full-history/all.json");

  return response.data.history[marketHashName];
};

export const getPriceHistory = async (marketHashName) => {
  const itemId =
    (await getFollowedItemId(marketHashName)) ||
    (await getItemId(marketHashName));
  const response = await csMarketApi.get(`full-history/${itemId}.json`);

  const prices = response.data.data.history.map((priceInfo) => {
    return convertPriceArrays(priceInfo);
  });

  // console.log(
  //   prices.slice(0, 5).map((item) => ({
  //     ...item,
  //     timestamp: new Date(item.timestamp * 1000).toISOString(),
  //   })),
  // );

  return summarizeDailyPrices(prices);
};
