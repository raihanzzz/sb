import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail";
import { transporter, sender } from "./mailtrap";

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    const recipient = [{ email }]
    try {
        const info = await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: 'Verify your email',
            html: htmlContent.replace("{verificationToken}", verificationToken),
        });
    } catch (error) {
        console.error(error);
        console.log("--- DEV MODE EMAIL FALLBACK ---");
        console.log(`To: ${email}`);
        console.log(`Subject: Verify your email`);
        console.log(`Verification Code: ${verificationToken}`);
        console.log("-------------------------------");
        // throw new Error("Failed to send email verification: " + (error instanceof Error ? error.message : String(error)));
    }
}

export const sendWelcomeEmail = async (email: string, name: string) => {
    const recipient = [{ email }]
    const htmlContent = generateWelcomeEmailHtml(name);
    try {
        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: 'Welcome to SnapBite',
            html: htmlContent,
        });
    } catch (error) {
        console.error(error);
        // throw new Error("Failed to send welcome email")
        console.log("--- DEV MODE EMAIL FALLBACK ---");
        console.log(`To: ${email}`);
        console.log(`Subject: Welcome to SnapBite`);
        console.log("-------------------------------");
    }
}

export const sendPasswordResetEmail = async (email: string, resetURL: string) => {
    const recipient = [{ email }]
    const htmlContent = generatePasswordResetEmailHtml(resetURL);
    try {
        const info = await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: 'Reset your password',
            html: htmlContent,
        });
    } catch (error) {
        console.error(error);
        // throw new Error("Failed to reset password")
        console.log("--- DEV MODE EMAIL FALLBACK ---");
        console.log(`To: ${email}`);
        console.log(`Subject: Reset your password`);
        console.log(`Reset Link: ${resetURL}`);
        console.log("-------------------------------");
    }
}

export const sendResetSuccessEmail = async (email: string) => {
    const recipient = [{ email }]
    const htmlContent = generateResetSuccessEmailHtml();
    try {
        const info = await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: 'Password Reset Successfully',
            html: htmlContent,
        });
    } catch (error) {
        console.error(error);
        // throw new Error("Failed to send password reset success email")
        console.log("--- DEV MODE EMAIL FALLBACK ---");
        console.log(`To: ${email}`);
        console.log(`Subject: Password Reset Successfully`);
        console.log("-------------------------------");
    }
}