class ContactPage {
  constructor(page) {
    this.page = page;
    this.email = page.locator("#recipient-email");
    this.name = page.locator("#recipient-name");
    this.message = page.locator("#message-text");
    this.sendBtn = page.locator("#exampleModal button:has-text('Send message')");
  }

  async sendMessage({ email, name, message }) {
    await this.email.fill(email);
    await this.name.fill(name);
    await this.message.fill(message);

    return await new Promise((resolve) => {
      this.page.once("dialog", async (dialog) => {
        const msg = dialog.message();
        await dialog.accept();
        resolve(msg);
      });
      this.sendBtn.click();
    });
  }
}

module.exports = { ContactPage };
