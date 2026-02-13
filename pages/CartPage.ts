import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartHeading: Locator;
    readonly productList: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartHeading = page.getByRole('heading', { name: 'My Cart' });
        this.productList = page.locator('.cartSection h3');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    }

    async verifyProductInCart(productName: string) {
        await expect(this.page.getByRole('heading', { name: productName, level: 3 })).toBeVisible();
    }

    async verifyCheckoutButtonVisible() {
        await expect(this.checkoutButton).toBeVisible();
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }
}
