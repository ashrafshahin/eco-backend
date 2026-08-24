const nodemailer = require("nodemailer");
const generateToken = require('../utils/generateToken')

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, 
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

const sendVerificationEmail = async (token, email) => {
    
    if (!email) {
        throw new Error("No email provided...");
    };
    if (!token) {
        throw new Error("No token provided...");
    };

    try {
        const info = await transporter.sendMail({
            from: process.env.GMAIL_USER, 
            to: email,
            subject: "Please verify your Email...", 

            html: `<body style="margin:0;padding:0;background-color:#eef2f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:40px 15px"><table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.08)"><tr><td style="background:linear-gradient(90deg,#2e7d32,#66bb6a);height:6px"></td></tr><tr><td align="center" style="padding:30px 20px 10px"><h1 style="margin:0;font-size:28px;color:#2e7d32;letter-spacing:.5px">EcoBazaar</h1><p style="margin:6px 0 0;color:#7a8a8f;font-size:14px">Organic living made simple 🌿</p></td></tr><tr><td align="center" style="padding:20px"><div style="font-size:48px">📧</div></td></tr><tr><td style="padding:0 40px 10px"><h2 style="margin:0;font-size:22px;color:#333;text-align:center">Confirm your email</h2><p style="color:#5f6c72;line-height:1.7;text-align:center;margin:15px 0">Hi, <strong>Welcome to EcoBazaar...</strong>,<br>You're just one step away from exploring fresh, organic products. Please verify your email address to activate your EcoBazaar account.</p></td></tr><tr><td align="center" style="padding:25px"><a href="http://localhost:5173/verify-email/${token}" style="background:linear-gradient(90deg,#2e7d32,#43a047);color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:16px;font-weight:600;display:inline-block;box-shadow:0 4px 14px rgba(46,125,50,.4)">Verify Email Address</a></td></tr><tr><td style="padding:0 40px"><hr style="border:none;border-top:1px solid #eee"></td></tr><tr><td style="padding:20px 40px"><p style="font-size:13px;color:#8a979c;text-align:center;margin:0">Or copy and paste this link into your browser:</p><p style="font-size:13px;color:#2e7d32;word-break:break-all;text-align:center">http://localhost:5173/verify-email/${token}</p></td></tr><tr><td align="center" style="background:#fafafa;padding:25px;font-size:12px;color:#9aa5aa"><p style="margin:0">Didn’t sign up? No worries, you can ignore this email.</p><p style="margin:8px 0 0">© 2026 EcoBazaar. All rights reserved. | Powered by <a href="https://ashraf-shahin.vercel.app“> Md Ashraf Shahin </a>  • Dhaka, Bangladesh</p></td></tr></table><table width="600"><tr><td height="20"></td></tr></table></td></tr></table></body>`, // HTML body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview URL is only available when using an Ethereal test account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
};

const resetPasswordEmail = async (token,email) => {

    if (!email) {
        throw new Error("No email provided");
    };
    if (!token) {
        throw new Error("No token provided...");
    };


    try {
        const info = await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Please reset your password...",

            html: `<body style="margin:0;padding:0;background:#f4f7f6;font-family:Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 25px rgba(0,0,0,.08)"><tr><td align="center" style="background:linear-gradient(135deg,#2e7d32,#43a047);padding:35px 20px"><h1 style="margin:0;color:#fff;font-size:32px">Eco Bazaar</h1><p style="margin:8px 0 0;color:#e8f5e9">Sustainable Shopping Made Easy</p></td></tr><tr><td style="padding:40px"><h2 style="margin:0 0 20px;color:#222">Reset Your Password</h2><p style="font-size:16px;line-height:1.7;color:#555">Hi <strong>Dear User</strong>,</p><p style="font-size:16px;line-height:1.7;color:#555">We received a request to reset your Eco Bazaar account password. Click the button below to create a new password.</p><p align="center" style="margin:30px 0"><a href="http://localhost:5173/reset-password/${token}" target="_blank" style="background:#2e7d32;color:#fff;text-decoration:none;padding:15px 35px;border-radius:50px;font-weight:bold">Reset Password</a></p><p style="background:#f1f8f4;border-left:4px solid #43a047;padding:15px;color:#555;font-size:14px">This password reset link will expire in <strong>10 minutes</strong>.</p><p style="font-size:14px;line-height:1.7;color:#666">If you didn't request this password reset, you can safely ignore this email.</p><p style="margin-top:30px;color:#333">Cheers,<br><strong>Eco Bazaar Team</strong></p></td></tr><tr><td align="center" style="background:#f8f8f8;padding:20px;border-top:1px solid #eee"><p style="margin:0;font-size:12px;color:#888">© 2026 Eco Bazaar. All rights reserved. Powered by Ashraf Shahin</p></td></tr></table></td></tr></table></body>`, // HTML body
                          });

        console.log("Message sent: %s", info.messageId);
        // Preview URL is only available when using an Ethereal test account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
};

module.exports = {sendVerificationEmail, resetPasswordEmail,}
