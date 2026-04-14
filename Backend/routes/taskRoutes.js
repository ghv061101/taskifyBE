const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const auth = require('../middlewares/auth');
const router = express.Router();

// GET /projects/:id/tasks
router.get('/projects/:id/tasks', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner_id: req.user._id });
    if (!project) {
      return res.status(404).json({ error: 'not found' });
    }
    const { status, assignee } = req.query;
    let filter = { project_id: req.params.id };
    if (status) filter.status = status;
    if (assignee) filter.assignee_id = assignee;
    const tasks = await Task.find(filter);
    const transformedTasks = tasks.map(task => ({
      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      project_id: task.project_id,
      assignee_id: task.assignee_id,
      due_date: task.due_date,
      created_at: task.created_at
    }));
    res.json({ tasks: transformedTasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /projects/:id/tasks
router.post('/projects/:id/tasks', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner_id: req.user._id });
    if (!project) {
      return res.status(404).json({ error: 'not found' });
    }
    const { title, description, priority, assignee_id, due_date } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'validation failed', fields: { title: 'is required' } });
    }
    const task = new Task({
      title,
      description,
      priority,
      assignee_id,
      due_date,
      project_id: req.params.id
    });
    await task.save();
    const transformedTask = {
      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      project_id: task.project_id,
      assignee_id: task.assignee_id,
      due_date: task.due_date,
      created_at: task.created_at
    };
    res.status(201).json(transformedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /tasks/:id
router.patch('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'not found' });
    }
    const project = await Project.findOne({ _id: task.project_id, owner_id: req.user._id });
    if (!project) {
      return res.status(403).json({ error: 'forbidden' });
    }
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        task[key] = updates[key];
      }
    });
    await task.save();
    const transformedTask = {
      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      project_id: task.project_id,
      assignee_id: task.assignee_id,
      due_date: task.due_date,
      created_at: task.created_at
    };
    res.json(transformedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /tasks/:id
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'not found' });
    }
    const project = await Project.findOne({ _id: task.project_id, owner_id: req.user._id });
    if (!project) {
      return res.status(403).json({ error: 'forbidden' });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
