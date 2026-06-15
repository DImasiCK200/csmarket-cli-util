import axios from "axios";
import storage from "node-persist";

const csMarketApi = axios.create({
  baseURL: "https://market.csgo.com/api/v2",
  timeout: 10000,
});

await csMarketApi.get("full-history/all.json");

const getItemId = async (marketHashName) => {
  try {
    const response = await csMarketApi.get("full-history/all.json");

    return response.data.history[marketHashName];
  } catch (err) {
    console.error(err);
  }
};

const getPriceHistory = async (marketHashName) => {
  try {
    const itemId = await getItemId(marketHashName);
    const response = await csMarketApi.get(`full-history/${itemId}.json`);

    const prices = response.data.data.history.map((priceInfo) => {
      return convertPriceArrays(priceInfo);
    });

    return summarizeDailyPrices(prices);
  } catch (err) {
    console.error(err);
  }
};

const convertPriceArrays = (priceArray) => {
  return {
    timestamp: priceArray[0],
    price: priceArray[1],
  };
};
