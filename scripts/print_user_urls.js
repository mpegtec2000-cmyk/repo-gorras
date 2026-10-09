const fs = require('fs');

const urls = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8')).urls;

console.log('=== LISTADO COMPLETO DE URLs REGISTRADAS ===');
urls.forEach((u, i) => {
  console.log(`${i + 1}. [${u.vendor}] ${u.title}`);
  console.log(`   ${u.url}`);
});
