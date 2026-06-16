import storage from "node-persist";

export const initStorage = async () => {
  await storage.init();
};

export const getSavedPrices = async (itemName) => {
  return await storage.getItem(itemName);
};

export const savePrices = async (itemName, prices) => {
  await storage.setItem(itemName, prices);
};
