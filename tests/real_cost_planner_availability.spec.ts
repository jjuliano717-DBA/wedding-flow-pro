// playwright-test suite for Real Cost flow, Planner Multi-Tenancy, and Availability Locking
// This suite assumes the application is running locally at http://localhost:8080
// Adjust selectors as needed to match the actual DOM structure.

import { test, expect } from '@playwright/test';

// Helper to login as a specific user role
async function login(page, email, password) {
    await page.goto('http://localhost:8080/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button:has-text("Log In")');
    await expect(page).toHaveURL(/\/pro/);
}

// Helper to reset test data via Supabase RPC (placeholder)
async function resetTestData() {
    // Implement a server endpoint or direct Supabase call to clear test data.
    // This is a placeholder to illustrate strict data isolation.
}

test.describe('Critical Paths', () => {
    test.beforeEach(async ({ page }) => {
        await resetTestData();
    });

    test('Real Cost flow with realtime sync', async ({ page, context }) => {
        // User A (Couple) logs in and swipes right on Catering
        await login(page, 'userA@example.com', 'password1');
        await page.goto('http://localhost:8080/pro/leads');
        // Find the Catering lead card and swipe right (click "Right" button)
        const cateringCard = page.locator('text=Catering').first();
        await expect(cateringCard).toBeVisible();
        await cateringCard.locator('button:has-text("Right")').click();
        // Verify warning about 20% gratuity appears
        const warning = page.locator('text=Includes est. 20% gratuity');
        await expect(warning).toBeVisible();
        // Click Book button
        await cateringCard.locator('button:has-text("Book")').click();
        // Confirm booking appears in Budget view for User A
        await page.goto('http://localhost:8080/pro/budget');
        await expect(page.locator('text=Catering')).toBeVisible();

        // Open a new context for User B (Partner) to simulate separate device
        const partnerContext = await context.newPage();
        await login(partnerContext, 'userB@example.com', 'password2');
        await partnerContext.goto('http://localhost:8080/pro/budget');
        // Verify the same Catering booking appears in real‑time sync
        await expect(partnerContext.locator('text=Catering')).toBeVisible();
    });

    test('Planner multi‑tenancy isolation', async ({ page, context }) => {
        // Planner logs in and selects Client A
        await login(page, 'planner@example.com', 'plannerpass');
        await page.goto('http://localhost:8080/planner');
        // Select client A from dropdown
        await page.selectOption('select[name="client"]', { label: 'Client A' });
        // Verify Catering booking from User A is visible
        await expect(page.locator('text=Catering')).toBeVisible();

        // Switch to Client B
        await page.selectOption('select[name="client"]', { label: 'Client B' });
        // Verify Catering booking from Client A is NOT visible
        await expect(page.locator('text=Catering')).toBeHidden();
    });

    test('Availability locking for vendor slots', async ({ page }) => {
        // Vendor X has a single slot on Date Y – assume date selector exists
        // User A books the slot
        await login(page, 'userA@example.com', 'password1');
        await page.goto('http://localhost:8080/pro/vendors/1'); // vendor id placeholder
        // Choose Date Y (e.g., 2025-12-31) and click Book
        await page.fill('input[name="date"]', '2025-12-31');
        await page.click('button:has-text("Book")');
        // Verify booking succeeded (toast or confirmation)
        await expect(page.locator('text=Booking confirmed')).toBeVisible();

        // User D (another couple) views same vendor/date
        const otherPage = await page.context().newPage();
        await login(otherPage, 'userD@example.com', 'password4');
        await otherPage.goto('http://localhost:8080/pro/vendors/1');
        await otherPage.fill('input[name="date"]', '2025-12-31');
        // Verify the booking button is disabled or shows "Unavailable"
        const bookBtn = otherPage.locator('button:has-text("Book")');
        await expect(bookBtn).toBeDisabled();
        await expect(otherPage.locator('text=Unavailable')).toBeVisible();
    });
});
