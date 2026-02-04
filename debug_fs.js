const fs = require('fs').promises;
const path = require('path');

console.log('CWD:', process.cwd());
const DATA_DIR = path.join(process.cwd(), 'data');
console.log('DATA_DIR:', DATA_DIR);

async function readJson(filename) {
    const filePath = path.join(DATA_DIR, filename);
    console.log('Reading:', filePath);
    try {
        await fs.access(DATA_DIR);
        console.log('Dir exists');
    } catch (e) {
        console.log('Dir does not exist, creating...');
    }

    try {
        const data = await fs.readFile(filePath, 'utf-8');
        console.log('Success, content length:', data.length);
    } catch (error) {
        console.error('Error reading file:', error);
    }
}

readJson('guests.json');
