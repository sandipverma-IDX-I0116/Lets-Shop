import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly registerLink: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.registerLink = page.getByText('Register here');
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

    async goToRegister() {
        await this.registerLink.click();
    }
}
