import { test, expect } from '@playwright/test';

test.describe('Dashboard Module', () => {

    test.beforeEach(async ({ page }) => {
        // Login with static credentials
        await page.goto('https://rahulshettyacademy.com/client/');

        // Logout if needed
        const signout = page.getByRole('button', { name: 'Sign Out' });
        if (await signout.isVisible()) {
            await signout.click();
        }

        // Login
        if (!await page.getByRole('heading', { name: 'Log in' }).isVisible()) {
            await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
        }
        await page.locator('#userEmail').fill('dummyuser145@gmail.com');
        await page.locator('#userPassword').fill('Demo@123');
        await page.getByRole('button', { name: 'Login' }).click();

        // Wait for Dashboard to load
        await expect(page.locator('.card-body b').first()).toBeVisible();
    });

    test('TC_DASH_01: Verify product display', async ({ page }) => {
        await test.step('Check for products', async () => {
            const products = page.locator('.card-body');
            await expect(products.first()).toBeVisible();
            const count = await products.count();
            expect(count).toBeGreaterThan(0);
        });
    });

    test('TC_DASH_02: Verify search functionality', async ({ page }) => {
        const productName = 'ZARA COAT 3';
        await test.step('Search for product', async () => {
            // Use exact product name for search
            await page.getByRole('textbox', { name: 'search' }).first().fill(productName);
            await page.keyboard.press('Enter');
            // Wait for list to update
            await page.waitForTimeout(2000);

            // Verify filtered results
            const products = page.locator('.card-body');
            // Should contain our product
            await expect(products.filter({ hasText: productName }).first()).toBeVisible();
        });
    });

    test('TC_DASH_03: Verify add to cart', async ({ page }) => {
        const productName = 'iphone 13 pro';

        await test.step('Add product to cart', async () => {
            // Find product card with specific text and click Add To Cart
            // Playwright locator chaining:
            await page.locator('div.card')
                .filter({ hasText: productName })
                .getByRole('button', { name: 'Add To Cart' })
                .click();
        });

        await test.step('Verify Success Toast', async () => {
            await expect(page.locator('#toast-container')).toBeVisible();
            await expect(page.locator('#toast-container')).toContainText('Product Added To Cart');
        });
    });

});
