import { NextRequest, NextResponse } from 'next/server';
import { getUsers, saveUsers } from '@/src/lib/store';
import { updateUserSchema } from '@/src/lib/validation';
import { hashPassword } from '@/src/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const users = await getUsers();

        const user = users.find(u => u.user_id === id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();

        // Validate request body
        const validation = updateUserSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                error: 'Validation failed',
                details: validation.error.issues
            }, { status: 400 });
        }

        const users = await getUsers();
        const index = users.findIndex(u => u.user_id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if username is being changed and if it already exists
        if (body.username && body.username !== users[index].username) {
            const existingUser = users.find(u => u.username === body.username);
            if (existingUser) {
                return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
            }
        }

        // Hash password if it's being updated
        let updateData = { ...body };
        if (body.password) {
            updateData.password = await hashPassword(body.password);
        }

        // Update user
        users[index] = { ...users[index], ...updateData, user_id: id };
        await saveUsers(users);

        // Remove password from response
        const { password, ...userWithoutPassword } = users[index];
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const users = await getUsers();

        // Prevent deleting the last admin user
        const user = users.find(u => u.user_id === id);
        if (user && user.role === 'Admin') {
            const adminCount = users.filter(u => u.role === 'Admin').length;
            if (adminCount <= 1) {
                return NextResponse.json({
                    error: 'Cannot delete the last admin user'
                }, { status: 400 });
            }
        }

        const filtered = users.filter(u => u.user_id !== id);

        if (filtered.length === users.length) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await saveUsers(filtered);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
