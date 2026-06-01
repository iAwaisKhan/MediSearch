const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!dirFile.includes('node_modules')) {
        filelist = walkSync(dirFile, filelist);
      }
    } else if (dirFile.endsWith('.ts')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync(__dirname);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Remove "use strict";
  content = content.replace(/^"use strict";\r?\n/gm, '');
  
  // Remove trailing export {};
  content = content.replace(/^export\s*\{\s*\}\s*;\r?\n/gm, '');

  // const x = require('y'); -> import x from 'y';
  content = content.replace(/const\s+([a-zA-Z0-9_]+)\s*=\s*require\((['"`][^'"`]+['"`])\);/g, 'import $1 from $2;');
  
  // const { x, y } = require('z'); -> import { x, y } from 'z';
  content = content.replace(/const\s+\{\s*([^}]+)\s*\}\s*=\s*require\((['"`][^'"`]+['"`])\);/g, 'import { $1 } from $2;');
  
  // module.exports = x; -> export default x;
  content = content.replace(/module\.exports\s*=\s*/g, 'export default ');
  
  // exports.x = y; -> export const x = y; (only at start of lines, not inside functions)
  content = content.replace(/^exports\.([a-zA-Z0-9_]+)\s*=\s*/gm, 'export const $1 = ');

  // Require without assignment (e.g. require("dotenv").config())
  // This is a bit tricky, we can change require("dotenv").config() to import dotenv from "dotenv"; dotenv.config();
  // For now, let's leave naked requires alone or manually fix them.

  if (original !== content) {
    fs.writeFileSync(file, content.trim() + '\n', 'utf8');
    console.log(`Migrated ${file}`);
  }
});
