import { NextRequest, NextResponse } from 'next/server';
import { getRoomTypes, saveRoomTypes } from '@/src/lib/store';
import { RoomType } from '@/src/types';
import { createRoomTypeSchema } from '@/src/lib/validation';
import { getNextId } from '@/src/lib/db-utils';

export async function GET() {
    try {
        const roomTypes = await getRoomTypes();
        return NextResponse.json(roomTypes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch room types' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const validation = createRoomTypeSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                error: 'Validation failed',
                details: validation.error.issues
            }, { status: 400 });
        }

        const roomTypes = await getRoomTypes();

        const newRoomType: RoomType = {
            room_type_id: getNextId(roomTypes, 'room_type_id'),
            type_name: body.type_name,
            price: body.price
        };

        roomTypes.push(newRoomType);
        await saveRoomTypes(roomTypes);

        return NextResponse.json(newRoomType, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create room type' }, { status: 500 });
    }
}
