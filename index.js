import {
  initStorage,
  getSavedPrices,
  savePrices,
} from "./src/services/storageService.js";
import { getPriceHistory } from "./src/services/marketService.js";
import { concatPrices } from "./src/utils/prices.js";

const ITEM_NAME = "Revolution Case";

const main = async () => {
  try {
    await initStorage();

    const savedPrices = await getSavedPrices(ITEM_NAME);
    console.log(
      `Получены данные из хранилища за ${savedPrices ? Object.keys(savedPrices).length : 0} дней.`,
    );

    const collectedPrices = await getPriceHistory(ITEM_NAME);
    console.log(
      `Получены данные из api за ${Object.keys(collectedPrices).length} дней.`,
    );

    const unitedPrices = concatPrices(collectedPrices, savedPrices);
    console.log(
      `В итоге в хранилище теперь данные за ${Object.keys(unitedPrices).length} дней`,
    );

    await savePrices(ITEM_NAME, unitedPrices);
  } catch (error) {
    console.error("Ошибка при выполнении скрипта:", error);
  }
};

main();
