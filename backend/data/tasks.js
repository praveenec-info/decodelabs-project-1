// In-memory data store (no database per project scope)
// Each task: { id, text, priority, done, createdAt }

let tasks = [
  { id: 1, text: "Walking", priority: "high", done: true, createdAt: new Date().toISOString() },
  { id: 2, text: "Writing", priority: "normal", done: false, createdAt: new Date().toISOString() },
  { id: 3, text: "Exercise", priority: "low", done: false, createdAt: new Date().toISOString() }
];

let nextId = 4;

module.exports = {
  getAll: () => tasks,
  getById: (id) => tasks.find((t) => t.id === id),
  create: (data) => {
    const newTask = {
      id: nextId++,
      text: data.text,
      priority: data.priority || "normal",
      done: false,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    return newTask;
  },
  update: (id, data) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return null;
    if (data.text !== undefined) task.text = data.text;
    if (data.priority !== undefined) task.priority = data.priority;
    if (data.done !== undefined) task.done = data.done;
    return task;
  },
  remove: (id) => {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  }
};