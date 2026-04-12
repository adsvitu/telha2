const fs = require('fs');
const path = require('path');

const files = [
  'al/index.html',
  'ce/index.html',
  'pb/index.html',
  'rn/index.html'
];

const replacements = [
  { from: /Ã­/g, to: 'í' },
  { from: /Ã¡/g, to: 'á' },
  { from: /Ã£/g, to: 'ã' },
  { from: /Ã§/g, to: 'ç' },
  { from: /Ãª/g, to: 'ê' },
  { from: /Ã³/g, to: 'ó' },
  { from: /Ã©/g, to: 'é' },
  { from: /Ãº/g, to: 'ú' },
  { from: /Ã€/g, to: 'À' },
  { from: /Ã‚/g, to: 'Â' },
  { from: /Ã /g, to: 'à' },
  { from: /Ãµ/g, to: 'õ' },
  { from: /Ã¹/g, to: 'ù' },
  { from: /Ã‰/g, to: 'É' },
  { from: /Ã“/g, to: 'Ó' },
  { from: /Ã‡/g, to: 'Ç' },
  { from: /Ã€/g, to: 'À' },
  { from: /â€”/g, to: '—' },
  { from: /ðŸ“ž/g, to: '📞' },
  { from: /ðŸ“ /g, to: '📍' },
  { from: /ðŸ”¥/g, to: '🔥' },
  { from: /âœ“/g, to: '✓' }
];

const baseDir = 'C:/Users/VICTOR/OneDrive/Área de Trabalho/IAS/clients/telha2';

files.forEach(file => {
  const fullPath = path.join(baseDir, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'binary'); // Read as binary to capture raw bytes
    
    // Attempt to convert from binary to utf-8 if it was saved as win-1252
    // Or just do string replacements on the already-corrupted-but-read-as-utf8 string
    content = fs.readFileSync(fullPath, 'utf8');
    
    let newContent = content;
    replacements.forEach(rep => {
      newContent = newContent.replace(rep.from, rep.to);
    });

    if (content !== newContent) {
      fs.writeFileSync(fullPath, newContent, 'utf8');
      console.log(`Fixed: ${file}`);
    } else {
      console.log(`No changes needed for: ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});
