import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import loginData from '../../data/login_data.json';
import dashData from '../../data/dashboard_data.json';

test.describe('Dashboard POM Tests', () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);

        await loginPage.goTo();
        await loginPage.login(loginData.validUser.email, loginData.validUser.password);
        await loginPage.verifyDashboard();
    });

    test('TC_DASH_01: Verify product display', async ({ page }) => {
        // Check if any products are displayed
        const count = await dashboardPage.productCards.count();
        // Wait for products to load usually handled by verifyDashboard but let's be explicit
        await dashboardPage.productCards.first().waitFor();
    });

    test('TC_DASH_02: Verify search functionality', async () => {
        await dashboardPage.searchProduct('ZARA COAT 3');
        await dashboardPage.verifyProductDisplayed('ZARA COAT 3');
    });

    test('TC_DASH_03: Verify add to cart', async () => {
        await dashboardPage.addToCart(dashData.cartProduct);
        await dashboardPage.verifyToastMessage('Product Added To Cart');
    });

});
