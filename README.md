# TaskFlow - Task Management System

A minimal but complete full-stack task management application with authentication, project management, and task tracking. Built with a modern tech stack for a polished, production-ready user experience.

## Overview

TaskFlow is a real task management system (not a demo). Users can:
- **Register & Login** with secure password hashing (bcrypt)
- **Create Projects** to organize their work
- **Manage Tasks** within projects with status tracking, priorities, and due dates
- **Collaborate** by assigning tasks to team members
- **Filter & Search** tasks by status and assignee

### Tech Stack

**Backend:**
- Node.js with Express.js
- PostgreSQL for data persistence
- JWT for authentication
- Bcrypt for password security
- Database migrations with [migration tool]

**Frontend:**
- Next.js 16 with React 19 and TypeScript
- TailwindCSS for responsive styling
- Dark mode support
- Client-side auth persistence

## Architecture Decisions

### Backend Structure
- **RESTful API** with clear separation of concerns (routes, models, middleware)
- **JWT tokens** stored in localStorage (24-hour expiry) for stateless authentication
- **Structured error responses** with validation field mapping
- **Database relations** enforcing data integrity (foreign keys, cascading deletes)

### Frontend Architecture
- **Client-side rendering** with Next.js App Router for fast navigation
- **Auth Context** for global auth state management with automatic persistence
- **Component composition** for reusable UI patterns (Navbar, TaskCard, TaskModal)
- **TailwindCSS** over component libraries for minimal bundle size and full control
- **Optimistic updates** for responsive task status changes

### Design Tradeoffs
1. **No Real-time Updates**: Used polling instead of WebSockets to reduce complexity
2. **Single-user Focus**: Tasks default to unassigned; could be extended for team collaboration
3. **Minimal Styling**: Used TailwindCSS utilities instead of pre-built component library to reduce dependencies
4. **Client-side Auth State**: Auth state persists via localStorage; not ideal for highly sensitive apps but good for this use case

### Intentionally Left Out
- **Complex filtering UIs**: One-click status filters only
- **Drag-and-drop reordering**: Scope constraint; can be added with react-beautiful-dnd
- **Real-time collaboration**: Would require WebSocket layer
- **Admin dashboard**: Feature not in scope
- **Role-based access control**: All projects are user-owned

## Running Locally

### Prerequisites
- Docker & Docker Compose installed
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/taskflow
cd taskflow

# Copy environment configuration
cp .env.example .env

# Start all services (PostgreSQL, API, Frontend)
docker compose up

# Application available at: http://localhost:3000
```

That's it! Docker Compose handles:
- PostgreSQL database setup
- Database migrations
- API server startup
- Frontend development server

### Without Docker

If you prefer to run locally without Docker:

**Backend Setup:**
```bash
cd Backend
npm install
cp ../.env.example .env
npm run migrate:up      # Run migrations
npm run seed            # Seed test data
npm run dev             # Start on port 5000
```

**Frontend Setup:**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev             # Start on port 3000
```

## Database Setup & Migrations

### Automatic (with Docker)
Migrations run automatically when the container starts.

### Manual (Development)
```bash
cd Backend
npm run migrate:up      # Run all pending migrations
npm run migrate:down    # Rollback last migration
npm run migrate:fresh   # Reset and re-run all migrations
```

### Seeding Test Data
A seed script creates test data for immediate use:
```bash
npm run seed
```

Includes:
- 1 test user (email: test@example.com, password: password123)
- 1 sample project (owned by test user)
- 3 sample tasks with different statuses and priorities

## Test Credentials

Use these to log in immediately after setup:

```
Email:    test@example.com
Password: password123
```

## API Reference

### Authentication

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}

Response: { "token": "jwt...", "user": { "id", "name", "email", "created_at" } }
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response: { "token": "jwt...", "user": { "id", "name", "email", "created_at" } }
```

### Projects

**List Projects**
```http
GET /api/projects
Authorization: Bearer <token>

Response: [{ "id", "name", "description", "owner_id", "created_at" }]
```

**Get Project**
```http
GET /api/projects/:id
Authorization: Bearer <token>

Response: { "id", "name", "description", "owner_id", "created_at", "tasks": [...] }
```

**Create Project**
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Q2 Roadmap",
  "description": "Optional description"
}

Response: { "id", "name", "description", "owner_id", "created_at" }
```

**Update Project**
```http
PATCH /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}

Response: { "id", "name", "description", "owner_id", "created_at" }
```

**Delete Project**
```http
DELETE /api/projects/:id
Authorization: Bearer <token>

Response: { "success": true }
```

### Tasks

**List Tasks**
```http
GET /api/projects/:projectId/tasks?status=todo&assignee=userId
Authorization: Bearer <token>

Response: [{ "id", "title", "description", "status", "priority", "project_id", "assignee_id", "due_date", "created_at", "updated_at" }]
```

