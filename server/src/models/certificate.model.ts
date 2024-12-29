import mongoose, { Schema, Document } from 'mongoose';
import { ICertificate } from '../types/certificate.types';

export interface ICertificateDocument extends ICertificate, Document {}

const certificateSchema = new Schema(
  {
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    serialNumber: { type: String },
    subject: { type: String },
    organization: { type: String },
    organizationalUnit: { type: String }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<ICertificateDocument>('Certificate', certificateSchema);
