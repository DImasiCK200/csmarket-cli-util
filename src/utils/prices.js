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

export const concatPrices = (newPrices, oldPrices) => ({
  ...newPrices,
  ...oldPrices,
});
