const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'web-ext-artifacts');
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.zip')) {
        const src = path.join(dir, file);
        const dest = path.join(dir, file.replace('.zip', '.xpi'));
        fs.renameSync(src, dest);
        console.log(`Renamed ${file} to ${path.basename(dest)}`);
    }
});
