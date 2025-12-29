#!/usr/bin/env node

/**
 * Test Script for User-to-Business Linking
 * 
 * This script helps test the business linking functionality by creating
 * test users and business profiles in Supabase.
 * 
 * Usage:
 *   node scripts/test-business-linking.js setup
 * 
 * Note: Requires dotenv package. Install with: npm install dotenv
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '../.env') });

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables');
    console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test scenarios
const testScenarios = {
    // Scenario A: Existing business, new user (should claim)
    existingBusiness: {
        email: 'test-vendor-claim@example.com',
        businessName: 'Test Venue to Claim',
        userRole: 'vendor'
    },

    // Scenario B: New user, no business (should create)
    newUser: {
        email: 'test-vendor-new@example.com',
        userRole: 'venue'
    },

    // Scenario D: Couple role (should not see business dashboard)
    coupleUser: {
        email: 'test-couple@example.com',
        userRole: 'couple'
    }
};

async function setupTestData() {
    console.log('🔧 Setting up test data...\n');

    // Create unclaimed business profile for Scenario A
    console.log('📝 Creating unclaimed business profile...');
    const { data: business, error: businessError } = await supabase
        .from('vendors')
        .insert({
            name: testScenarios.existingBusiness.businessName,
            contact_email: testScenarios.existingBusiness.email,
            owner_id: null,
            type: 'Vendor',
            category: 'Photography',
            location: 'Test City, FL',
            description: 'Test business for claiming scenario'
        })
        .select()
        .single();

    if (businessError) {
        console.error('❌ Error creating business:', businessError.message);
    } else {
        console.log('✅ Created business:', business.name);
        console.log(`   Email: ${business.contact_email}`);
        console.log(`   ID: ${business.id}\n`);
    }
}

async function cleanupTestData() {
    console.log('\n🧹 Cleaning up test data...\n');

    // Delete test businesses
    const testEmails = Object.values(testScenarios).map(s => s.email);

    const { error } = await supabase
        .from('vendors')
        .delete()
        .in('contact_email', testEmails);

    if (error) {
        console.error('❌ Error cleaning up:', error.message);
    } else {
        console.log('✅ Test data cleaned up');
    }
}

async function checkBusinessLinks() {
    console.log('\n📊 Checking current business links...\n');

    const { data, error } = await supabase
        .from('vendors')
        .select('id, name, contact_email, owner_id')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('❌ Error fetching businesses:', error.message);
        return;
    }

    console.log('Recent Business Profiles:');
    console.table(data.map(b => ({
        Name: b.name || '(unnamed)',
        Email: b.contact_email || '(no email)',
        'Owner ID': b.owner_id ? b.owner_id.substring(0, 8) + '...' : '⚠️ UNCLAIMED',
        Status: b.owner_id ? '✅ Linked' : '⚠️ Unclaimed'
    })));
}

async function main() {
    console.log('🧪 Business Linking Test Script\n');
    console.log('================================\n');

    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'setup':
            await setupTestData();
            break;

        case 'cleanup':
            await cleanupTestData();
            break;

        case 'check':
            await checkBusinessLinks();
            break;

        default:
            console.log('Available commands:');
            console.log('  setup   - Create test business profiles');
            console.log('  cleanup - Remove test data');
            console.log('  check   - View current business links');
            console.log('\nUsage:');
            console.log('  node test-business-linking.js [command]');
            console.log('\nTest Accounts:');
            console.log('  Scenario A (Claim): test-vendor-claim@example.com');
            console.log('  Scenario B (Create): test-vendor-new@example.com');
            console.log('  Scenario D (Couple): test-couple@example.com');
            console.log('\nManual Testing Steps:');
            console.log('  1. Run: node test-business-linking.js setup');
            console.log('  2. Sign up with test emails in the app');
            console.log('  3. Navigate to /business to test linking');
            console.log('  4. Run: node test-business-linking.js check');
            console.log('  5. Run: node test-business-linking.js cleanup');
    }
}

main().catch(console.error);
