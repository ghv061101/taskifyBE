// MSW Server setup for Node.js testing environments
const { setupServer } = require('msw/node');
const { handlers } = require('./handlers');

// Create the test server
const server = setupServer(...handlers);

module.exports = { server };
