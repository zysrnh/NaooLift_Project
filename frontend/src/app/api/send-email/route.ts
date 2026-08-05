import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const body = await request.json();
    const { to, subject, text, html } = body;

    const smtpUser = process.env.SMTP_USER || 'naooolaf@gmail.com';
    const rawPass = process.env.SMTP_PASS || 'lrls ihmy swvq wfnp';
    const smtpPass = rawPass.replace(/\s+/g, '');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for 587
      auth: {
        user: smtpUser.trim(),
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"NaooLift Gym System" <${smtpUser.trim()}>`,
      to: to || smtpUser,
      subject: subject || 'Pemberitahuan NaooLift System',
      text: text || 'Pesan dari aplikasi NaooLift Workout Tracker & Gym Management System.',
      html:
        html ||
        `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #090F15; color: #E2E8F0; padding: 32px; border-radius: 12px; border: 1px solid #1E293B; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #3B82F6; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">NAOOLIFT GYM MANAGEMENT</h1>
            <p style="color: #64748B; font-size: 12px; margin-top: 4px; text-transform: uppercase;">Official Member Notification</p>
          </div>
          <div style="background-color: #131C26; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6; margin-bottom: 24px;">
            <p style="font-size: 15px; line-height: 1.7; color: #F8FAFC; white-space: pre-line; margin: 0;">${text || 'Pesan dari NaooLift System.'}</p>
          </div>
          <div style="border-top: 1px solid #1E293B; padding-top: 16px; text-align: center;">
            <p style="font-size: 11px; color: #64748B; margin: 8px 0 0 0;">NaooLift High-Performance Workout Tracker & Gym Scheduler</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, messageId: info.messageId }, { headers: corsHeaders });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown SMTP error';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500, headers: corsHeaders });
  }
}
