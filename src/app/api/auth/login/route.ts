import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '@/src/lib/store';
import { loginSchema } from '@/src/lib/validation';
import { comparePassword, generateToken } from '@/src/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const validation = loginSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                error: 'Validation failed',
                details: validation.error.issues
            }, { status: 400 });
        }

        const users = await getUsers();

        // Find user by username
        const user = users.find(u => u.username === body.username);
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password
        const isValid = await comparePassword(body.password, user.password || '');
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Generate JWT token
        const { password, ...userWithoutPassword } = user;
        const token = generateToken(userWithoutPassword);

        return NextResponse.json({
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
