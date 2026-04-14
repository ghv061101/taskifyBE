// Mock data for MSW handlers
const mockUsers = {
  user_1: {
    _id: 'user_1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed_password_123'
  },
  user_2: {
    _id: 'user_2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'hashed_password_456'
  }
};

const mockProjects = {
  proj_1: {
    _id: 'proj_1',
    name: 'Website Redesign',
    description: 'Redesign company website with new branding',
    owner_id: 'user_1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  proj_2: {
    _id: 'proj_2',
    name: 'Mobile App Development',
    description: 'Build iOS and Android mobile app',
    owner_id: 'user_1',
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-02-10T12:00:00Z'
  },
  proj_3: {
    _id: 'proj_3',
    name: 'API Integration',
    description: 'Integrate third-party payment API',
    owner_id: 'user_2',
    createdAt: '2024-02-05T09:00:00Z',
    updatedAt: '2024-02-15T14:00:00Z'
  }
};

const mockTasks = {
  task_1: {
    _id: 'task_1',
    title: 'Design mockups',
    description: 'Create UI mockups for homepage',
    priority: 'high',
    status: 'in_progress',
    assignee_id: 'user_1',
    project_id: 'proj_1',
    due_date: '2024-03-01T23:59:59Z',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z'
  },
  task_2: {
    _id: 'task_2',
    title: 'Implement authentication',
    description: 'Add JWT-based authentication',
    priority: 'high',
    status: 'completed',
    assignee_id: 'user_1',
    project_id: 'proj_2',
    due_date: '2024-03-10T23:59:59Z',
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-02-20T16:00:00Z'
  },
  task_3: {
    _id: 'task_3',
    title: 'Setup database',
    description: 'Configure MongoDB and create schemas',
    priority: 'high',
    status: 'completed',
    assignee_id: 'user_2',
    project_id: 'proj_2',
    due_date: '2024-03-05T23:59:59Z',
    createdAt: '2024-02-01T08:30:00Z',
    updatedAt: '2024-02-18T10:00:00Z'
  },
  task_4: {
    _id: 'task_4',
    title: 'API Documentation',
    description: 'Write comprehensive API docs',
    priority: 'medium',
    status: 'pending',
    assignee_id: 'user_2',
    project_id: 'proj_3',
    due_date: '2024-03-15T23:59:59Z',
    createdAt: '2024-02-05T09:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z'
  },
  task_5: {
    _id: 'task_5',
    title: 'Frontend styling',
    description: 'Apply CSS and responsive design',
    priority: 'medium',
    status: 'in_progress',
    assignee_id: 'user_1',
    project_id: 'proj_1',
    due_date: '2024-03-05T23:59:59Z',
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-02-10T13:00:00Z'
  }
};

module.exports = {
  mockUsers,
  mockProjects,
  mockTasks
};
