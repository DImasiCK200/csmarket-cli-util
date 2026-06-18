import storage from "node-persist";

import { getItemId } from "./marketService.js";

const priceStorage = storage.create({
  dir: "./storage/prices",
});

const followedItemsStorage = storage.create({
  dir: "./storage/followedItems",
});

export const initStorage = async () => {
  await priceStorage.init();

  await followedItemsStorage.init();
};

export const getSavedPrices = async (itemName) => {
  return (await priceStorage.getItem(itemName)) || {};
};

export const savePrices = async (itemName, prices) => {
  await priceStorage.setItem(itemName, prices);
};

export const getFollowedItems = async () => {
  return (await followedItemsStorage.keys()) || {};
};

export const getFollowedItemId = async (itemName) => {
  return (await followedItemsStorage.getItem(itemName)) || {};
};

export const addFollowedItem = async (itemName) => {
  const itemId = await getItemId(itemName);

  await followedItemsStorage.setItem(itemName, itemId);
};
