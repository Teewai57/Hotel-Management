import { NextRequest, NextResponse } from 'next/server';
import { getGuests, saveGuests, getBookings, saveBookings, getRooms, saveRooms } from '@/src/lib/store';
import { updateGuestSchema } from '@/src/lib/validation';
import { hasActiveBookings } from '@/src/lib/db-utils';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);
        const body = await request.json();

        // Validate request body
        const validation = updateGuestSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                error: 'Validation failed',
                details: validation.error.issues
            }, { status: 400 });
        }

        const guests = await getGuests();

        const index = guests.findIndex(g => g.guest_id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
        }

        guests[index] = { ...guests[index], ...body, guest_id: id };
        await saveGuests(guests);

        return NextResponse.json(guests[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update guest' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idString } = await params;
        const id = parseInt(idString);
        const guests = await getGuests();
        const bookings = await getBookings();
        const rooms = await getRooms();

        // 1. Find the guest
        console.log(`Attempting to delete guest ID: ${id} (type: ${typeof id})`);
        const guestExists = guests.find(g => g.guest_id === id);
        if (!guestExists) {
            console.log("Guest ID not found in:", guests.map(g => g.guest_id));
            return NextResponse.json({ error: `Guest not found (ID: ${id})` }, { status: 404 });
        }

        // 2. Find and remove guest's bookings
        const guestBookings = bookings.filter(b => b.guest_id === id);
        const activeBookings = guestBookings.filter(b => b.status === 'Confirmed' || b.status === 'CheckedIn');
        const remainingBookings = bookings.filter(b => b.guest_id !== id);

        // 3. Free up rooms used by active bookings
        // We only free up rooms that were currently occupied/reserved by this guest
        let roomsUpdated = false;
        activeBookings.forEach(booking => {
            const roomIndex = rooms.findIndex(r => r.room_id === booking.room_id);
            if (roomIndex !== -1) {
                rooms[roomIndex].status = 'Available';
                roomsUpdated = true;
            }
        });

        // 4. Save changes
        if (guestBookings.length > 0) {
            await saveBookings(remainingBookings);
        }

        if (roomsUpdated) {
            await saveRooms(rooms);
        }

        // 5. Remove guest
        const filteredGuests = guests.filter(g => g.guest_id !== id);
        await saveGuests(filteredGuests);

        return NextResponse.json({ success: true, message: `Guest deleted along with ${guestBookings.length} bookings.` });
    } catch (error: any) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: 'Failed to delete guest', details: error.message }, { status: 500 });
    }
}

