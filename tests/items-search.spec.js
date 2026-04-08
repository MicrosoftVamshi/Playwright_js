const path = require("path");
const { test, expect } = require("@playwright/test");

const { HomePage } = require("../src/pages/homePage");
const { ExcelUtil } = require("../src/utils/excelUtil");
const { CsvUtil } = require("../src/utils/csvUtil");
const { JsonUtil } = require("../src/utils/jsonUtil");

test("Rotate item search using Excel / CSV / JSON", async ({ page }) => {
  test.setTimeout(180000);

  const home = new HomePage(page);
  const basePath = path.join(__dirname, "..", "data-files");

  const items = [
    { item: "Samsung galaxy s6", expectedAvailable: true },
    { item: "Nokia lumia 1520", expectedAvailable: true },
    { item: "Imaginary Phone XYZ", expectedAvailable: false }
  ];

  const excelPath = path.join(basePath, "items.xlsx");
  const csvPath = path.join(basePath, "items.csv");
  const jsonPath = path.join(basePath, "items.json");

  // Write all 3 formats
  await ExcelUtil.write(excelPath, "items", items);
  CsvUtil.write(csvPath, items);
  JsonUtil.write(jsonPath, items);

  // Read all 3 formats (rotate)
  const sources = [
    { name: "EXCEL", data: await ExcelUtil.read(excelPath, "items") },
    { name: "CSV", data: CsvUtil.read(csvPath) },
    { name: "JSON", data: JsonUtil.read(jsonPath) }
  ];

  for (const source of sources) {
    for (const row of source.data) {
      // ✅ normalize boolean for CSV/Excel/JSON
      const expected = String(row.expectedAvailable).toLowerCase() === "true";

      const found = await home.openProductByName(row.item);

      expect(found, `${row.item} check failed from ${source.name}`).toBe(expected);
    }
  }
});
