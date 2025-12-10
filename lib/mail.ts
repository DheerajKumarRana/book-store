import nodemailer from 'nodemailer';

// Create a transporter using SMTP
// For development/production, these values should come from ENV variables
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendVerificationEmail(email: string, otp: string) {
    try {
        console.log(`[Mail Debug] Attempting to send verification email to: ${email}`);

        // If no credentials setup, just log it for dev
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('====================================================');
            console.warn('[WARNING] Email credentials (SMTP_USER/SMTP_PASS) are missing!');
            console.warn('Emails cannot be sent. Simulating email sending for Development.');
            console.log(`[DEV MODE] Email to ${email}`);
            console.log(`[DEV MODE] Verification Code: ${otp}`);
            console.log('====================================================');
            return true;
        }

        const info = await transporter.sendMail({
            from: `"BookStore" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Verify your email address",
            text: `Your verification code is: ${otp}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Welcome to BookStore!</h2>
                    <p>Please use the following code to verify your email address:</p>
                    <h1 style="color: #4f46e5; letter-spacing: 5px;">${otp}</h1>
                    <p>This code will expire in 10 minutes.</p>
                </div>
            `,
        });

        console.log("[Mail Debug] Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("[Mail Debug] Error sending email:", error);
        return false;
    }
}

export async function sendResetPasswordEmail(email: string, resetUrl: string) {
    try {
        console.log(`[Mail Debug] Attempting to send reset password email to: ${email}`);

        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('====================================================');
            console.warn('[WARNING] Email credentials (SMTP_USER/SMTP_PASS) are missing!');
            console.warn('Emails cannot be sent. Simulating email sending for Development.');
            console.log(`[DEV MODE] Reset Password Link for ${email}`);
            console.log(`[DEV MODE] Link: ${resetUrl}`);
            console.log('====================================================');
            return true;
        }

        const info = await transporter.sendMail({
            from: `"BookStore" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Reset your password",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Reset Password Request</h2>
                    <p>You requested to reset your password. Click the link below to verify:</p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p>Link expires in 1 hour.</p>
                </div>
            `,
        });

        console.log("[Mail Debug] Reset email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("[Mail Debug] Error sending reset email:", error);
        return false;
    }
}
