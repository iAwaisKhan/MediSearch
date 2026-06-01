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

  // Fix import ctrl from ... to import * as ctrl from ...
  content = content.replace(/import\s+ctrl\s+from\s+(['"][^'"]+['"])/g, 'import * as ctrl from $1');
  content = content.replace(/import\s+aiService\s+from\s+(['"][^'"]+['"])/g, 'import * as aiService from $1');
  content = content.replace(/import\s+cacheService\s+from\s+(['"][^'"]+['"])/g, 'import * as cacheService from $1');

  // Fix implicit any
  content = content.replace(/\(req, res, next\)/g, '(req: any, res: any, next: any)');
  content = content.replace(/\(req, _res, next\)/g, '(req: any, _res: any, next: any)');
  content = content.replace(/\(_req, res, next\)/g, '(_req: any, res: any, next: any)');
  content = content.replace(/\(req, res\)/g, '(req: any, res: any)');
  content = content.replace(/\(_req, res\)/g, '(_req: any, res: any)');
  content = content.replace(/\(err, req, res, next\)/g, '(err: any, req: any, res: any, next: any)');
  content = content.replace(/\(err, _req, res, _next\)/g, '(err: any, _req: any, res: any, _next: any)');

  content = content.replace(/catch\s*\(\s*err\s*\)/g, 'catch (err: any)');
  content = content.replace(/catch\s*\(\s*error\s*\)/g, 'catch (error: any)');

  if (file.endsWith('catchAsync.ts')) {
    content = content.replace(/fn\s*=>/g, '(fn: any) =>');
  }

  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
  }
});
