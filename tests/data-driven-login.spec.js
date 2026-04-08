const path = require("path");
const { test, expect } = require("@playwright/test");

const { HomePage } = require("../src/pages/homePage");
const { SignupPage } = require("../src/pages/signupPage");
const { LoginPage } = require("../src/pages/loginPage");

const { ExcelUtil } = require("../src/utils/excelUtil");
const { CsvUtil } = require("../src/utils/csvUtil");
const { JsonUtil } = require("../src/utils/jsonUtil");
const { uniqueUser } = require("../src/utils/dataFactory");

test("Create users → store in Excel/CSV/JSON → rotate read & login all", async ({ page }) => {
  test.setTimeout(240000);

  const home = new HomePage(page);
  const signup = new SignupPage(page);
  const login = new LoginPage(page);

  const basePath = path.join(__dirname, "..", "data-files");

  // 1) Create users
  const users = [uniqueUser("u1"), uniqueUser("u2"), uniqueUser("u3")];

  // 2) Signup users
  await home.goto();
  for (const u of users) {
    await home.openSignup();
    const msg = await signup.signup(u.username, u.password);
    expect(msg).toMatch(/Sign up successful|This user already exist/i);
    await page.waitForTimeout(500);
  }

  // 3) Write data to Excel, CSV, JSON
  const excelPath = path.join(basePath, "users.xlsx");
  const csvPath = path.join(basePath, "users.csv");
  const jsonPath = path.join(basePath, "users.json");

  await ExcelUtil.write(excelPath, "users", users);
  CsvUtil.write(csvPath, users);
  JsonUtil.write(jsonPath, users);

  // 4) Rotate reads
  const sources = [
    { name: "EXCEL", data: await ExcelUtil.read(excelPath, "users") },
    { name: "CSV", data: CsvUtil.read(csvPath) },
    { name: "JSON", data: JsonUtil.read(jsonPath) }
  ];

  for (const source of sources) {
    for (const u of source.data) {
      await home.goto();
      await home.openLogin();

      const err = await login.login(u.username, u.password);
      expect(err, `Login failed for ${u.username} from ${source.name}`).toBeNull();

      await home.logout();
      expect(await home.isLoggedOut()).toBe(true);
    }
  }
});
