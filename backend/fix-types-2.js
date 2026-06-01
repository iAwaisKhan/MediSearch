const fs = require('fs');

const replaceInFile = (file, replacements) => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let orig = content;
  replacements.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });
  if (content !== orig) {
    fs.writeFileSync(file, content, 'utf8');
  }
};

// 1. authController.ts
replaceInFile('backend/controllers/authController.ts', [
  [/user\.matchPassword/g, '(user as any).matchPassword'],
  [/user\.lastLogin/g, '(user as any).lastLogin'],
  [/user\.password\s*=/g, '(user as any).password ='],
  [/user\.passwordChangedAt/g, '(user as any).passwordChangedAt']
]);

// 2. medicineController.ts
replaceInFile('backend/controllers/medicineController.ts', [
  [/import aiService from/g, 'import * as aiService from'],
  [/import cacheService from/g, 'import * as cacheService from']
]);

// 3. authMiddleware.ts
replaceInFile('backend/middleware/authMiddleware.ts', [
  [/jwt\.verify\(token, process\.env\.JWT_SECRET\)/g, 'jwt.verify(token, process.env.JWT_SECRET as string)'],
  [/user\.changedPasswordAfter/g, '(user as any).changedPasswordAfter'],
  [/\(\.\.\.roles\)/g, '(...roles: string[])']
]);

// 4. errorHandler.ts
replaceInFile('backend/middleware/errorHandler.ts', [
  [/const handleCastError = \(err\)/g, 'const handleCastError = (err: any)'],
  [/const handleDuplicateKey = \(err\)/g, 'const handleDuplicateKey = (err: any)']
]);

// 5. User.ts
replaceInFile('backend/models/User.ts', [
  [/enteredPassword\)/g, 'enteredPassword: any)'],
  [/jwtIat\)/g, 'jwtIat: any)'],
  [/process\.env\.JWT_SECRET/g, 'process.env.JWT_SECRET as string']
]);

// 6. ocrRoutes.ts
replaceInFile('backend/routes/ocrRoutes.ts', [
  [/cb\(new AppError\("Not an image! Please upload an image\.", 400\), false\);/g, 'cb(new AppError("Not an image! Please upload an image.", 400) as any, false);']
]);

// 7. aiService.ts
replaceInFile('backend/services/aiService.ts', [
  [/function buildSearchPrompt\(name, lang\)/g, 'function buildSearchPrompt(name: string, lang: string)'],
  [/function buildComparePrompt\(medA, medB, lang\)/g, 'function buildComparePrompt(medA: string, medB: string, lang: string)'],
  [/async function callLLM7\(prompt\)/g, 'async function callLLM7(prompt: string)'],
  [/async function callGemini\(prompt\)/g, 'async function callGemini(prompt: string)'],
  [/fetchMedicine = async \(name, lang = "en"\)/g, 'fetchMedicine = async (name: string, lang = "en")'],
  [/fetchCompare = async \(medA, medB, lang = "en"\)/g, 'fetchCompare = async (medA: string, medB: string, lang = "en")']
]);

// 8. cacheService.ts
replaceInFile('backend/services/cacheService.ts', [
  [/function makeCacheKey\(name, lang\)/g, 'function makeCacheKey(name: string, lang: string)'],
  [/export const getCache = async \(name, lang = "en"\)/g, 'export const getCache = async (name: string, lang = "en")'],
  [/export const setCache = async \(name, lang, data\)/g, 'export const setCache = async (name: string, lang: string, data: any)']
]);

// 9. catchAsync.ts
replaceInFile('backend/utils/catchAsync.ts', [
  [/const catchAsync = \(fn: any\) => \(req: any, res: any, next: any\)/g, 'const catchAsync = (fn: any) => (req: any, res: any, next: any)']
]);

console.log("Done fixing phase 2 types");
