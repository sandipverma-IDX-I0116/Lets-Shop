import { test } from '@playwright/test';
import { RegistrationPage } from '../../pages/RegistrationPage';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { OrderPage } from '../../pages/OrderPage';
import data from '../../data/shopping_data.json';

test('End-to-End Shopping Journey', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const orderPage = new OrderPage(page);

    const uniqueEmail = `ag_pom_${Date.now()}@example.com`;

    // 1. Register
    await registrationPage.goTo();
    await registrationPage.fillForm(data, uniqueEmail);
    await registrationPage.submit();
    await registrationPage.verifySuccess();
    await registrationPage.navigateToLogin();

    // 2. Login
    await loginPage.login(uniqueEmail, data.password);
    await loginPage.verifyDashboard();

    // 3. Dashboard
    await dashboardPage.addToCart(data.productName);
    await dashboardPage.verifyToastMessage('Product Added To Cart');

    // Navigate to Cart
    await page.getByRole('button', { name: /Cart/ }).first().click();

    // 4. Cart
    await cartPage.verifyProductInCart(data.productName);
    await cartPage.proceedToCheckout();

    // 5. Checkout
    await checkoutPage.selectCountry(data.countryName);
    await checkoutPage.placeOrder();

    // 6. Order Confirmation
    await orderPage.verifyOrderSuccess();
    const orderId = await orderPage.getOrderId();
    console.log('POM Order ID:', orderId);
});
