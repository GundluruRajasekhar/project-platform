// Vercel serverless entrypoint (same pattern as your Task 3 deployment)
require('dotenv').config();
module.exports = require('../src/app');
