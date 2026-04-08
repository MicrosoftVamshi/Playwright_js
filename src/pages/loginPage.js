const { CommonMethods } = require("../common/commonMethods");

class LoginPage {
  constructor(page) {
    this.page = page;
    this.common = new CommonMethods(page);

    this.username = page.locator("#loginusername");
    this.password = page.locator("#loginpassword");
    this.loginBtn = page.locator("#logInModal button:has-text('Log in')");

    // Navbar indicator for successful login
    this.logoutLink = page.locator("#logout2");
    this.welcomeUser = page.locator("#nameofuser"); // optional extra signal
  }

  async login(user, pass) {
    // Ensure modal inputs are visible before typing
    await this.username.waitFor({ state: "visible", timeout: 20000 });

    await this.common.type(this.username, user);
    await this.common.type(this.password, pass);

    // Invalid login -> browser alert; valid login -> no alert, logout becomes visible
    const dialogPromise = this.page.waitForEvent("dialog", { timeout: 8000 }).catch(() => null);

    await this.loginBtn.click({ force: true });

    const dialog = await dialogPromise;

    // If dialog appeared => login failed
    if (dialog) {
      const msg = dialog.message();
      try { await dialog.accept(); } catch (e) {}
      return msg; // return failure message
    }

    // No dialog => likely success, wait for logout (or welcome user) to appear
    try {
      await Promise.race([
        this.logoutLink.waitFor({ state: "visible", timeout: 20000 }),
        this.welcomeUser.waitFor({ state: "visible", timeout: 20000 })
      ]);
    } catch (e) {
      // If it still didn't show, return null (test will fail if it expects logout)
      return null;
    }

    return null; // success (no alert)
  }
}

module.exports = { LoginPage };
