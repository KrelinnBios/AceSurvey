(function () {
  var root = document.documentElement;
  var KEY = 'theme';

  function system() {
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function current() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function label(theme) {
    return theme === 'dark' ? '切换到浅色模式' : '切换到深色模式';
  }

  root.setAttribute('data-theme', stored() || system());

  var SUN = '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>';
  var MOON = '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 9 0 0 0 21 12.79z"></path></svg>';

  function apply(theme, persist) {
    root.setAttribute('data-theme', theme);
    var button = document.getElementById('themeToggle');
    if (button) button.setAttribute('aria-label', label(theme));
    if (persist) {
      try { localStorage.setItem(KEY, theme); } catch (e) {}
    }
  }

  function build() {
    if (!document.body || document.getElementById('themeToggle')) return;
    var button = document.createElement('button');
    button.id = 'themeToggle';
    button.className = 'theme-toggle';
    button.type = 'button';
    button.setAttribute('aria-label', label(current()));
    button.innerHTML = SUN + MOON;
    button.addEventListener('click', function () {
      apply(current() === 'dark' ? 'light' : 'dark', true);
    });
    document.body.appendChild(button);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();

  if (window.matchMedia) {
    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function (event) {
      if (!stored()) apply(event.matches ? 'dark' : 'light', false);
    };
    if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', onChange);
    else if (mediaQuery.addListener) mediaQuery.addListener(onChange);
  }
})();
