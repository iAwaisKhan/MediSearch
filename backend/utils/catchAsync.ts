"use strict";

// Wraps async route handlers – no need for try/catch in every controller
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;

export {};
