import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.tutorialspoint.com/selenium/practice/selenium_automation_practice.php');
  await page.getByRole('textbox', { name: 'Name:' }).click();
  await page.getByRole('textbox', { name: 'Name:' }).fill('Vamshi');
  await page.getByRole('textbox', { name: 'Email:' }).click();
  await page.getByRole('textbox', { name: 'Email:' }).fill('vamshivardhan@gmail.com');
  await page.getByRole('radio', { name: 'Gender:' }).check();
  await page.getByRole('textbox', { name: 'Mobile(10 Digits):' }).click();
  await page.getByRole('textbox', { name: 'Mobile(10 Digits):' }).fill('1234567890');
  await page.getByRole('textbox', { name: 'Date of Birth:' }).fill('2003-09-20');
  await page.getByRole('textbox', { name: 'Subjects:' }).click();
  await page.getByRole('textbox', { name: 'Subjects:' }).fill('Physics');
  await page.getByRole('checkbox', { name: 'Hobbies:' }).check();
  await page.getByRole('checkbox').nth(1).check();
  await page.getByRole('checkbox').nth(2).check();
  await page.getByRole('button', { name: 'Picture: State and City' }).click();
  await page.getByRole('button', { name: 'Picture: State and City' }).setInputFiles("C:\\Users\\v-vemmadi\\Pictures\\sun.jpg");
  await page.getByRole('textbox', { name: 'Currend Address' }).click();
  await page.getByRole('textbox', { name: 'Currend Address' }).fill('Hyderabad, SP Sez');
  await page.locator('#state').selectOption('NCR');
  await page.locator('#city').selectOption('Lucknow');
});