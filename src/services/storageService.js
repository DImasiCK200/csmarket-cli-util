import storage from "node-persist";

const priceStorage = storage.create({
  dir: "prices",
});

const followedItemsStorage = storage.create({
  dir: "followedItems",
});

export const initStorage = async () => {
  await priceStorage.init();

  await followedItemsStorage.init();
};

export const getSavedPrices = async (itemName) => {
  return await priceStorage.getItem(itemName);
};

export const savePrices = async (itemName, prices) => {
  await priceStorage.setItem(itemName, prices);
};

export const getFollowedItems = async () => {
  return await followedItemsStorage.getItem("followedItems");
};

export const addFollowedItem = async (itemName) => {
  const currentFollowedItems = await getFollowedItems();
  const alreadyFollowed = currentFollowedItems.includes(itemName);

  if (alreadyFollowed) {
    return;
  }
  const newFollowedItems = [...currentFollowedItems, itemName];

  await followedItemsStorage.setItem("followedItems", newFollowedItems);
};
