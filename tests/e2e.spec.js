const { test, expect } = require("@playwright/test");
const { HomePage } = require("../src/pages/homePage");
const { SignupPage } = require("../src/pages/signupPage");
const { LoginPage } = require("../src/pages/loginPage");
const { CartPage } = require("../src/pages/cartPage");
const { uniqueUser, purchaseDetails } = require("../src/utils/dataFactory");

test("E2E: signup -> login -> add 2 items -> delete 1 -> total check -> purchase -> logout", async ({ page }) => {
  test.setTimeout(180000);

  const home = new HomePage(page);
  const signup = new SignupPage(page);
  const login = new LoginPage(page);
  const cart = new CartPage(page);

  // i. signup
  const user = uniqueUser("e2e");
  await home.goto();
  await home.openSignup();
  const signupMsg = await signup.signup(user.username, user.password);
  expect(signupMsg).toBeTruthy();
  expect(signupMsg).toMatch(/Sign up successful|This user already exist/i);

  // ii. login
  await home.goto();
  await home.openLogin();
  const loginErr = await login.login(user.username, user.password);
  expect(loginErr).toBeNull();

  // iii + iv. select 2 items and add to cart
  const items = ["Samsung galaxy s6", "Nokia lumia 1520"];

  for (const item of items) {
    const found = await home.openProductByName(item);
    expect(found).toBe(true);

    const alertMsg = await home.addCurrentProductToCart();
    expect(alertMsg).toContain("Product added");
    await page.waitForTimeout(800);
  }

  // v. go to cart
  await home.openCart();

  // ✅ Wait until cart has at least 2 items
  const pricesBefore = await cart.getAllItemPrices(items.length);
  expect(pricesBefore.length).toBeGreaterThanOrEqual(items.length);

  // ✅ Delete first row (most stable on Demoblaze)
  const deleted = await cart.deleteItemByIndex(0, items.length);
  expect(deleted).toBe(true);

  // vi. total validation (after delete)
  await page.waitForTimeout(1500);
  const remainingPrices = await cart.getAllItemPrices(1);
  const expectedTotal = remainingPrices.reduce((a, b) => a + b, 0);

  await page.waitForTimeout(1200);
  const displayedTotal = await cart.getTotal();
  expect(displayedTotal).toBe(expectedTotal);

  // vii + viii. place order and verify message
  const purchase = await cart.placeOrder(purchaseDetails());
  expect(purchase.msg).toContain("Thank you for your purchase");

  // ix. logout
  await home.goto();
  await home.logout();
  expect(await home.isLoggedOut()).toBe(true);
});
