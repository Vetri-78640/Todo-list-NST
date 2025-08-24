const fs = require('fs');
const path = require('path');
const DB_PATH = path.join(__dirname, 'db.txt');

// Helper: Read all todos as array of objects
function readTodosSync() {
  if (!fs.existsSync(DB_PATH)) return [];
  const data = fs.readFileSync(DB_PATH, 'utf8').trim();
  if (!data) return [];
  return data.split('\n').map(line => JSON.parse(line));
}

// Helper: Write todos array back to file
function writeTodosSync(todos) {
  const data = todos.map(todo => JSON.stringify(todo, null, 2)).join('\n');
  fs.writeFileSync(DB_PATH, data + (data ? '\n' : ''));
}

// 1. Create
function createTodoSync(title) {
  const now = new Date().toISOString();
  const todo = {
    id: Date.now(),
    title,
    isCompleted: false,
    createdAt: now,
    updatedAt: now
  };
  const line = JSON.stringify(todo, null, 2);
  fs.appendFileSync(DB_PATH, line + '\n');
  return todo;
}

// 2. Get all (raw)
function getTodosSync() {
  if (!fs.existsSync(DB_PATH)) return '';
  return fs.readFileSync(DB_PATH, 'utf8');
}

// 3. Get by ID (stringified JSON)
function getTodoSync(id) {
  const todos = readTodosSync();
  const todo = todos.find(t => t.id === id);
  return todo ? JSON.stringify(todo, null, 2) : null;
}

// 4. Update
function updateTodoSync(id, updates) {
  const todos = readTodosSync();
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return null;
  todos[idx] = {
    ...todos[idx],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  writeTodosSync(todos);
  return todos[idx];
}

// 5. Delete
function deleteTodoSync(id) {
  const todos = readTodosSync();
  const filtered = todos.filter(t => t.id !== id);
  writeTodosSync(filtered);
  return todos.length !== filtered.length;
}

module.exports = {
  createTodoSync,
  getTodosSync,
  getTodoSync,
  updateTodoSync,
  deleteTodoSync
};