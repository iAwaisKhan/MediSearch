const fs = require('fs');

const replace = (file, arr) => {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');
  arr.forEach(([r, v]) => c = c.replace(r, v));
  fs.writeFileSync(file, c, 'utf8');
};

replace('config/db.ts', [
  [/mongoose\.connect\(process\.env\.MONGO_URI\)/, 'mongoose.connect(process.env.MONGO_URI as string)']
]);

replace('config/envValidator.ts', [
  [/const missing = requiredEnv\.filter\(\(env\) =>/, 'const missing = requiredEnv.filter((env: any) =>']
]);

replace('controllers/authController.ts', [
  [/const sendToken = \(user, statusCode, res\)/, 'const sendToken = (user: any, statusCode: any, res: any)'],
  [/User\.create<IUser>\(\{ name, email, password, preferredLang \}\)/, 'User.create({ name, email, password, preferredLang } as any)'],
  [/User\.findByIdAndUpdate<IUser>/g, 'User.findByIdAndUpdate']
]);

replace('middleware/authMiddleware.ts', [
  [/jwt\.verify\(token, process\.env\.JWT_SECRET as string\)/g, '(jwt.verify(token, process.env.JWT_SECRET as string) as any)']
]);

replace('middleware/errorHandler.ts', [
  [/const handleCastError = \(err\)/, 'const handleCastError = (err: any)'],
  [/const handleDuplicateKey = \(err\)/, 'const handleDuplicateKey = (err: any)']
]);

replace('models/User.ts', [
  [/process\.env\.JWT_SECRET as string/g, 'process.env.JWT_SECRET as string']
]);
