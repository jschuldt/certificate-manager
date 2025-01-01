import { Schema, model, Document } from 'mongoose';

/**
 * Type representing a user without sensitive information (password)
 */
export type SafeUser = Omit<IUser, 'password'>;

/**
 * User interface extending Mongoose Document
 * @interface IUser
 * @extends {Document}
 */
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    notificationPreferences: string[];
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    /**
     * Converts user document to safe object by removing sensitive information
     * @returns {SafeUser} User object without password
     */
    toSafeObject(): SafeUser;
}

/**
 * Mongoose schema for User model
 * @description Defines the structure and validation rules for user documents
 */
const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    notificationPreferences: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

/**
 * Converts user document to safe object
 * @method toSafeObject
 * @returns {SafeUser} User object with password field removed
 */
userSchema.methods.toSafeObject = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

export default model<IUser>('User', userSchema);
