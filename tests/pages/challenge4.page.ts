import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class Challenge4Page extends BasePage {
    private readonly submitButton: Locator;

    constructor(page: Page) {
        super(page)
        this.submitButton = page.locator('#submitButton');
    }

    async navigate() {
        await this.page.goto('/challenge4.html');
    }
} 
