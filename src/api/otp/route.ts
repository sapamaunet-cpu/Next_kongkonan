import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // Gunakan 16 digit App Password
      },
    });

    const mailOptions = {
      from: `"KONGKONAN" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Kode Verifikasi Akun Kongkonan',
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
          <h2>Verifikasi Akun Anda</h2>
          <p>Gunakan kode OTP di bawah ini untuk masuk:</p>
          <h1 style="color: #4f46e5; font-size: 40px; letter-spacing: 5px;">${otp}</h1>
          <p>Kode ini berlaku selama 5 menit.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengirim email' }, { status: 500 });
  }
}
