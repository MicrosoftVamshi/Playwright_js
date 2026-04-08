class CommonMethods {
  constructor(page) {
    this.page = page;
  }

  async click(locator) {
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  async type(locator, text) {
    await locator.waitFor({ state: "visible" });
    await locator.fill(text);
  }

  async getText(locator) {
    await locator.waitFor({ state: "visible" });
    return await locator.textContent();
  }

  async waitForTimeout(ms) {
    await this.page.waitForTimeout(ms);
  }
}

module.exports = { CommonMethods };
