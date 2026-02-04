const fs = require('fs');

fetch('http://localhost:3000/api/guests')
    .then(res => res.text())
    .then(text => {
        console.log('Status:', 200); // Wait, I should check res.status
        fs.writeFileSync('error.html', text);
        console.log('Saved to error.html');
    })
    .catch(err => console.error(err));

fetch('http://localhost:3000/api/test')
    .then(res => res.json())
    .then(data => console.log('Test API:', data))
    .catch(err => console.error('Test API error:', err));
