const { test, expect } = require("@playwright/test");
const { HomePage } = require("../src/pages/homePage");
const { CartPage } = require("../src/pages/cartPage");

test("Add items -> delete one item from cart -> validate deletion", async ({ page }) => {
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
  const beforePrices = await cart.getAllItemPrices(itemsToAdd.length);
  expect(beforePrices.length).toBeGreaterThanOrEqual(itemsToAdd.length);

  // ✅ delete first row (most reliable)
  const deleted = await cart.deleteItemByIndex(0, itemsToAdd.length);
  expect(deleted).toBe(true);

  // ✅ wait for cart to reduce
  await page.waitForTimeout(1500);
  const afterPrices = await cart.getAllItemPrices(1);

  expect(afterPrices.length).toBeLessThan(beforePrices.length);
});
