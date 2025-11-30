import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Zwigato - Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; background:#fff7f4; padding:20px;">
        <div style="
          max-width:600px;
          background:white;
          margin:0 auto;
          border-radius:10px;
          padding:25px;
          border:1px solid #f2d4cc;
        ">
          
          <h2 style="text-align:center; color:#ff4d2d; margin-bottom:10px;">
            Zwigato
          </h2>

          <p style="font-size:16px; color:#444;">
            Hello,
          </p>

          <p style="font-size:15px; color:#555;">
            We received a request to reset the password for your Zwigato account.
            Please use the One-Time Password (OTP) below to proceed.
          </p>

          <div style="
            text-align:center; 
            margin:25px 0;
          ">
            <span style="
              font-size:28px;
              letter-spacing:5px;
              font-weight:bold;
              color:#ff4d2d;
              border:2px dashed #ff4d2d;
              padding:10px 20px;
              border-radius:8px;
              display:inline-block;
            ">
              ${otp}
            </span>
          </div>

          <p style="font-size:14px; color:#777;">
            This OTP is valid for <b>5 minutes</b>.  
            If you did not request a password reset, please ignore this email.
          </p>

          <hr style="margin:25px 0; border:none; border-top:1px solid #eee;" />

          <p style="font-size:13px; color:#888; text-align:center;">
            © ${new Date().getFullYear()} Zwigato. All rights reserved.
          </p>
        
        </div>
      </div>
    `,
  });
};

export const sendDeliveryOtpMail = async (user, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject: "Zwigato - Delivery Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; background:#fff7f4; padding:20px;">
        <div style="
          max-width:600px;
          background:white;
          margin:0 auto;
          border-radius:10px;
          padding:25px;
          border:1px solid #f2d4cc;
        ">

          <h2 style="text-align:center; color:#ff4d2d; margin-bottom:12px;">
            Zwigato
          </h2>

          <p style="font-size:16px; color:#444;">
            Hello ${user.fullName ? user.fullName : ""},
          </p>

          <p style="font-size:15px; color:#555;">
            Your order is almost there!  
            To complete the delivery verification, please provide the OTP shown below to your delivery partner.
          </p>

          <div style="text-align:center; margin:25px 0;">
            <span style="
              font-size:28px;
              letter-spacing:5px;
              font-weight:bold;
              color:#ff4d2d;
              border:2px dashed #ff4d2d;
              padding:10px 20px;
              border-radius:8px;
              display:inline-block;
            ">
              ${otp}
            </span>
          </div>

          <p style="font-size:14px; color:#777;">
            This OTP will expire in <b>5 minutes</b>.  
            Please do not share it with anyone except your delivery partner.
          </p>

          <hr style="margin:25px 0; border:none; border-top:1px solid #eee;" />

          <p style="font-size:13px; color:#888; text-align:center;">
            © ${new Date().getFullYear()} Zwigato. All rights reserved.
          </p>

        </div>
      </div>
    `,
  });
};
