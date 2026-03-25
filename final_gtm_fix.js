const { execSync } = require('child_process');
const fs = require('fs');

const baseDir = 'c:/Users/VICTOR/Downloads/telha2';
process.chdir(baseDir);

try {
    execSync('git checkout -- index.html', { stdio: 'inherit' });
    console.log('1. Restored clean index.html');
} catch (e) {
    console.log('Failed checkout', e);
}

let html = fs.readFileSync('index.html', 'utf8');

const headRegex = /<!--\s*Google Tag Manager\s*-->[\s\S]{0,500}?<script>[\s\S]{0,500}?GTM-PFDP9QHR'\);<\/script>\s*<!--\s*End Google Tag Manager\s*-->/gi;
const bodyRegex = /<!--\s*Google Tag Manager \(noscript\)\s*-->[\s\S]{0,500}?<noscript><iframe[\s\S]{0,200}?GTM-PFDP9QHR"[\s\S]{0,200}?<\/noscript>\s*<!--\s*End Google Tag Manager \(noscript\)\s*-->/gi;

let origLen = html.length;
html = html.replace(headRegex, '');
html = html.replace(bodyRegex, '');
console.log('2. Deleted explicit manual old HTML tags (chars removed):', origLen - html.length);

html = html.replace(/GTM-PFDP9QHR/g, 'GTM-5X6D3NV5');
console.log('3. Substituted old ID with the new GTM-5X6D3NV5 natively inside Wix structures.');

fs.writeFileSync('index.html', html, 'utf8');

try {
    execSync('node c:/Users/VICTOR/AppData/Local/Temp/telha_multipage.js', { stdio: 'inherit' });
    console.log('4. Regenerated ce, pb, rn, al variants.');
} catch (e) {
    console.log('Failed multipage generation', e);
}

console.log('\nAll done! The site now natively uses GTM-5X6D3NV5.');
