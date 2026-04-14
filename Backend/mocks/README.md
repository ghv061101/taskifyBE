# Mock Service Worker (MSW) Setup

This directory contains Mock Service Worker configuration for testing your TaskFlow backend API.

## Files Overview

- **mockData.js** - Sample data for users, projects, and tasks
- **handlers.js** - MSW request handlers for all API endpoints
- **server.js** - Server setup for Node.js testing environments
- **browser.js** - Worker setup for browser-based testing

## Installation

First, install MSW and its dependencies:

```bash
npm install --save-dev msw
```

## Usage

### For Frontend Testing (React, Vue, etc.)

1. In your frontend setup file (e.g., `src/setupTests.js` or `src/main.jsx`):

```javascript
import { worker } from '../path/to/mocks/browser';

if (process.env.NODE_ENV === 'development') {
  worker.start();
}
```

2. For testing with Vitest or Jest:

```javascript
// vitest.config.js or jest.config.js
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

// Enable API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done
afterAll(() => server.close());
```

### For Node.js Testing (Backend Integration Tests)

```javascript
import { server } from './mocks/server';
import { beforeAll, afterEach, afterAll } from 'vitest';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## API Endpoints Mocked

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Projects
- `GET /projects` - List all projects for the authenticated user
- `POST /projects` - Create a new project
- `GET /projects/:id` - Get specific project with its tasks
- `PATCH /projects/:id` - Update project details
- `DELETE /projects/:id` - Delete project and associated tasks

### Tasks
- `GET /projects/:id/tasks` - List tasks for a project (supports `status` and `assignee` query params)
- `POST /projects/:id/tasks` - Create a new task
- `PATCH /tasks/:id` - Update task details
- `DELETE /tasks/:id` - Delete a task

## Mock Authentication

MSW provides mock JWT tokens when you authenticate:

```javascript
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'test_password'
  })
});

const { token } = await response.json();
// Use the token in subsequent requests
fetch('http://localhost:3000/projects', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## Mock Data

### Users
- `user_1`: John Doe (john@example.com)
- `user_2`: Jane Smith (jane@example.com)

### Projects (associated with user_1 and user_2)
- Website Redesign
- Mobile App Development
- API Integration

### Tasks (associated with projects)
5 sample tasks with various statuses and priorities

## Adding/Modifying Mock Data

Edit `mockData.js` to add or modify:

```javascript
const mockProjects = {
  proj_custom: {
    _id: 'proj_custom',
    name: 'My Custom Project',
    description: 'Project description',
    owner_id: 'user_1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};
```

## Overriding Handlers in Tests

If you need different responses for specific tests:

```javascript
import { server } from './mocks/server';
import { http, HttpResponse } from 'msw';

server.use(
  http.get('*/projects', () => {
    return HttpResponse.json({ projects: [] });
  })
);
```

## Debugging

Enable debugging to see all intercepted requests:

```javascript
import { setupWorker } from 'msw/browser';
import { handlers } from './mocks/handlers';

const worker = setupWorker(...handlers);
worker.start({ onUnhandledRequest: 'warn' });
```

Check the browser console for MSW debugging information.

## Base URL Configuration

By default, MSW intercepts requests to any origin. If your frontend uses a specific base URL, make sure it matches the requests in your application:

```javascript
// In your application
const API_BASE = 'http://localhost:3000'; // or your configured base URL
const response = await fetch(`${API_BASE}/projects`);
```

## Troubleshooting

### Handlers Not Intercepting Requests
- Ensure MSW is initialized before your tests/app starts
- Check that request URLs match the patterns in handlers.js
- Verify that Content-Type headers are set correctly

### Authentication Issues
- Make sure to include `Authorization: Bearer {token}` header
- Tokens are generated on successful login/register
- Tokens persist in memory during the session

### CORS Issues
- MSW handles CORS at the JavaScript level, not the network level
- If you still see CORS errors, ensure your frontend allows the mocked requests

## Next Steps

1. Update mock data to match your actual database structure
2. Add your frontend's API client configuration to use the mocked API
3. Run your frontend tests against the mocked API
4. Expand handlers for any additional endpoints

For more information, visit: https://mswjs.io/
