const fs = require('fs');
let html = fs.readFileSync('c:/Users/VICTOR/Downloads/telha2/index.html', 'utf8');

const iifeRegex = /\(\s*function\s*\(w,\s*d,\s*s,\s*l,\s*i\s*\)[\s\S]*?'GTM-PFDP9QHR'\s*\)\s*;/gi;
const match = html.match(iifeRegex);
console.log("Found IIFE Matches:", match ? match.length : 0);

const noscriptRegex = /<noscript[^>]*>[\s\S]*?id=GTM-PFDP9QHR[\s\S]*?<\/noscript>/gi;
const noscriptEscapedRegex = /<noscript[^>]*>[\s\S]*?id=GTM-PFDP9QHR[\s\S]*?<\\\/noscript>/gi;
const nsMatch1 = html.match(noscriptRegex);
const nsMatch2 = html.match(noscriptEscapedRegex);
console.log("Found Noscript Matches:", (nsMatch1 ? nsMatch1.length : 0) + (nsMatch2 ? nsMatch2.length : 0));
