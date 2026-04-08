const { CommonMethods } = require("../common/commonMethods");

class HomePage {
  constructor(page) {
    this.page = page;
    this.common = new CommonMethods(page);

    // Navbar links (Demoblaze IDs)
    this.loginLink = page.locator("#login2");
    this.signupLink = page.locator("#signin2");
    this.cartMenu = page.locator("#cartur");
    this.logoutMenu = page.locator("#logout2");

    // Modals
    this.loginModal = page.locator("#logInModal");
    this.signupModal = page.locator("#signInModal");

    // Modal inputs
    this.loginUser = page.locator("#loginusername");
    this.signupUser = page.locator("#sign-username");

    // Products
    this.nextBtn = page.locator("#next2");
  }

  async goto() {
    await this.page.goto("/");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async _safeOpenModal(linkSelector, inputSelector, attempts = 3) {
    for (let i = 0; i < attempts; i++) {
      // If input already visible, modal is open
      if (await this.page.locator(inputSelector).isVisible()) return true;

      // Try normal click first
      try {
        await this.page.locator(linkSelector).click({ timeout: 5000 });
      } catch (e) {
        // JS click fallback if overlay intercepts
        await this.page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (el) el.click();
        }, linkSelector);
      }

      // Wait a bit for bootstrap animation
      try {
        await this.page.waitForSelector(inputSelector, { state: "visible", timeout: 8000 });
        return true;
      } catch (e) {
        // If still not visible, press Escape and retry
        try { await this.page.keyboard.press("Escape"); } catch (e2) {}
        await this.page.waitForTimeout(500);

        // One retry with reload if page got stuck
        if (i === attempts - 2) {
          await this.page.reload();
          await this.page.waitForLoadState("domcontentloaded");
        }
      }
    }
    return false;
  }

  async openSignupModal() {
    const ok = await this._safeOpenModal("#signin2", "#sign-username", 3);
    if (!ok) throw new Error("Signup modal did not open (sign-username not visible)");
  }
  async openSignup() { await this.openSignupModal(); }

  async openLoginModal() {
    const ok = await this._safeOpenModal("#login2", "#loginusername", 3);
    if (!ok) throw new Error("Login modal did not open (loginusername not visible)");
  }
  async openLogin() { await this.openLoginModal(); }

  async openCart() {
    try {
      await this.cartMenu.click({ timeout: 8000 });
    } catch (e) {
      await this.page.evaluate(() => {
        const el = document.querySelector("#cartur");
        if (el) el.click();
      });
    }
    await this.page.waitForLoadState("domcontentloaded");
  }

  async logout() {
    try { await this.logoutMenu.click({ timeout: 8000 }); } catch (e) {}
  }

  async isLoggedOut() {
    return await this.loginLink.isVisible();
  }

  async waitForProducts() {
    await this.page.waitForSelector("#tbodyid .card-title a", { timeout: 20000 });
  }

  async openProductByName(productName) {
    for (let attempt = 0; attempt < 2; attempt++) {
      await this.goto();
      await this.waitForProducts();

      for (let i = 0; i < 10; i++) {
        const product = this.page.locator("#tbodyid .card-title a", { hasText: productName });
        if (await product.count() > 0) {
          await product.first().click();
          await this.page.waitForLoadState("domcontentloaded");
          return true;
        }

        if (!(await this.nextBtn.isVisible())) break;
        await this.nextBtn.click();
        await this.page.waitForTimeout(900);
      }

      await this.page.reload();
      await this.page.waitForLoadState("domcontentloaded");
    }
    return false;
  }

  async addCurrentProductToCart() {
    const addBtn = this.page.locator("a:has-text('Add to cart')");
    await addBtn.waitFor({ state: "visible", timeout: 15000 });

    const dialogPromise = this.page.waitForEvent("dialog", { timeout: 15000 }).catch(() => null);
    await addBtn.click({ force: true });

    const dialog = await dialogPromise;
    const msg = dialog ? dialog.message() : null;

    if (dialog) {
      try { await dialog.accept(); } catch (e) {}
    }
    return msg;
  }
}

module.exports = { HomePage };
