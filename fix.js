const fs = require('fs');

const files = ['js/pages/admin/sections.js', 'js/pages/student/dashboard.js'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\\`/g, '`');
    content = content.replace(/\\\$/g, '$');
    fs.writeFileSync(file, content);
    console.log('Fixed ' + file);
});
