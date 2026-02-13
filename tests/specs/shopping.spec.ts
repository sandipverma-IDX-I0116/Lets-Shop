import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { OrderPage } from '../../pages/OrderPage';
import data from '../../data/shopping_data.json';

test('End-to-End Shopping Journey', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const orderPage = new OrderPage(page);

    const uniqueEmail = `ag_pom_${Date.now()}@example.com`;

    // 1. Register
    await loginPage.goTo();
    await loginPage.register(data, uniqueEmail);

    // 2. Login
    await loginPage.login(uniqueEmail, data.password);

    // 3. Dashboard
    await dashboardPage.searchProductAddCart(data.productName);
    await dashboardPage.navigateToCart();

    // 4. Cart
    await cartPage.verifyProductDisplay(data.productName);
    await cartPage.checkout();

    // 5. Checkout
    await checkoutPage.selectCountry(data.countryName);
    await checkoutPage.verifyEmail(uniqueEmail);
    await checkoutPage.submitOrder();

    // 6. Order Confirmation
    await orderPage.verifyOrderSuccess();
    const orderId = await orderPage.getOrderId();
    console.log('POM Order ID:', orderId);
});
