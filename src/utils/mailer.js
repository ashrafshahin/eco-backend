const nodemailer = require("nodemailer");
const generateToken = require('../utils/generateToken')

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, 
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

const sendVerificationEmail = async (email) => {
    
    const token = generateToken(email)
    
    if (!email) {
        throw new Error("No email provided");
    };

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_USER, 
            to: email,
            subject: "Please verify your Email...", 
            
            html: `<body style="margin:0;padding:0;background-color:#eef2f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:40px 15px"><table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.08)"><tr><td style="background:linear-gradient(90deg,#2e7d32,#66bb6a);height:6px"></td></tr><tr><td align="center" style="padding:30px 20px 10px"><h1 style="margin:0;font-size:28px;color:#2e7d32;letter-spacing:.5px">EcoBazaar</h1><p style="margin:6px 0 0;color:#7a8a8f;font-size:14px">Organic living made simple 🌿</p></td></tr><tr><td align="center" style="padding:20px"><div style="font-size:48px">📧</div></td></tr><tr><td style="padding:0 40px 10px"><h2 style="margin:0;font-size:22px;color:#333;text-align:center">Confirm your email</h2><p style="color:#5f6c72;line-height:1.7;text-align:center;margin:15px 0">Hi, <strong>Welcome to EcoBazaar...</strong>,<br>You're just one step away from exploring fresh, organic products. Please verify your email address to activate your EcoBazaar account.</p></td></tr><tr><td align="center" style="padding:25px"><a href="http://localhost:5173/verifyemail/${token}" style="background:linear-gradient(90deg,#2e7d32,#43a047);color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:16px;font-weight:600;display:inline-block;box-shadow:0 4px 14px rgba(46,125,50,.4)">Verify Email Address</a></td></tr><tr><td style="padding:0 40px"><hr style="border:none;border-top:1px solid #eee"></td></tr><tr><td style="padding:20px 40px"><p style="font-size:13px;color:#8a979c;text-align:center;margin:0">Or copy and paste this link into your browser:</p><p style="font-size:13px;color:#2e7d32;word-break:break-all;text-align:center">http://localhost:5173/verifyemail/${token}</p></td></tr><tr><td align="center" style="background:#fafafa;padding:25px;font-size:12px;color:#9aa5aa"><p style="margin:0">Didn’t sign up? No worries, you can ignore this email.</p><p style="margin:8px 0 0">© 2026 EcoBazaar • Dhaka, Bangladesh</p></td></tr></table><table width="600"><tr><td height="20"></td></tr></table></td></tr></table></body>`, // HTML body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview URL is only available when using an Ethereal test account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
};

module.exports = {sendVerificationEmail}
