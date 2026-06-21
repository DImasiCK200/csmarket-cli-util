import { steamMarketApi } from "../config/api.js";
import { groupPricesSteam } from "../utils/prices.js";

export const getPriceHistory = async (marketHashName) => {
  const response = await steamMarketApi.get(`pricehistory`, {
    params: {
      appid: 730,
      market_hash_name: marketHashName,
    },
    headers: {
      Referer: `https://steamcommunity.com/market/listings/730/${encodeURIComponent(marketHashName)}`,
    },
  });

  return groupPricesSteam(response.data.prices);
};
