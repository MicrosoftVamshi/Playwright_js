const { test, expect } = require("@playwright/test");
const { HomePage } = require("../src/pages/homePage");
const { SignupPage } = require("../src/pages/signupPage");
const { uniqueUser } = require("../src/utils/dataFactory");

test("Sign up and validate user can sign up with valid details", async ({ page }) => {
  const home = new HomePage(page);
  const signup = new SignupPage(page);

  const user = uniqueUser("signup");

  await home.goto();
  await home.openSignup();

  const msg = await signup.signup(user.username, user.password);
  expect(msg).toContain("Sign up successful");
});
