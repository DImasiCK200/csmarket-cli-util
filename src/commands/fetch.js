import {
  getSavedPrices,
  savePrices,
  getFollowedItems,
} from "../services/storageService.js";
import { getPriceHistory } from "../services/marketService.js";
import { concatPrices } from "../utils/prices.js";

const updatePriceHistory = async (itemName) => {
  console.log(`🚀 Запрос данных для: "${itemName}"...`);

  const savedPrices = await getSavedPrices(itemName);

  const collectedPrices = await getPriceHistory(itemName);

  const unitedPrices = concatPrices(collectedPrices, savedPrices);

  await savePrices(itemName, unitedPrices);

  console.log(
    `✅ Успешно! Цены для ${itemName} за ${Object.keys(unitedPrices).length} дней, из них новых: ${Object.keys(unitedPrices).length - Object.keys(savedPrices).length}`,
  );
};

export const registerFetchCommand = async (program, beforeEach) => {
  program
    .command("fetch")
    .description("Получить свежую историю продаж")
    .argument("[itemName]", "Название предмета")
    .action((itemName) =>
      beforeEach(async () => {
        if (!itemName) {
          console.log("🚀 Обновление цен для отслеживаемых предметов...");
          const itemNameArray = await getFollowedItems();

          const updatePromises = itemNameArray.map((itemName) => {
            return updatePriceHistory(itemName);
          });

          await Promise.all(updatePromises);

          console.log(
            `✅ Успешно! История цен обновлена для ${itemNameArray.length} предметов`,
          );
        } else {
          await updatePriceHistory(itemName);
        }
      }),
    );
};
