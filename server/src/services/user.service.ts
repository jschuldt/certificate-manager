import User, { IUser, SafeUser } from '../models/user.model';
import { comparePassword, hashPassword } from '../utils/password.utils';

/**
 * Service class handling all user-related operations
 * @class UserService
 */
export class UserService {
    /**
     * Creates a new user in the system
     * @param {Partial<IUser>} userData - The user data to create
     * @returns {Promise<SafeUser>} The created user without sensitive information
     */
    async create(userData: Partial<IUser>): Promise<SafeUser> {
        if (userData.password) {
            userData.password = await hashPassword(userData.password);
        }
        const user = new User(userData);
        await user.save();
        return user.toSafeObject();
    }

    /**
     * Retrieves a paginated list of all active users
     * @param {number} page - Page number for pagination (default: 1)
     * @param {number} limit - Number of items per page (default: 10)
     * @returns {Promise<{users: SafeUser[]; total: number;}>} Paginated users and total count
     */
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

    /**
     * Retrieves a single user by their ID
     * @param {string} id - The user's ID
     * @returns {Promise<SafeUser | null>} The user if found, null otherwise
     */
    async getById(id: string): Promise<SafeUser | null> {
        const user = await User.findOne({ _id: id, isDeleted: false });
        return user ? user.toSafeObject() : null;
    }

    /**
     * Updates a user's information
     * @param {string} id - The user's ID
     * @param {Partial<IUser>} userData - The data to update
     * @returns {Promise<SafeUser | null>} The updated user if found, null otherwise
     */
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

    /**
     * Soft deletes a user by setting isDeleted flag
     * @param {string} id - The user's ID
     * @returns {Promise<boolean>} True if successful, false otherwise
     */
    async delete(id: string): Promise<boolean> {
        const result = await User.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: { isDeleted: true, isActive: false } },
            { new: true }
        );
        return !!result;
    }

    /**
     * Searches for users based on provided criteria
     * @param {Partial<IUser>} query - Search criteria
     * @returns {Promise<SafeUser[]>} Array of matching users
     */
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

    /**
     * Authenticates a user with email and password
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Promise<SafeUser | null>} Authenticated user or null if authentication fails
     */
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
