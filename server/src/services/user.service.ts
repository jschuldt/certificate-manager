import User, { IUser, SafeUser } from '../models/user.model';
import { comparePassword, hashPassword } from '../utils/password.utils';

export class UserService {
    async create(userData: Partial<IUser>): Promise<SafeUser> {
        if (userData.password) {
            userData.password = await hashPassword(userData.password);
        }
        const user = new User(userData);
        await user.save();
        return user.toSafeObject();
    }

    async getAll(page: number = 1, limit: number = 10): Promise<{ users: SafeUser[]; total: number; }> {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            User.find({ isDeleted: false })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            User.countDocuments({ isDeleted: false })
        ]);

        return {
            users: users.map(user => user.toSafeObject()),
            total
        };
    }

    async getById(id: string): Promise<SafeUser | null> {
        const user = await User.findOne({ _id: id, isDeleted: false });
        return user ? user.toSafeObject() : null;
    }

    async update(id: string, userData: Partial<IUser>): Promise<SafeUser | null> {
        if (userData.password) {
            userData.password = await hashPassword(userData.password);
        }
        const user = await User.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: userData },
            { new: true }
        );
        return user ? user.toSafeObject() : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await User.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: { isDeleted: true, isActive: false } },
            { new: true }
        );
        return !!result;
    }

    async search(query: Partial<IUser>): Promise<SafeUser[]> {
        const searchCriteria = { isDeleted: false };

        if (query.firstName) {
            Object.assign(searchCriteria, { firstName: new RegExp(query.firstName, 'i') });
        }
        if (query.lastName) {
            Object.assign(searchCriteria, { lastName: new RegExp(query.lastName, 'i') });
        }
        if (query.email) {
            Object.assign(searchCriteria, { email: new RegExp(query.email, 'i') });
        }

        const users = await User.find(searchCriteria);
        return users.map(user => user.toSafeObject());
    }

    async login(email: string, password: string): Promise<SafeUser | null> {
        const user = await User.findOne({ email, isDeleted: false });
        if (!user) {
            console.log('Login failed: User not found:', email);
            return null;
        }

        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            console.log('Login failed: Invalid password for user:', email);
            return null;
        }

        return user.toSafeObject();
    }
}

export const userService = new UserService();
