import { expect, test } from '@playwright/test';
import { HomePage } from '@pages/home.page';

const testEmailAddress = 'test1@example.com'
const testPassword = 'password1'

// Fix the below scripts to work consistently and do not use static waits. Add proper assertions to the tests
// Login 3 times sucessfully

// VF: A simple solution based on observations of how the DOM structure changes after login
// VF: Update - removed for loop, added fixture to continue test run on failure, 
// enable parallelization and reporting clarity
const testUsers = [
  { id: 1, email: 'test1@example.com', pass: 'password1'},
  { id: 2, email: 'test2@example.com', pass: 'password2'},
  { id: 3, email: 'test3@example.com', pass: 'password3'},
]
for (const user of testUsers) {
  test(`Login multiple times, sucessfully for user ${user.id} @c1`, async ({ page }) => {
    const homePage = new HomePage(page)
    const submitButton = page.locator('#submitButton');
    const submitButtonLoading = page.locator('.submit-btn.loading');
    const successMessage = page.locator(`#successMessage`);
    const visibleSuccessMessage = page.locator('.success-message.show');

    await homePage.navigate()
    await homePage.goToChallenge(1)

    // Login multiple times
    // VF: Check Sign In button is shown in initial state only
    await expect(submitButton).toBeVisible
    await expect(visibleSuccessMessage).toBeHidden()
    await expect(submitButtonLoading).toBeHidden()

    await page.locator('#email').fill(user.email);
    await page.locator('#password').fill(user.pass);
    await submitButton.click();

    // VF: Check the transition from Sign In button in loading state to success message in show state
    await expect(submitButtonLoading).toBeAttached()
    await expect(visibleSuccessMessage).toBeAttached()

    await expect(successMessage).toContainText('Successfully submitted!');
    await expect(successMessage).toContainText(`Email: ${user.email}`);
    await expect(successMessage).toContainText(`Password: ${user.pass}`);

    await expect(submitButton).toBeVisible()
  });
}

// Login and logout successfully with animated form and delayed loading
// VF: I don't really like this solution because it relies on an implicit wait for the animation part,
// sometimes you have to use it. Since the animation takes 7s which is longer than our global 5s timeout,
// we can change the default global waits in config but it's not feasible for the case
test('Login animated form and logout sucessfully @c2', async ({ page }) => {
  const homePage = new HomePage(page)
  const loginForm = page.locator('#loginForm');
  const initializedMenuBtn = page.locator('#menuButton[data-initialized="true"]');

  await homePage.navigate()
  await homePage.goToChallenge(2)

  await expect(loginForm).toBeVisible();

  await page.locator('#email').fill(testEmailAddress);
  await page.locator('#password').fill(testPassword);
  await page.locator('#submitButton').click({ timeout: 10000 });

  await expect(page.locator('#dashboard')).toBeVisible();
  await expect(page.locator('#userEmail')).toContainText(testEmailAddress);
  await expect(page.locator('div.dashboard')).toBeVisible();

  await initializedMenuBtn.click();
  await page.locator('#logoutOption').click();
});

// VF: This solution is better - no implicit waits added, animation for the element is turned off
test('Login animated form and logout sucessfully @c2b', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.navigate()
  await homePage.goToChallenge(2)

  const loginForm = page.locator('#loginForm');
  await expect(loginForm).toBeVisible();

  await page.locator('#email').fill(testEmailAddress);
  await page.locator('#password').fill(testPassword);

  const submitBtn = page.locator('#submitButton');
  await submitBtn.evaluate(el => el.style.animationDuration = '0s');
  await submitBtn.click();

  await expect(page.locator('#dashboard')).toBeVisible();
  await expect(page.getByText('Welcome!')).toBeVisible();
  await expect(page.locator('#userEmail')).toContainText(`Logged in as: ${testEmailAddress}`);
  await expect(page.locator('#menuButton')).toBeVisible();

  const initializedMenuBtn = page.locator('#menuButton[data-initialized="true"]');
  await initializedMenuBtn.click();

  await page.locator('#logoutOption').click();
});

// Fix the Forgot password test and add proper assertions

// VF: Shared locator values for email fields for both Login and Reset Password forms
// Making sure the correct form is loaded by form-title and Reset Password button presence
test('Forgot password @c3', async ({ page }) => {
  const homePage = new HomePage(page)
  const loginForm = page.getByRole('heading', { name: 'Login' });
  const resetPasswordButton = page.getByRole('button', { name: 'Reset Password' });
  const closeButton = page.getByRole('button', { name: 'Close' });

  await homePage.navigate()
  await homePage.goToChallenge(3)

  await expect(loginForm).toBeVisible();

  await page.getByRole('button', { name: 'Forgot Password?' }).click();

  await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
  await expect(resetPasswordButton).toBeVisible();

  await page.locator('#email').fill(testEmailAddress);
  await resetPasswordButton.click();
  
  await expect(page.getByRole('heading', { name: 'Success!' })).toBeVisible();
  await expect(page.locator('#mainContent')).toContainText('Password reset link sent!');
  await expect(page.locator('#mainContent')).toContainText(`Email: ${testEmailAddress}`);
  await expect(closeButton).toBeVisible();

  await closeButton.click()

  await expect(loginForm).toBeVisible();
});

// Fix the login test. Hint: There is a global variable that you can use to check if the app is in ready state
test('Login and logout @c4', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.navigate()
  await homePage.goToChallenge(4)

  // VF: waiting global variable isAppReady to switch to true
  await page.waitForFunction(() => window.isAppReady === true);

  await page.locator('#email').fill(testEmailAddress);
  await page.locator('#password').fill(testPassword);
  await page.locator('#submitButton').click();
  await page.locator('#profileButton').click();
  await page.getByText('Logout').click();
});