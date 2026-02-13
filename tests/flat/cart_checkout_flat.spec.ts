
import { test, expect } from '@playwright/test';

test.describe('Cart/Checkout Module', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the site
        await page.goto('https://rahulshettyacademy.com/client/');

        // Check if already logged in and logout if needed
        const signout = page.getByRole('button', { name: 'Sign Out' });
        if (await signout.isVisible()) {
            await signout.click();
            // Wait for redirect to login page
            await page.waitForURL('**/auth/login');
        }

        // Ensure we're on login page
        await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
        await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();

        // Login
        await page.locator('#userEmail').fill('dummyuser145@gmail.com');
        await page.locator('#userPassword').fill('Demo@123');
        await page.getByRole('button', { name: 'Login' }).click();

        // Wait for Dashboard to load
        await expect(page.locator('.card-body b').first()).toBeVisible();
    });

    test('TC_CART_01: Verify cart displays added products', async ({ page }) => {
        const productName = 'iphone 13 pro';

        await test.step('Add product to cart', async () => {
            await page.locator('div.card').filter({ hasText: productName })
                .getByRole('button', { name: 'Add To Cart' }).click();
            await expect(page.locator('#toast-container')).toContainText('Product Added To Cart');
            await page.waitForTimeout(1000); // Wait for toast to disappear
        });

        await test.step('Navigate to Cart', async () => {
            await page.getByRole('button', { name: /Cart/ }).first().click();
            await expect(page.getByRole('heading', { name: 'My Cart' })).toBeVisible();
        });

        await test.step('Verify product in cart', async () => {
            await expect(page.getByRole('heading', { name: productName, level: 3 })).toBeVisible();
        });

        await test.step('Verify Checkout button', async () => {
            await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();
        });
    });

    test('TC_CHECKOUT_01: Complete checkout successfully', async ({ page }) => {
        const productName = 'iphone 13 pro';
        const country = 'India';

        await test.step('Add product to cart', async () => {
            await page.locator('div.card').filter({ hasText: productName })
                .getByRole('button', { name: 'Add To Cart' }).click();
            await expect(page.locator('#toast-container')).toContainText('Product Added To Cart');
            await page.waitForTimeout(1000); // Wait for toast to disappear
        });

        await test.step('Navigate to Cart and Checkout', async () => {
            await page.getByRole('button', { name: /Cart/ }).first().click();
            await page.getByRole('button', { name: 'Checkout' }).click();
        });

        await test.step('Select Country', async () => {
            // Type in country field using pressSequentially
            await page.getByPlaceholder('Select Country').pressSequentially('Ind');

            // Wait for dropdown suggestions
            const dropdown = page.locator('.ta-results');
            await dropdown.waitFor();

            // Find and click India from dropdown
            const optionsCount = await dropdown.locator('button').count();
            for (let i = 0; i < optionsCount; ++i) {
                const text = await dropdown.locator('button').nth(i).textContent();
                if (text?.trim() === country) {
                    await dropdown.locator('button').nth(i).click();
                    break;
                }
            }
        });

        await test.step('Place Order', async () => {
            await page.locator('.action__submit').click();
        });

        await test.step('Verify Order Confirmation', async () => {
            await expect(page.getByText('Thankyou for the order.')).toBeVisible();
            // Verify Order ID is displayed
            await expect(page.locator('.em-spacer-1 .ng-star-inserted')).toBeVisible();
        });
    });

    test('TC_CHECKOUT_02: Verify empty country field validation', async ({ page }) => {
        const productName = 'iphone 13 pro';

        await test.step('Add product to cart', async () => {
            await page.locator('div.card').filter({ hasText: productName })
                .getByRole('button', { name: 'Add To Cart' }).click();
            await expect(page.locator('#toast-container')).toContainText('Product Added To Cart');
            await page.waitForTimeout(1000); // Wait for toast to disappear
        });

        await test.step('Navigate to Cart and Checkout', async () => {
            await page.getByRole('button', { name: /Cart/ }).first().click();
            await page.getByRole('button', { name: 'Checkout' }).click();
        });

        await test.step('Attempt to Place Order without country', async () => {
            // Leave country field empty and click Place Order
            await page.locator('text=Place Order').click();
        });

        await test.step('Verify Validation Error', async () => {
            // The validation might be shown as an alert or toast
            // Based on typical behavior, check if still on checkout page
            await expect(page.getByPlaceholder('Select Country')).toBeVisible();
        });
    });

});
