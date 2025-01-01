export interface IUser {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    notificationPreferences: NotificationPreference[];
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type NotificationPreference = 'EMAIL' | 'SMS' | 'PUSH';

export interface IUserResponse extends Omit<IUser, 'password'> { }

export interface IUserCredentials {
    email: string;
    password: string;
}
