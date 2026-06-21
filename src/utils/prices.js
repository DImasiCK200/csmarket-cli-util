import { formatSteamDate } from "./date.js";

export const convertPriceArrays = (priceArray) => {
  return {
    timestamp: priceArray[0],
    price: priceArray[1],
  };
};

export const groupPricesByDay = (prices) => {
  const groupedPrices = {};

  prices.forEach((item) => {
    const dayKey = new Date(item.timestamp * 1000).toISOString().split("T")[0];

    if (!groupedPrices[dayKey]) {
      groupedPrices[dayKey] = { prices: [] };
    }

    groupedPrices[dayKey].prices.push(item.price);
  });

  return groupedPrices;
};

export const calculateProperties = (pricesByDay) => {
  const dailyStatsHistory = {};

  Object.keys(pricesByDay).forEach((date) => {
    const { prices, ...dailyStats } = pricesByDay[date];

    dailyStatsHistory[date] = {
      ...dailyStats,
      median: calculateMedians(prices),
      avg: calculateAverage(prices),
      count: prices.length,
    };
  });

  return dailyStatsHistory;
};

export const calculateMedians = (prices) => {
  prices.sort((a, b) => a - b);

  const mid = Math.floor(prices.length / 2);

  return prices.length % 2 !== 0
    ? prices[mid]
    : (prices[mid] + prices[mid - 1]) / 2;
};

export const calculateAverage = (prices) => {
  const totalSum = prices.reduce((sum, price) => sum + price, 0);

  return Number((totalSum / prices.length).toFixed(2));
};

export const summarizeDailyPrices = (prices) => {
  return calculateProperties(groupPricesByDay(prices));
};

export const getOverlaps = (firstArray, secondArray) => {
  const secondArraySet = new Set(secondArray);

  return new Set(firstArray.filter((item) => secondArraySet.has(item)));
};

export const copyUniqueDates = (sourcePrices, overlapDates, targetPrices) => {
  Object.keys(sourcePrices).forEach((date) => {
    if (!overlapDates.has(date)) {
      targetPrices[date] = { ...sourcePrices[date] };
    }
  });
};

export const getAverageProperties = (newPrice, oldPrice) => {
  const unitedPrice =
    newPrice.count > oldPrice.count ? { ...newPrice } : { ...oldPrice };

  return unitedPrice;
};

export const concatPrices = (newPrices, oldPrices) => {
  const unitedPrices = {};

  const overlapDates = getOverlaps(
    Object.keys(newPrices),
    Object.keys(oldPrices),
  );

  copyUniqueDates(newPrices, overlapDates, unitedPrices);

  overlapDates.forEach((date) => {
    unitedPrices[date] = getAverageProperties(newPrices[date], oldPrices[date]);
  });

  copyUniqueDates(oldPrices, overlapDates, unitedPrices);

  return unitedPrices;
};

export const groupPricesSteam = (prices) => {
  const groupedPrices = {};

  prices.forEach((priceInfo) => {
    const date = formatSteamDate(priceInfo[0]);

    if (!groupedPrices[date]) {
      groupedPrices[date] = { avg: [], count: [] };
    }

    groupedPrices[date].avg.push(priceInfo[1]);
    groupedPrices[date].count.push(Number(priceInfo[2]));
  });

  const sum = (array) => array.reduce((sum, item) => sum + item, 0);

  Object.keys(groupedPrices).forEach((date) => {
    groupedPrices[date] = {
      avg: Number(
        (sum(groupedPrices[date].avg) / groupedPrices[date].avg.length).toFixed(
          2,
        ),
      ),
      count: Math.floor(sum(groupedPrices[date].count)),
    };
  });

  return groupedPrices;
};
