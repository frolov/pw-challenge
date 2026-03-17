import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
    private readonly tryChallenge1Button: Locator;
    private readonly tryChallenge2Button: Locator;
    private readonly tryChallenge3Button: Locator;
    private readonly tryChallenge4Button: Locator;

    constructor(page: Page) {
        super(page)
        this.tryChallenge1Button = page.getByRole('link', { name: 'Try Challenge 1' });
        this.tryChallenge2Button = page.getByRole('link', { name: 'Try Challenge 2' });
        this.tryChallenge3Button = page.getByRole('link', { name: 'Try Challenge 3' });
        this.tryChallenge4Button = page.getByRole('link', { name: 'Try Challenge 4' });
    }

    async navigate() {
        await this.page.goto('/');
    }

    async goToChallenge(n: number) {
        const challengeLink = this.page.getByRole('link', { name: `Try Challenge ${n}` });

        await challengeLink.click();
    }

}