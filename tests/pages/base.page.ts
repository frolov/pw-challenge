import { Page, Locator } from '@playwright/test';

export class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    async disableAnimations(locator: Locator) {
        await locator.evaluate((el: HTMLElement) => {
            el.style.animationDuration = '0s';
        });
    }
}