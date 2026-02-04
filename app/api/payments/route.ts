import { NextRequest, NextResponse } from 'next/server';
import { getPayments, savePayments, getBookings } from '@/src/lib/store';
import { Payment } from '@/src/types';
import { createPaymentSchema } from '@/src/lib/validation';
import { validateBookingExists, getNextId } from '@/src/lib/db-utils';

export async function GET() {
    try {
        const payments = await getPayments();
        return NextResponse.json(payments);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const validation = createPaymentSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                error: 'Validation failed',
                details: validation.error.issues
            }, { status: 400 });
        }

        const payments = await getPayments();
        const bookings = await getBookings();

        // Validate booking exists
        if (!validateBookingExists(body.booking_id, bookings)) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 400 });
        }

        const newPayment: Payment = {
            payment_id: getNextId(payments, 'payment_id'),
            booking_id: body.booking_id,
            amount: body.amount,
            method: body.method,
            payment_date: body.payment_date
        };

        payments.push(newPayment);
        await savePayments(payments);

        return NextResponse.json(newPayment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
    }
}
