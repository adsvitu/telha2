const { execSync } = require('child_process');
const fs = require('fs');

const baseDir = 'c:/Users/VICTOR/Downloads/telha2';
process.chdir(baseDir);

let html = fs.readFileSync('index.html', 'utf8');

// Eliminate local cached GTM scripts downloaded by site exporter
html = html.replace(/<script[^>]*src="js\/gtm\.js"[^>]*><\/script>/gi, '');

// Disable the exact GT-KFHTGBL old tag instance inline
html = html.replace(/GT-KFHTGBL/g, 'GT-DISABLED');

// Remember from last turn, we had already replaced GTM-PFDP9QHR with GTM-5X6D3NV5 in hydration.
// We just want to make sure it's purged.
fs.writeFileSync('index.html', html, 'utf8');
console.log('Purged old local JS artifacts and GT-KFHTGBL');

try {
    execSync('node c:/Users/VICTOR/AppData/Local/Temp/telha_multipage.js', { stdio: 'inherit' });
    console.log('Regenerated sub-pages');
} catch (e) {
    console.log('Failed multipage generation', e);
}

// Re-inject the new manual code to ensure it connects directly to Google, rather than relying on a broken HTTrack local file
try {
    execSync('node inject_gtm.js', { stdio: 'inherit' });
    console.log('Re-injected live Google servers GTM code');
} catch (e) {
    console.log('Failed GTM injection', e);
}

console.log('Cleanup complete!');
