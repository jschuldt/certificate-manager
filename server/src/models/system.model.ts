import mongoose, { Schema, Document } from 'mongoose';
import { ISystemConfig, ISmtpConfig } from '../types/system.types';

/**
 * System Configuration document interface extending both Document and ISystemConfig
 * @interface ISystemConfigDocument
 * @extends {Document}
 * @extends {ISystemConfig}
 */
export interface ISystemConfigDocument extends Document, ISystemConfig {
    componentConfig: ISmtpConfig & Record<string, any>;
}

/**
 * SMTP Configuration sub-schema
 * @description Defines the structure for SMTP configurations including
 * server settings, authentication, and test results
 */
const smtpConfigSchema = new Schema({
    service: {
        type: String,
        required: true,
        enum: ['GMAIL', 'OUTLOOK', 'HOTMAIL', 'YAHOO', 'CUSTOM'],
        description: 'Email service provider'
    },
    host: { 
        type: String, 
        required: true,
        description: 'SMTP server hostname'
    },
    port: { 
        type: Number, 
        required: true,
        description: 'SMTP server port'
    },
    secure: { 
        type: Boolean, 
        default: true,
        description: 'Use SSL/TLS'
    },
    auth: {
        user: { 
            type: String, 
            required: true,
            description: 'SMTP authentication username'
        },
        pass: { 
            type: String, 
            required: true,
            description: 'SMTP authentication password'
        }
    },
    fromAddress: { 
        type: String, 
        required: true,
        description: 'Default sender email address'
    },
    replyTo: { 
        type: String,
        description: 'Reply-to email address'
    },
    tls: {
        rejectUnauthorized: { 
            type: Boolean, 
            default: true,
            description: 'Verify TLS certificate'
        }
    },
    maxRetries: { 
        type: Number, 
        default: 3,
        description: 'Maximum retry attempts for failed emails'
    },
    timeout: { 
        type: Number, 
        default: 10000,
        description: 'Connection timeout in milliseconds'
    },
    isDefault: { 
        type: Boolean, 
        default: false,
        description: 'Primary SMTP configuration flag'
    },
    lastTested: { 
        type: Date,
        description: 'Last configuration test timestamp'
    },
    testResult: {
        success: { type: Boolean },
        message: { type: String },
        timestamp: { type: Date }
    }
});

/**
 * Mongoose schema for System Configuration model
 * @description Defines the structure for system configuration documents including
 * component settings, status, and metadata
 */
const systemConfigSchema = new Schema(
    {
        systemComponent: {
            type: String,
            required: true,
            unique: true,
            description: 'Component identifier (e.g., SMTP, OAuth)'
        },
        componentConfig: {
            type: Schema.Types.Mixed,
            required: true,
            validate: {
                validator: function(this: ISystemConfigDocument, config: any) {
                    if (this.systemComponent === 'SMTP') {
                        return config.service && config.host && config.port && config.auth;
                    }
                    return true;
                },
                message: 'Invalid configuration for system component'
            },
            description: 'Component-specific configuration object'
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'error'],
            default: 'inactive',
            required: true,
            description: 'Current component status'
        },
        description: { 
            type: String,
            description: 'Component description or notes'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Pre-save middleware to ensure only one default SMTP config
systemConfigSchema.pre('save', async function(next) {
    if (
        this.systemComponent === 'SMTP' &&
        this.componentConfig.isDefault
    ) {
        await this.model('SystemConfig').updateMany(
            { 
                systemComponent: 'SMTP',
                _id: { $ne: this._id }
            },
            { 'componentConfig.isDefault': false }
        );
    }
    next();
});

export default mongoose.model<ISystemConfigDocument>('SystemConfig', systemConfigSchema);
