import { test, expect } from '@playwright/test';

test.describe('Login Module', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/client/');
        // If logged in, logout
        const signout = page.getByRole('button', { name: 'Sign Out' });
        if (await signout.isVisible()) {
            await signout.click();
        }
        // Check if on login page, if not wait or navigate
        if (!await page.getByRole('heading', { name: 'Log in' }).isVisible()) {
            await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
        }
        await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
    });

    test('TC_LOGIN_01: Verify successful login with valid credentials', async ({ page }) => {
        // Use static credentials
        const email = 'dummyuser145@gmail.com';
        const password = 'Demo@123';

        await test.step('Perform Login', async () => {
            await page.locator('#userEmail').fill(email);
            await page.locator('#userPassword').fill(password);
            await page.getByRole('button', { name: 'Login' }).click();
        });

        await test.step('Verify Dashboard', async () => {
            await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
            await expect(page.locator('.card-body b').first()).toBeVisible(); // Check for products
        });
    });

    test('TC_LOGIN_02: Verify login with invalid password', async ({ page }) => {
        // Use valid email but wrong password
        const email = 'dummyuser145@gmail.com';
        const invalidPassword = 'WrongPassword';

        await test.step('Login with Invalid Password', async () => {
            await page.locator('#userEmail').fill(email);
            await page.locator('#userPassword').fill(invalidPassword);
            await page.getByRole('button', { name: 'Login' }).click();
        });

        await test.step('Verify Error', async () => {
            await expect(page.locator('#toast-container')).toContainText('Incorrect email or password');
        });
    });

    test('TC_LOGIN_03: Verify login with non-existent email', async ({ page }) => {
        await test.step('Login with non-existent email', async () => {
            await page.locator('#userEmail').fill(`nonexist_${Date.now()}@example.com`);
            await page.locator('#userPassword').fill('Password@123');
            await page.getByRole('button', { name: 'Login' }).click();
        });

        await test.step('Verify Error', async () => {
            await expect(page.locator('#toast-container')).toContainText('Incorrect email or password');
        });
    });

    test('TC_LOGIN_04: Verify empty fields validation', async ({ page }) => {
        await test.step('Login with empty fields', async () => {
            await page.getByRole('button', { name: 'Login' }).click();
        });

        await test.step('Verify Validation Errors', async () => {
            await expect(page.getByText('*Email is required')).toBeVisible();
            await expect(page.getByText('*Password is required')).toBeVisible();
        });
    });

});
