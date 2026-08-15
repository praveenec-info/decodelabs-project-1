(function(){
  "use strict";

  // Mobile nav toggle — shared behavior for pages without the task manager script
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');

  if(!navToggle || !primaryNav) return;

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
})();