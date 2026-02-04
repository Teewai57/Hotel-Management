import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@/src/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: Omit<User, 'password'>): string {
    return jwt.sign(
        {
            user_id: user.user_id,
            username: user.username,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}

/**
 * Middleware to check if user is authenticated
 */
export function isAuthenticated(authHeader: string | null): { authenticated: boolean; user?: any } {
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
        return { authenticated: false };
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return { authenticated: false };
    }

    return { authenticated: true, user: decoded };
}

/**
 * Check if user has required role
 */
export function hasRole(user: any, allowedRoles: User['role'][]): boolean {
    return allowedRoles.includes(user.role);
}
