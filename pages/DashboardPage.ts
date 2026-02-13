import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly products: Locator;
    readonly cartButton: Locator;
    readonly toast: Locator;

    constructor(page: Page) {
        this.page = page;
        this.products = page.locator('.card-body');
        this.cartButton = page.locator('[routerlink*="cart"]');
        this.toast = page.locator('#toast-container');
    }

    async searchProductAddCart(productName: string) {
        // Wait for products to load
        await this.products.first().waitFor();
        const titles = await this.products.locator('b').allTextContents();
        console.log('Products found:', titles);

        // Add to Cart
        await this.products.filter({ hasText: productName })
            .getByRole('button', { name: 'Add To Cart' }).click();

        // Verify Toast
        await expect(this.toast).toContainText('Product Added To Cart');
        await expect(this.toast).toBeHidden();
    }

    async navigateToCart() {
        await this.cartButton.click();
    }
}
