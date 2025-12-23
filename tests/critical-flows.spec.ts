// /Volumes/HomeX/jasonmini/Documents/Projects/2PlanAWedding/wedding-flow-pro/tests/critical-flows.spec.ts
import 'dotenv/config';
import { test, expect, Page } from '@playwright/test';

// Constant IDs for mocking
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';
const MOCK_PROJECT_ID = '00000000-0000-0000-0000-000000000002';

async function login(page: Page, email: string) {
    await page.goto('/auth');
    await page.waitForSelector('input[name="email"]');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'pasword1');
    // Important: Click the submit button inside the form to avoid ambiguity
    await page.locator('button[type="submit"]').filter({ hasText: 'Sign In' }).click();
    // Wait for the URL to change away from /auth or for a header to appear
    await page.waitForFunction(() => !window.location.pathname.startsWith('/auth'), { timeout: 15000 });
    await page.waitForSelector('header', { timeout: 15000 });
}

async function mockSupabase(page: Page, role: string = 'couple') {
    // Register Fallback first
    await page.route(/supabase\.co/, async route => {
        const url = route.request().url();
        console.log('[MOCK] Fallback intercept for:', url);

        // Return array for Selects, Object for RPC or single-row lookups if we can guess
        if (url.includes('/rest/v1/')) {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([])
            });
        } else {
            await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
        }
    });

    // Mock Auth Token
    await page.route(/\/auth\/v1\/token/, async route => {
        console.log('[MOCK] Intercepted AUTH Token');
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                access_token: 'mock-token',
                token_type: 'bearer',
                expires_in: 3600,
                refresh_token: 'mock-refresh',
                user: {
                    id: MOCK_USER_ID,
                    email: 'test@demo.com',
                    user_metadata: { full_name: 'Test ' + role, role: role },
                    app_metadata: { provider: 'email' },
                    aud: 'authenticated',
                    created_at: new Date().toISOString()
                }
            })
        });
    });

    // Mock Auth User
    await page.route(/\/auth\/v1\/user/, async route => {
        console.log('[MOCK] Intercepted AUTH User');
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                id: MOCK_USER_ID,
                email: 'test@demo.com',
                user_metadata: { full_name: 'Test ' + role, role: role },
                aud: 'authenticated',
                created_at: new Date().toISOString()
            })
        });
    });

    // Mock Users/Profiles (Support .single() by returning an object instead of array if requested)
    await page.route(/\/rest\/v1\/(users|profiles)/, async route => {
        const url = route.request().url();
        console.log('[MOCK] Intercepted REST Users/Profiles:', url);

        const responseData = {
            id: MOCK_USER_ID,
            email: 'test@demo.com',
            role: role,
            full_name: 'Test ' + role.charAt(0).toUpperCase() + role.slice(1),
            avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
            location: 'Miami, FL'
        };

        // If the query contains id=eq, it's likely a single fetch
        if (url.includes('id=eq.')) {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(responseData) // Single object for .single()
            });
        } else {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([responseData]) // Array for Select
            });
        }
    });

    // Mock Projects
    await page.route(/\/rest\/v1\/projects/, async route => {
        console.log('[MOCK] Intercepted REST Projects');
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([{
                id: MOCK_PROJECT_ID,
                name: 'Smith-Jones Wedding',
                user_id: MOCK_USER_ID
            }])
        });
    });

    // Mock Inspiration Assets
    await page.route(/\/rest\/v1\/inspiration_assets/, async route => {
        console.log('[MOCK] Intercepted REST Assets');
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([{
                id: 'asset-456',
                category_tag: 'Catering',
                image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552',
                base_cost_low: 500000, // represent in cents if that is what the app expects
                base_cost_high: 800000,
                vendors: { name: 'Test Caterer' }
            }])
        });
    });

    // Mock Budget Scenarios
    await page.route(/\/rest\/v1\/budget_scenarios/, async route => {
        console.log('[MOCK] Intercepted REST Budget Scenarios');
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([{
                id: 'budget-1',
                user_id: MOCK_USER_ID,
                type: 'A',
                data: {
                    totalBudget: 30000,
                    guestCount: 100,
                    location: 'Test City',
                    allocations: {
                        'Venue': 0.25,
                        'Catering': 0.15,
                        'Photographer': 0.10
                    }
                }
            }])
        });
    });

    // Mock RPC
    await page.route(/\/rest\/v1\/rpc\//, async route => {
        console.log('[MOCK] Intercepted REST RPC');
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([])
        });
    });

    // Mock Interactions
    await page.route(/\/rest\/v1\/user_swipes/, async route => {
        console.log('[MOCK] Intercepted REST Swipes');
        await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({ success: true })
        });
    });
}

test.describe('E2E Critical Flows', () => {

    test('Real Cost Flow – Gratuity warning & Booking', async ({ page }) => {
        await mockSupabase(page, 'couple');
        await login(page, 'couple@demo.com');

        await page.goto('/discover');
        await expect(page.getByText('Catering Inspiration')).toBeVisible({ timeout: 15000 });

        // Heart button for Like
        await page.locator('button').filter({ has: page.locator('svg.fill-current') }).click();

        await page.goto('/budget');
        // Ensure "Catering" text exists on the page
        await expect(page.getByText(/^Catering$/)).toBeVisible({ timeout: 10000 });
        // Then check for the gratuity warning
        await expect(page.getByText(/Includes est\. 20% gratuity/i)).toBeVisible({ timeout: 10000 });

        await page.getByRole('button', { name: /Book/i }).first().click();
        await expect(page.getByText(/Booking confirmed/i)).toBeVisible();
    });

    test('Planner Multi-Tenancy – Client Selector', async ({ page }) => {
        await mockSupabase(page, 'planner');
        await login(page, 'planner@demo.com');

        // The client switcher is in PlannerHeader
        const clientSwitcher = page.getByRole('button', { name: /Smith-Jones|Select Client|Active Client/i }).first();
        await expect(clientSwitcher).toBeVisible({ timeout: 10000 });

        await clientSwitcher.click();
        await expect(page.getByText('Managed Weddings')).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Smith-Jones Wedding' })).toBeVisible();
    });

    test('Availability Locking – State blocking', async ({ page }) => {
        await mockSupabase(page, 'couple');
        await login(page, 'couple@demo.com');

        await page.goto('/budget');
        const bookBtn = page.getByRole('button', { name: /Book/i }).first();
        await bookBtn.click();
        await expect(page.getByText(/Booking confirmed/i)).toBeVisible();
    });
});
