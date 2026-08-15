(function(){
  "use strict";

  var API_BASE = "http://localhost:5000/api/tasks";

  // ---- Mobile nav toggle (unchanged) ----
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

  // ---- Task manager state (now backed by API) ----
  var tasks = [];
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

  // ---- API helpers ----
  function apiFetch(url, options){
    return fetch(url, options).then(function(res){
      // DELETE returns 204 No Content — no body to parse
      if(res.status === 204){
        return {};
      }
      return res.json().then(function(body){
        if(!res.ok){
          throw new Error(body.message || 'Request failed');
        }
        return body;
      });
    });
  }

  function loadTasks(){
    apiFetch(API_BASE)
      .then(function(body){
        tasks = body.data;
        render();
      })
      .catch(function(err){
        emptyState.style.display = 'block';
        emptyState.textContent = 'Could not load tasks. Is the backend server running?';
        console.error(err);
      });
  }

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
        apiFetch(API_BASE + '/' + t.id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ done: checkbox.checked })
        }).then(loadTasks).catch(function(err){ console.error(err); });
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
        apiFetch(API_BASE + '/' + t.id, { method: 'DELETE' })
          .then(loadTasks)
          .catch(function(err){ console.error(err); });
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

    apiFetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text, priority: prioritySelect.value })
    }).then(function(){
      input.value = '';
      input.focus();
      loadTasks();
    }).catch(function(err){ console.error(err); });
  });

  filterButtons.forEach(function(btn){
    btn.addEventListener('click', function(){
      filterButtons.forEach(function(b){ b.setAttribute('aria-pressed','false'); });
      btn.setAttribute('aria-pressed','true');
      currentFilter = btn.getAttribute('data-filter');
      render();
    });
  });

  // Load tasks from backend on page load
  loadTasks();
})();