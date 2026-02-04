import { NextRequest, NextResponse } from 'next/server';
import { getUsers, saveUsers } from '@/src/lib/store';
import { User } from '@/src/types';
import { createUserSchema } from '@/src/lib/validation';
import { hashPassword, generateToken } from '@/src/lib/auth';
import { getNextId } from '@/src/lib/db-utils';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const validation = createUserSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                error: 'Validation failed',
                details: validation.error.issues
            }, { status: 400 });
        }

        const users = await getUsers();

        // Check if username already exists
        const existingUser = users.find(u => u.username === body.username);
        if (existingUser) {
            return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await hashPassword(body.password);

        const newUser: User = {
            user_id: getNextId(users, 'user_id'),
            username: body.username,
            password: hashedPassword,
            role: body.role
        };

        users.push(newUser);
        await saveUsers(users);

        // Generate token for immediate login
        const { password, ...userWithoutPassword } = newUser;
        const token = generateToken(userWithoutPassword);

        return NextResponse.json({
            token,
            user: userWithoutPassword
        }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
