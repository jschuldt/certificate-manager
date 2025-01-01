import mongoose, { Schema, Document } from 'mongoose';
import { ICertificate } from '../types/certificate.types';

/**
 * Certificate document interface extending both Document and ICertificate
 * @interface ICertificateDocument
 * @extends {Document}
 * @extends {ICertificate}
 */
export interface ICertificateDocument extends Document, ICertificate {
    // Additional methods can be defined here if needed
}

/**
 * Mongoose schema for Certificate model
 * @description Defines the structure for SSL/TLS certificate documents including
 * certificate details, metadata, and management information
 */
const certificateSchema = new Schema(
  {
    name: { type: String },                    // Common name or identifier for the certificate
    issuer: { type: String },                  // Certificate issuing authority
    validFrom: { type: Date },                 // Certificate validity start date
    validTo: { type: Date },                   // Certificate expiration date
    serialNumber: { type: String },            // Unique serial number of the certificate
    subject: { type: String },                 // Subject of the certificate
    organization: { type: String },            // Organization name
    organizationalUnit: { type: String },      // Department or unit within organization
    certLastQueried: { type: Date },          // Last time certificate was checked/updated

    /**
     * Additional certificate technical details
     */
    metadata: {
      country: { type: String },               // Country code
      state: { type: String },                 // State/Province
      locality: { type: String },              // City/Locality
      alternativeNames: [{ type: String }],    // Subject Alternative Names (SANs)
      fingerprint: { type: String },           // Certificate fingerprint
      bits: { type: Number }                   // Key size in bits
    },
    deleted: { type: Boolean, default: false }, // Soft delete flag

    /**
     * Certificate management and operational details
     */
    certManager: {
      website: { type: String, required: true },    // Associated website/domain
      responsiblePerson: { type: String },          // Person responsible for certificate
      alertDate: { type: Date },                    // When to send renewal notifications
      renewalDate: { type: Date },                  // Planned renewal date
      comments: { type: String }                    // Additional notes or comments
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<ICertificateDocument>('Certificate', certificateSchema);
