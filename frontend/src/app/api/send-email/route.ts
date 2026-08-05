import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, text, html } = body;

    const smtpUser = process.env.SMTP_USER || 'naooolaf@gmail.com';
    const smtpPass = process.env.SMTP_PASS || 'lrlsihmysvwqwfnp';

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"NaooLift Gym App" <${smtpUser}>`,
      to: to || smtpUser,
      subject: subject || 'Pemberitahuan NaooLift System',
      text: text || 'Pesan dari aplikasi NaooLift Workout Tracker & Gym Management System.',
      html:
        html ||
        `
        <div style="font-family: Arial, sans-serif; background-color: #090F15; color: #D3D1CE; padding: 24px; border-radius: 8px;">
          <h2 style="color: #A855F7; margin-top: 0;">NaooLift Gym Management</h2>
          <p style="font-size: 14px; line-height: 1.6;">${text || 'Pesan otomatis dari NaooLift System.'}</p>
          <hr style="border-color: #262E36; margin: 20px 0;" />
          <p style="font-size: 11px; color: #7E8489;">NaooLift High-Performance Workout Tracker & Gym Management System</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown SMTP error';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
