import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartProducts: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartProducts = page.locator('.cartSection h3');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    }

    async verifyProductDisplay(productName: string) {
        await this.cartProducts.waitFor();
        const bool = await this.getProductLocator(productName).isVisible();
        expect(bool).toBeTruthy();
    }

    getProductLocator(productName: string) {
        return this.page.locator("h3:has-text('" + productName + "')");
    }

    async checkout() {
        await this.checkoutButton.click();
    }
}
