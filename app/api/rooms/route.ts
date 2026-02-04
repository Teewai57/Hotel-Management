import { NextRequest, NextResponse } from 'next/server';
import { getRooms, saveRooms, getRoomTypes } from '@/src/lib/store';
import { Room } from '@/src/types';
import { createRoomSchema } from '@/src/lib/validation';
import { validateRoomTypeExists, getNextId } from '@/src/lib/db-utils';

export async function GET() {
    try {
        const rooms = await getRooms();
        const roomTypes = await getRoomTypes();

        // Join room type information
        const roomsWithTypes = rooms.map(room => {
            const roomType = roomTypes.find(rt => rt.room_type_id === room.room_type_id);
            return {
                ...room,
                room_type: roomType || null
            };
        });

        return NextResponse.json(roomsWithTypes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const validation = createRoomSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                error: 'Validation failed',
                details: validation.error.issues
            }, { status: 400 });
        }

        const rooms = await getRooms();
        const roomTypes = await getRoomTypes();

        // Validate room type exists
        if (!validateRoomTypeExists(body.room_type_id, roomTypes)) {
            return NextResponse.json({ error: 'Room type not found' }, { status: 400 });
        }

        // Check if room number already exists
        const existingRoom = rooms.find(r => r.room_number === body.room_number);
        if (existingRoom) {
            return NextResponse.json({ error: 'Room number already exists' }, { status: 400 });
        }

        const newRoom: Room = {
            room_id: getNextId(rooms, 'room_id'),
            room_number: body.room_number,
            room_type_id: body.room_type_id,
            status: body.status || 'Available'
        };

        rooms.push(newRoom);
        await saveRooms(rooms);

        return NextResponse.json(newRoom, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
    }
}

