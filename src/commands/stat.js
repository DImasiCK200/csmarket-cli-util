import { showStat, showList } from "../utils/show.js";
import {
  getFollowedItems,
  getSavedPrices,
} from "../services/storageService.js";
import { getPriceHistory } from "../services/steamService.js";

export const registerShowCommand = async (program, beforeEach) => {
  program
    .command("show")
    .description("Выводит информацию о предмете")
    .argument("[itemName]", "Название предмета")
    .option("-s --stat", "Показать таблицу со статистикой цен")
    .option("-m --max-show <number>", "Количество дней для вывода", parseInt)
    .option("-f --followed", "Показывает список отслеживаемых предметов")
    .action((itemName, { maxShow, stat, followed }) =>
      beforeEach(async () => {
        if (itemName) {
          const pricesMarket = await getSavedPrices(itemName);
          const pricesSteam = await getPriceHistory(itemName);

          const concatenateObjectsByDate = (objectMarket, objectSteam) => {
            const result = {};

            Object.keys(objectMarket).forEach((date) => {
              const dataMarket = objectMarket[date];
              const dataSteam = objectSteam[date];

              result[date] = {
                marketAVG: dataMarket.avg,
                marketMedian: dataMarket.median,
                marketCount: dataMarket.count,

                steamAVG: dataSteam.avg,
                steamCount: dataSteam.count,

                difference: Number(
                  (
                    ((dataSteam.avg - dataMarket.avg) / dataMarket.avg) *
                    100
                  ).toFixed(2),
                ),
              };
            });

            return result;
          };

          const concatenatedPrices = concatenateObjectsByDate(
            pricesMarket,
            pricesSteam,
          );

          if (Object.keys(concatenatedPrices).length === 0) {
            console.log("Кажется данных об этом предмете нет в хранилище");
            return;
          }

          if (stat) {
            console.log(`\n📊 История цен для: ${itemName}\n`);
            showStat(concatedPrices, { maxShow });
          }

          return;
        }

        if (followed) {
          console.log("\n Список отслеживаемых предметов");
          const followedItems = await getFollowedItems();
          showList(followedItems);
        }
      }),
    );
};
