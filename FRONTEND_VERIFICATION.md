# TaskFlow Frontend - Verification Checklist

Use this checklist to verify that the frontend is set up correctly and ready to integrate with the backend.

## ✅ Setup Verification

### Dependencies
- [ ] `npm install` completed without errors
- [ ] `node_modules/` directory exists
- [ ] `package-lock.json` created
- [ ] TypeScript types installed (`@types/react`, `@types/node`)

### Configuration Files
- [ ] `.env.local` exists with `NEXT_PUBLIC_API_URL`
- [ ] `tsconfig.json` has path aliases (`@/*`)
- [ ] `next.config.ts` exists
- [ ] `tailwind.config.ts` exists
- [ ] `postcss.config.mjs` exists

### Directory Structure
```
frontend/
├── app/
│   ├── login/page.tsx         [ ]
│   ├── register/page.tsx      [ ]
│   ├── page.tsx               [ ]
│   ├── projects/
│   │   └── [id]/page.tsx      [ ]
│   ├── layout.tsx             [ ]
│   └── globals.css            [ ]
├── components/
│   ├── navbar.tsx             [ ]
│   └── task-modal.tsx         [ ]
├── lib/
│   ├── api.ts                 [ ]
│   ├── auth-context.tsx       [ ]
│   └── use-protected-route.ts [ ]
└── public/                    [ ]
```

## ✅ Development Server

### Start & Load
- [ ] `npm run dev` starts without errors
- [ ] Server runs on `http://localhost:3000`
- [ ] Browser loads login page
- [ ] No 404 errors in DevTools

### Console
- [ ] No TypeScript errors
- [ ] No runtime warnings
- [ ] No console errors on load

## ✅ Authentication Pages

### Login Page (`/login`)
- [ ] Page loads without errors
- [ ] Email input accepts text
- [ ] Password input masks characters
- [ ] Submit button appears
- [ ] "Don't have an account?" link visible
- [ ] Demo credentials displayed
- [ ] Dark mode works (toggle browser dark mode)

### Register Page (`/register`)
- [ ] Page loads without errors
- [ ] All form fields visible (Name, Email, Password, Confirm)
- [ ] Form submits with valid data
- [ ] Password mismatch error shows (if passwords differ)
- [ ] "Already have an account?" link visible

## ✅ Authentication Flow

### Registration
- [ ] Fill register form with unique email
- [ ] Submit form
- [ ] No network errors in DevTools
- [ ] Redirected to projects page after success
- [ ] User name appears in navbar

### Login
- [ ] Go to `/login` page
- [ ] Enter test@example.com / password123
- [ ] Form submits successfully
- [ ] Redirected to projects page
- [ ] User "Test User" appears in navbar

### Logout
- [ ] Click "Logout" button in navbar
- [ ] Redirected to `/login`
- [ ] localStorage cleared (`taskflow_auth` gone)

### Session Persistence
- [ ] Login with test account
- [ ] Refresh page (F5)
- [ ] Still logged in (navbar shows user)
- [ ] Close browser tab
- [ ] Reopen and navigate to app
- [ ] Still logged in (session restored)

### Protected Routes
- [ ] Clear localStorage: `localStorage.clear()`
- [ ] Refresh page
- [ ] Automatically redirected to `/login`

## ✅ Projects Dashboard (`/`)

### Page Load
- [ ] Page loads after login
- [ ] "Projects" heading visible
- [ ] "New Project" button visible
- [ ] No errors in DevTools

### Existing Projects
- [ ] Projects display as cards (if any exist)
- [ ] Each card shows: name, description, creation date
- [ ] Cards are clickable
- [ ] Cards have hover effect

### Create Project
- [ ] Click "New Project" button
- [ ] Form appears with project name and description
- [ ] Enter project name
- [ ] Click "Create"
- [ ] New project appears in list
- [ ] Form closes

### Empty State
- [ ] Delete all projects (or start fresh)
- [ ] See "No projects yet" message
- [ ] "Create Project" button visible in empty state
- [ ] Button navigates to create form

### Navigation
- [ ] Click on project card
- [ ] Navigates to `/projects/:id`

## ✅ Project Detail Page (`/projects/:id`)

### Page Load
- [ ] Page loads without errors
- [ ] Project name appears as heading
- [ ] Project description displays (if exists)
- [ ] "New Task" button visible
- [ ] Status filter buttons visible (All, To Do, In Progress, Done)

### Task List
- [ ] Tasks display as cards (if any exist)
- [ ] Each task shows: title, description, priority badge, due date
- [ ] Status dropdown on each task
- [ ] Edit and Delete buttons on each task

### Create Task
- [ ] Click "New Task" button
- [ ] Modal appears with task form
- [ ] All fields visible: title, description, status, priority, date
- [ ] Fill in task title
- [ ] Click "Create"
- [ ] Modal closes
- [ ] New task appears in list

### Edit Task
- [ ] Click "Edit" button on task card
- [ ] Modal opens with task data pre-filled
- [ ] Modify task details
- [ ] Click "Update"
- [ ] Modal closes
- [ ] Task updates in list

### Delete Task
- [ ] Click "Delete" button on task card
- [ ] Confirmation dialog appears
- [ ] Click confirm
- [ ] Task removed from list

### Status Filter
- [ ] Click "To Do" filter
- [ ] Only "todo" status tasks visible
- [ ] Click "In Progress" filter
- [ ] Only "in_progress" status tasks visible
- [ ] Click "Done" filter
- [ ] Only "done" status tasks visible
- [ ] Click "All" filter
- [ ] All tasks visible again

### Status Dropdown
- [ ] Click status dropdown on task
- [ ] Options visible: To Do, In Progress, Done
- [ ] Select different status
- [ ] Task status updates in card
- [ ] No page reload

