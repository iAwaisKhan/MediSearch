const fs = require('fs');

const migrate = (file) => {
  let c = fs.readFileSync(file, 'utf8');
  // CJS -> ESM
  c = c.replace(/const\s+([a-zA-Z0-9_]+)\s*=\s*require\((['"`][^'"`]+['"`])\);/g, 'import $1 from $2;');
  c = c.replace(/const\s+\{\s*([^}]+)\s*\}\s*=\s*require\((['"`][^'"`]+['"`])\);/g, 'import { $1 } from $2;');
  c = c.replace(/module\.exports\s*=\s*/g, 'export default ');
  c = c.replace(/^exports\.([a-zA-Z0-9_]+)\s*=\s*/gm, 'export const $1 = ');
  c = c.replace(/import\s+ctrl\s+from\s+(['"][^'"]+['"])/g, 'import * as ctrl from $1');
  
  // Implicit any fixes
  c = c.replace(/\(req, res, next\)/g, '(req: any, res: any, next: any)');
  c = c.replace(/\(req, res\)/g, '(req: any, res: any)');
  c = c.replace(/catch\s*\(\s*err\s*\)/g, 'catch (err: any)');
  
  return c;
};

// config/db.ts
let db = migrate('backend/config/db.ts');
db = db.replace(/process\.env\.MONGODB_URI/, 'process.env.MONGODB_URI as string');
fs.writeFileSync('backend/config/db.ts', db, 'utf8');

// config/envValidator.ts
let env = migrate('backend/config/envValidator.ts');
env = env.replace(/filter\(\(env\) =>/, 'filter((env: any) =>');
fs.writeFileSync('backend/config/envValidator.ts', env, 'utf8');

// controllers/authController.ts
let auth = migrate('backend/controllers/authController.ts');
auth = 'import { IUser } from "../types";\n' + auth;
auth = auth.replace(/const sendToken = \(user, statusCode, res\)/, 'const sendToken = (user: IUser, statusCode: any, res: any)');
auth = auth.replace(/parseInt\(process\.env\.JWT_COOKIE_EXPIRE\)/, 'parseInt(process.env.JWT_COOKIE_EXPIRE as string)');
auth = auth.replace(/const user = await User\.findById\(/g, 'const user = await User.findById<IUser>(');
auth = auth.replace(/const user = await User\.findOne\(/g, 'const user = await User.findOne<IUser>(');
auth = auth.replace(/const user = await User\.create\(\{/, 'const user = await User.create({'); // Let Mongoose infer create
auth = auth.replace(/const user = await User\.findByIdAndUpdate\(/, 'const user = await User.findByIdAndUpdate('); // Mongoose handles this well enough
auth = auth.replace(/const user = await User\.findById<IUser>\(req\.user\.id\)\.select\("\+password"\);\r?\n\r?\n\s*if \(!\(await user\.matchPassword\(currentPassword\)\)\)/g, 
  'const user = await User.findById<IUser>(req.user.id).select("+password");\n\n  if (!user) return next(new AppError("User not found", 404));\n  if (!(await user.matchPassword(currentPassword)))');

fs.writeFileSync('backend/controllers/authController.ts', auth, 'utf8');

console.log("Restored files fixed.");
