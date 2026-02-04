import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDir(dirPath: string): Promise<void> {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function seedUsers() {
    const filePath = path.join(DATA_DIR, 'users.json');

    // Hash the default password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const users = [
        {
            user_id: 1,
            username: 'admin',
            password: hashedPassword,
            role: 'Admin'
        }
    ];

    await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf-8');
    console.log('✓ Created users.json with default admin user');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('  ⚠ IMPORTANT: Change the admin password after first login!');
}

async function seedPayments() {
    const filePath = path.join(DATA_DIR, 'payments.json');

    const payments = [
        {
            payment_id: 1,
            booking_id: 1,
            amount: 450.00,
            method: 'Credit Card',
            payment_date: '2023-08-12T14:30:00'
        },
        {
            payment_id: 2,
            booking_id: 2,
            amount: 300.00,
            method: 'Cash',
            payment_date: '2023-08-12T15:00:00'
        }
    ];

    await fs.writeFile(filePath, JSON.stringify(payments, null, 2), 'utf-8');
    console.log('✓ Created payments.json with sample data');
}

async function ensureDataFiles() {
    const files = [
        { name: 'guests.json', seed: null },
        { name: 'rooms.json', seed: null },
        { name: 'room_types.json', seed: null },
        { name: 'bookings.json', seed: null },
        { name: 'payments.json', seed: seedPayments },
        { name: 'users.json', seed: seedUsers }
    ];

    for (const file of files) {
        const filePath = path.join(DATA_DIR, file.name);
        const exists = await fileExists(filePath);

        if (!exists) {
            if (file.seed) {
                await file.seed();
            } else {
                await fs.writeFile(filePath, '[]', 'utf-8');
                console.log(`✓ Created empty ${file.name}`);
            }
        } else {
            console.log(`⚠ ${file.name} already exists, skipping`);
        }
    }
}

async function main() {
    console.log('Starting data seeding process...\n');

    await ensureDir(DATA_DIR);
    await ensureDataFiles();

    console.log('\n✅ Seeding complete!');
}

main().catch(error => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
});
