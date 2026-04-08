const { CommonMethods } = require("../common/commonMethods");

class SignupPage {
  constructor(page) {
    this.page = page;
    this.common = new CommonMethods(page);

    // Navbar open link
    this.openSignupLink = page.locator("#signin2");

    // Modal + inputs
    this.modal = page.locator("#signInModal");
    this.username = page.locator("#sign-username");
    this.password = page.locator("#sign-password");

    // Buttons
    this.signupBtn = page.locator("#signInModal button:has-text('Sign up')");
    this.closeBtn = page.locator("#signInModal button:has-text('Close')");
  }

  async ensureSignupModalOpen() {
    // If input is hidden, open modal
    if (!(await this.username.isVisible())) {
      try {
        await this.openSignupLink.click({ timeout: 8000 });
      } catch (e) {
        // JS click fallback
        await this.page.evaluate(() => {
          const el = document.querySelector("#signin2");
          if (el) el.click();
        });
      }
    }

    await this.username.waitFor({ state: "visible", timeout: 20000 });
    await this.signupBtn.waitFor({ state: "visible", timeout: 20000 });
  }

  async signup(user, pass) {
    await this.ensureSignupModalOpen();

    await this.common.type(this.username, user);
    await this.common.type(this.password, pass);

    // ✅ reliable dialog capture (cannot miss)
    const tryOnce = async () => {
      const dialogPromise = this.page.waitForEvent("dialog", { timeout: 20000 });
      await this.signupBtn.click({ force: true });
      const dialog = await dialogPromise;
      const msg = dialog.message();
      try { await dialog.accept(); } catch (e) {}
      return msg;
    };

    try {
      const msg = await tryOnce();

      // Close modal to avoid overlay impact on next steps
      try {
        if (await this.closeBtn.isVisible()) {
          await this.closeBtn.click({ force: true });
        }
      } catch (e) {}

      return msg;
    } catch (e) {
      // Retry once: close modal and reopen
      try {
        if (await this.closeBtn.isVisible()) {
          await this.closeBtn.click({ force: true });
        }
      } catch (e2) {}

      await this.page.waitForTimeout(500);
      await this.ensureSignupModalOpen();

      const msg = await tryOnce();

      try {
        if (await this.closeBtn.isVisible()) {
          await this.closeBtn.click({ force: true });
        }
      } catch (e3) {}

      return msg;
    }
  }
}

module.exports = { SignupPage };
