const db = require('../config/db');

const VALID_STATUSES = ['pending', 'in-progress', 'completed'];

// GET /api/tasks  (supports optional ?status= filter)
async function getTasks(req, res) {
  try {
    const { status } = req.query;
    const tasks = await db.getTasks(req.user.id, status);
    res.json(tasks);
  } catch (err) {
    console.error('GetTasks error:', err);
    res.status(500).json({ message: 'Server error fetching tasks.' });
  }
}

// GET /api/tasks/:id
async function getTaskById(req, res) {
  try {
    const task = await db.getTaskById(req.params.id, req.user.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json(task);
  } catch (err) {
    console.error('GetTaskById error:', err);
    res.status(500).json({ message: 'Server error fetching task.' });
  }
}

// POST /api/tasks
async function createTask(req, res) {
  try {
    const { title, description, status, due_date } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required.' });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const task = await db.createTask({
      user_id: req.user.id,
      title,
      description: description || null,
      status: status || 'pending',
      due_date: due_date || null,
    });
    res.status(201).json(task);
  } catch (err) {
    console.error('CreateTask error:', err);
    res.status(500).json({ message: 'Server error creating task.' });
  }
}

// PUT /api/tasks/:id
async function updateTask(req, res) {
  try {
    const { title, description, status, due_date } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const current = await db.getTaskById(req.params.id, req.user.id);
    if (!current) return res.status(404).json({ message: 'Task not found.' });

    const updated = await db.updateTask(req.params.id, req.user.id, {
      title: title ?? current.title,
      description: description ?? current.description,
      status: status ?? current.status,
      due_date: due_date ?? current.due_date,
    });

    res.json(updated);
  } catch (err) {
    console.error('UpdateTask error:', err);
    res.status(500).json({ message: 'Server error updating task.' });
  }
}

// DELETE /api/tasks/:id
async function deleteTask(req, res) {
  try {
    const removed = await db.deleteTask(req.params.id, req.user.id);
    if (!removed) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted successfully.', id: removed.id });
  } catch (err) {
    console.error('DeleteTask error:', err);
    res.status(500).json({ message: 'Server error deleting task.' });
  }
}

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
