import { test, expect } from '@playwright/test';

test.describe('Registration Module', () => {
    let uniqueEmail: string;

    test.beforeEach(async ({ page }) => {
        // Navigate to Login page then Registration page
        await page.goto('https://rahulshettyacademy.com/client/');
        // If logged in, sign out
        const signout = page.getByRole('button', { name: 'Sign Out' });
        if (await signout.isVisible()) {
            await signout.click();
        }

        // Check if on login page, if not wait or navigate
        if (await page.getByRole('heading', { name: 'Log in' }).isVisible()) {
            await page.getByText('Register here').click();
        } else {
            await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
            await page.getByText('Register here').click();
        }
        await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
    });

    test('TC_REG_01: Verify successful registration with valid details', async ({ page }) => {
        uniqueEmail = `reg_test_${Date.now()}@example.com`;

        await test.step('Fill detailed registration form', async () => {
            await page.getByPlaceholder('First Name').fill('Test');
            await page.getByPlaceholder('Last Name').fill('User');
            await page.getByPlaceholder('email@example.com').fill(uniqueEmail);
            await page.getByPlaceholder('enter your number').fill('1234567890');
            await page.locator('select[formcontrolname="occupation"]').selectOption('Engineer');

            await page.locator('input[value="Male"]').check();
            await page.locator('#userPassword').fill('Password@123');
            await page.locator('#confirmPassword').fill('Password@123');
            await page.locator('input[type="checkbox"]').check();
        });

        await test.step('Submit and Verify Success', async () => {
            await page.getByRole('button', { name: 'Register' }).click();
            await expect(page.getByText('Account Created Successfully')).toBeVisible();
        });

        await test.step('Navigate to Login', async () => {
            await page.getByRole('button', { name: 'Login' }).click();
            await expect(page.getByText('Log in')).toBeVisible();
        });
    });

    test('TC_REG_02: Verify registration with existing email', async ({ page }) => {
        // Prerequisite: TC_REG_01 must have run or we need a known existing email.
        // If uniqueEmail is not set (e.g. running this test alone), generate one and register first? 
        // For flat test simplicity, let's just use a fixed one if uniqueEmail is undefined or assume sequential execution.
        // Better: Helper step to create user if needed? 
        // Or just use a hardcoded one that definitely exists or create one inside this test if isolated.
        // To make it independent, let's reuse uniqueEmail if available, else register one. 
        // But since tests run in parallel/isolation by default, sharing state is tricky. 
        // Strategy: Register a user -> Expect Success -> Logout -> Register SAME user -> Expect Error.
        // This makes the test self-contained.

        const testEmail = `reg_exist_${Date.now()}@example.com`;

        await test.step('Pre-condition: Register a user', async () => {
            await page.getByPlaceholder('First Name').fill('Existing');
            await page.getByPlaceholder('Last Name').fill('User');
            await page.getByPlaceholder('email@example.com').fill(testEmail);
            await page.getByPlaceholder('enter your number').fill('1234567890');
            await page.locator('select[formcontrolname="occupation"]').selectOption('Doctor');
            await page.locator('input[value="Female"]').check();
            await page.locator('#userPassword').fill('Password@123');
            await page.locator('#confirmPassword').fill('Password@123');
            await page.locator('input[type="checkbox"]').check();
            await page.getByRole('button', { name: 'Register' }).click();
            await expect(page.getByText('Account Created Successfully')).toBeVisible();
            await page.getByRole('button', { name: 'Login' }).click();
        });

        await test.step('Try to register again with same email', async () => {
            await page.getByText('Register here').click();
            await page.getByPlaceholder('First Name').fill('Existing');
            await page.getByPlaceholder('Last Name').fill('User');
            // Enter existing email
            await page.getByPlaceholder('email@example.com').fill(testEmail);
            await page.getByPlaceholder('enter your number').fill('1234567890');
            await page.locator('select[formcontrolname="occupation"]').selectOption('Doctor');
            await page.locator('input[value="Female"]').check();
            await page.locator('#userPassword').fill('Password@123');
            await page.locator('#confirmPassword').fill('Password@123');
            await page.locator('input[type="checkbox"]').check();

            await page.getByRole('button', { name: 'Register' }).click();

            // Assert Error
            await expect(page.locator('#toast-container')).toContainText('User already ex');
        });
    });

    test('TC_REG_03: Verify password mismatch error', async ({ page }) => {
        await test.step('Fill form with mismatched passwords', async () => {
            await page.getByPlaceholder('First Name').fill('Test');
            await page.getByPlaceholder('Last Name').fill('Mismatch');
            await page.getByPlaceholder('email@example.com').fill(`mismatch_${Date.now()}@example.com`);
            await page.getByPlaceholder('enter your number').fill('1234567890');
            await page.locator('select[formcontrolname="occupation"]').selectOption('Student');
            await page.locator('input[value="Male"]').check();

            await page.locator('#userPassword').fill('Password@123');
            await page.locator('#confirmPassword').fill('Password@999'); // Mismatch

            await page.locator('input[type="checkbox"]').check();
        });

        await test.step('Click Register and Verify Error', async () => {
            await page.getByRole('button', { name: 'Register' }).click();
            await expect(page.getByText('Password and Confirm Password must match with each other.')).toBeVisible();
        });
    });

    test('TC_REG_04: Verify empty mandatory fields validation', async ({ page }) => {
        await test.step('Leave all fields empty and click Register', async () => {
            await page.getByRole('button', { name: 'Register' }).click();
        });

        await test.step('Verify Error Messages', async () => {
            await expect(page.getByText('*First Name is required')).toBeVisible();
            await expect(page.getByText('*Email is required')).toBeVisible();
            await expect(page.getByText('*Phone Number is required')).toBeVisible();
            await expect(page.getByText('*Password is required')).toBeVisible();
            await expect(page.getByText('Confirm Password is required')).toBeVisible();
            await expect(page.getByText('*Please check above checkbox')).toBeVisible();
        });
    });

});
