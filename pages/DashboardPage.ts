import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly productCards: Locator;
    readonly searchInput: Locator;
    readonly toastContainer: Locator;
    readonly signoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productCards = page.locator('.card');
        // Using generic textbox role/locator based on finding
        this.searchInput = page.locator('input[type="text"]').last(); // Often specifically the search bar if multiple inputs
        // or better: 
        this.searchInput = page.getByRole('textbox', { name: 'search' }).first();

        this.toastContainer = page.locator('#toast-container');
        this.signoutButton = page.getByRole('button', { name: 'Sign Out' });
    }

    async searchProduct(productName: string) {
        await this.searchInput.fill(productName);
        await this.page.keyboard.press('Enter');
        // Wait for network/grid update
        await this.page.waitForTimeout(2000);
    }

    async getProductCard(productName: string): Promise<Locator> {
        // Case insensitive match often needed
        return this.productCards.filter({ hasText: productName }).first();
    }

    async addToCart(productName: string) {
        const card = await this.getProductCard(productName);
        await expect(card).toBeVisible();
        await card.getByRole('button', { name: 'Add To Cart' }).click();
    }

    async verifyProductDisplayed(productName: string) {
        const card = await this.getProductCard(productName);
        await expect(card).toBeVisible();
    }

    async verifyToastMessage(message: string) {
        await expect(this.toastContainer).toBeVisible();
        await expect(this.toastContainer).toContainText(message);
    }
}
