import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USERNAME;
    const smtpPass = process.env.SMTP_PASSWORD;

    console.log('Initializing email service with config:', {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser ? 'SET' : 'NOT SET',
      pass: smtpPass ? 'SET' : 'NOT SET',
    });

    if (!smtpUser || !smtpPass) {
      console.warn('SMTP credentials not configured. Email sending will fail.');
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false, // false for port 587 (STARTTLS); true only for 465 (SSL)
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      // Optional: Remove tls.rejectUnauthorized in production for security
      // tls: {
      //   rejectUnauthorized: false,
      // },
    });

    // Verify connection on startup
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP connection failed:', error);
      } else {
        console.log('SMTP server is ready to send emails');
      }
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const subject = 'Verify Your Email - BuyAgain';
    const htmlBody = `
      <h1>Welcome to BuyAgain!</h1>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
      <p>If you didn't register, please ignore this email.</p>
      <p>This link will expire in 24 hours.</p>
    `;

    await this.sendEmail(email, subject, htmlBody);
  }

  private async sendEmail(to: string, subject: string, htmlBody: string) {
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USERNAME || 'ohwojerogodstime@gmail.com',
      to,
      subject,
      html: htmlBody,
      text: 'Please verify your email by clicking the verification link.', // Plain text fallback
    };

    console.log('=== EMAIL SEND ATTEMPT ===');
    console.log('To:', to);
    console.log('From:', mailOptions.from);
    console.log('Subject:', subject);

    if (!process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD) {
      console.error('❌ SMTP credentials not configured!');
      throw new Error('SMTP_USERNAME and SMTP_PASSWORD must be set in environment variables');
    }

    try {
      console.log('📤 Sending email...');
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', {
        messageId: info.messageId,
        envelope: info.envelope,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      });

      return info;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}