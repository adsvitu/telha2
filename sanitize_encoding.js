const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'al/index.html',
  'ce/index.html',
  'pb/index.html',
  'rn/index.html'
];

const replacements = [
  // Acentos Comuns
  { from: /í/g, to: '&iacute;' },
  { from: /í/g, to: '&iacute;' },
  { from: /Ã­/g, to: '&iacute;' },
  
  { from: /ã/g, to: '&atilde;' },
  { from: /Ã£/g, to: '&atilde;' },
  
  { from: /á/g, to: '&aacute;' },
  { from: /Ã¡/g, to: '&aacute;' },
  
  { from: /ó/g, to: '&oacute;' },
  { from: /Ã³/g, to: '&oacute;' },
  
  { from: /ú/g, to: '&uacute;' },
  { from: /Ãº/g, to: '&uacute;' },
  
  { from: /ê/g, to: '&ecirc;' },
  { from: /Ãª/g, to: '&ecirc;' },
  
  { from: /é/g, to: '&eacute;' },
  { from: /Ã©/g, to: '&eacute;' },
  
  { from: /ç/g, to: '&ccedil;' },
  { from: /Ã§/g, to: '&ccedil;' },
  
  { from: /õ/g, to: '&otilde;' },
  { from: /Ãµ/g, to: '&otilde;' },
  
  { from: /Í/g, to: '&Iacute;' },
  { from: /Á/g, to: '&Aacute;' },
  { from: /À/g, to: '&Agrave;' },
  { from: /Â/g, to: '&Acirc;' },
  
  // Símbolos
  { from: /—/g, to: '&mdash;' },
  { from: /â€”/g, to: '&mdash;' },
  { from: /â€“/g, to: '&ndash;' },
  { from: /©/g, to: '&copy;' },
  { from: /Â©/g, to: '&copy;' },
  { from: /®/g, to: '&reg;' },
  { from: /Â®/g, to: '&reg;' },
  
  // Mojibakes de Emojis que sobraram
  { from: /ðŸ“ž/g, to: '&#128222;' }, // 📞
  { from: /ðŸ“ /g, to: '&#128205;' }, // 📍
  { from: /ðŸ”¥/g, to: '&#128293;' }, // 🔥
  { from: /📞/g, to: '&#128222;' },
  { from: /📍/g, to: '&#128205;' },
  { from: /🔥/g, to: '&#128293;' },
  { from: /✓/g, to: '&#10003;' },
  { from: /âœ✓/g, to: '&#10003;' }
];

const baseDir = 'C:/Users/VICTOR/IAS/clients/telha2';

files.forEach(file => {
  const fullPath = path.join(baseDir, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    let newContent = content;
    replacements.forEach(rep => {
      newContent = newContent.replace(rep.from, rep.to);
    });

    // Forçar a meta tag se não houver ou se estiver errada
    if (!newContent.includes('<meta charset="UTF-8">')) {
       newContent = newContent.replace('<head>', '<head>\n  <meta charset="UTF-8">');
    }

    fs.writeFileSync(fullPath, newContent, 'utf8');
    console.log(`Sanitized: ${file}`);
  }
});

// Agora o main.js para usar unicode escapes nos nomes de estados
const mainJsPath = path.join(baseDir, 'main.js');
if (fs.existsSync(mainJsPath)) {
    let content = fs.readFileSync(mainJsPath, 'utf8');
    const stateReplacements = [
        { name: "São Paulo", escape: "S\u00E3o Paulo" },
        { name: "Minas Gerais", escape: "Minas Gerais" },
        { name: "Paraná", escape: "Paran\u00E1" },
        { name: "Paraíba", escape: "Para\u00EDba" },
        { name: "Ceará", escape: "Cear\u00E1" },
        { name: "Piauí", escape: "Piau\u00ED" },
        { name: "Pará", escape: "Par\u00E1" },
        { name: "Maranhão", escape: "Maranh\u00E3o" },
        { name: "Goiás", escape: "Goi\u00E1s" },
        { name: "Rondônia", escape: "Rond\u00F4nia" }
    ];
    
    // Simplificando: vamos apenas converter o objeto DDD_MAP no arquivo JS se encontrarmos
    // Na verdade, o próprio Node pode fazer a conversão se lermos em utf8 e escrevermos
    // Mas para ser 100% blindado, vamos injetar caracteres Unicode
    
    content = content.replace(/11:"São Paulo"/g, '11:"S\\u00E3o Paulo"');
    content = content.replace(/41:"Paraná"/g, '41:"Paran\\u00E1"');
    content = content.replace(/83:"Paraíba"/g, '83:"Para\\u00EDba"');
    content = content.replace(/85:"Ceará"/g, '85:"Cear\\u00E1"');
    content = content.replace(/86:"Piauí"/g, '86:"Piau\\u00ED"');
    content = content.replace(/91:"Pará"/g, '91:"Par\\u00E1"');
    content = content.replace(/98:"Maranhão"/g, '98:"Maranh\\u00E3o"');
    content = content.replace(/62:"Goiás"/g, '62:"Goi\\u00E1s"');
    content = content.replace(/69:"Rondônia"/g, '69:"Rond\\u00F4nia"');
    
    fs.writeFileSync(mainJsPath, content, 'utf8');
    console.log(`Sanitized: main.js`);
}
