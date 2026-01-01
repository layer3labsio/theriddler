import { test, expect } from '@playwright/test';
import path from 'path';

const LOCAL_GAME_PATH = path.resolve(process.cwd(), 'assets/the-riddler.html');

test.describe('The Riddler Game Tests', () => {
    test('Game loads successfully', async ({ page }) => {
        await page.goto(`file://${LOCAL_GAME_PATH}`);

        // Wait for the component to be interactive
        await expect(page.getByText('The Riddler').first()).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('Test your wit and logic!')).toBeVisible();
    });

    test('Game displays stats', async ({ page }) => {
        await page.goto(`file://${LOCAL_GAME_PATH}`);

        // Check for stat boxes
        await expect(page.getByText('Riddle', { exact: true })).toBeVisible();
        await expect(page.getByText('Score', { exact: true })).toBeVisible();
        await expect(page.getByText('Streak', { exact: true })).toBeVisible();
    });

    test('Game displays a riddle and answers', async ({ page }) => {
        await page.goto(`file://${LOCAL_GAME_PATH}`);

        // We can't know which riddle is first without mocking, but we can look for the structure
        // There should be 4 answer buttons (A, B, C, D)
        const buttons = await page.$$('button');
        // We expect at least 4 answer buttons + "Create My Own Riddle"
        expect(buttons.length).toBeGreaterThanOrEqual(4);

        // Check for answer labels A, B, C, D
        await expect(page.getByText('A', { exact: true })).toBeVisible();
        await expect(page.getByText('B', { exact: true })).toBeVisible();
        await expect(page.getByText('C', { exact: true })).toBeVisible();
        await expect(page.getByText('D', { exact: true })).toBeVisible();
    });

    test('Create Riddle Modal opens', async ({ page }) => {
        await page.goto(`file://${LOCAL_GAME_PATH}`);

        await page.getByText('Create My Own Riddle').click();
        await expect(page.getByText('Category')).toBeVisible();
        await expect(page.getByText('Skill Level')).toBeVisible();
        await expect(page.getByText('Generate Riddle')).toBeVisible();
    });
});
