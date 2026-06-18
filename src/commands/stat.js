import { showStat } from "../utils/show.js";
import { getSavedPrices } from "../services/storageService.js";

export const registerShowCommand = async (program, beforeEach) => {
  program
    .command("show")
    .description("Выводит информацию о предмете")
    .argument("<itemName>", "Название предмета")
    .option("-s --stat", "Показать таблицу со статистикой цен")
    .option("-m --max-show <number>", "Количество дней для вывода", parseInt)
    .action((itemName, { maxShow, stat }) =>
      beforeEach(async () => {
        const prices = await getSavedPrices(itemName);

        if (Object.keys(prices).length === 0) {
          console.log("Кажется данных об этом предмете нет в хранилище");
          return;
        }

        if (stat) {
          console.log(`\n📊 История цен для: ${itemName}\n`);
          showStat(prices, { maxShow });
        }
      }),
    );
};
