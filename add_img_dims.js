const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function decodeHTMLEntities(text) {
  return text.replace(/&eacute;/g, 'é').replace(/&ccedil;/g, 'ç').replace(/&atilde;/g, 'ã').replace(/&iacute;/g, 'í');
}

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.endsWith('.html')) results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk(__dirname, async function(err, results) {
  if (err) throw err;
  let count = 0;
  
  for (const file of results) {
    let content = fs.readFileSync(file, 'utf8');
    const imgRegex = /<img([^>]+)>/g;
    let changed = false;
    
    // We can't do async inside String.replace, so we'll match all tags, get their dimensions, then replace.
    const tags = [];
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      tags.push({ full: match[0], attrs: match[1] });
    }
    
    for (const tag of tags) {
      if (tag.attrs.includes('width=') || tag.attrs.includes('height=')) {
        continue;
      }
      const srcMatch = tag.attrs.match(/src="([^"]+)"/);
      if (!srcMatch) continue;
      
      let src = srcMatch[1];
      if (src.startsWith('http://') || src.startsWith('https://')) continue;
      
      src = src.replace(/^\/+/, '');
      src = decodeHTMLEntities(src);
      
      let imgPath = path.join(__dirname, src);
      if (fs.existsSync(imgPath)) {
        try {
          const metadata = await sharp(imgPath).metadata();
          if (metadata && metadata.width && metadata.height) {
            const newTag = `<img${tag.attrs} width="${metadata.width}" height="${metadata.height}">`;
            content = content.replace(tag.full, newTag);
            changed = true;
          }
        } catch(e) {}
      }
    }

    if (changed) {
      fs.writeFileSync(file, content, 'utf8');
      console.log('Updated image dimensions in: ' + file);
      count++;
    }
  }
  console.log('Total files updated: ' + count);
});
