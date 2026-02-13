import { test } from '@playwright/test';
import { RegistrationPage } from '../../pages/RegistrationPage';
import data from '../../data/registration_data.json';

test.describe('Registration POM Tests', () => {
    let registrationPage: RegistrationPage;
    let uniqueEmail: string;

    test.beforeEach(async ({ page }) => {
        registrationPage = new RegistrationPage(page);
        await registrationPage.goTo();
    });

    test('TC_REG_01: Verify successful registration', async () => {
        uniqueEmail = `pom_reg_${Date.now()}@example.com`;
        await registrationPage.fillForm(data.valid, uniqueEmail);
        await registrationPage.submit();
        await registrationPage.verifySuccess();
        await registrationPage.navigateToLogin();
    });

    test('TC_REG_02: Verify registration with existing email', async ({ page }) => { // page needed for creating fresh context? No, just passed to page object
        // Pre-requisite: User must exist. We can register one or used hardcoded.
        // Let's use a self-contained approach again: Register -> Log out -> Register Same error.
        const testEmail = `pom_exist_${Date.now()}@example.com`;

        // Step 1: Register (Success)
        await registrationPage.fillForm(data.valid, testEmail);
        await registrationPage.submit();
        await registrationPage.verifySuccess();
        await registrationPage.navigateToLogin();

        // Step 2: Try Register Again (Fail)
        await registrationPage.goTo(); // Navigate back to register
        await registrationPage.fillForm(data.valid, testEmail);
        await registrationPage.submit();
        await registrationPage.verifyError('User already exists');
    });

    test('TC_REG_03: Verify password mismatch error', async () => {
        const mismatchData = {
            ...data.mismatch,
            email: `pom_mismatch_${Date.now()}@example.com`
        };
        await registrationPage.fillForm(mismatchData);
        await registrationPage.submit();
        await registrationPage.verifyError('Password and Confirm Password must match with each other.');
    });

    test('TC_REG_04: Verify empty mandatory fields validation', async () => {
        // Just submit empty form. Note: fillForm not called or called with empty? 
        // The manual test says "Leave all fields empty".
        await registrationPage.submit();
        await registrationPage.verifyEmptyFieldErrors();
    });

});
