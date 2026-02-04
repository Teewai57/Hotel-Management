import { NextRequest, NextResponse } from 'next/server';
import { getBookings, saveBookings, getGuests, getRooms, saveRooms } from '@/src/lib/store';
import * as fromStore from '@/src/lib/store'; // Backup import for namespacing if needed
import { Booking } from '@/src/types';
import { createBookingSchema } from '@/src/lib/validation';
import { validateGuestExists, validateRoomExists, isRoomAvailable, getNextId } from '@/src/lib/db-utils';

export async function GET() {
    try {
        const bookings = await getBookings();
        return NextResponse.json(bookings);
    } catch (error) {
        console.error("Error in GET /api/bookings:", error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const validation = createBookingSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                error: 'Validation failed',
                details: validation.error.issues
            }, { status: 400 });
        }

        const bookings = await getBookings();
        const guests = await getGuests();
        const rooms = await getRooms();

        // Validate guest exists
        if (!validateGuestExists(body.guest_id, guests)) {
            return NextResponse.json({ error: 'Guest not found' }, { status: 400 });
        }

        // Validate room exists
        if (!validateRoomExists(body.room_id, rooms)) {
            return NextResponse.json({ error: 'Room not found' }, { status: 400 });
        }

        // Check room availability
        if (!isRoomAvailable(body.room_id, body.check_in_date, body.check_out_date, bookings)) {
            return NextResponse.json({ error: 'Room is not available for the selected dates' }, { status: 400 });
        }

        const newBooking: Booking = {
            booking_id: getNextId(bookings, 'booking_id'),
            guest_id: body.guest_id,
            room_id: body.room_id,
            check_in_date: body.check_in_date,
            check_out_date: body.check_out_date,
            status: body.status || 'Confirmed'
        };

        bookings.push(newBooking);
        await saveBookings(bookings);

        // Update room status to Occupied
        const roomIndex = rooms.findIndex(r => r.room_id === body.room_id);
        if (roomIndex !== -1) {
            rooms[roomIndex].status = 'Occupied';
            // Note: In a real app we'd check if the booking is currently active (today), 
            // but for this simple version we mark it occupied immediately.
            await fromStore.saveRooms(rooms);
        }

        return NextResponse.json(newBooking, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}

