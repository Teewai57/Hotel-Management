import { Guest, Room, Booking, RoomType, Payment, User } from '@/src/types';

/**
 * Generate a unique ID based on timestamp and random number
 */
export function generateId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
}

/**
 * Validate that a date string is in valid ISO format
 */
export function isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

/**
 * Check if date1 is before date2
 */
export function isDateBefore(date1: string, date2: string): boolean {
    return new Date(date1) < new Date(date2);
}

/**
 * Check if two date ranges overlap
 */
export function doDateRangesOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string
): boolean {
    const s1 = new Date(start1);
    const e1 = new Date(end1);
    const s2 = new Date(start2);
    const e2 = new Date(end2);

    return s1 < e2 && s2 < e1;
}

/**
 * Validate referential integrity: check if guest exists
 */
export function validateGuestExists(guestId: number, guests: Guest[]): boolean {
    return guests.some(g => g.guest_id === guestId);
}

/**
 * Validate referential integrity: check if room exists
 */
export function validateRoomExists(roomId: number, rooms: Room[]): boolean {
    return rooms.some(r => r.room_id === roomId);
}

/**
 * Validate referential integrity: check if room type exists
 */
export function validateRoomTypeExists(roomTypeId: number, roomTypes: RoomType[]): boolean {
    return roomTypes.some(rt => rt.room_type_id === roomTypeId);
}

/**
 * Validate referential integrity: check if booking exists
 */
export function validateBookingExists(bookingId: number, bookings: Booking[]): boolean {
    return bookings.some(b => b.booking_id === bookingId);
}

/**
 * Check if a room is available for a given date range
 */
export function isRoomAvailable(
    roomId: number,
    checkIn: string,
    checkOut: string,
    bookings: Booking[],
    excludeBookingId?: number
): boolean {
    const roomBookings = bookings.filter(b =>
        b.room_id === roomId &&
        b.status !== 'Cancelled' &&
        b.status !== 'CheckedOut' &&
        (excludeBookingId === undefined || b.booking_id !== excludeBookingId)
    );

    for (const booking of roomBookings) {
        if (doDateRangesOverlap(checkIn, checkOut, booking.check_in_date, booking.check_out_date)) {
            return false;
        }
    }

    return true;
}

/**
 * Check if a guest has any active bookings
 */
export function hasActiveBookings(guestId: number, bookings: Booking[]): boolean {
    return bookings.some(b =>
        b.guest_id === guestId &&
        (b.status === 'Confirmed' || b.status === 'CheckedIn')
    );
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (basic validation)
 */
export function isValidPhone(phone: string): boolean {
    // Allow digits, spaces, dashes, parentheses, and plus sign
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
}

/**
 * Check for duplicate IDs in an array
 */
export function hasDuplicateIds<T extends { [key: string]: any }>(
    items: T[],
    idField: keyof T
): boolean {
    const ids = items.map(item => item[idField]);
    return new Set(ids).size !== ids.length;
}

/**
 * Get the maximum ID from an array
 */
export function getMaxId<T extends { [key: string]: any }>(
    items: T[],
    idField: keyof T
): number {
    if (items.length === 0) return 0;
    return Math.max(...items.map(item => Number(item[idField])));
}

/**
 * Generate next sequential ID
 */
export function getNextId<T extends { [key: string]: any }>(
    items: T[],
    idField: keyof T
): number {
    return getMaxId(items, idField) + 1;
}
