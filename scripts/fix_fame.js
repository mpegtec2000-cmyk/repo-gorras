const fs = require('fs');

// The 4 Fame Club individual caps
const fameCaps = [
  {
    title: 'Gorra Fame Club x Samantha Universe Tiffany',
    handle: 'gorra-fame-club-x-samantha-universe-tiffany-1',
    url: 'https://drop-shop.mx/products/gorra-fame-club-x-samantha-universe-tiffany-1',
    vendor: 'FAME CLUB'
  },
  {
    title: 'Gorra Fame Club x Samantha Universe Pink',
    handle: 'gorra-fame-club-x-samantha-universe-pink',
    url: 'https://drop-shop.mx/products/gorra-fame-club-x-samantha-universe-pink',
    vendor: 'FAME CLUB'
  },
  {
    title: 'Gorra Fame Club x Samantha Universe Black',
    handle: 'gorra-fame-club-x-samantha-universe-tiffany',
    url: 'https://drop-shop.mx/products/gorra-fame-club-x-samantha-universe-tiffany',
    vendor: 'FAME CLUB'
  },
  {
    title: 'Gorra Fame Club x Samantha Blessed',
    handle: 'gorra-fame-club-flashes-copia',
    url: 'https://drop-shop.mx/products/gorra-fame-club-flashes-copia',
    vendor: 'FAME CLUB'
  }
];

const raw = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8')).urls;

// Keep everything except Fame Club
const clean = raw.filter(r => !r.vendor.toLowerCase().includes('fame') && !r.title.toLowerCase().includes('fame'));

// Add the 4 Fame Club
fameCaps.forEach(fc => clean.push(fc));

fs.writeFileSync('D:/GORROS/scripts/user_urls.json', JSON.stringify({ urls: clean }, null, 2));
