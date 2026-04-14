// MSW handlers for backend API endpoints
const { http, HttpResponse } = require('msw');
const { mockUsers, mockProjects, mockTasks } = require('./mockData');

// In-memory storage for session tokens
const sessionTokens = new Map();

// Helper function to verify token
const verifyToken = (token) => {
  return sessionTokens.get(token);
};

// Helper function to get user from authorization header
const getUserFromAuth = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  return verifyToken(token);
};

// Generate a mock JWT token
const generateToken = () => {
  return 'mock_jwt_' + Math.random().toString(36).substr(2, 9);
};

const handlers = [
  // ===== AUTH ROUTES =====
  http.post('*/auth/register', async ({ request }) => {
    try {
      const body = await request.json();
      const { name, email, password } = body;

      if (!name || !email || !password) {
        return HttpResponse.json({
          error: 'validation failed',
          fields: {
            ...((!name) && { name: 'is required' }),
            ...((!email) && { email: 'is required' }),
            ...((!password) && { password: 'is required' })
          }
        }, { status: 400 });
      }

      // Check if email already exists
      const emailExists = Object.values(mockUsers).some(u => u.email === email);
      if (emailExists) {
        return HttpResponse.json({
          error: 'validation failed',
          fields: { email: 'already exists' }
        }, { status: 400 });
      }

      // Create new user
      const userId = 'user_' + Date.now();
      const newUser = {
        _id: userId,
        name,
        email,
        password
      };
      mockUsers[userId] = newUser;

      // Generate token
      const token = generateToken();
      sessionTokens.set(token, userId);

      return HttpResponse.json({
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email
        }
      }, { status: 201 });
    } catch (error) {
      return HttpResponse.json({
        error: error.message
      }, { status: 400 });
    }
  }),

  http.post('*/auth/login', async ({ request }) => {
    try {
      const body = await request.json();
      const { email, password } = body;

      if (!email || !password) {
        return HttpResponse.json({
          error: 'validation failed',
          fields: {
            ...((!email) && { email: 'is required' }),
            ...((!password) && { password: 'is required' })
          }
        }, { status: 400 });
      }

      // Find user by email
      const user = Object.values(mockUsers).find(u => u.email === email);
      if (!user || user.password !== password) {
        return HttpResponse.json({
          error: 'unauthorized'
        }, { status: 401 });
      }

      // Generate token
      const token = generateToken();
      sessionTokens.set(token, user._id);

      return HttpResponse.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      return HttpResponse.json({
        error: error.message
      }, { status: 400 });
    }
  }),

  // ===== PROJECT ROUTES =====
  http.get('*/projects', ({ request }) => {
    const userId = getUserFromAuth(request);
    if (!userId) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const projects = Object.values(mockProjects).filter(p => p.owner_id === userId);
    return HttpResponse.json({ projects });
  }),

  http.post('*/projects', async ({ request }) => {
    const userId = getUserFromAuth(request);
    if (!userId) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    try {
      const body = await request.json();
      const { name, description } = body;

      if (!name) {
        return HttpResponse.json({
          error: 'validation failed',
          fields: { name: 'is required' }
        }, { status: 400 });
      }

      const projectId = 'proj_' + Date.now();
      const newProject = {
        _id: projectId,
        name,
        description: description || '',
        owner_id: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockProjects[projectId] = newProject;

      return HttpResponse.json(newProject, { status: 201 });
    } catch (error) {
      return HttpResponse.json({
        error: error.message
      }, { status: 400 });
    }
  }),

  http.get('*/projects/:id', ({ request, params }) => {
    const userId = getUserFromAuth(request);
    if (!userId) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const project = mockProjects[params.id];
    if (!project || project.owner_id !== userId) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 });
    }

    const tasks = Object.values(mockTasks).filter(t => t.project_id === params.id);
    return HttpResponse.json({ ...project, tasks });
  }),

  http.patch('*/projects/:id', async ({ request, params }) => {
    const userId = getUserFromAuth(request);
    if (!userId) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    try {
      const project = mockProjects[params.id];
      if (!project || project.owner_id !== userId) {
        return HttpResponse.json({ error: 'not found' }, { status: 404 });
      }

      const body = await request.json();
      const { name, description } = body;

      if (name) project.name = name;
      if (description !== undefined) project.description = description;
      project.updatedAt = new Date().toISOString();

      return HttpResponse.json(project);
    } catch (error) {
      return HttpResponse.json({
        error: error.message
      }, { status: 400 });
    }
  }),

  http.delete('*/projects/:id', ({ request, params }) => {
    const userId = getUserFromAuth(request);
    if (!userId) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const project = mockProjects[params.id];
    if (!project || project.owner_id !== userId) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 });
    }

    delete mockProjects[params.id];
    // Also delete associated tasks
    Object.keys(mockTasks).forEach(taskId => {
      if (mockTasks[taskId].project_id === params.id) {
        delete mockTasks[taskId];
      }
    });

    return HttpResponse.json({}, { status: 204 });
  }),

  // ===== TASK ROUTES =====
  http.get('*/projects/:id/tasks', ({ request, params }) => {
    const userId = getUserFromAuth(request);
    if (!userId) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const project = mockProjects[params.id];
    if (!project || project.owner_id !== userId) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 });
    }

    let tasks = Object.values(mockTasks).filter(t => t.project_id === params.id);

    // Apply filters
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const assignee = url.searchParams.get('assignee');

    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }
    if (assignee) {
      tasks = tasks.filter(t => t.assignee_id === assignee);
    }

    return HttpResponse.json({ tasks });
  }),

  http.post('*/projects/:id/tasks', async ({ request, params }) => {
    const userId = getUserFromAuth(request);
    if (!userId) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    try {
      const project = mockProjects[params.id];
      if (!project || project.owner_id !== userId) {
        return HttpResponse.json({ error: 'not found' }, { status: 404 });
      }

      const body = await request.json();
      const { title, description, priority, assignee_id, due_date } = body;

      if (!title) {
        return HttpResponse.json({
          error: 'validation failed',
          fields: { title: 'is required' }
        }, { status: 400 });
      }

      const taskId = 'task_' + Date.now();
      const newTask = {
        _id: taskId,
        title,
        description: description || '',
        priority: priority || 'medium',
        status: 'pending',
        assignee_id: assignee_id || null,
        due_date: due_date || null,
        project_id: params.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockTasks[taskId] = newTask;

      return HttpResponse.json(newTask, { status: 201 });
    } catch (error) {
      return HttpResponse.json({
        error: error.message
      }, { status: 400 });
    }
  }),

  http.patch('*/tasks/:id', async ({ request, params }) => {
    const userId = getUserFromAuth(request);
    if (!userId) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    try {
      const task = mockTasks[params.id];
      if (!task) {
        return HttpResponse.json({ error: 'not found' }, { status: 404 });
      }

      const project = mockProjects[task.project_id];
      if (!project || project.owner_id !== userId) {
        return HttpResponse.json({ error: 'forbidden' }, { status: 403 });
      }

      const body = await request.json();
      Object.keys(body).forEach(key => {
        if (body[key] !== undefined) {
          task[key] = body[key];
        }
      });
      task.updatedAt = new Date().toISOString();

      return HttpResponse.json(task);
    } catch (error) {
      return HttpResponse.json({
        error: error.message
      }, { status: 400 });
    }
  }),

  http.delete('*/tasks/:id', ({ request, params }) => {
    const userId = getUserFromAuth(request);
    if (!userId) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const task = mockTasks[params.id];
    if (!task) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 });
    }

    const project = mockProjects[task.project_id];
    if (!project || project.owner_id !== userId) {
      return HttpResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    delete mockTasks[params.id];
    return HttpResponse.json({}, { status: 204 });
  })
];

module.exports = { handlers };
