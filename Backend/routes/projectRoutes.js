const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const auth = require('../middlewares/auth');
const router = express.Router();


router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner_id: req.user._id });
    const transformedProjects = projects.map(project => ({
      id: project._id,
      name: project.name,
      description: project.description,
      owner_id: project.owner_id,
      created_at: project.created_at
    }));
    res.json({ projects: transformedProjects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'validation failed', fields: { name: 'is required' } });
    }
    const project = new Project({ name, description, owner_id: req.user._id });
    await project.save();
    const transformedProject = {
      id: project._id,
      name: project.name,
      description: project.description,
      owner_id: project.owner_id,
      created_at: project.created_at
    };
    res.status(201).json(transformedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner_id: req.user._id });
    if (!project) {
      return res.status(404).json({ error: 'not found' });
    }
    const tasks = await Task.find({ project_id: req.params.id });
    res.json({ ...project.toObject(), tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.patch('/:id', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner_id: req.user._id },
      { name, description },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ error: 'not found' });
    }
    const transformedProject = {
      id: project._id,
      name: project.name,
      description: project.description,
      owner_id: project.owner_id,
      created_at: project.created_at
    };
    res.json(transformedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner_id: req.user._id });
    if (!project) {
      return res.status(404).json({ error: 'not found' });
    }
    await Task.deleteMany({ project_id: req.params.id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
