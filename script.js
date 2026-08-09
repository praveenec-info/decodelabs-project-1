(function(){
  "use strict";

  // ---- Mobile nav toggle ----
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');
  navToggle.addEventListener('click', function(){
    var open = primaryNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  primaryNav.addEventListener('click', function(e){
    if(e.target.tagName === 'A' && primaryNav.classList.contains('open')){
      primaryNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // ---- Task manager state (in-memory) ----
  var tasks = [];
  var idCounter = 0;
  var currentFilter = 'all';

  var form = document.getElementById('taskForm');
  var input = document.getElementById('taskInput');
  var prioritySelect = document.getElementById('prioritySelect');
  var list = document.getElementById('taskList');
  var emptyState = document.getElementById('emptyState');
  var filterButtons = document.querySelectorAll('.filters button');

  var statTotal = document.getElementById('statTotal');
  var statDone = document.getElementById('statDone');
  var statActive = document.getElementById('statActive');
  var statHigh = document.getElementById('statHigh');
  var dialPercent = document.getElementById('dialPercent');

  function render(){
    list.innerHTML = '';
    var visible = tasks.filter(function(t){
      if(currentFilter === 'active') return !t.done;
      if(currentFilter === 'done') return t.done;
      return true;
    });

    if(visible.length === 0){
      emptyState.style.display = 'block';
      emptyState.textContent = tasks.length === 0
        ? 'No tasks yet — add your first one above.'
        : 'Nothing here for this filter.';
    } else {
      emptyState.style.display = 'none';
    }

    visible.forEach(function(t){
      var li = document.createElement('li');
      li.className = 'task-item' + (t.done ? ' done' : '');

      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = t.done;
      checkbox.setAttribute('aria-label', 'Mark "' + t.text + '" as ' + (t.done ? 'active' : 'done'));
      checkbox.addEventListener('change', function(){
        t.done = checkbox.checked;
        render();
      });

      var span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = t.text;

      var tag = document.createElement('span');
      tag.className = 'tag ' + t.priority;
      tag.textContent = t.priority;

      var delBtn = document.createElement('button');
      delBtn.className = 'del-btn';
      delBtn.type = 'button';
      delBtn.innerHTML = '&#10005;';
      delBtn.setAttribute('aria-label', 'Delete "' + t.text + '"');
      delBtn.addEventListener('click', function(){
        tasks = tasks.filter(function(x){ return x.id !== t.id; });
        render();
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(tag);
      li.appendChild(delBtn);
      list.appendChild(li);
    });

    updateStats();
  }

  function updateStats(){
    var total = tasks.length;
    var done = tasks.filter(function(t){ return t.done; }).length;
    var active = total - done;
    var high = tasks.filter(function(t){ return t.priority === 'high' && !t.done; }).length;

    statTotal.textContent = total;
    statDone.textContent = done;
    statActive.textContent = active;
    statHigh.textContent = high;

    var pct = total === 0 ? 0 : Math.round((done / total) * 100);
    dialPercent.textContent = pct + '%';
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var text = input.value.trim();
    if(!text) return;
    tasks.push({
      id: ++idCounter,
      text: text,
      priority: prioritySelect.value,
      done: false
    });
    input.value = '';
    input.focus();
    render();
  });

  filterButtons.forEach(function(btn){
    btn.addEventListener('click', function(){
      filterButtons.forEach(function(b){ b.setAttribute('aria-pressed','false'); });
      btn.setAttribute('aria-pressed','true');
      currentFilter = btn.getAttribute('data-filter');
      render();
    });
  });

  // Seed a couple of example tasks so the UI isn't empty on load
  tasks.push({ id: ++idCounter, text: 'Walking', priority: 'high', done: true });
  tasks.push({ id: ++idCounter, text: 'Writing', priority: 'normal', done: false });
  tasks.push({ id: ++idCounter, text: 'Exercise', priority: 'low', done: false });
  render();
})();