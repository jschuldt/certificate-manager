import nodemailer, { Transporter } from 'nodemailer';
import SystemConfig, { ISystemConfigDocument } from '../models/system.model';
import { ISmtpConfig } from '../types/system.types';

export class SystemService {
  private smtpTransporter: Transporter | null = null;

  /**
   * Get active SMTP configuration
   */
  private async getSmtpConfig(): Promise<ISmtpConfig> {
    const config = await SystemConfig.findOne({
      systemComponent: 'SMTP',
      status: 'active',
      'componentConfig.isDefault': true
    });

    if (!config) {
      throw new Error('No active SMTP configuration found');
    }

    return config.componentConfig as ISmtpConfig;
  }

  /**
   * Initialize SMTP transporter
   */
  private async initializeSmtpTransporter(): Promise<void> {
    const smtpConfig = await this.getSmtpConfig();

    this.smtpTransporter = nodemailer.createTransport({
      service: smtpConfig.service === 'CUSTOM' ? undefined : smtpConfig.service.toLowerCase(),
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: smtpConfig.auth,
      tls: smtpConfig.tls
    });
  }

  /**
   * Send email using configured SMTP settings
   */
  async sendEmail(to: string, subject: string, message: string): Promise<boolean> {
    try {
      if (!this.smtpTransporter) {
        await this.initializeSmtpTransporter();
      }

      const smtpConfig = await this.getSmtpConfig();
      
      const mailOptions = {
        from: smtpConfig.fromAddress,
        to,
        subject,
        text: message,
        replyTo: smtpConfig.replyTo
      };

      await this.smtpTransporter!.sendMail(mailOptions);

      // Update last tested timestamp and result
      await SystemConfig.findOneAndUpdate(
        { systemComponent: 'SMTP', 'componentConfig.isDefault': true },
        {
          $set: {
            'componentConfig.lastTested': new Date(),
            'componentConfig.testResult': {
              success: true,
              message: 'Email sent successfully',
              timestamp: new Date()
            }
          }
        }
      );

      return true;
    } catch (error) {
      // Update failure status
      await SystemConfig.findOneAndUpdate(
        { systemComponent: 'SMTP', 'componentConfig.isDefault': true },
        {
          $set: {
            'componentConfig.lastTested': new Date(),
            'componentConfig.testResult': {
              success: false,
              message: error instanceof Error ? error.message : 'Failed to send email',
              timestamp: new Date()
            }
          }
        }
      );
      throw error;
    }
  }

  /**
   * Update SMTP configuration settings
   */
  async updateSmtpSettings(smtpData: any): Promise<ISystemConfigDocument> {
    try {
      const smtpConfig = await SystemConfig.findOneAndUpdate(
        { systemComponent: 'SMTP' },
        {
          $set: {
            systemComponent: 'SMTP',
            componentConfig: smtpData,
            status: 'active',
            lastUpdated: new Date()
          }
        },
        { 
          new: true, 
          upsert: true 
        }
      );

      return smtpConfig;
    } catch (error) {
      console.error('Failed to update SMTP settings:', error);
      throw error;
    }
  }

  /**
   * Get SMTP configuration settings
   */
  async getSmtpSettings(): Promise<ISystemConfigDocument | null> {
    try {
      const config = await SystemConfig.findOne({ systemComponent: 'SMTP' });
      return config;
    } catch (error) {
      console.error('Failed to fetch SMTP settings:', error);
      throw error;
    }
  }
}

export const systemService = new SystemService();
