/**
 * Represents the core certificate information and metadata
 * This interface contains all the essential details of a digital certificate
 */
export interface ICertificate {
    /** Name/identifier of the certificate */
    name: string;
    /** The entity that issued/signed the certificate */
    issuer: string;
    /** Start date of certificate validity */
    validFrom: Date;
    /** Expiration date of certificate */
    validTo: Date;
    /** Unique identifier for the certificate */
    serialNumber: string;
    /** The entity the certificate was issued to */
    subject: string;
    /** Organization owning the certificate */
    organization: string;
    /** Specific department or unit within the organization */
    organizationalUnit: string;
    /** Last time the certificate was checked/verified */
    certLastQueried: Date;
    /** Additional certificate details */
    metadata: ICertificateMetadata;
    /** Indicates if the certificate has been marked as deleted */
    deleted: boolean;
    /** Certificate management related information */
    certManager: ICertManagerInfo;
    /** Optional creation timestamp */
    createdAt?: Date;
    /** Optional last update timestamp */
    updatedAt?: Date;
}

/**
 * Extends ICertificate with required response fields
 * Used when returning certificate data from the API
 */
export interface ICertificateResponse extends ICertificate {
    /** Unique database identifier */
    id: string;
    /** Timestamp when the record was created */
    createdAt: Date;
    /** Timestamp when the record was last updated */
    updatedAt: Date;
}

/**
 * Contains additional metadata about the certificate
 */
export interface ICertificateMetadata {
    /** Country code where the certificate was issued */
    country: string;
    /** State/province where the certificate was issued */
    state: string;
    /** City where the certificate was issued */
    locality: string;
    /** Subject Alternative Names (SANs) for the certificate */
    alternativeNames: string[];
    /** Certificate fingerprint/hash */
    fingerprint: string;
    /** Key size in bits */
    bits: number;
}

/**
 * Information about certificate management and responsibilities
 */
export interface ICertManagerInfo {
    /** URL where the certificate is deployed/used */
    website: string;
    /** Person responsible for managing the certificate */
    responsiblePerson?: string;
    /** Date when alerts should be sent for renewal */
    alertDate?: Date;
    /** Planned or actual renewal date */
    renewalDate?: Date;
    /** Additional notes or comments about the certificate */
    comments?: string;
}

/**
 * Basic certificate information used for quick reference
 */
export interface CertificateInfo {
    /** Entity the certificate was issued to */
    subject: string;
    /** Entity that issued the certificate */
    issuer: string;
    /** Start date of validity period */
    validFrom: string;
    /** End date of validity period */
    validTo: string;
}

/** Possible status values for a certificate */
export type CertificateStatus = 'VALID' | 'EXPIRED' | 'EXPIRING_SOON' | 'REVOKED';

/**
 * Filter criteria for querying certificates
 */
export interface ICertificateFilter {
    /** Filter by organization name */
    organization?: string;
    /** Filter by certificate status */
    validityStatus?: CertificateStatus;
    /** Filter certificates expiring before this date */
    expiringBefore?: Date;
    /** Filter by certificate issuer */
    issuedBy?: string;
}
