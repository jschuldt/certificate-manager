/**
 * Represents a user in the system
 * @interface IUser
 */
export interface IUser {
    /** Unique identifier for the user */
    id?: string;
    /** User's first name */
    firstName: string;
    /** User's last name */
    lastName: string;
    /** User's email address */
    email: string;
    /** User's hashed password */
    password: string;
    /** Array of user's notification preferences */
    notificationPreferences: NotificationPreference[];
    /** Indicates if the user account is active */
    isActive: boolean;
    /** Indicates if the user has been soft-deleted */
    isDeleted: boolean;
    /** Timestamp of user creation */
    createdAt: Date;
    /** Timestamp of last user update */
    updatedAt: Date;
}

/** Available notification channels for users */
export type NotificationPreference = 'EMAIL' | 'SMS' | 'PUSH';

/**
 * User response interface without sensitive information
 * @interface IUserResponse
 */
export interface IUserResponse extends Omit<IUser, 'password'> { }

/**
 * User login credentials
 * @interface IUserCredentials
 */
export interface IUserCredentials {
    /** User's email address */
    email: string;
    /** User's password */
    password: string;
}
