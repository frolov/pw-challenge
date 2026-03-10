import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class Challenge2Page extends BasePage {
    private readonly submitButton: Locator;
    private readonly loginForm: Locator;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly dashboard: Locator;
    private readonly dashboardHeaderText: Locator;
    private readonly dashboardUserEmail: Locator;
    private readonly dashboardMyAccountButton: Locator;

    constructor(page: Page) {
        super(page)
        this.submitButton = page.locator('#submitButton');
        this.loginForm = page.locator('#loginForm');
        this.emailInput = page.locator('#email');
        this.passwordInput = page.locator('#password');

        this.dashboard = page.locator('#dashboard');
        this.dashboardHeaderText = page.getByText('Welcome!');
        this.dashboardUserEmail = page.locator('#userEmail');
        this.dashboardMyAccountButton = page.locator('#menuButton');
    }

    async navigate() {
        await this.page.goto('/challenge2.html');
    }

    async enterCredentials(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
    }

    async loginAs(email: string, password: string) {
        await this.enterCredentials(email, password);
        
        await super.disableAnimations(this.submitButton);
        await this.submitButton.click();
    }

    async expectLoaded() {
        await expect(this.loginForm).toBeVisible();
    }

    async expectDashboardLoaded(loggedInEmail: string) {
          await expect(this.dashboard).toBeVisible();
          await expect(this.dashboardHeaderText).toBeVisible();
          await expect(this.dashboardUserEmail).toContainText(`Logged in as: ${loggedInEmail}`);
          await expect(this.dashboardMyAccountButton).toBeVisible();
    }

    async openMyAccountMenu() {
        const initializedMenuBtn = this.page.locator('#menuButton[data-initialized="true"]');
        await initializedMenuBtn.click();
    }
} 
