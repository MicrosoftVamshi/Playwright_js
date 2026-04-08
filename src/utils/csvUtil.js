const fs = require("fs");
const { parse } = require("csv-parse/sync");

class CsvUtil {
  static read(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    if (!content.trim()) return [];
    return parse(content, { columns: true, skip_empty_lines: true });
  }

  static write(filePath, rows) {
    if (!rows.length) {
      fs.writeFileSync(filePath, "", "utf-8");
      return;
    }
    const headers = Object.keys(rows[0]);
    const lines = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => `${r[h]}`).join(",")),
    ];
    fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
  }
}

module.exports = { CsvUtil };
