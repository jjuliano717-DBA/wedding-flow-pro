
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// Load env
try {
    const envConfig = dotenv.parse(fs.readFileSync('.env'));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} catch (e) {
    console.log('Could not read .env details, checking process.env');
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
    const filePath = '/Volumes/HomeX/jasonmini/.gemini/antigravity/brain/0814f2d7-70a9-4b52-a37b-9519729828f1/uploaded_image_1769011121731.png';
    const fileName = 'decorate-with-lights-main.png';
    const bucketName = 'vendor-assets';

    // 1. Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find(b => b.name === bucketName)) {
        console.log(`Creating bucket ${bucketName}...`);
        await supabase.storage.createBucket(bucketName, { public: true });
    }

    // 2. Read file
    const fileBuffer = fs.readFileSync(filePath);

    // 3. Upload
    console.log(`Uploading ${fileName}...`);
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileBuffer, {
            contentType: 'image/png',
            upsert: true
        });

    if (uploadError) {
        console.error('Upload failed:', uploadError);
        process.exit(1);
    }

    // 4. Get Public URL
    const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;
    console.log('File uploaded:', publicUrl);

    // 5. Update Vendor
    const email = 'info@mosquitofl.com';
    console.log(`Updating vendor for ${email}...`);

    // Find vendor id first? Or just update by contact_email if unique?
    // Safer to find first.
    const { data: vendors } = await supabase
        .from('vendors')
        .select('id')
        .eq('contact_email', email)
        .limit(1);

    if (!vendors || vendors.length === 0) {
        console.error('Vendor not found');
        process.exit(1);
    }

    const vendorId = vendors[0].id;

    const { error: updateError } = await supabase
        .from('vendors')
        .update({
            images: [publicUrl],
            // Also update image_url just in case logic uses it
            image_url: publicUrl
        })
        .eq('id', vendorId);

    if (updateError) {
        console.error('Update failed:', updateError);
        // Retry without image_url if it failed on that column, but images array is key
    } else {
        console.log('Vendor updated successfully with new image!');
    }
}

main();
