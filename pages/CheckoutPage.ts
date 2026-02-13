import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly countryField: Locator;
    readonly countryDropdown: Locator;
    readonly placeOrderButton: Locator;
    readonly orderConfirmationMessage: Locator;
    readonly orderIdElement: Locator;

    constructor(page: Page) {
        this.page = page;
        this.countryField = page.getByPlaceholder('Select Country');
        this.countryDropdown = page.locator('.ta-results');
        this.placeOrderButton = page.locator('.action__submit');
        this.orderConfirmationMessage = page.getByText('Thankyou for the order.');
        this.orderIdElement = page.locator('.em-spacer-1 .ng-star-inserted');
    }

    async selectCountry(countryName: string) {
        // Type in country field using pressSequentially to trigger dropdown
        await this.countryField.pressSequentially(countryName.substring(0, 3));

        // Wait for dropdown suggestions
        await this.countryDropdown.waitFor();

        // Find and click the country from dropdown
        const optionsCount = await this.countryDropdown.locator('button').count();
        for (let i = 0; i < optionsCount; ++i) {
            const text = await this.countryDropdown.locator('button').nth(i).textContent();
            if (text?.trim() === countryName) {
                await this.countryDropdown.locator('button').nth(i).click();
                break;
            }
        }
    }

    async placeOrder() {
        await this.placeOrderButton.click();
    }

    async verifyOrderConfirmation() {
        await expect(this.orderConfirmationMessage).toBeVisible();
        await expect(this.orderIdElement).toBeVisible();
    }

    async verifyCountryFieldVisible() {
        // Used for validation - if still on checkout page, country field should be visible
        await expect(this.countryField).toBeVisible();
    }
}
