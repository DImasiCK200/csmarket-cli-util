export const formatSteamDate = (dateStr) => {
  const months = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const match = dateStr.match(/^([A-Za-z]{3})\s+(\d{1,2})\s+(\d{4})/);

  if (!match) return null;

  const [_, monthStr, dayStr, year] = match;
  const month = months[monthStr];

  const day = dayStr.padStart(2, "0");

  return `${year}-${month}-${day}`;
};
