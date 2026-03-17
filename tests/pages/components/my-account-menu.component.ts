import { expect, Locator, Page } from '@playwright/test';

export enum MyAccountOption {
    Profile = '#logoutOption',
    Settings = '#profileOption',
    Preferences = '#settingsOption',
    Logout = '#logoutOption',
}

export class MyAccountMenuComponent {
    private readonly page: Page;
    private readonly initializedMyAccountButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.initializedMyAccountButton = page.locator('#menuButton[data-initialized="true"]');
    }

    async openMyAccountMenu() {
        const initializedMenuBtn = this.page.locator('#menuButton[data-initialized="true"]');
        await initializedMenuBtn.click();
    }

    async navigate(option: MyAccountOption) {
        await this.initializedMyAccountButton.click();

        const menuItem = this.page.locator(option);
        await expect(menuItem).toBeVisible();

        await menuItem.click();
    }
}