export const showStat = (priceHistory, { maxShow } = {}) => {
  const priceArray = maxShow
    ? Object.entries(priceHistory).slice(0, maxShow)
    : Object.entries(priceHistory);

  const tableData = priceArray.map(([date, info]) => {
    return {
      date,
      ...info,
    };
  });

  console.table(tableData);
};

export const showList = (list) => {
  list.forEach((item, n) => {
    console.log(`${n + 1}) ${item}`);
  });
};
