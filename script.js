const STORAGE_KEY = 'taskflow.tasks';
let currentFilter = 'all';

const elements = {
  form: document.querySelector('#taskForm'),
  taskInput: document.querySelector('#taskInput'),
  prioritySelect: document.querySelector('#prioritySelect'),
  taskList: document.querySelector('#taskList'),
  emptyState: document.querySelector('#emptyState'),
  dialPercent: document.querySelector('#dialPercent'),
  filterButtons: document.querySelectorAll('[data-filter]'),
  navToggle: document.querySelector('#navToggle'),
  primaryNav: document.querySelector('#primaryNav'),
  statTotal: document.querySelector('#statTotal'),
  statDone: document.querySelector('#statDone'),
  statActive: document.querySelector('#statActive'),
  statHigh: document.querySelector('#statHigh')
};

let tasks = loadTasks();

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Unable to restore saved tasks:', error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function createTask(text, priority) {
  const id = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return {
    id,
    text,
    priority,
    done: false
  };
}

function getFilteredTasks() {
  switch (currentFilter) {
    case 'active':
      return tasks.filter((task) => !task.done);
    case 'done':
      return tasks.filter((task) => task.done);
    default:
      return tasks;
  }
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter((task) => task.done).length;
  const active = total - done;
  const high = tasks.filter((task) => task.priority === 'high').length;

  elements.statTotal.textContent = String(total);
  elements.statDone.textContent = String(done);
  elements.statActive.textContent = String(active);
  elements.statHigh.textContent = String(high);
}

function updateDial() {
  const total = tasks.length;
  const done = tasks.filter((task) => task.done).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  elements.dialPercent.textContent = `${percent}%`;
}

function renderTasks() {
  const filtered = getFilteredTasks();

  elements.taskList.innerHTML = '';

  if (filtered.length === 0) {
    elements.taskList.hidden = true;
    elements.emptyState.hidden = false;
  } else {
    elements.taskList.hidden = false;
    elements.emptyState.hidden = true;
  }

  filtered.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item ${task.done ? 'done' : ''}`;

    item.innerHTML = `
      <input type="checkbox" ${task.done ? 'checked' : ''} aria-label="Mark ${escapeHtml(task.text)} as done">
      <span class="task-text">${escapeHtml(task.text)}</span>
      <span class="tag ${task.priority}">${task.priority}</span>
      <button type="button" class="del-btn" aria-label="Delete ${escapeHtml(task.text)}">×</button>
    `;

    const checkbox = item.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      saveTasks();
      render();
    });

    const deleteButton = item.querySelector('.del-btn');
    deleteButton.addEventListener('click', () => {
      tasks = tasks.filter((entry) => entry.id !== task.id);
      saveTasks();
      render();
    });

    elements.taskList.appendChild(item);
  });

  updateStats();
  updateDial();
}

function renderFilterButtons() {
  elements.filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function render() {
  renderFilterButtons();
  renderTasks();
}

function handleSubmit(event) {
  event.preventDefault();

  const text = elements.taskInput.value.trim();
  if (!text) {
    elements.taskInput.focus();
    return;
  }

  tasks.push(createTask(text, elements.prioritySelect.value));
  saveTasks();
  elements.form.reset();
  elements.prioritySelect.value = 'normal';
  render();
  elements.taskInput.focus();
}

function toggleMobileNav() {
  const isExpanded = elements.navToggle.getAttribute('aria-expanded') === 'true';
  elements.navToggle.setAttribute('aria-expanded', String(!isExpanded));
  elements.primaryNav.classList.toggle('open', !isExpanded);
}

function initialize() {
  elements.form.addEventListener('submit', handleSubmit);

  elements.filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.filter;
      render();
    });
  });

  if (elements.navToggle && elements.primaryNav) {
    elements.navToggle.addEventListener('click', toggleMobileNav);
  }

  render();
}

initialize();