### Empty State
- [ ] Delete all tasks
- [ ] See "No tasks yet" message
- [ ] "Create Task" button visible

## ✅ Navbar

### Display
- [ ] Navbar appears on every protected page
- [ ] "TaskFlow" logo visible
- [ ] User's name displays
- [ ] "Logout" button visible

### Navigation
- [ ] Click "TaskFlow" logo
- [ ] Navigates to projects page

## ✅ Responsive Design

### Mobile (375px)
- [ ] Open DevTools (mobile view)
- [ ] Set width to 375px (iPhone SE)
- [ ] All elements visible and readable
- [ ] No horizontal scroll
- [ ] Button text not cut off
- [ ] Form inputs are full width
- [ ] Cards stack vertically

### Tablet (768px)
- [ ] Projects display as 2 columns
- [ ] Tasks display as 2 columns
- [ ] Grid layouts responsive

### Desktop (1280px)
- [ ] Projects display as 3 columns
- [ ] Tasks display as 3 columns
- [ ] Content has max-width applied

### Touch Targets
- [ ] All buttons are at least 44px tall
- [ ] Form inputs are at least 40px tall
- [ ] Touch-friendly on mobile

## ✅ Dark Mode

### Activation
- [ ] Open browser dark mode setting
- [ ] Page automatically switches to dark theme
- [ ] Text remains readable
- [ ] Backgrounds are dark (`dark:bg-zinc-950`)
- [ ] Text is light (`dark:text-white`)

### Components
- [ ] Navbar works in dark mode
- [ ] Forms work in dark mode
- [ ] Cards work in dark mode
- [ ] Buttons work in dark mode
- [ ] Modal works in dark mode

## ✅ Error States

### Network Error (Backend Down)
- [ ] Stop backend API
- [ ] Try to login
- [ ] Error message displays
- [ ] No blank page

### Invalid Credentials
- [ ] Login with wrong password
- [ ] "Invalid credentials" error shows
- [ ] Can retry

### API Errors
- [ ] Trigger an API error (e.g., create task without title)
- [ ] Error message appears
- [ ] Form still usable
- [ ] Can retry

## ✅ Forms

### Validation
- [ ] Login form requires email and password
- [ ] Register form requires name, email, password
- [ ] Task form requires title
- [ ] Project form requires name
- [ ] Form won't submit without required fields

### Visual Feedback
- [ ] Focus rings visible on inputs
- [ ] Hover effects on buttons
- [ ] Button disabled state when loading
- [ ] Success/error messages colored appropriately

## ✅ TypeScript

### No Errors
```bash
npm run build
```
- [ ] Build completes without TypeScript errors
- [ ] No type warnings

### Types
- [ ] All API response types defined
- [ ] Component props typed
- [ ] State variables typed
- [ ] Function return types defined

## ✅ Code Quality

### ESLint
```bash
npm run lint
```
- [ ] No linting errors
- [ ] No unused variables
- [ ] No console.log statements in production code

### Bundle
```bash
npm run build
```
- [ ] Build succeeds
- [ ] No build warnings
- [ ] `next/image` optimization works
- [ ] CSS properly bundled

## ✅ Browser Compatibility

### Chrome/Chromium
- [ ] Works correctly
- [ ] All features functional

### Firefox
- [ ] Works correctly
- [ ] All features functional

### Safari
- [ ] Works correctly
- [ ] All features functional

### Mobile Browsers
- [ ] iOS Safari works
- [ ] Chrome Mobile works

## ✅ Performance

### Loading
- [ ] Initial page load < 3 seconds
- [ ] Login page loads quickly
- [ ] Projects page loads quickly
- [ ] No blocking network requests

### Interactions
- [ ] UI feels responsive
- [ ] No noticeable lag when clicking
- [ ] Modal opens instantly
- [ ] Form submission feels fast

## ✅ Accessibility

### Keyboard Navigation
- [ ] Tab moves between form fields
- [ ] Enter submits form
- [ ] Escape closes modal
- [ ] Can use app without mouse

### Screen Readers
- [ ] All images have alt text
- [ ] Form labels associated with inputs
- [ ] Buttons have descriptive text
- [ ] Headings properly structured

## ✅ API Integration Ready

### Backend Connection
- [ ] Backend API running on port 5000
- [ ] `NEXT_PUBLIC_API_URL` points to correct endpoint
- [ ] API endpoints match specification

### Network Tab
- [ ] Login request: `POST /api/auth/login` ✓
- [ ] Get projects: `GET /api/projects` ✓
- [ ] Create project: `POST /api/projects` ✓
- [ ] Get project: `GET /api/projects/:id` ✓
- [ ] Create task: `POST /api/projects/:id/tasks` ✓
- [ ] Update task: `PATCH /api/tasks/:id` ✓
- [ ] Delete task: `DELETE /api/tasks/:id` ✓

### Response Status
- [ ] Successful requests return 200/201
- [ ] Unauthorized returns 401
- [ ] Forbidden returns 403
- [ ] Not found returns 404

## ✅ Final Checks

- [ ] README.md complete and accurate
- [ ] GETTING_STARTED.md helpful
- [ ] Environment setup documented
- [ ] All files committed to git
- [ ] No sensitive data in code
- [ ] No console.log debug statements
- [ ] Comments clear and helpful
- [ ] No credit card or personal data visible

## 🎉 All Checks Passed!

Frontend is ready for production! ✅

Next steps:
1. Deploy backend API
2. Update `NEXT_PUBLIC_API_URL` for production
3. Run full integration tests
4. Deploy frontend
5. Monitor for issues
