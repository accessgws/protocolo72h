const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// SVG Icon definition
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e2024" />
      <stop offset="100%" stop-color="#0c0e12" />
    </linearGradient>
    <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffc174" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#f59e0b" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Background rounded canvas -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  <rect x="12" y="12" width="488" height="488" rx="100" fill="none" stroke="#282a2e" stroke-width="4"/>

  <!-- Tactical Shield outline -->
  <path d="M 256 64 
           L 404 124 
           C 404 280, 340 376, 256 436 
           C 172 376, 108 280, 108 124 
           Z" 
        fill="#14171c" 
        stroke="url(#amberGrad)" 
        stroke-width="14" 
        stroke-linejoin="round"
        filter="url(#glow)"/>

  <!-- Inner shield rim -->
  <path d="M 256 86 
           L 384 138 
           C 384 270, 330 354, 256 408 
           C 182 354, 128 270, 128 138 
           Z" 
        fill="#1a1c20" 
        stroke="#333539" 
        stroke-width="3" 
        stroke-linejoin="round"/>

  <!-- Emergency 72H Badge -->
  <g text-anchor="middle" font-family="'Oswald', Impact, Arial Black, sans-serif">
    <!-- Lightning bolt symbol -->
    <path d="M 264 120 L 232 204 L 270 204 L 244 280 L 292 192 L 254 192 Z" 
          fill="url(#amberGrad)"/>
    
    <text x="256" y="348" font-size="78" font-weight="800" fill="#f59e0b" letter-spacing="2">72H</text>
    <text x="256" y="382" font-family="'Inter', sans-serif" font-size="19" font-weight="700" fill="#e2e2e8" letter-spacing="6">PROTOCOLO</text>
  </g>

  <!-- Corner tactical accents -->
  <line x1="36" y1="56" x2="56" y2="36" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
  <line x1="476" y1="56" x2="456" y2="36" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
  <line x1="36" y1="456" x2="56" y2="476" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
  <line x1="476" y1="456" x2="456" y2="476" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
</svg>`;

// Write SVGs
fs.writeFileSync(path.join(__dirname, 'icons', 'icon.svg'), svgContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'icons', 'favicon.svg'), svgContent, 'utf8');

// CRC32 implementation for PNG chunks
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crcVal = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crcVal, 8 + len);
  return chunk;
}

function generateRasterPng(size) {
  // Generate a procedural tactical icon image
  const width = size;
  const height = size;
  const rowStride = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowStride);

  const cx = width / 2;
  const cy = height / 2;
  const rBg = width * 0.46;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowStride;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default dark background #111317
      let r = 0x11, g = 0x13, b = 0x17, a = 0xff;

      // Rounded box border
      const cornerR = width * 0.22;
      const nx = Math.abs(x - cx);
      const ny = Math.abs(y - cy);
      const bx = cx - cornerR;
      const by = cy - cornerR;

      let isInside = true;
      if (nx > bx && ny > by) {
        const cdist = Math.sqrt((nx - bx) ** 2 + (ny - by) ** 2);
        if (cdist > cornerR) isInside = false;
      }

      if (!isInside) {
        // Transparent outside rounded icon
        r = 0; g = 0; b = 0; a = 0;
      } else {
        // Shield geometry
        // Normalized coordinates in shield area
        const sx = (x - cx) / (width * 0.35);
        const sy = (y - (height * 0.48)) / (height * 0.38);

        // Shield curve approximation: top flat/tilted, sides vertical, bottom parabolic
        let inShield = false;
        if (sy > -0.9 && sy < 0.95 && Math.abs(sx) < 1.0) {
          if (sy < 0.2) {
            inShield = (Math.abs(sx) <= 0.9);
          } else {
            // tapered bottom
            const taper = 1.0 - Math.pow((sy - 0.2) / 0.75, 1.4);
            inShield = (Math.abs(sx) <= Math.max(0, taper));
          }
        }

        if (inShield) {
          // Inside shield
          r = 0x1e; g = 0x20; b = 0x24; // dark surface-container

          // Shield gold border
          const borderDist = Math.abs(sx) - (sy < 0.2 ? 0.8 : (1.0 - Math.pow(Math.max(0, sy - 0.2) / 0.75, 1.4) * 0.88));
          if (borderDist > -0.15 || sy < -0.78 || (sy > 0.8 && inShield)) {
            r = 0xf5; g = 0x9e; b = 0x0b; // amber
          } else {
            // Central Amber bolt / emblem
            if (Math.abs(dx) < width * 0.08 && Math.abs(dy + height * 0.08) < height * 0.14) {
              r = 0xff; g = 0xc1; b = 0x74;
            }
            // 72H text area glow
            if (dy > height * 0.08 && dy < height * 0.28 && Math.abs(dx) < width * 0.22) {
              r = 0xf5; g = 0x9e; b = 0x0b;
            }
          }
        } else {
          // Dark carbon textured background
          const grid = (x % 16 < 1 || y % 16 < 1) ? 0x16 : 0x11;
          r = grid; g = grid + 2; b = grid + 6;
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // Deflate IDAT data
  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter 0
  ihdrData[12] = 0; // Non-interlaced
  const ihdr = createChunk('IHDR', ihdrData);

  // IDAT
  const idat = createChunk('IDAT', compressed);

  // IEND
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

// Generate icons
fs.writeFileSync(path.join(__dirname, 'icons', 'icon-192.png'), generateRasterPng(192));
fs.writeFileSync(path.join(__dirname, 'icons', 'icon-512.png'), generateRasterPng(512));
fs.writeFileSync(path.join(__dirname, 'icons', 'apple-touch-icon.png'), generateRasterPng(180));
fs.writeFileSync(path.join(__dirname, 'icons', 'icon-maskable-192.png'), generateRasterPng(192));
fs.writeFileSync(path.join(__dirname, 'icons', 'icon-maskable-512.png'), generateRasterPng(512));

console.log('Icons generated successfully!');
