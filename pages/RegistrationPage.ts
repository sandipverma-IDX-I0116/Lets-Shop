import { Page, Locator, expect } from '@playwright/test';

export class RegistrationPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly phoneInput: Locator;
    readonly occupationDropdown: Locator;
    readonly genderRadio: (gender: string) => Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly termsCheckbox: Locator;
    readonly registerButton: Locator;
    readonly successMessage: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.emailInput = page.getByPlaceholder('email@example.com');
        this.phoneInput = page.getByPlaceholder('enter your number');
        this.occupationDropdown = page.locator('select[formcontrolname="occupation"]');
        this.genderRadio = (gender: string) => page.locator(`input[value="${gender}"]`);
        this.passwordInput = page.locator('#userPassword');
        this.confirmPasswordInput = page.locator('#confirmPassword');
        this.termsCheckbox = page.locator('input[type="checkbox"]');
        this.registerButton = page.getByRole('button', { name: 'Register' });
        this.successMessage = page.getByText('Account Created Successfully');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async goTo() {
        await this.page.goto('https://rahulshettyacademy.com/client/');
        // If logged in, logout logic handled in test or here? 
        // Best to keep page object localized.
        // Assuming starting from Login page or dashboard.
        // If on login page:
        if (await this.page.getByRole('heading', { name: 'Log in' }).isVisible()) {
            await this.page.getByText('Register here').click();
        } else {
            // Force navigate if not on login
            await this.page.goto('https://rahulshettyacademy.com/client/#/auth/login');
            await this.page.getByText('Register here').click();
        }
        await expect(this.page.getByRole('heading', { name: 'Register' })).toBeVisible();
    }

    async fillForm(data: any, email?: string) {
        if (data.firstName) await this.firstNameInput.fill(data.firstName);
        if (data.lastName) await this.lastNameInput.fill(data.lastName);
        if (email) {
            await this.emailInput.fill(email);
        } else if (data.email) {
            await this.emailInput.fill(data.email);
        }
        if (data.phone) await this.phoneInput.fill(data.phone);
        if (data.occupation) await this.occupationDropdown.selectOption(data.occupation);
        if (data.gender) await this.genderRadio(data.gender).check();
        if (data.password) await this.passwordInput.fill(data.password);

        // Handle specific logic for confirmation
        if (data.confirmPassword) {
            await this.confirmPasswordInput.fill(data.confirmPassword);
        } else if (data.password) {
            // Default to same password if not specified (for success case)
            await this.confirmPasswordInput.fill(data.password);
        }

        await this.termsCheckbox.check();
    }

    async submit() {
        await this.registerButton.click();
    }

    async verifySuccess() {
        await expect(this.successMessage).toBeVisible();
    }

    async navigateToLogin() {
        await this.loginButton.click();
    }

    async verifyError(errorMessage: string) {
        if (errorMessage === 'User already exists') {
            await expect(this.page.locator('#toast-container')).toContainText('User already ex');
        } else {
            await expect(this.page.getByText(errorMessage)).toBeVisible();
        }
    }

    async verifyEmptyFieldErrors() {
        await expect(this.page.getByText('*First Name is required')).toBeVisible();
        await expect(this.page.getByText('*Email is required')).toBeVisible();
        await expect(this.page.getByText('*Phone Number is required')).toBeVisible();
        await expect(this.page.getByText('*Password is required')).toBeVisible();
        await expect(this.page.getByText('Confirm Password is required')).toBeVisible();
        await expect(this.page.getByText('*Please check above checkbox')).toBeVisible();
    }
}
