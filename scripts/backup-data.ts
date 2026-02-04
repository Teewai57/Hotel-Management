import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), 'backups');
const MAX_BACKUPS = parseInt(process.env.MAX_BACKUPS || '10');

async function ensureDir(dirPath: string): Promise<void> {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

async function backupFile(filename: string): Promise<void> {
    const sourcePath = path.join(DATA_DIR, filename);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `${filename}.${timestamp}.bak`);

    try {
        await fs.copyFile(sourcePath, backupPath);
        console.log(`✓ Backed up ${filename}`);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.log(`⚠ Skipped ${filename} (file not found)`);
        } else {
            throw error;
        }
    }
}

async function cleanOldBackups(filename: string): Promise<void> {
    const files = await fs.readdir(BACKUP_DIR);
    const backupFiles = files
        .filter(f => f.startsWith(filename))
        .map(f => ({
            name: f,
            path: path.join(BACKUP_DIR, f),
            time: f.split('.').slice(-2, -1)[0] // Extract timestamp
        }))
        .sort((a, b) => b.time.localeCompare(a.time)); // Sort by timestamp descending

    // Keep only MAX_BACKUPS most recent backups
    const toDelete = backupFiles.slice(MAX_BACKUPS);

    for (const file of toDelete) {
        await fs.unlink(file.path);
        console.log(`🗑 Deleted old backup: ${file.name}`);
    }
}

async function main() {
    console.log('Starting backup process...\n');

    await ensureDir(BACKUP_DIR);

    const dataFiles = [
        'guests.json',
        'rooms.json',
        'room_types.json',
        'bookings.json',
        'payments.json',
        'users.json'
    ];

    for (const file of dataFiles) {
        await backupFile(file);
        await cleanOldBackups(file);
    }

    console.log(`\n✅ Backup complete! Files saved to: ${BACKUP_DIR}`);
}

main().catch(error => {
    console.error('❌ Backup failed:', error);
    process.exit(1);
});
