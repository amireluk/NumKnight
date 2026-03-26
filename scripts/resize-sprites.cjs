/**
 * Halves the resolution of all character sprites (knight + enemies).
 * Backgrounds are left untouched — they're already being upscaled on Retina
 * and halving would make them visibly soft.
 *
 * Run once: node scripts/resize-sprites.js
 */

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const CHARS_DIR = path.join(__dirname, '../public/assets/characters')

async function resizeFile(filePath) {
  const meta = await sharp(filePath).metadata()
  const newW = Math.round(meta.width / 2)
  const newH = Math.round(meta.height / 2)

  const tmp = filePath + '.tmp.webp'
  await sharp(filePath)
    .resize(newW, newH)
    .webp({ quality: 90, effort: 6 })
    .toFile(tmp)

  const before = fs.statSync(filePath).size
  const after  = fs.statSync(tmp).size
  fs.renameSync(tmp, filePath)

  const pct = Math.round((1 - after / before) * 100)
  console.log(`  ${path.basename(filePath)}: ${meta.width}x${meta.height} → ${newW}x${newH}  ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB  (-${pct}%)`)
}

async function main() {
  const files = fs.readdirSync(CHARS_DIR, { recursive: true, withFileTypes: true })
    .filter(e => e.isFile() && e.name.endsWith('.webp'))
    .map(e => path.join(e.parentPath ?? e.path, e.name))

  console.log(`Resizing ${files.length} character sprites…\n`)
  let totalBefore = 0, totalAfter = 0

  for (const f of files) {
    const before = fs.statSync(f).size
    await resizeFile(f)
    const after = fs.statSync(f).size
    totalBefore += before
    totalAfter  += after
  }

  console.log(`\nTotal: ${(totalBefore/1024).toFixed(0)}KB → ${(totalAfter/1024).toFixed(0)}KB  (-${Math.round((1 - totalAfter/totalBefore)*100)}%)`)
}

main().catch(err => { console.error(err); process.exit(1) })
