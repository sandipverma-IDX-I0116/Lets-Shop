import { test, expect } from '@playwright/test';

test('Automate Shopping Workflow', async ({ page }) => {
    const email = `test_user_${Date.now()}@example.com`;
    const password = 'Password@123';
    const firstName = 'Test';
    const lastName = 'User';
    const phoneNumber = '1234567890';
    const countryName = 'India';
    const productName = 'iphone 13 pro';

    // 1. Register
    await page.goto('https://rahulshettyacademy.com/client/');
    await page.getByText('Register here').click();
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();

    await page.getByPlaceholder('First Name').fill(firstName);
    await page.getByPlaceholder('Last Name').fill(lastName);
    await page.getByPlaceholder('email@example.com').fill(email);
    await page.getByPlaceholder('enter your number').fill(phoneNumber);
    await page.locator('select[formcontrolname="occupation"]').selectOption('Engineer');
    await page.locator('input[value="Male"]').check();
    await page.locator('#userPassword').fill(password);
    await page.locator('#confirmPassword').fill(password);
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole('button', { name: 'Register' }).click();

    // Verify Registration Success
    await expect(page.getByText('Account Created Successfully')).toBeVisible();
    await page.getByRole('button', { name: 'Login' }).click();

    // 2. Login
    await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify Login
    await expect(page.locator('.card-body b').first()).toBeVisible();

    // 3. Add to Cart
    await page.locator('.card-body').filter({ hasText: productName })
        .getByRole('button', { name: 'Add To Cart' }).click();
    await expect(page.locator('#toast-container')).toContainText('Product Added To Cart');
    // Wait for toaster to disappear to ensure clickability of next elements
    await expect(page.locator('#toast-container')).toBeHidden();

    // 4. Cart
    // Using first() to avoid strict mode violation as 'Cart' button appears multiple times
    await page.getByRole('button', { name: /Cart/ }).first().click();
    await expect(page.locator('.cartSection h3')).toHaveText(productName);
    await page.getByRole('button', { name: 'Checkout' }).click();

    // 5. Checkout
    await page.getByPlaceholder('Select Country').pressSequentially('Ind');
    const dropdown = page.locator('.ta-results');
    await dropdown.waitFor();
    const optionsCount = await dropdown.locator('button').count();
    for (let i = 0; i < optionsCount; ++i) {
        const text = await dropdown.locator('button').nth(i).textContent();
        if (text?.trim() === countryName) {
            await dropdown.locator('button').nth(i).click();
            break;
        }
    }
    await page.locator('.action__submit').click();

    // 6. Order Confirmation
    await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ');
    const orderId = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
    console.log('Order ID:', orderId);
});
