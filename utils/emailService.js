const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, eventTitle) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${otp} is your verification code for ${eventTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { background-color: white; border-radius: 10px; padding: 30px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; color: #3B82F6; margin-bottom: 20px; }
          .otp-box { background-color: #EFF6FF; border: 2px dashed #3B82F6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1E40AF; }
          .event-title { color: #6B7280; font-size: 14px; margin-top: 10px; }
          .footer { text-align: center; color: #9CA3AF; font-size: 12px; margin-top: 30px; }
          .warning { color: #DC2626; font-size: 14px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Sydney Events</h1>
          </div>
          
          <h2>Verify Your Email</h2>
          <p>You're almost there! Enter this code to continue to your event:</p>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div class="event-title">${eventTitle}</div>
          </div>
          
          <p>This code will expire in <strong>10 minutes</strong>.</p>
          
          <p class="warning">⚠️ Never share this code with anyone.</p>
          
          <div class="footer">
            <p>If you didn't request this code, please ignore this email.</p>
            <p>© 2026 Sydney Events. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail
};