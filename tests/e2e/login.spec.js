// tests/e2e/login.spec.js
const { test, expect } = require('@playwright/test');

// Adjust these to match your actual frontend routes and DOM structure.
const LOGIN_PATH = '/login';
const VALID_EMAIL = 'test@test.com';
const VALID_PASSWORD = 'correctpass';

test.describe('Login flow (E2E)', () => {

    test('blocks submission when fields are empty (native HTML5 validation)', async ({ page }) => {
        await page.goto(LOGIN_PATH);

        const emailInput = page.getByLabel(/email/i);
        const passwordInput = page.getByLabel(/password/i);

        await page.getByRole('button', { name: /login|sign in/i }).click();

        // Since the inputs are marked `required`, the browser blocks submission
        // natively and the form never reaches the backend. Confirm that behavior
        // instead of looking for a custom error message that never renders.
        await expect(emailInput).toHaveJSProperty('validity.valid', false);

        // We never navigated away or hit the API, since native validation stopped it
        await expect(page).toHaveURL(new RegExp(LOGIN_PATH));
    });

    test('shows error for invalid credentials', async ({ page }) => {
        await page.goto(LOGIN_PATH);

        await page.getByLabel(/email/i).fill('nouser@test.com');
        await page.getByLabel(/password/i).fill('wrongpassword');
        await page.getByRole('button', { name: /login|sign in/i }).click();

        await expect(page.getByText(/user not found|invalid email or password/i)).toBeVisible();
    });

    test('logs in successfully and redirects to dashboard', async ({ page }) => {
        await page.goto(LOGIN_PATH);

        await page.getByLabel(/email/i).fill(VALID_EMAIL);
        await page.getByLabel(/password/i).fill(VALID_PASSWORD);
        await page.getByRole('button', { name: /login|sign in/i }).click();

        // Adjust to whatever route your app redirects to after a successful login
        await expect(page).toHaveURL(/dashboard|home|profile/i);

        // Optional: confirm something on the page that only shows when logged in
        // await expect(page.getByText(/welcome/i)).toBeVisible();

        // Optional: confirm the auth cookie was actually set
        const cookies = await page.context().cookies();
        const authCookie = cookies.find(c => c.name === 'token');
        expect(authCookie).toBeDefined();
    });

    test('logged-in user can log out', async ({ page }) => {
        await page.goto(LOGIN_PATH);
        await page.getByLabel(/email/i).fill(VALID_EMAIL);
        await page.getByLabel(/password/i).fill(VALID_PASSWORD);
        await page.getByRole('button', { name: /login|sign in/i }).click();

        await expect(page).toHaveURL(/dashboard|home|profile/i);

        // Adjust selector for your actual logout button/link
        await page.getByRole('button', { name: /logout|sign out/i }).click();

        await expect(page).toHaveURL(/login/i);
    });

});