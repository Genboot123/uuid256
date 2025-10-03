import { test, expect } from '@playwright/test';

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

test.describe('U256ID Browser E2E', () => {
  test('should load the page with correct title and UI elements', async ({ page }) => {
    const url = CONTRACT_ADDRESS ? `/?addr=${encodeURIComponent(CONTRACT_ADDRESS)}` : '/';
    await page.goto(url);

    await expect(page.getByRole('heading', { name: 'U256ID Browser (React + Vite)' })).toBeVisible();
    await expect(page.getByText(/chain.*84532.*base.*sepolia/i)).toBeVisible();

    if (CONTRACT_ADDRESS) {
      await expect(page.getByText(/contract.*0x/i)).toBeVisible();
    } else {
      await expect(page.getByText(/contract.*set.*addr/i)).toBeVisible();
    }
  });

  test('should show wallet not connected state', async ({ page }) => {
    const url = CONTRACT_ADDRESS ? `/?addr=${encodeURIComponent(CONTRACT_ADDRESS)}` : '/';
    await page.goto(url);

    await expect(page.getByText(/account.*not connected/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Connect Wallet' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mint NFT' })).toBeDisabled();
  });

  test('should disable mint button when wallet not connected', async ({ page }) => {
    if (!CONTRACT_ADDRESS) {
      test.skip('CONTRACT_ADDRESS not set');
    }

    await page.goto(`/?addr=${encodeURIComponent(CONTRACT_ADDRESS)}`);

    // Mint button should be disabled when wallet not connected
    const mintButton = page.getByRole('button', { name: 'Mint NFT' });
    await expect(mintButton).toBeDisabled();
  });

  test('should disable mint button when no contract address', async ({ page }) => {
    await page.goto('/');

    const mintButton = page.getByRole('button', { name: 'Mint NFT' });
    await expect(mintButton).toBeDisabled();
  });

  test('should show correct chain information', async ({ page }) => {
    await page.goto('/');

    // Verify chain ID and name are displayed correctly for base-sepolia
    await expect(page.getByText(/84532/)).toBeVisible(); // base-sepolia chain ID
    await expect(page.getByText(/base.*sepolia/i)).toBeVisible();
  });
});