**Create Task**
```http
POST /api/projects/:projectId/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Implement auth",
  "description": "Add JWT authentication",
  "status": "in_progress",
  "priority": "high",
  "assignee_id": "optional-user-id",
  "due_date": "2025-06-30"
}

Response: { "id", "title", "description", "status", "priority", "project_id", "assignee_id", "due_date", "created_at", "updated_at" }
```

**Update Task**
```http
PATCH /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "done",
  "priority": "medium"
}

Response: { "id", "title", ...full task object }
```

**Delete Task**
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>

Response: { "success": true }
```

### Error Responses

**Validation Error (400)**
```json
{
  "error": "validation failed",
  "fields": {
    "email": "is required",
    "password": "must be at least 8 characters"
  }
}
```

**Unauthorized (401)**
```json
{
  "error": "unauthorized"
}
```

**Forbidden (403)**
```json
{
  "error": "forbidden"
}
```

**Not Found (404)**
```json
{
  "error": "not found"
}
```

## Frontend Structure

```
frontend/
├── app/
│   ├── login/page.tsx          # Login page
│   ├── register/page.tsx       # Registration page
│   ├── projects/[id]/page.tsx  # Project detail with tasks
│   ├── page.tsx                # Projects list (dashboard)
│   ├── layout.tsx              # Root layout with AuthProvider
│   └── globals.css             # TailwindCSS styles
├── components/
│   ├── navbar.tsx              # Navigation bar
│   └── task-modal.tsx          # Task creation/editing & task card
├── lib/
│   ├── api.ts                  # API client with type definitions
│   ├── auth-context.tsx        # Auth state management
│   └── use-protected-route.ts  # Route protection hook
├── .env.local                  # Local environment (dev)
└── package.json
```

### Key Components

**AuthProvider & useAuth()**
- Manages authentication state globally
- Persists token to localStorage
- Provides login/register/logout methods

**useProtectedRoute()**
- Redirects unauthenticated users to /login
- Used on protected pages

**TaskModal**
- Reusable modal for creating/editing tasks
- Validates and submits to API

**TaskCard**
- Displays task with status, priority, due date
- Inline status dropdown for optimistic updates

## Development

### Adding a New Feature

1. **Update API** (`Backend/routes/`)
2. **Update Types** (`frontend/lib/api.ts`)
3. **Create Component** if needed (`frontend/components/`)
4. **Create/Update Page** (`frontend/app/`)
5. **Test** both backend and frontend

### Styling

Uses TailwindCSS with dark mode support via `dark:` prefix:
```tsx
<div className="text-black dark:text-white bg-white dark:bg-zinc-950">
```

## What You'd Do With More Time

### High Priority
1. **Websocket Real-time Updates**: Replace polling with live task updates
2. **Task Assignee Selection**: Show user list when assigning tasks
3. **Drag-and-drop Kanban**: Reorder tasks by dragging between status columns
4. **Keyboard Shortcuts**: ⌘K for quick search, Escape to close modals
5. **Better Error Recovery**: Retry logic for failed requests, error toast notifications

### Medium Priority
6. **Team Collaboration**: Share projects, assign to multiple users
7. **Activity Timeline**: See who made what changes and when
8. **Recurring Tasks**: Duplicate tasks on a schedule
9. **Comments on Tasks**: Discussion thread per task
10. **Email Notifications**: Notify assignees of changes

### Polish & Performance
11. **Analytics Dashboard**: Burndown charts, velocity tracking
12. **Mobile App**: React Native or Flutter
13. **Dark Mode Toggle**: UI for switching themes (currently auto)
14. **Offline Support**: Service workers for offline-first experience
15. **E2E Tests**: Cypress or Playwright for critical flows
16. **Accessibility Audit**: WCAG 2.1 AA compliance
17. **Search & Filtering**: Full-text search, advanced filters
18. **Export**: CSV/PDF exports of projects and tasks

### Architecture Improvements
19. **Replace localStorage**: Use secure HTTP-only cookies
20. **Implement Caching**: React Query or SWR for request deduplication
21. **Rate Limiting**: Prevent abuse, protect API
22. **Logging & Monitoring**: Sentry for error tracking
23. **Database Connection Pooling**: Better resource management
24. **GraphQL**: Replace REST API for more flexible queries

### Testing
25. **Unit Tests**: 80%+ coverage on both backend and frontend
26. **Integration Tests**: API contract testing
27. **Load Testing**: k6 or Apache JMeter for performance

## Deployment

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run start
```

**Backend:**
```bash
cd Backend
npm install --production
npm start
```

### Environment Variables

See `.env.example` files in both Backend and frontend directories:

**Backend (.env):**
```
DATABASE_URL=postgresql://user:pass@localhost/taskflow
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=24h
NODE_ENV=production
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=https://api.taskflow.com
```

## License

MIT

## Support

Issues and PRs welcome! This is an open-source learning project.
#   t a s k i f y B E  
 