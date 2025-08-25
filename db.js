const fs = require('fs');
const DB_PATH = './db.txt';

// Convert the text file format to JSON array
const dbTextToJson = (text) => {
  if (!text.trim()) return [];
  const formattedString = `[${text.trim().split("\n}\n{").join("},{")}]`;
  return JSON.parse(formattedString);
};

// Convert JSON array to the stored text format
const JsonToDbText = (jsonArray) => {
  let text = "";
  jsonArray.forEach((todo) => {
    text += JSON.stringify(todo, null, 2) + "\n";
  });
  return text;
};

const getTodosSync = () => {
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return data;
};

const getTodoSync = (id) => {
  const text = fs.readFileSync(DB_PATH, 'utf8');
  const arr = dbTextToJson(text);
  const todo = arr.find(item => item.id === id);
  return todo ? JSON.stringify(todo) : null; 
};


const createTodoSync = (todoTitle) => {
  const obj = {
    id: Date.now(),
    title: todoTitle,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Read existing todos
  const data = fs.readFileSync(DB_PATH, 'utf8');
  const todos = dbTextToJson(data);

  // Add new todo
  todos.push(obj);

  // Write back
  const text = JsonToDbText(todos);
  fs.writeFileSync(DB_PATH, text);
};

const updateTodoSync = (id, updates) => {
  const data = fs.readFileSync(DB_PATH, 'utf8');
  const todos = dbTextToJson(data);

  todos.forEach(item => {
    if (item.id == id) {
      Object.entries(updates).forEach(([key, value]) => {
        item[key] = value;
      });
      item.updatedAt = new Date().toISOString();
    }
  });

  const text = JsonToDbText(todos);
  fs.writeFileSync(DB_PATH, text);
};

const deleteTodoSync = (id) => {
  const data = fs.readFileSync(DB_PATH, 'utf8');
  const todos = dbTextToJson(data);

  const filtered = todos.filter(item => item.id !== id);

  const text = JsonToDbText(filtered);
  fs.writeFileSync(DB_PATH, text);
};

module.exports = {
  getTodosSync,
  getTodoSync,
  createTodoSync,
  updateTodoSync,
  deleteTodoSync,
};