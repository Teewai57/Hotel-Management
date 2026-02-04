import fs from 'fs/promises';
import path from 'path';
import { Guest, Room, RoomType, Booking, Payment, User } from '@/src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), 'backups');

/**
 * Ensure directory exists
 */
async function ensureDir(dirPath: string): Promise<void> {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

/**
 * Create a backup of a file before modifying it
 */
async function createBackup(filename: string): Promise<void> {
    try {
        await ensureDir(BACKUP_DIR);
        const sourcePath = path.join(DATA_DIR, filename);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(BACKUP_DIR, `${filename}.${timestamp}.bak`);

        try {
            await fs.copyFile(sourcePath, backupPath);
        } catch (error: any) {
            // If source file doesn't exist, skip backup
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    } catch (error) {
        console.error(`Failed to create backup for ${filename}:`, error);
        // Don't throw - backup failure shouldn't prevent writes
    }
}

/**
 * Read JSON file with error handling
 */
async function readJson<T>(filename: string): Promise<T[]> {
    const filePath = path.join(DATA_DIR, filename);
    try {
        await ensureDir(DATA_DIR);
        const data = await fs.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(data);

        if (!Array.isArray(parsed)) {
            console.error(`Invalid data format in ${filename}: expected array`);
            return [];
        }

        return parsed as T[];
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            // If file doesn't exist, create it with empty array
            await fs.writeFile(filePath, '[]', 'utf-8');
            return [];
        }

        if (error instanceof SyntaxError) {
            console.error(`Invalid JSON in ${filename}:`, error);
            // Return empty array for corrupted files
            return [];
        }

        console.error(`Unexpected error reading ${filename} from ${filePath}:`, error);
        throw error;
    }
}

/**
 * Write JSON file atomically with backup
 */
async function writeJson<T>(filename: string, data: T[]): Promise<void> {
    await ensureDir(DATA_DIR);

    // Create backup before writing
    await createBackup(filename);

    const filePath = path.join(DATA_DIR, filename);
    const tempPath = `${filePath}.tmp`;

    try {
        // Write to temporary file first
        await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');

        // Atomically rename temp file to actual file
        await fs.rename(tempPath, filePath);
    } catch (error) {
        // Clean up temp file if it exists
        try {
            await fs.unlink(tempPath);
        } catch {
            // Ignore cleanup errors
        }
        throw error;
    }
}

// Guests
export const getGuests = () => readJson<Guest>('guests.json');
export const saveGuests = (guests: Guest[]) => writeJson('guests.json', guests);

// Rooms
export const getRooms = () => readJson<Room>('rooms.json');
export const saveRooms = (rooms: Room[]) => writeJson('rooms.json', rooms);

// Room Types
export const getRoomTypes = () => readJson<RoomType>('room_types.json');
export const saveRoomTypes = (types: RoomType[]) => writeJson('room_types.json', types);

// Bookings
export const getBookings = () => readJson<Booking>('bookings.json');
export const saveBookings = (bookings: Booking[]) => writeJson('bookings.json', bookings);

// Payments
export const getPayments = () => readJson<Payment>('payments.json');
export const savePayments = (payments: Payment[]) => writeJson('payments.json', payments);

// Users
export const getUsers = () => readJson<User>('users.json');
export const saveUsers = (users: User[]) => writeJson('users.json', users);

