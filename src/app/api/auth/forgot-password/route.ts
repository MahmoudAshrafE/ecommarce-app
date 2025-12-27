import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // For security, do not reveal if user does not exist
            return NextResponse.json({ success: true, message: "If account exists, email sent." });
        }

        // Generate Token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Save to DB
        await prisma.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry
            }
        });

        // Send Email using Nodemailer (Gmail)
        const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/en/auth/reset-password/${resetToken}`;

        const cleanPass = process.env.EMAIL_PASS?.replace(/["']/g, '').replace(/\s+/g, '');

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER?.trim(),
                pass: cleanPass,
            },
            debug: true, // show debug output
            logger: true // log to console
        });

        const mailOptions = {
            from: `"Mahmoud Burger🍔" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #333;">Password Reset</h2>
                    <p style="color: #666;">You requested a password reset. Click the button below to reset your password.</p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #ff9900; color: #fff; text-decoration: none; font-weight: bold; border-radius: 5px;">Reset Password</a>
                    <p style="color: #999; font-size: 12px;">If you didn't request this, ignore this email.</p>
                    <p style="color: #999; font-size: 12px;">Link valid for 1 hour.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        console.log(`Password reset email sent to ${email}`);

        return NextResponse.json({ success: true, message: "Email sent" });

    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
