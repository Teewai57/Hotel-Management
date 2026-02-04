import { z } from 'zod';

// Guest validation schemas
export const createGuestSchema = z.object({
    full_name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    phone: z.string().optional(),
    email: z.union([z.string().email('Invalid email format'), z.string().length(0)]).optional(),
    address: z.string().min(1, 'Address is required').max(200, 'Address is too long')
});

export const updateGuestSchema = createGuestSchema.partial();

// Room validation schemas
export const createRoomSchema = z.object({
    room_number: z.string().min(1, 'Room number is required'),
    room_type_id: z.number().int().positive('Invalid room type ID'),
    status: z.enum(['Available', 'Occupied', 'Maintenance'])
});

export const updateRoomSchema = createRoomSchema.partial();

// Room Type validation schemas
export const createRoomTypeSchema = z.object({
    type_name: z.string().min(1, 'Type name is required').max(50, 'Type name is too long'),
    price: z.number().positive('Price must be positive')
});

export const updateRoomTypeSchema = createRoomTypeSchema.partial();

// Booking validation schemas
// Booking validation schemas
const baseBookingSchema = z.object({
    guest_id: z.number().int().positive('Invalid guest ID'),
    room_id: z.number().int().positive('Invalid room ID'),
    check_in_date: z.string().datetime('Invalid check-in date format'),
    check_out_date: z.string().datetime('Invalid check-out date format'),
    status: z.enum(['Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled']).optional()
});

export const createBookingSchema = baseBookingSchema.refine(
    (data) => new Date(data.check_in_date) < new Date(data.check_out_date),
    {
        message: 'Check-out date must be after check-in date',
        path: ['check_out_date']
    }
);

export const updateBookingSchema = baseBookingSchema.partial();

// Payment validation schemas
export const createPaymentSchema = z.object({
    booking_id: z.number().int().positive('Invalid booking ID'),
    amount: z.number().positive('Amount must be positive'),
    method: z.enum(['Cash', 'Credit Card', 'Debit Card', 'Online']),
    payment_date: z.string().datetime('Invalid payment date format')
});

export const updatePaymentSchema = createPaymentSchema.partial();

// User validation schemas
export const createUserSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username is too long'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['Admin', 'Receptionist', 'Manager'])
});

export const updateUserSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username is too long').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    role: z.enum(['Admin', 'Receptionist', 'Manager']).optional()
});

export const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required')
});

// Type exports for TypeScript
export type CreateGuestInput = z.infer<typeof createGuestSchema>;
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type CreateRoomTypeInput = z.infer<typeof createRoomTypeSchema>;
export type UpdateRoomTypeInput = z.infer<typeof updateRoomTypeSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
