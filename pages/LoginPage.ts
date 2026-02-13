import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly registerLink: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    // Registration
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly phoneInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly termsCheckbox: Locator;
    readonly registerButton: Locator;
    readonly occupationDropdown: Locator;
    readonly genderRadio: (gender: string) => Locator;

    constructor(page: Page) {
        this.page = page;
        this.registerLink = page.getByText('Register here');
        this.emailInput = page.locator('#userEmail');
        this.passwordInput = page.locator('#userPassword');
        this.loginButton = page.getByRole('button', { name: 'Login' });

        // Registration
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.phoneInput = page.getByPlaceholder('enter your number');
        this.confirmPasswordInput = page.locator('#confirmPassword'); // Fixed locator
        this.termsCheckbox = page.locator('input[type="checkbox"]');
        this.registerButton = page.getByRole('button', { name: 'Register' });
        this.occupationDropdown = page.locator('select[formcontrolname="occupation"]');
        this.genderRadio = (gender: string) => page.locator(`input[value="${gender}"]`);
    }

    async goTo() {
        await this.page.goto('https://rahulshettyacademy.com/client/');
    }

    async register(data: any, email: string) {
        await this.registerLink.click();
        await expect(this.page.getByRole('heading', { name: 'Register' })).toBeVisible();

        await this.firstNameInput.fill(data.firstName);
        await this.lastNameInput.fill(data.lastName);
        await this.emailInput.fill(email); // Reused ID for registration email field? Needs verification. 
        // Wait, registration email field placeholder is email@example.com, ID might be different. 
        // In flat test we used 'email@example.com' placeholder.
        // Let's use placeholder for registration email to be safe as per flat test original successful attempt (before switch to ID).
        // Actually, in flat test I switched to #userEmail for login. For registration I switched too?
        // Let's check the flat test replacement.
        // I replaced `.getByPlaceholder('email@example.com')` with `#userEmail` in LOGIN section.
        // In REGISTER section, I only replaced password fields.
        // So for registration, I should use placeholder 'email@example.com'.

        await this.page.getByPlaceholder('email@example.com').fill(email);

        await this.phoneInput.fill(data.phoneNumber);
        await this.occupationDropdown.selectOption(data.occupation);
        await this.genderRadio(data.gender).check();

        await this.passwordInput.fill(data.password); // #userPassword works for both? 
        // In flat test replacement, I replaced:
        // await page.getByPlaceholder('Passsword').fill(password); -> #userPassword
        // This was in REGISTER section. So #userPassword works for register.

        await this.confirmPasswordInput.fill(data.password);
        await this.termsCheckbox.check();
        await this.registerButton.click();

        await expect(this.page.getByText('Account Created Successfully')).toBeVisible();
        await this.loginButton.click();
    }

    async login(email: string, password: string) {
        await expect(this.page.getByRole('heading', { name: 'Log in' })).toBeVisible();
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
