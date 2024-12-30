import mongoose, { Schema, Document } from 'mongoose';
import { ICertificate } from '../types/certificate.types';

export interface ICertificateDocument extends ICertificate, Document {}

const certificateSchema = new Schema(
  {
    name: { type: String },
    issuer: { type: String},
    validFrom: { type: Date},
    validTo: { type: Date,},
    serialNumber: { type: String },
    subject: { type: String },
    organization: { type: String },
    organizationalUnit: { type: String },
    certLastQueried: { type: Date },
    metadata: {
      country: { type: String },
      state: { type: String },
      locality: { type: String },
      alternativeNames: [{ type: String }],
      fingerprint: { type: String },
      bits: { type: Number }
    },
    deleted: { type: Boolean, default: false },
    certManager: {
      website: { type: String, required: true }, // Only this field remains required
      responsiblePerson: { type: String },
      alertDate: { type: Date },
      comments: { type: String }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<ICertificateDocument>('Certificate', certificateSchema);
