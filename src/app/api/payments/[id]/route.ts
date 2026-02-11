import { NextRequest, NextResponse } from 'next/server';
import { getPayments, savePayments, getBookings } from '@/src/lib/store';
import { updatePaymentSchema } from '@/src/lib/validation';
import { validateBookingExists } from '@/src/lib/db-utils';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const payments = await getPayments();

        const payment = payments.find(p => p.payment_id === id);
        if (!payment) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        return NextResponse.json(payment);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch payment' }, { status: 500 });
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
        const validation = updatePaymentSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                error: 'Validation failed',
                details: validation.error.issues
            }, { status: 400 });
        }

        const payments = await getPayments();
        const index = payments.findIndex(p => p.payment_id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        // Validate booking exists if booking_id is being updated
        if (body.booking_id !== undefined) {
            const bookings = await getBookings();
            if (!validateBookingExists(body.booking_id, bookings)) {
                return NextResponse.json({ error: 'Booking not found' }, { status: 400 });
            }
        }

        // Update payment
        payments[index] = { ...payments[index], ...body, payment_id: id };
        await savePayments(payments);

        return NextResponse.json(payments[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const payments = await getPayments();
        const filtered = payments.filter(p => p.payment_id !== id);

        if (filtered.length === payments.length) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        await savePayments(filtered);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete payment' }, { status: 500 });
    }
}
