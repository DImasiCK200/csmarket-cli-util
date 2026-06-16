import { getSavedPrices, savePrices } from "../services/storageService.js";
import { getPriceHistory } from "../services/marketService.js";
import { concatPrices } from "../utils/prices.js";

export const registerFetchCommand = async (program, beforeEach) => {
  program
    .command("fetch")
    .description("Получить свежую историю продаж")
    .argument("<itemName>", "Название предмета")
    .action((itemName) =>
      beforeEach(async () => {
        console.log(`🚀 Запрос данных для: "${itemName}"...`);

        const savedPrices = await getSavedPrices(itemName);

        const collectedPrices = await getPriceHistory(itemName);

        const unitedPrices = concatPrices(collectedPrices, savedPrices);

        await savePrices(itemName, unitedPrices);

        console.log(
          `✅ Успешно! Доступна информация за ${Object.keys(unitedPrices).length} дней, из них новых: ${Object.keys(unitedPrices).length - Object.keys(savedPrices).length}`,
        );
      }),
    );
};
