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
    const rawPass = process.env.SMTP_PASS || 'cvat mdru mghh akay';
    const smtpPass = rawPass.replace(/\s+/g, '');

    // Use SSL Port 465 for ultra-fast Gmail SMTP connections
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: smtpUser.trim(),
        pass: smtpPass,
      },
      connectionTimeout: 6000,
      greetingTimeout: 6000,
      socketTimeout: 6000,
    });

    const logoUrl = 'https://raw.githubusercontent.com/zysrnh/NaooLift_Project/main/frontend/public/NaooLift.png';

    const defaultHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject || 'Pemberitahuan NaooLift System'}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #05090D; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #F8FAFC;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #05090D; padding: 40px 16px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0D1520; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.12); boxShadow: 0 20px 50px rgba(0,0,0,0.8); overflow: hidden;">
                
                <!-- 1. Header Banner with Official NaooLift Logo -->
                <tr>
                  <td align="center" style="padding: 36px 32px 24px 32px; background: linear-gradient(180deg, #14202E 0%, #0D1520 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
                    <img src="${logoUrl}" alt="NaooLift Logo" width="160" style="display: block; width: 160px; height: auto; margin-bottom: 16px; filter: drop-shadow(0 4px 16px rgba(59, 130, 246, 0.4));" />
                    <div style="display: inline-block; background-color: rgba(59, 130, 246, 0.15); color: #60A5FA; font-size: 11px; font-weight: 800; padding: 5px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1.5px; border: 1px solid rgba(59, 130, 246, 0.3);">
                      OFFICIAL GYM NOTIFICATION
                    </div>
                  </td>
                </tr>

                <!-- 2. Message Body Section -->
                <tr>
                  <td style="padding: 36px 32px;">
                    <div style="background-color: #141E28; border-radius: 12px; border-left: 4px solid #3B82F6; border: 1px solid rgba(255, 255, 255, 0.08); border-left-width: 4px; border-left-color: #3B82F6; padding: 24px;">
                      <p style="font-size: 15px; line-height: 1.8; color: #F1F5F9; margin: 0; white-space: pre-line;">
                        ${text || 'Pesan otomatis dari NaooLift Gym System.'}
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- 3. Footer Stamp & Copyright -->
                <tr>
                  <td align="center" style="padding: 24px 32px 36px 32px; background-color: #0A0F17; border-top: 1px solid rgba(255, 255, 255, 0.06);">
                    <p style="font-size: 13px; font-weight: 800; color: #FFFFFF; margin: 0 0 6px 0; letter-spacing: -0.01em;">
                      NAOOLIFT HIGH-PERFORMANCE SYSTEM
                    </p>
                    <p style="font-size: 11px; color: #64748B; margin: 0; line-height: 1.5;">
                      © 2026 NaooLift Workout Tracker & Gym Scheduler. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"NaooLift Gym System" <${smtpUser.trim()}>`,
      to: to || smtpUser,
      subject: subject || 'Pemberitahuan NaooLift System',
      text: text || 'Pesan dari aplikasi NaooLift Workout Tracker & Gym Management System.',
      html: html || defaultHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, messageId: info.messageId }, { headers: corsHeaders });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown SMTP error';
    return NextResponse.json({ success: false, error: errMessage }, { status: 500, headers: corsHeaders });
  }
}
