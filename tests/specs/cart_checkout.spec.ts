import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import loginData from '../../data/login_data.json';
import cartData from '../../data/cart_checkout_data.json';

test.describe('Cart/Checkout POM Tests', () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        // Login
        await loginPage.goTo();
        await loginPage.login(loginData.validUser.email, loginData.validUser.password);
        await loginPage.verifyDashboard();
    });

    test('TC_CART_01: Verify cart displays added products', async ({ page }) => {
        // Add product to cart
        await dashboardPage.addToCart(cartData.cartProduct);
        await dashboardPage.verifyToastMessage('Product Added To Cart');

        // Navigate to Cart
        await page.getByRole('button', { name: /Cart/ }).first().click();
        await expect(cartPage.cartHeading).toBeVisible();

        // Verify product in cart
        await cartPage.verifyProductInCart(cartData.cartProduct);

        // Verify Checkout button
        await cartPage.verifyCheckoutButtonVisible();
    });

    test('TC_CHECKOUT_01: Complete checkout successfully', async ({ page }) => {
        // Add product to cart
        await dashboardPage.addToCart(cartData.cartProduct);
        await dashboardPage.verifyToastMessage('Product Added To Cart');

        // Navigate to Cart and Checkout
        await page.getByRole('button', { name: /Cart/ }).first().click();
        await cartPage.proceedToCheckout();

        // Select Country and Place Order
        await checkoutPage.selectCountry(cartData.country);
        await checkoutPage.placeOrder();

        // Verify Order Confirmation
        await checkoutPage.verifyOrderConfirmation();
    });

    test('TC_CHECKOUT_02: Verify empty country field validation', async ({ page }) => {
        // Add product to cart
        await dashboardPage.addToCart(cartData.cartProduct);
        await dashboardPage.verifyToastMessage('Product Added To Cart');

        // Navigate to Cart and Checkout
        await page.getByRole('button', { name: /Cart/ }).first().click();
        await cartPage.proceedToCheckout();

        // Attempt to Place Order without selecting country
        await checkoutPage.placeOrder();

        // Verify still on checkout page (country field visible)
        await checkoutPage.verifyCountryFieldVisible();
    });
});
