const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8')).urls;

const fame4 = [
  {
    handle: 'gorra-fame-club-flashes-copia',
    title: 'Gorra Fame Club x Samantha Blessed',
    vendor: 'FAME CLUB'
  },
  {
    handle: 'gorra-fame-club-x-samantha-universe-tiffany-1',
    title: 'Gorra Fame Club x Samantha Universe Tiffany',
    vendor: 'FAME CLUB'
  },
  {
    handle: 'gorra-fame-club-x-samantha-universe-pink',
    title: 'Gorra Fame Club x Samantha Universe Pink',
    vendor: 'FAME CLUB'
  },
  {
    handle: 'gorra-fame-club-x-samantha-universe-tiffany',
    title: 'Gorra Fame Club x Samantha Universe Black',
    vendor: 'FAME CLUB'
  }
];

fame4.forEach(f => {
  const exists = raw.some(u => u.handle === f.handle || u.url.includes(f.handle));
  if (!exists) {
    raw.push({
      id: raw.length + 1,
      url: `https://drop-shop.mx/products/${f.handle}`,
      handle: f.handle,
      title: f.title,
      vendor: f.vendor
    });
  }
});

fs.writeFileSync('D:/GORROS/scripts/user_urls.json', JSON.stringify({ urls: raw }, null, 2));
