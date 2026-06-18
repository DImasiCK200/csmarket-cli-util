export const showStat = (priceHistory, { maxShow } = {}) => {
  const priceArray = maxShow
    ? Object.entries(priceHistory).slice(0, maxShow)
    : Object.entries(priceHistory);

  const tableData = priceArray.map(([date, info]) => ({
    date,
    median: info.median.toFixed(2),
    avg: info.avg.toFixed(2),
    sold: info.count,
  }));

  console.table(tableData);
};
