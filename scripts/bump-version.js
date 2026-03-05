import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

const pkgPath = resolve(dirname(fileURLToPath(import.meta.url)), '../package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))

const [major, minor, patch] = pkg.version.split('.').map(Number)
pkg.version = `${major}.${minor}.${patch + 1}`

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
console.log(`Version → ${pkg.version}`)
