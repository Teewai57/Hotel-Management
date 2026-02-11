import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

async function readJson(filename: string) {
    const filePath = path.join(DATA_DIR, filename);
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

export async function GET() {
    try {
        const roomTypes = await readJson('room_types.json');
        return NextResponse.json(roomTypes);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch room types' }, { status: 500 });
    }
}
