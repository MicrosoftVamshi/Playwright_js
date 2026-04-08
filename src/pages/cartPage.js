class CartPage {
  constructor(page) {
    this.page = page;

    this.rows = page.locator("#tbodyid > tr");
    this.total = page.locator("#totalp");
    this.placeOrderBtn = page.locator("button:has-text('Place Order')");

    // Order modal fields (used in e2e)
    this.name = page.locator("#name");
    this.country = page.locator("#country");
    this.city = page.locator("#city");
    this.card = page.locator("#card");
    this.month = page.locator("#month");
    this.year = page.locator("#year");

    this.purchaseBtn = page.locator("button:has-text('Purchase')");
    this.confirmHeader = page.locator(".sweet-alert h2");
    this.confirmDetails = page.locator(".sweet-alert p");
    this.okBtn = page.locator(".sweet-alert button.confirm");
  }

  async waitForItems(minCount = 1) {
    await this.page.waitForFunction(
      (count) => document.querySelectorAll("#tbodyid > tr").length >= count,
      minCount,
      { timeout: 30000 }
    );
  }

  async getAllItemPrices(minCount = 1) {
    await this.waitForItems(minCount);

    const count = await this.rows.count();
    const prices = [];
    for (let i = 0; i < count; i++) {
      const txt = await this.rows.nth(i).locator("td:nth-child(3)").textContent();
      prices.push(Number((txt || "0").trim()));
    }
    return prices;
  }

  async getAllItemNames(minCount = 1) {
    await this.waitForItems(minCount);

    const count = await this.rows.count();
    const names = [];
    for (let i = 0; i < count; i++) {
      const txt = await this.rows.nth(i).locator("td:nth-child(2)").textContent();
      names.push((txt || "").trim());
    }
    return names;
  }

  async deleteItemByIndex(index = 0, minCount = 1) {
    await this.waitForItems(minCount);

    const count = await this.rows.count();
    if (count === 0) return false;
    if (index < 0 || index >= count) return false;

    const row = this.rows.nth(index);
    const del = row.locator("a:has-text('Delete')");
    await del.click();
    await this.page.waitForTimeout(2000);

    return true;
  }

  async deleteItemByName(name, minCount = 1) {
    await this.waitForItems(minCount);

    const row = this.page.locator("#tbodyid tr", { hasText: name });
    if (await row.count() === 0) return false;

    await row.first().locator("a:has-text('Delete')").click();
    await this.page.waitForTimeout(2000);
    return true;
  }

  async getTotal() {
    const t = await this.total.textContent();
    return Number((t || "0").trim());
  }

  async placeOrder(details) {
    await this.placeOrderBtn.click();

    await this.name.fill(details.name);
    await this.country.fill(details.country);
    await this.city.fill(details.city);
    await this.card.fill(details.card);
    await this.month.fill(details.month);
    await this.year.fill(details.year);

    await this.purchaseBtn.click();

    const msg = (await this.confirmHeader.textContent())?.trim();
    const info = (await this.confirmDetails.textContent())?.trim();
    await this.okBtn.click();

    return { msg, info };
  }
}

module.exports = { CartPage };
