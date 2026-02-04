import { NextRequest, NextResponse } from 'next/server';
import { getGuests, saveGuests } from '@/src/lib/store';
import { Guest } from '@/src/types';
import { createGuestSchema } from '@/src/lib/validation';
import { getNextId } from '@/src/lib/db-utils';

export async function GET() {
    try {
        const guests = await getGuests();
        return NextResponse.json(guests);
    } catch (error: any) {
        console.error("Error in GET /api/guests:", error);
        return NextResponse.json({ error: 'Failed to fetch guests', details: error.message, stack: error.stack }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const validation = createGuestSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                error: 'Validation failed',
                details: validation.error.issues
            }, { status: 400 });
        }

        const guests = await getGuests();

        const newGuest: Guest = {
            guest_id: getNextId(guests, 'guest_id'),
            full_name: body.full_name,
            phone: body.phone,
            email: body.email,
            address: body.address
        };

        guests.push(newGuest);
        await saveGuests(guests);

        return NextResponse.json(newGuest, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create guest' }, { status: 500 });
    }
}

