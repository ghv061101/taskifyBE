# TaskFlow Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                           │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          Next.js Frontend (React + TypeScript)          │ │
│  │                  Port: 3000                             │ │
│  │                                                          │ │
│  │  ┌─────────────────────────────────────────────────┐   │ │
│  │  │              App Router Pages                    │   │ │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │   │ │
│  │  │  │  Login   │  │Register  │  │ Projects     │  │   │ │
│  │  │  │  Page    │  │  Page    │  │ Dashboard    │  │   │ │
│  │  │  └──────────┘  └──────────┘  └──────────────┘  │   │ │
│  │  │                    ↓                             │   │ │
│  │  │             Project Detail                       │   │ │
│  │  │           + Task Management                      │   │ │
│  │  └─────────────────────────────────────────────────┘   │ │
│  │         ↓                                    ↓           │ │
│  │  ┌─────────────┐                  ┌────────────────┐   │ │
│  │  │ TaskModal   │                  │  TaskCard      │   │ │
│  │  │ (Create/    │                  │  (Display/     │   │ │
│  │  │  Edit)      │                  │   Update)      │   │ │
│  │  └─────────────┘                  └────────────────┘   │ │
│  │         ↓                                    ↓           │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │            Navbar Component                      │   │ │
│  │  │      (User Info + Logout Button)               │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
│              ↓                                    ↓            │
│  ┌──────────────────────────┐    ┌────────────────────────┐  │
│  │   Auth Context (State)   │    │  Protected Routes      │  │
│  │  ├─ user                 │    │  (Auto-redirect)       │  │
│  │  ├─ token                │    └────────────────────────┘  │
│  │  ├─ loading              │                                 │
│  │  ├─ error                │                                 │
│  │  ├─ login()              │                                 │
│  │  ├─ register()           │                                 │
│  │  └─ logout()             │                                 │
│  └──────────────────────────┘                                │
│         ↓ (provides)                                         │
│  ┌──────────────────────────┐                               │
│  │   API Client (lib/api)   │                               │
│  │  ├─ Auth endpoints       │                               │
│  │  ├─ Project endpoints    │                               │
│  │  └─ Task endpoints       │                               │
│  │                          │                               │
│  │  + Type definitions      │                               │
│  │  + Error handling        │                               │
│  │  + JWT attachment        │                               │
│  └──────────────────────────┘                               │
│              ↓                                               │
│      ┌─────────────┐                                        │
│      │ localStorage│ (auth persistence)                     │
│      └─────────────┘                                        │
└──────────────────────────────────────────────────────────────┘
         │
         │ HTTP(S) Requests
         │ + JWT Bearer Token
         │
         ↓
┌──────────────────────────────────────────────────────────────┐
│              Backend API (Node.js + Express)                 │
│                    Port: 5000                                │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Authentication Routes                     │ │
│  │  POST /api/auth/register                              │ │
│  │  POST /api/auth/login                                 │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Project Routes                            │ │
│  │  GET    /api/projects                                 │ │
│  │  GET    /api/projects/:id                             │ │
│  │  POST   /api/projects                                 │ │
│  │  PATCH  /api/projects/:id                             │ │
│  │  DELETE /api/projects/:id                             │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Task Routes                               │ │
│  │  GET    /api/projects/:id/tasks                       │ │
│  │  POST   /api/projects/:id/tasks                       │ │
│  │  PATCH  /api/tasks/:id                                │ │
│  │  DELETE /api/tasks/:id                                │ │
│  └────────────────────────────────────────────────────────┘ │
│         ↓                                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Middleware                                │ │
│  │  ├─ Auth verification (JWT)                           │ │
│  │  ├─ Error handling                                    │ │
│  │  └─ Validation                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│         ↓                                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Data Models                               │ │
│  │  ├─ User (id, name, email, password)                 │ │
│  │  ├─ Project (id, name, desc, owner_id)               │ │
│  │  └─ Task (id, title, status, priority, ...)          │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
         │
         │ SQL Queries
         │
         ↓
┌──────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                         │
│                                                              │
│  Tables:                                                     │
│  ├─ users     (id, name, email, password_hash, created_at) │
│  ├─ projects  (id, name, description, owner_id, created_at)│
│  └─ tasks     (id, title, description, status, priority,   │
│               project_id, assignee_id, due_date, ...)      │
│                                                              │
│  Relationships:                                              │
│  ├─ projects.owner_id → users.id                           │
│  ├─ tasks.project_id → projects.id                         │
│  └─ tasks.assignee_id → users.id (nullable)               │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow Example: Create a Task

