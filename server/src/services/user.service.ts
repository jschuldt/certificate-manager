import User, { IUser } from '../models/user.model';

export class UserService {
    async create(userData: Partial<IUser>): Promise<IUser> {
        const user = new User(userData);
        return await user.save();
    }

    async getAll(page: number = 1, limit: number = 10): Promise<{ users: IUser[]; total: number; }> {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            User.find({ isDeleted: false })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            User.countDocuments({ isDeleted: false })
        ]);

        return { users, total };
    }

    async getById(id: string): Promise<IUser | null> {
        return await User.findOne({ _id: id, isDeleted: false });
    }

    async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
        return await User.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: userData },
            { new: true }
        );
    }

    async delete(id: string): Promise<boolean> {
        const result = await User.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: { isDeleted: true, isActive: false } },
            { new: true }
        );
        return !!result;
    }

    async search(query: Partial<IUser>): Promise<IUser[]> {
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

        return await User.find(searchCriteria);
    }
}

export const userService = new UserService();
