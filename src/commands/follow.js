import {
  addFollowedItem,
  getSavedPrices,
  savePrices,
} from "../services/storageService.js";
import { getPriceHistory } from "../services/marketService.js";
import { concatPrices } from "../utils/prices.js";

export const registerFollowCommand = async (program, beforeEach) => {
  program
    .command("follow")
    .description("Добавить предмет в отслеживаемые")
    .argument("<itemName>", "Название предмета")
    .action((itemName) =>
      beforeEach(async () => {
        console.log(`🚀 Добавление предмета в отслеживаемые: "${itemName}"...`);

        await addFollowedItem(itemName);

        console.log(`✅ Успешно! Предмет будет отслеживаться`);
      }),
    );
};
