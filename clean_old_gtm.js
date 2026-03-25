const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/VICTOR/Downloads/telha2';
const files = ['index.html', 'ce/index.html', 'pb/index.html', 'rn/index.html', 'al/index.html'];

const iifeRegex = /\(\s*function\s*\(w,\s*d,\s*s,\s*l,\s*i\s*\)[\s\S]*?'GTM-PFDP9QHR'\s*\)\s*;/gi;
const noscriptRegex = /<noscript(?:[^>]*)>[\s\S]*?id=GTM-PFDP9QHR[\s\S]*?<\/noscript>/gi;
const noscriptEscapedRegex = /<noscript(?:[^>]*)>[\s\S]*?id=GTM-PFDP9QHR[\s\S]*?<\\\/noscript>/gi;
const trackingIdRegex = /trackingId:\s*['"]GTM-PFDP9QHR['"]/gi;
const rawStringRegex = /GTM-PFDP9QHR/g;

for (const file of files) {
    const target = path.join(baseDir, file);
    if (!fs.existsSync(target)) continue;
    let html = fs.readFileSync(target, 'utf8');

    html = html.replace(iifeRegex, '');
    html = html.replace(noscriptRegex, '');
    html = html.replace(noscriptEscapedRegex, '');
    html = html.replace(trackingIdRegex, "trackingId: ''");
    // Any residual raw strings inside Wix hydrating chunks will point to a disabled tag
    html = html.replace(rawStringRegex, 'GTM-DISABLED');

    fs.writeFileSync(target, html);
    console.log('Cleaned', file);
}
console.log('Done.');
