
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load env explicitly from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function main() {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    console.log("-----------------------------------------");
    console.log(`EMAIL_USER: ${user}`);
    // Show password wrapped in quotes to see hidden spaces or issues
    console.log(`EMAIL_PASS (Raw): '${pass}'`);

    if (!user || !pass) {
        console.error("❌ ERROR: Missing credentials in .env file");
        return;
    }

    // Gmail often requires the 16-char app password WITHOUT spaces
    const cleanPass = pass.replace(/["']/g, '').replace(/\s+/g, '');
    console.log(`EMAIL_PASS (Cleaned): '${cleanPass}'`);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: cleanPass,
        },
    });

    try {
        console.log("Attempting to verify connection to Gmail...");
        await transporter.verify();
        console.log("✅ SUCCESS: Connection verified! Username and Password are correct.");
    } catch (e) {
        console.error("❌ FAILURE: Could not connect to Gmail.");
        console.error(e);
    }
    console.log("-----------------------------------------");
}

main();
