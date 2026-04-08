class AboutPage {
  constructor(page) {
    this.page = page;
    this.modal = page.locator("#videoModal");
    this.closeBtn = page.locator("#videoModal button:has-text('Close')");
  }

  async isOpen() {
    return await this.modal.isVisible();
  }

  async close() {
    await this.closeBtn.click();
  }
}

module.exports = { AboutPage };
