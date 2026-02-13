import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly countryInput: Locator;
    readonly dropdownResults: Locator;
    readonly submitButton: Locator;
    readonly userEmailLabel: Locator;

    constructor(page: Page) {
        this.page = page;
        this.countryInput = page.getByPlaceholder('Select Country');
        this.dropdownResults = page.locator('.ta-results');
        this.submitButton = page.locator('.action__submit');
        this.userEmailLabel = page.locator('.user__name [type="text"]').first();
    }

    async selectCountry(countryName: string) {
        await this.countryInput.pressSequentially(countryName, { delay: 100 });
        await this.dropdownResults.waitFor();
        const optionsCount = await this.dropdownResults.locator('button').count();
        for (let i = 0; i < optionsCount; ++i) {
            const text = await this.dropdownResults.locator('button').nth(i).textContent();
            if (text?.trim() === countryName) {
                await this.dropdownResults.locator('button').nth(i).click();
                break;
            }
        }
    }

    async verifyEmail(email: string) {
        await expect(this.userEmailLabel).toHaveText(email);
    }

    async submitOrder() {
        await this.submitButton.click();
    }
}
