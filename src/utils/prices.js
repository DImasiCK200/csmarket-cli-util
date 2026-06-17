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
  const unitedPrice = {};

  Object.keys(newPrice).forEach((key) => {
    if (key === "count") {
      unitedPrice[key] = Math.floor((newPrice[key] + oldPrice[key]) / 2);
    } else {
      unitedPrice[key] = Number(
        ((newPrice[key] + oldPrice[key]) / 2).toFixed(2),
      );
    }
  });

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
