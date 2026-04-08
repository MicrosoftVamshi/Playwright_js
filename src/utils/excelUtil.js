const ExcelJS = require("exceljs");

class ExcelUtil {
  static async write(filePath, sheetName, rows) {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(sheetName);

    if (!rows.length) {
      await wb.xlsx.writeFile(filePath);
      return;
    }

    ws.columns = Object.keys(rows[0]).map((k) => ({ header: k, key: k }));
    rows.forEach((r) => ws.addRow(r));

    await wb.xlsx.writeFile(filePath);
  }

  static async read(filePath, sheetName) {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(filePath);

    const ws = wb.getWorksheet(sheetName);
    if (!ws) return [];

    const headers = [];
    ws.getRow(1).eachCell((cell) => headers.push(String(cell.value).trim()));

    const data = [];
    ws.eachRow((row, rowNum) => {
      if (rowNum === 1) return;
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = row.getCell(i + 1).value;
      });
      data.push(obj);
    });

    return data;
  }
}

module.exports = { ExcelUtil };
