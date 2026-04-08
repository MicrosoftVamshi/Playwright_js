const fs = require("fs");

class JsonUtil {
  static read(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  static write(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  }
}

module.exports = { JsonUtil };
