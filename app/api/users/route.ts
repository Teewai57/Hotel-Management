import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '@/src/lib/store';

export async function GET() {
    try {
        const users = await getUsers();

        // Remove passwords from response
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);

        return NextResponse.json(usersWithoutPasswords);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