```
User Interface
    ↓
┌─────────────────────────┐
│  Task Modal Form        │
│  - Title input          │
│  - Status dropdown      │
│  - Priority dropdown    │
│  - Due date picker      │
│  - Submit button        │
└─────────────────────────┘
    ↓ onSubmit event
┌─────────────────────────────────────────┐
│  Form Validation (Client-side)          │
│  - Check title not empty                │
│  - Validate date format                 │
└─────────────────────────────────────────┘
    ↓ validation passes
┌─────────────────────────────────────────┐
│ API Call (lib/api.ts)                   │
│ apiClient.createTask(projectId, data)   │
└─────────────────────────────────────────┘
    ↓ HTTP POST
┌──────────────────────────────────────────┐
│ Backend: POST /api/projects/:id/tasks    │
│                                          │
│ 1. Verify JWT token                      │
│ 2. Validate request data                 │
│ 3. Check user owns project               │
│ 4. Insert into database                  │
│ 5. Return new task with ID               │
└──────────────────────────────────────────┘
    ↓ HTTP 201 + JSON response
┌──────────────────────────────────────────┐
│ Frontend: Response Handler                │
│                                          │
│ 1. Update project.tasks array            │
│ 2. Close modal                           │
│ 3. Display success feedback              │
│ 4. Refetch project (optional)            │
└──────────────────────────────────────────┘
    ↓
┌─────────────────────────────┐
│ Rendered Task Card          │
│ - Shows on page              │
│ - User can edit/delete      │
│ - Status dropdown available │
└─────────────────────────────┘
```

## Authentication Flow

```
Initial Load
    ↓
┌──────────────────────────────┐
│ Check localStorage           │
│ taskflow_auth key exists?    │
└──────────────────────────────┘
    ├─ YES: Restore session              ├─ NO: Show login
    │   1. Parse stored token             │  page
    │   2. Set auth context               │
    │   3. Show protected pages           │
    └────────────────────┬────────────────┘
                         ↓
                ┌─────────────────────┐
                │  User Authentication│
                │  State Ready        │
                └─────────────────────┘

Login Flow:
User enters email/password
    ↓
Validate client-side
    ↓
POST /api/auth/login
    ↓
Backend: verify password with bcrypt
    ↓
Return: { token, user }
    ↓
Frontend:
  1. Store in localStorage
  2. Set auth context
  3. Set API client token
  4. Redirect to /
```

## File Dependencies

```
app/page.tsx (Projects Dashboard)
    ├─ @/lib/auth-context.tsx (useAuth)
    ├─ @/lib/use-protected-route.ts
    ├─ @/lib/api.ts (apiClient)
    └─ @/components/navbar.tsx

app/projects/[id]/page.tsx (Project Detail)
    ├─ @/lib/auth-context.tsx (useAuth)
    ├─ @/lib/use-protected-route.ts
    ├─ @/lib/api.ts (apiClient)
    ├─ @/components/navbar.tsx
    └─ @/components/task-modal.tsx
        └─ @/lib/api.ts (apiClient)

lib/auth-context.tsx
    └─ @/lib/api.ts (apiClient)

lib/api.ts
    └─ No internal dependencies
        (uses fetch API, types only)
```

## Component Hierarchy

```
RootLayout
  ├─ AuthProvider
  │   └─ {children}
  │       ├─ Navbar (if user logged in)
  │       └─ Page Content
  │           ├─ Projects Page
  │           │   └─ TaskModal (when creating)
  │           │
  │           └─ Project Detail Page
  │               ├─ Navbar
  │               ├─ TaskCard (list of tasks)
  │               └─ TaskModal (when editing or creating)
  │
  └─ Login/Register Pages (if not authenticated)
```

## Request/Response Examples

### Login Request
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid-1234",
    "name": "John Doe",
    "email": "user@example.com",
    "created_at": "2025-04-13T10:00:00Z"
  }
}
```

### Create Task Request
```
POST /api/projects/uuid-project/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "title": "Implement auth",
  "description": "Add JWT authentication",
  "status": "todo",
  "priority": "high",
  "due_date": "2025-06-30"
}

Response (201):
{
  "id": "uuid-5678",
  "title": "Implement auth",
  "description": "Add JWT authentication",
  "status": "todo",
  "priority": "high",
  "project_id": "uuid-project",
  "assignee_id": null,
  "due_date": "2025-06-30",
  "created_at": "2025-04-13T10:05:00Z",
  "updated_at": "2025-04-13T10:05:00Z"
}
```

## Technology Stack Summary

```
Frontend
  ├─ Next.js 16        (framework, routing, build)
  ├─ React 19          (UI components)
  ├─ TypeScript         (type safety)
  ├─ TailwindCSS        (styling)
  └─ Fetch API          (HTTP requests)

Backend (Required)
  ├─ Node.js           (runtime)
  ├─ Express.js        (web framework)
  ├─ PostgreSQL        (database)
  └─ JWT               (authentication)

Deployment
  ├─ Docker            (containerization)
  ├─ Docker Compose    (orchestration)
  └─ Environment       (configuration)
```

This diagram shows how all pieces of TaskFlow fit together!
