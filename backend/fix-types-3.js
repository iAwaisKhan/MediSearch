const fs = require('fs');

const fixFile = (filePath, replacer) => {
  let content = fs.readFileSync(filePath, 'utf8');
  const newContent = replacer(content);
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Fixed ${filePath}`);
  }
};

fixFile('controllers/authController.ts', content => {
  if (!content.includes('import { IUser }')) {
    content = 'import { IUser } from "../types";\n' + content;
  }
  content = content.replace(/const user = await User\.findById/g, 'const user = await User.findById<IUser>');
  content = content.replace(/const user = await User\.findOne/g, 'const user = await User.findOne<IUser>');
  content = content.replace(/const user = await User\.create/g, 'const user = await User.create<IUser>');
  content = content.replace(/const user = await User\.findByIdAndUpdate/g, 'const user = await User.findByIdAndUpdate<IUser>');
  
  // Fix null check in changePassword
  content = content.replace(/const user = await User\.findById<IUser>\(req\.user\.id\)\.select\("\+password"\);\r?\n\r?\n\s*if \(!\(await user\.matchPassword\(currentPassword\)\)\)/g, 
    'const user = await User.findById<IUser>(req.user.id).select("+password");\n\n  if (!user) return next(new AppError("User not found", 404));\n  if (!(await user.matchPassword(currentPassword)))');

  return content;
});

fixFile('middleware/authMiddleware.ts', content => {
  if (!content.includes('import { IUser }')) {
    content = 'import { IUser } from "../types";\n' + content;
  }
  content = content.replace(/const user = await User\.findById/g, 'const user = await User.findById<IUser>');
  
  // Fix jwt.verify
  content = content.replace(/jwt\.verify\(token, process\.env\.JWT_SECRET\)/g, 'jwt.verify(token, process.env.JWT_SECRET as string)');
  
  // Fix roles parameter
  content = content.replace(/\(\.\.\.roles\)/g, '(...roles: string[])');
  
  return content;
});

fixFile('models/User.ts', content => {
  if (!content.includes('import { IUser }')) {
    content = 'import { IUser } from "../types";\n' + content;
  }
  // Change Schema to Schema<IUser>
  content = content.replace(/new mongoose\.Schema\(\{/g, 'new mongoose.Schema<IUser>({');
  
  // Fix parameters
  content = content.replace(/matchPassword = async function \(enteredPassword\)/g, 'matchPassword = async function (enteredPassword: string)');
  content = content.replace(/changedPasswordAfter = function \(jwtIat\)/g, 'changedPasswordAfter = function (jwtIat: number)');
  content = content.replace(/getSignedJWT = function \(\)/g, 'getSignedJWT = function ()');
  
  // Fix jwt.sign
  content = content.replace(/jwt\.sign\(\{ id: this\._id \}, process\.env\.JWT_SECRET/g, 'jwt.sign({ id: this._id }, process.env.JWT_SECRET as string');
  
  return content;
});

fixFile('services/aiService.ts', content => {
  content = content.replace(/function buildSearchPrompt\(name, lang\)/g, 'function buildSearchPrompt(name: string, lang: string)');
  content = content.replace(/function buildComparePrompt\(medA, medB, lang\)/g, 'function buildComparePrompt(medA: string, medB: string, lang: string)');
  content = content.replace(/async function callLLM7\(prompt\)/g, 'async function callLLM7(prompt: string)');
  content = content.replace(/async function callGemini\(prompt\)/g, 'async function callGemini(prompt: string)');
  content = content.replace(/async function fetchMedicine\(name, lang = "en"\)/g, 'async function fetchMedicine(name: string, lang = "en")');
  content = content.replace(/async function fetchCompare\(medA, medB, lang = "en"\)/g, 'async function fetchCompare(medA: string, medB: string, lang = "en")');
  
  // Fix text undefined
  content = content.replace(/let text = response\.text;/g, 'let text = response.text || "";');
  
  return content;
});

fixFile('services/cacheService.ts', content => {
  content = content.replace(/function makeCacheKey\(name, lang\)/g, 'function makeCacheKey(name: string, lang: string)');
  content = content.replace(/async function getCache\(name, lang\)/g, 'async function getCache(name: string, lang: string)');
  content = content.replace(/async function setCache\(name, lang, data\)/g, 'async function setCache(name: string, lang: string, data: any)');
  return content;
});

fixFile('middleware/errorHandler.ts', content => {
  content = content.replace(/const handleCastError = \(err\)/g, 'const handleCastError = (err: any)');
  content = content.replace(/const handleDuplicateKey = \(err\)/g, 'const handleDuplicateKey = (err: any)');
  return content;
});

fixFile('routes/ocrRoutes.ts', content => {
  content = content.replace(/cb\(new AppError\("Not an image! Please upload an image\.", 400\), false\);/g, 'cb(new AppError("Not an image! Please upload an image.", 400) as any, false);');
  return content;
});

fixFile('controllers/ocrController.ts', content => {
  content = content.replace(/let text = response\.text;/g, 'let text = response.text || "";');
  return content;
});
