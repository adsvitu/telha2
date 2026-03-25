const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/VICTOR/Downloads/telha2';
const filesToUpdate = [
    'index.html',
    'ce/index.html',
    'pb/index.html',
    'rn/index.html',
    'al/index.html'
];

const gtmHead = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5X6D3NV5');</script>
<!-- End Google Tag Manager -->`;

const gtmBody = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5X6D3NV5"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

for (const file of filesToUpdate) {
    const filePath = path.join(baseDir, file);
    if (!fs.existsSync(filePath)) {
        console.log('File not found:', filePath);
        continue;
    }
    let html = fs.readFileSync(filePath, 'utf8');

    if (!html.includes('GTM-5X6D3NV5')) {
        // Inject at the top of <head>
        html = html.replace(/(<head[^>]*>)/i, '$1\n' + gtmHead + '\n');
        
        // Inject at the top of <body>
        html = html.replace(/(<body[^>]*>)/i, '$1\n' + gtmBody + '\n');
        
        fs.writeFileSync(filePath, html, 'utf8');
        console.log('Injected GTM into', file);
    } else {
        console.log('GTM already present in', file);
    }
}
console.log('Done.');
