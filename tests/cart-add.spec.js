const { test, expect } = require("@playwright/test");
const { HomePage } = require("../src/pages/homePage");
const { CartPage } = require("../src/pages/cartPage");

test("Search/select items and add them to cart, validate added", async ({ page }) => {
  const home = new HomePage(page);
  const cart = new CartPage(page);

  const itemsToAdd = ["Samsung galaxy s6", "Nokia lumia 1520"];

  for (const item of itemsToAdd) {
    const found = await home.openProductByName(item);
    expect(found).toBe(true);

    const msg = await home.addCurrentProductToCart();
    expect(msg).toContain("Product added");
    await page.waitForTimeout(800);
  }

  await home.openCart();

  // ✅ wait until cart has expected number of items
  const prices = await cart.getAllItemPrices(itemsToAdd.length);
  expect(prices.length).toBeGreaterThanOrEqual(itemsToAdd.length);
});
