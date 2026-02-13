import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('#userEmail');
        this.passwordInput = page.locator('#userPassword');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async goTo() {
        await this.page.goto('https://rahulshettyacademy.com/client/');
    }

    async login(email: string, password: string) {
        await expect(this.page.getByRole('heading', { name: 'Log in' })).toBeVisible();
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async verifyLoginError(errorMessage: string) {
        if (errorMessage.includes('Incorrect')) {
            await expect(this.page.locator('#toast-container')).toContainText(errorMessage);
        } else {
            // Fallback for other errors if any
            await expect(this.page.locator('#toast-container')).toBeVisible();
        }
    }

    async verifyEmptyFieldErrors() {
        await expect(this.page.getByText('*Email is required')).toBeVisible();
        await expect(this.page.getByText('*Password is required')).toBeVisible();
    }

    async verifyDashboard() {
        await expect(this.page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
        await expect(this.page.locator('.card-body b').first()).toBeVisible();
    }

    async signOut() {
        await this.page.getByRole('button', { name: 'Sign Out' }).click();
    }
}
