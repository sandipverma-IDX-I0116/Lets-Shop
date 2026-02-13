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

    // Occupation
    await page.locator('select[formcontrolname="occupation"]').selectOption('Engineer');

    // Gender
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
    await expect(page.getByText('Validating User')).not.toBeVisible();
    await expect(page.locator('.card-body b').first()).toBeVisible(); // Wait for products to load

    // 3. Add to Cart
    // Find product by name and click Add To Cart
    // We need to use locator chaining/filtering to get the exact card
    const products = page.locator('.card-body');
    const count = await products.count();

    // Better way using filter
    await page.locator('.card-body').filter({ hasText: productName })
        .getByRole('button', { name: 'Add To Cart' }).click();

    // Verify Added to Cart Toaster
    await expect(page.locator('#toast-container')).toContainText('Product Added To Cart');
    await expect(page.locator('#toast-container')).toBeHidden(); // Wait for it to disappear

    // 4. Cart
    await page.locator('[routerlink*="cart"]').click();

    // Verify item in cart
    await expect(page.locator('.cartSection h3')).toHaveText(productName);

    await page.getByRole('button', { name: 'Checkout' }).click();

    // 5. Checkout
    await page.getByPlaceholder('Select Country').pressSequentially('Ind');

    // Wait for suggestions and click India
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

    // Verify Country Selected
    // (Optional, field value check)

    await page.locator('.action__submit').click();

    // 6. Order Confirmation
    await expect(page.getByRole('heading', { name: 'Generic Event' })).not.toBeVisible(); // sanity check against error page
    await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ');

    const orderId = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
    console.log('Order ID:', orderId);

    // Download Order Details (Optional verify click works)
    // await page.getByRole('button', { name: 'Click To Download Order Details' }).click();

});
