// MSW Browser setup for browser-based testing (frontend applications)
const { setupWorker } = require('msw/browser');
const { handlers } = require('./handlers');

// Create the service worker
const worker = setupWorker(...handlers);

module.exports = { worker };
