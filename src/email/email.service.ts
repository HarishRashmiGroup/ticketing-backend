import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleDestroy {
  private transporter: nodemailer.Transporter | null = null;
  private messageQueue: Array<{
    to: string;
    cc?: string;
    subject: string;
    html: string;
  }> = [];
  private processing = false;
  private readonly logger = new Logger(EmailService.name);

  private async createTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.outlook.com',
        port: 587,
        secure: false,
        auth: {
          user: 'harish.kumar@rashmigroup.com',
          pass: process.env.email_password,
        },
        tls: {
          ciphers: 'SSLv3',
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        socketTimeout: 60000,
      });

      try {
        await this.transporter.verify();
        this.logger.log('SMTP connection established');
      } catch (error) {
        this.logger.error('SMTP connection error:', error);
        this.transporter = null;
        throw error;
      }
    }
    return this.transporter;
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.messageQueue.length === 0) {
      return;
    }

    this.processing = true;
    const transporter = await this.createTransporter();

    try {
      while (this.messageQueue.length > 0 && transporter.isIdle()) {
        const email = this.messageQueue.shift();
        if (email) {
          try {
            await transporter.sendMail({
              from: '"Rashmi Group IT Team" <harish.kumar@rashmigroup.com>',
              ...email,
            });
            this.logger.debug(`Email sent successfully to ${email.to}`);
          } catch (error) {
            this.logger.error(`Failed to send email to ${email.to}:`, error);
          }
        }
      }
    } finally {
      this.processing = false;
      
      if (this.messageQueue.length === 0) {
        await this.closeConnection();
      }
      else if (transporter.isIdle()) {
        this.processQueue();
      }
    }
  }

  async sendEmailWithCC(to: string, cc: string, subject: string, html: string): Promise<void> {
    try {
      this.messageQueue.push({ to, cc, subject, html });
      if (!this.processing) {
        await this.processQueue();
      }
    } catch (error) {
      this.logger.error('Failed to queue email with CC:', error);
      throw new Error('Email queuing failed');
    }
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      this.messageQueue.push({ to, subject, html });
      if (!this.processing) {
        await this.processQueue();
      }
    } catch (error) {
      this.logger.error('Failed to queue email:', error);
      throw new Error('Email queuing failed');
    }
  }

  async sendBulkEmails(
    emails: { to: string; cc?: string; subject: string; html: string }[],
  ): Promise<void> {
    try {
      this.messageQueue.push(...emails);
      if (!this.processing) {
        await this.processQueue();
      }
    } catch (error) {
      this.logger.error('Failed to queue bulk emails:', error);
      throw new Error('Bulk email queuing failed');
    }
  }

  private async closeConnection(): Promise<void> {
    try {
      if (this.transporter) {
        await this.transporter.close();
        this.transporter = null;
        this.logger.log('Email transport connection closed');
      }
    } catch (error) {
      this.logger.error('Error closing email transport connection:', error);
    }
  }

  async onModuleDestroy() {
    await this.closeConnection();
  }
}