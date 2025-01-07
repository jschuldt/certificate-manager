import { Request, Response } from 'express';
import { systemService } from '../services/system.service';

export const systemController = {
  /**
   * Health check endpoint
   */
  async healthCheck(req: Request, res: Response) {
    res.json({ status: 'alive', timestamp: new Date().toISOString() });
  },

  /**
   * Send email using configured SMTP settings
   */
  async sendEmail(req: Request, res: Response) {
    try {
      const { to, subject, message } = req.body;

      // Validate required fields
      if (!to || !subject || !message) {
        return res.status(400).json({
          error: 'Missing required fields',
          details: 'to, subject, and message are required'
        });
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(to)) {
        return res.status(400).json({
          error: 'Invalid email format',
          details: 'Recipient email address is not valid'
        });
      }

      await systemService.sendEmail(to, subject, message);
      
      res.status(200).json({
        success: true,
        message: 'Email sent successfully'
      });
    } catch (error) {
      console.error('Email sending error:', error);
      res.status(500).json({
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  },

  /**
   * Update SMTP configuration settings
   */
  async updateSmtpSettings(req: Request, res: Response) {
    try {
      const smtpConfig = await systemService.updateSmtpSettings(req.body);
      
      // Create a safe copy of the config without sensitive data
      const safeConfig = {
        ...smtpConfig.toObject(),
        componentConfig: {
          ...smtpConfig.componentConfig,
          auth: {
            user: smtpConfig.componentConfig.auth.user,
            // Omit password entirely from response
          }
        }
      };

      res.status(200).json({
        success: true,
        message: 'SMTP settings updated successfully',
        config: safeConfig
      });
    } catch (error) {
      console.error('SMTP settings update error:', error);
      res.status(500).json({
        error: 'Failed to update SMTP settings',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  },

  /**
   * Get SMTP configuration settings
   */
  async getSmtpSettings(req: Request, res: Response) {
    try {
      const smtpConfig = await systemService.getSmtpSettings();
      
      if (!smtpConfig) {
        return res.status(404).json({
          error: 'SMTP configuration not found'
        });
      }

      // Create safe copy without sensitive data
      const safeConfig = {
        ...smtpConfig.toObject(),
        componentConfig: {
          ...smtpConfig.componentConfig,
          auth: {
            user: smtpConfig.componentConfig.auth.user
          }
        }
      };

      res.status(200).json({
        success: true,
        config: safeConfig
      });
    } catch (error) {
      console.error('SMTP settings fetch error:', error);
      res.status(500).json({
        error: 'Failed to fetch SMTP settings',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
};
