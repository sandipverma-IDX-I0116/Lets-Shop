import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import data from '../../data/login_data.json';

test.describe('Login POM Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goTo();
    });

    test('TC_LOGIN_01: Verify successful login with valid credentials', async () => {
        await loginPage.login(data.validUser.email, data.validUser.password);
        await loginPage.verifyDashboard();
    });

    test('TC_LOGIN_02: Verify login with invalid password', async () => {
        // Use valid email but wrong password
        await loginPage.login(data.validUser.email, data.invalidPassword.password);
        await loginPage.verifyLoginError('Incorrect email or password');
    });

    test('TC_LOGIN_03: Verify login with non-existent email', async () => {
        const nonExistEmail = `nonexist_${Date.now()}@example.com`;
        await loginPage.login(nonExistEmail, data.nonExistent.password);
        await loginPage.verifyLoginError('Incorrect email or password');
    });

    test('TC_LOGIN_04: Verify empty fields validation', async () => {
        // Just click login without filling headers
        await loginPage.loginButton.click();
        await loginPage.verifyEmptyFieldErrors();
    });

});
