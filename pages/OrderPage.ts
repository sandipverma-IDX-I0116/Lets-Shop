import { Page, Locator, expect } from '@playwright/test';

export class OrderPage {
    readonly page: Page;
    readonly successMessage: Locator;
    readonly orderId: Locator;

    constructor(page: Page) {
        this.page = page;
        this.successMessage = page.locator('.hero-primary');
        this.orderId = page.locator('.em-spacer-1 .ng-star-inserted');
    }

    async verifyOrderSuccess() {
        await expect(this.successMessage).toHaveText(' Thankyou for the order. ');
    }

    async getOrderId() {
        return await this.orderId.textContent();
    }
}
