const fs = require('fs');
const path = require('path');
const os = require('os');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbFile = path.join(dataDir, 'db.json');

function read() {
  try {
    if (!fs.existsSync(dbFile)) {
      const init = { users: [], tasks: [], _seq: { users: 0, tasks: 0 } };
      fs.writeFileSync(dbFile, JSON.stringify(init, null, 2), 'utf8');
    }
    const raw = fs.readFileSync(dbFile, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read DB file', err);
    return { users: [], tasks: [], _seq: { users: 0, tasks: 0 } };
  }
}

function write(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf8');
}

async function findUserByEmail(email) {
  const db = read();
  return db.users.find((u) => u.email === email.toLowerCase()) || null;
}

async function createUser({ name, email, password }) {
  const db = read();
  const id = ++db._seq.users;
  const user = { id, name, email: email.toLowerCase(), password, created_at: new Date().toISOString() };
  db.users.push(user);
  write(db);
  return { id: user.id, name: user.name, email: user.email, created_at: user.created_at };
}

async function getUserById(id) {
  const db = read();
  return db.users.find((u) => u.id === Number(id)) || null;
}

async function getTasks(userId, status) {
  const db = read();
  let tasks = db.tasks.filter((t) => t.user_id === Number(userId));
  if (status) tasks = tasks.filter((t) => t.status === status);
  tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return tasks;
}

async function getTaskById(id, userId) {
  const db = read();
  return db.tasks.find((t) => t.id === Number(id) && t.user_id === Number(userId)) || null;
}

async function createTask({ user_id, title, description, status, due_date }) {
  const db = read();
  const id = ++db._seq.tasks;
  const now = new Date().toISOString();
  const task = {
    id,
    user_id: Number(user_id),
    title,
    description: description || null,
    status: status || 'pending',
    due_date: due_date || null,
    created_at: now,
    updated_at: now,
  };
  db.tasks.push(task);
  write(db);
  return task;
}

async function updateTask(id, userId, fields) {
  const db = read();
  const idx = db.tasks.findIndex((t) => t.id === Number(id) && t.user_id === Number(userId));
  if (idx === -1) return null;
  const current = db.tasks[idx];
  const updated = { ...current, ...fields, updated_at: new Date().toISOString() };
  db.tasks[idx] = updated;
  write(db);
  return updated;
}

async function deleteTask(id, userId) {
  const db = read();
  const idx = db.tasks.findIndex((t) => t.id === Number(id) && t.user_id === Number(userId));
  if (idx === -1) return false;
  const removed = db.tasks.splice(idx, 1)[0];
  write(db);
  return removed;
}

module.exports = {
  findUserByEmail,
  createUser,
  getUserById,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  _dbFile: dbFile,
};
