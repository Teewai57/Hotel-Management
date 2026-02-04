import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

async function readJson(filename: string) {
    const filePath = path.join(DATA_DIR, filename);
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        console.error(`Failed to read ${filename}`, e);
        return [];
    }
}

async function writeJson(filename: string, data: any) {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function syncRooms() {
    console.log('Syncing room statuses...');

    // 1. Read Data
    const bookings = await readJson('bookings.json');
    const rooms = await readJson('rooms.json');

    if (!Array.isArray(bookings) || !Array.isArray(rooms)) {
        console.error('Invalid data format');
        return;
    }

    // 2. Identify Occupied Rooms (from 'CheckedIn' bookings)
    const occupiedRoomIds = new Set(
        bookings
            .filter((b: any) => b.status === 'CheckedIn')
            .map((b: any) => b.room_id)
    );

    console.log(`Found ${occupiedRoomIds.size} occupied rooms based on CheckedIn bookings.`);

    let validUpdateCount = 0;

    // 3. Update Rooms
    const updatedRooms = rooms.map((room: any) => {
        const isOccupied = occupiedRoomIds.has(room.room_id);
        const newStatus = isOccupied ? 'Occupied' : 'Available';

        // Preserve 'Maintenance' if needed? 
        // For now, the user wants to fix "Available" showing for occupied rooms.
        // We will strictly set to Occupied or Available to ensure sync.

        if (room.status !== newStatus) {
            console.log(`Room ${room.room_number}: ${room.status} -> ${newStatus}`);
            validUpdateCount++;
            return { ...room, status: newStatus };
        }
        return room;
    });

    if (validUpdateCount > 0) {
        await writeJson('rooms.json', updatedRooms);
        console.log(`Updated ${validUpdateCount} rooms.`);
    } else {
        console.log('All rooms are already in sync.');
    }
}

syncRooms().catch(console.error);
