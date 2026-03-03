import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailService = {
    async sendResetPasswordEmail(email: string, resetToken: string) {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8000";
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const { data, error } = await resend.emails.send({
            from: "BookSync <booksync@rahuldev.eu>",
            to: [email],
            subject: "Password Reset Request",
            html: `
        <h1>You requested a password reset</h1>
        <p>Please click on the link below to reset your password. This link will expire in 10 minutes.</p>
        <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
        });

        if (error) {
            console.error("Resend error:", error);
            throw new Error("Email could not be sent");
        }

        return data;
    },
};
