import { test, expect } from '@playwright/test';

test.describe('U256ID Browser E2E - Basic UI Tests', () => {
  test('should load and render React app', async ({ page }) => {
    await page.goto('/');

    // Wait a bit for React to mount
    await page.waitForTimeout(1000);

    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/page-load.png' });

    // Basic check that page loaded
    await expect(page).toHaveTitle(/U256ID/);
  });
});
