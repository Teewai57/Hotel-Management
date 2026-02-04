export interface Guest {
    guest_id: number;
    full_name: string;
    phone: string;
    email: string;
    address: string;
}

export interface Room {
    room_id: number;
    room_number: string;
    room_type_id: number;
    status: 'Available' | 'Occupied' | 'Maintenance';
}

export interface RoomType {
    room_type_id: number;
    type_name: string;
    price: number;
}

export interface Booking {
    booking_id: number;
    guest_id: number;
    room_id: number;
    check_in_date: string;
    check_out_date: string;
    status: 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';
}

export interface Payment {
    payment_id: number;
    booking_id: number;
    amount: number;
    method: 'Cash' | 'Credit Card' | 'Debit Card' | 'Online';
    payment_date: string;
}

export interface User {
    user_id: number;
    username: string;
    password?: string; // Optional for when sending to client
    role: 'Admin' | 'Receptionist' | 'Manager';
}

// Composite type for the frontend table display
export interface GuestDisplay {
    id: number; // usually booking_id or guest_id depending on view. Let's use booking_id as primary key for the table rows
    guest_id: number;
    name: string;
    email: string; // Added field
    phone: string; // Added field
    address: string; // Added field
    avatar: string;
    checkIn: string;
    checkInISO?: string; // For editing
    checkOut: string;
    checkOutISO?: string; // For editing
    room: string;
    room2: string;
    status: Booking['status'];
}
