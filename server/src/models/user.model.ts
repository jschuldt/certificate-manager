import { Schema, model, Document } from 'mongoose';

export type SafeUser = Omit<IUser, 'password'>;

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
    toSafeObject(): SafeUser;
}

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

userSchema.methods.toSafeObject = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

export default model<IUser>('User', userSchema);
