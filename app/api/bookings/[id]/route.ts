import { NextRequest, NextResponse } from 'next/server';
import { getBookings, saveBookings, getRooms, getGuests } from '@/src/lib/store';
import { updateBookingSchema } from '@/src/lib/validation';
import { validateGuestExists, validateRoomExists, isRoomAvailable } from '@/src/lib/db-utils';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const bookings = await getBookings();

        const booking = bookings.find(b => b.booking_id === id);
        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json(booking);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
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
        const validation = updateBookingSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                error: 'Validation failed',
                details: validation.error.issues
            }, { status: 400 });
        }

        const bookings = await getBookings();
        const index = bookings.findIndex(b => b.booking_id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Validate guest exists if guest_id is being updated
        if (body.guest_id !== undefined) {
            const guests = await getGuests();
            if (!validateGuestExists(body.guest_id, guests)) {
                return NextResponse.json({ error: 'Guest not found' }, { status: 400 });
            }
        }

        // Validate room exists and is available if room or dates are being updated
        if (body.room_id !== undefined || body.check_in_date !== undefined || body.check_out_date !== undefined) {
            const rooms = await getRooms();
            const roomId = body.room_id || bookings[index].room_id;
            const checkIn = body.check_in_date || bookings[index].check_in_date;
            const checkOut = body.check_out_date || bookings[index].check_out_date;

            if (!validateRoomExists(roomId, rooms)) {
                return NextResponse.json({ error: 'Room not found' }, { status: 400 });
            }

            if (!isRoomAvailable(roomId, checkIn, checkOut, bookings, id)) {
                return NextResponse.json({ error: 'Room is not available for the selected dates' }, { status: 400 });
            }
        }

        // Update booking
        bookings[index] = { ...bookings[index], ...body, booking_id: id };
        await saveBookings(bookings);

        return NextResponse.json(bookings[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const bookings = await getBookings();
        const filtered = bookings.filter(b => b.booking_id !== id);

        if (filtered.length === bookings.length) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        await saveBookings(filtered);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
    }
}
