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

const concatArraysByTimestamp = (firstArray, secondArray) => {
  const uniqueMap = new Map(
    [...(firstArray || []), ...(secondArray || [])].map((item) => [
      item.timestamp,
      item,
    ]),
  );

  return Array.from(uniqueMap.values());
};

const groupPricesByDay = (prices) => {
  const pricesByDay = {};

  prices.forEach((item) => {
    const dayKey = new Date(item.timestamp * 1000).toISOString().split("T")[0];

    if (!pricesByDay[dayKey]) {
      pricesByDay[dayKey] = { prices: [] };
    }

    pricesByDay[dayKey].prices.push(item.price);
  });

  return pricesByDay;
};

const calculateProperties = (pricesByDay) => {
  const dailyStatsHistory = {};
  Object.keys(pricesByDay).forEach((key) => {
    const { prices, ...dailyStats } = pricesByDay[key];

    dailyStatsHistory[key] = {
      ...dailyStats,
      median: calculateMedians(prices),
      avg: calculateAverage(prices),
      count: prices.length,
    };
  });

  return dailyStatsHistory;
};

const calculateMedians = (prices) => {
  prices.sort((a, b) => a - b);

  const mid = Math.floor(prices.length / 2);

  return prices.length % 2 !== 0
    ? prices[mid]
    : (prices[mid] + prices[mid - 1]) / 2;
};

const calculateAverage = (prices) => {
  const totalSum = prices.reduce((sum, price) => sum + price, 0);

  return Number((totalSum / prices.length).toFixed(2));
};

const summarizeDailyPrices = (prices) => {
  return calculateProperties(groupPricesByDay(prices));
};

const main = async () => {
  await storage.init();

  const ITEM_NAME = "M4A1-S | Black Lotus (Field-Tested)";

  const priceHistory = await storage.getItem(ITEM_NAME);

  const newPrices = await getPriceHistory(ITEM_NAME);

  const resultPrices = { ...newPrices, ...priceHistory };

  await storage.setItem(ITEM_NAME, resultPrices);
};

main();
