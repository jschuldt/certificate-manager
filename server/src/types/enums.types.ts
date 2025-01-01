/**
 * Represents the possible states of a certificate
 * @enum {string}
 */
export enum CertificateStatusEnum {
    /** Certificate is currently valid */
    VALID = 'VALID',
    /** Certificate has expired */
    EXPIRED = 'EXPIRED',
    /** Certificate will expire soon */
    EXPIRING_SOON = 'EXPIRING_SOON',
    /** Certificate has been revoked */
    REVOKED = 'REVOKED'
}

/**
 * Available notification channels
 * @enum {string}
 */
export enum NotificationTypeEnum {
    /** Email notifications */
    EMAIL = 'EMAIL',
    /** SMS notifications */
    SMS = 'SMS',
    /** Push notifications */
    PUSH = 'PUSH'
}

/**
 * Sort order options
 * @enum {string}
 */
export enum SortOrderEnum {
    /** Ascending order */
    ASC = 'asc',
    /** Descending order */
    DESC = 'desc'
}
