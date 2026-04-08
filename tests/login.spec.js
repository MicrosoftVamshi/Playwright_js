const { test, expect } = require("@playwright/test");
const { HomePage } = require("../src/pages/homePage");
const { SignupPage } = require("../src/pages/signupPage");
const { LoginPage } = require("../src/pages/loginPage");
const { uniqueUser } = require("../src/utils/dataFactory");

test("Login: valid credentials should login, invalid should fail", async ({ page }) => {
  const home = new HomePage(page);
  const signup = new SignupPage(page);
  const login = new LoginPage(page);

  const user = uniqueUser("login");

  // signup first (demoblaze requires existing user)
  await home.goto();
  await home.openSignup();
  const signupMsg = await signup.signup(user.username, user.password);
  expect(signupMsg).toContain("Sign up successful");

  // invalid login
  await home.openLogin();
  const invalidAlert = await login.login("wrong_user_x", "wrong_pass_x");
  expect(invalidAlert).toBeTruthy();

  // valid login
  await home.openLogin();
  await login.login(user.username, user.password);
  await expect(home.logoutMenu).toBeVisible();
});
