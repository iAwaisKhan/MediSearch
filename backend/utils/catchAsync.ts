// Wraps async route handlers – no need for try/catch in every controller
const catchAsync = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default catchAsync;
