const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/VICTOR/Downloads/telha2';
process.chdir(baseDir);

try {
    execSync('git checkout -- index.html', { stdio: 'inherit' });
    console.log('1. Restored index.html via git checkout');
} catch (e) {
    console.log('Failed to git checkout', e);
}

let html = fs.readFileSync('index.html', 'utf8');

const headStr = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PFDP9QHR');</script>
<!-- End Google Tag Manager -->`;

const bodyStr = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PFDP9QHR"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

const originalLen = html.length;

// Using precise regex replacement bounded tightly to avoid eating other tags
const headRegex = /<!--\s*Google Tag Manager\s*-->[\s\S]{0,500}?<script>[\s\S]{0,500}?GTM-PFDP9QHR'\);<\/script>\s*<!--\s*End Google Tag Manager\s*-->/gi;
const bodyRegex = /<!--\s*Google Tag Manager \(noscript\)\s*-->[\s\S]{0,500}?<noscript><iframe[\s\S]{0,200}?GTM-PFDP9QHR"[\s\S]{0,200}?<\/noscript>\s*<!--\s*End Google Tag Manager \(noscript\)\s*-->/gi;

html = html.replace(headRegex, '');
html = html.replace(bodyRegex, '');

console.log('Length diff after exact removal:', originalLen - html.length);
fs.writeFileSync('index.html', html, 'utf8');

console.log('2. Regenerating multipage variants');
try {
    execSync('node c:/Users/VICTOR/AppData/Local/Temp/telha_multipage.js', { stdio: 'inherit' });
} catch (e) {
    console.log('Error during telha_multipage.js', e);
}

console.log('3. Injecting new GTM');
try {
    execSync('node inject_gtm.js', { stdio: 'inherit' });
} catch (e) {
    console.log('Error injecting new GTM', e);
}

console.log('Done fixing site.');
