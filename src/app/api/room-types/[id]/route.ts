import { NextRequest, NextResponse } from 'next/server';
import { getRoomTypes, saveRoomTypes, getRooms } from '@/src/lib/store';
import { updateRoomTypeSchema } from '@/src/lib/validation';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const roomTypes = await getRoomTypes();

        const roomType = roomTypes.find(rt => rt.room_type_id === id);
        if (!roomType) {
            return NextResponse.json({ error: 'Room type not found' }, { status: 404 });
        }

        return NextResponse.json(roomType);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch room type' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const body = await request.json();

        // Validate request body
        const validation = updateRoomTypeSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                error: 'Validation failed',
                details: validation.error.issues
            }, { status: 400 });
        }

        const roomTypes = await getRoomTypes();
        const index = roomTypes.findIndex(rt => rt.room_type_id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Room type not found' }, { status: 404 });
        }

        // Update room type
        roomTypes[index] = { ...roomTypes[index], ...body, room_type_id: id };
        await saveRoomTypes(roomTypes);

        return NextResponse.json(roomTypes[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update room type' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const roomTypes = await getRoomTypes();
        const rooms = await getRooms();

        // Check if any rooms use this room type
        const roomsUsingType = rooms.filter(r => r.room_type_id === id);
        if (roomsUsingType.length > 0) {
            return NextResponse.json({
                error: 'Cannot delete room type that is in use by rooms',
                rooms: roomsUsingType.length
            }, { status: 400 });
        }

        const filtered = roomTypes.filter(rt => rt.room_type_id !== id);

        if (filtered.length === roomTypes.length) {
            return NextResponse.json({ error: 'Room type not found' }, { status: 404 });
        }

        await saveRoomTypes(filtered);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete room type' }, { status: 500 });
    }
}
