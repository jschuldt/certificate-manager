import bcrypt from 'bcrypt';

/**
 * Number of salt rounds for bcrypt hashing
 * Higher values increase security but also processing time
 */
const SALT_ROUNDS = 10;

/**
 * Hashes a password using bcrypt with configured salt rounds
 * @param password Plain text password to hash
 * @returns Promise resolving to hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Securely compares a plain text password with a hash
 * @param password Plain text password to verify
 * @param hash Hashed password to compare against
 * @returns Promise resolving to boolean indicating match
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};
