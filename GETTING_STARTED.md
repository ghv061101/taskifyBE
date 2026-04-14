# TaskFlow Frontend - Getting Started

## Quick Start (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:3000
```

Log in with test credentials:
- **Email:** test@example.com  
- **Password:** password123

## Project Walkthrough

### Pages & Routes

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Projects dashboard (protected) |
| `/login` | `app/login/page.tsx` | Login form |
| `/register` | `app/register/page.tsx` | Registration form |
| `/projects/:id` | `app/projects/[id]/page.tsx` | Project details + tasks |

### Main Components

**Navbar** (`components/navbar.tsx`)
- Shows logged-in user's name
- Logout button in top-right
- Used on all protected pages

**TaskModal** (`components/task-modal.tsx`)
```tsx
<TaskModal
  projectId="project-uuid"
  task={existingTask}  // omit to create new
  onClose={() => setShowModal(false)}
  onSave={(savedTask) => handleSave(savedTask)}
/>
```

**TaskCard** (`components/task-modal.tsx`)
- Displays task title, description, priority, due date
- Inline status dropdown
- Edit and Delete buttons

### State Management

**Auth Context** (`lib/auth-context.tsx`)
```tsx
import { useAuth } from '@/lib/auth-context';

const MyComponent = () => {
  const { user, token, loading, login, logout, error } = useAuth();
  
  if (loading) return <Spinner />;
  if (!user) return <LoginPrompt />;
  
  return <Dashboard user={user} />;
};
```

**Protected Routes** (`lib/use-protected-route.ts`)
```tsx
import { useProtectedRoute } from '@/lib/use-protected-route';

const ProtectedPage = () => {
  const { isProtected, loading } = useProtectedRoute();
  if (isProtected || loading) return null; // Redirects automatically
  return <Content />;
};
```

### API Client (`lib/api.ts`)

Type-safe API calls:

```tsx
import { apiClient } from '@/lib/api';

// Auth
const result = await apiClient.login(email, password);
const result = await apiClient.register(name, email, password);

// Projects
const projects = await apiClient.getProjects();
const project = await apiClient.getProject(projectId);
const newProject = await apiClient.createProject(name, description);
await apiClient.updateProject(projectId, name, description);
await apiClient.deleteProject(projectId);

// Tasks
const tasks = await apiClient.getTasks(projectId, status, assigneeId);
const task = await apiClient.createTask(projectId, taskData);
await apiClient.updateTask(taskId, partialData);
await apiClient.deleteTask(taskId);
```

All API methods include:
- Automatic JWT token attachment
- Error handling with structured responses
- Full TypeScript types

## Common Tasks

### Add a New Page

1. Create file: `app/newpage/page.tsx`
2. Add auth check:
```tsx
'use client';
import { useProtectedRoute } from '@/lib/use-protected-route';
import { Navbar } from '@/components/navbar';

export default function NewPage() {
  useProtectedRoute();
  return (
    <>
      <Navbar />
      {/* Content */}
    </>
  );
}
```

### Create a New Component

1. File: `components/my-component.tsx`
2. Use 'use client' if using hooks
3. Accept props and export:
```tsx
'use client';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return <div>{/*...*/}</div>;
}
```

### Add an API Endpoint Call

1. Import API client:
```tsx
import { apiClient, ApiErrorClass } from '@/lib/api';
```

2. Call endpoint with error handling:
```tsx
try {
  const data = await apiClient.getProjects();
  setProjects(data);
} catch (err) {
  if (err instanceof ApiErrorClass) {
    if (err.status === 401) {
      // Handle unauthorized
    }
    console.error(err.message);
  }
}
```

### Style a Component

Use TailwindCSS class names:
```tsx
<div className="w-full px-4 py-2 bg-white dark:bg-zinc-950 text-black dark:text-white rounded-md border border-zinc-200 dark:border-zinc-800">
  Content
</div>
```

**Common Classes:**
- `flex gap-4` - Flexible row with spacing
- `grid grid-cols-1 md:grid-cols-2` - Responsive grid
- `px-4 py-2` - Padding
- `rounded-md` - Border radius
- `border border-zinc-200` - 1px border
- `hover:bg-blue-700` - Hover effects
- `dark:bg-zinc-950` - Dark mode

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Change for other environments:
- **Production staging:** `https://api-staging.example.com`
- **Production live:** `https://api.example.com`

## Commands

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Check code style
```

## Type Definitions

Check `lib/api.ts` for all types:

```tsx
// User
interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

// Project
interface Project {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
}

// Task
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  project_id: string;
  assignee_id?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}
```

## Debugging

### Enable verbose logging:
```tsx
const { user, loading } = useAuth();
console.log('Auth state:', { user, loading });
```

### Check API calls:
- Open DevTools → Network tab
- Look for requests to `http://localhost:5000/api/...`
- Check response code and body

### Check localStorage:
```javascript
// In browser console
JSON.parse(localStorage.getItem('taskflow_auth'));
```

### TypeScript errors:
```bash
npm run lint  # Catch errors before building
```

## Testing

### Manual testing checklist:
- [ ] Register new user
- [ ] Login with test@example.com
- [ ] Create a project
- [ ] Create a task
- [ ] Edit task
- [ ] Change task status
- [ ] Delete task
- [ ] Logout
- [ ] Page reload - still logged in?
- [ ] Mobile responsiveness (DevTools)

## Performance Tips

1. **Avoid re-renders:** Use `useCallback` for event handlers
2. **Code splitting:** Next.js does this automatically per route
3. **Image optimization:** Use `next/image` 
4. **API caching:** Add response caching headers on backend

## Troubleshooting

**"Cannot GET /"**
- Make sure dev server is running: `npm run dev`

**API requests give 401 Unauthorized**
- Check backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Clear localStorage and re-login

**Dark mode not working**
- Check browser supports CSS `:dark` media query
- Or add `class="dark"` to `<html>` tag

**TypeScript errors**
- Run `npm install` to ensure types are installed
- Check `tsconfig.json` path aliases

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TailwindCSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

## Next Steps

1. Start frontend: `npm run dev`
2. Start backend: See Backend README
3. Test full integration
4. Deploy to staging

Happy coding! 🚀
