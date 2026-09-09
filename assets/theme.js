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

  function simplifyExportHint() {
    var hint = document.querySelector('.submit-area .export-hint');
    var exportBtn = document.getElementById('exportBtn');
    if (!hint || !exportBtn || !exportBtn.parentNode) return;

    hint.textContent = '自动保存 · 点击生成问卷卡片';
    exportBtn.parentNode.insertBefore(hint, exportBtn);
    hint.style.margin = '0 0 12px';
    hint.style.maxWidth = 'none';
  }

  function forcedColors() {
    return !!(window.matchMedia && window.matchMedia('(forced-colors: active)').matches);
  }

  function installOverlayScrollbar() {
    if (!document.body || forcedColors() || document.getElementById('surveyOverlayThumb')) return;
    var thumb = document.createElement('div');
    thumb.id = 'surveyOverlayThumb';
    thumb.className = 'survey-overlay-thumb';
    thumb.hidden = true;
    thumb.tabIndex = 0;
    thumb.setAttribute('role', 'scrollbar');
    thumb.setAttribute('aria-orientation', 'vertical');
    thumb.setAttribute('aria-label', '页面滚动条');
    thumb.setAttribute('aria-valuemin', '0');
    thumb.setAttribute('aria-valuemax', '100');
    thumb.setAttribute('aria-valuenow', '0');
    document.body.appendChild(thumb);
    root.classList.add('survey-overlay-scrollbar');

    var dragging = false;
    var dragOffset = 0;
    var pending = false;
    var isTouchDevice = window.matchMedia && (
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    );
    var scrollTimer = null;
    var thumbVisible = false;

    function metrics() {
      var se = document.scrollingElement || document.documentElement;
      var view = se.clientHeight;
      var scroll = se.scrollHeight;
      return { se: se, view: view, scroll: scroll, max: Math.max(0, scroll - view) };
    }

    function update() {
      var m = metrics();
      if (m.max <= 0) {
        thumb.hidden = true;
        thumb.setAttribute('aria-valuenow', '0');
        return;
      }
      var thumbH = Math.max(24, Math.round((m.view / m.scroll) * m.view));
      var track = Math.max(1, m.view - thumbH);
      var top = (m.se.scrollTop / m.max) * track;

      // 移动端：仅在滚动时显示
      if (isTouchDevice && !dragging) {
        thumb.hidden = !thumbVisible;
      } else {
        thumb.hidden = false;
      }

      thumb.style.height = thumbH + 'px';
      thumb.style.transform = 'translateY(' + top + 'px)';
      thumb.setAttribute('aria-valuenow', String(Math.round((m.se.scrollTop / m.max) * 100)));
    }

    function schedule() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        update();
      });
    }

    function showThumb() {
      if (!isTouchDevice) return;
      thumbVisible = true;
      if (scrollTimer) clearTimeout(scrollTimer);
      schedule();
      scrollTimer = setTimeout(function() {
        thumbVisible = false;
        schedule();
      }, 1500);
    }

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      thumb.classList.remove('is-dragging');
      if (e && e.pointerId != null) {
        try { thumb.releasePointerCapture(e.pointerId); } catch (err) {}
      }
    }

    thumb.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      dragging = true;
      thumb.classList.add('is-dragging');
      dragOffset = e.clientY - thumb.getBoundingClientRect().top;
      thumb.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    thumb.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var m = metrics();
      var thumbH = thumb.offsetHeight;
      var track = m.view - thumbH;
      if (track <= 0) return;
      var y = Math.max(0, Math.min(track, e.clientY - dragOffset));
      m.se.scrollTop = (y / track) * m.max;
    });
    thumb.addEventListener('pointerup', endDrag);
    thumb.addEventListener('pointercancel', endDrag);

    thumb.addEventListener('keydown', function (e) {
      var m = metrics();
      var map = {
        ArrowDown: m.se.scrollTop + 40,
        ArrowUp: m.se.scrollTop - 40,
        PageDown: m.se.scrollTop + m.view * 0.9,
        PageUp: m.se.scrollTop - m.view * 0.9,
        Home: 0,
        End: m.max
      };
      if (!(e.key in map)) return;
      m.se.scrollTop = map[e.key];
      e.preventDefault();
    });

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('scroll', showThumb, { passive: true });
    window.addEventListener('touchmove', showThumb, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', schedule);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(schedule);
      ro.observe(root);
      ro.observe(document.body);
    }
    update();
  }

  function installMobileScrollbarAutoHide() {
    var isTouchDevice = window.matchMedia && (
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    );

    if (!isTouchDevice) return;

    var scrollTimer = null;
    var isScrolling = false;

    function showScrollbar() {
      if (!isScrolling) {
        isScrolling = true;
        root.classList.add('is-scrolling');
      }

      if (scrollTimer) clearTimeout(scrollTimer);

      scrollTimer = setTimeout(function() {
        isScrolling = false;
        root.classList.remove('is-scrolling');
      }, 1500);
    }

    window.addEventListener('scroll', showScrollbar, { passive: true });
    window.addEventListener('touchmove', showScrollbar, { passive: true });
  }

  function setup() {
    build();
    simplifyExportHint();
    installOverlayScrollbar();
    installMobileScrollbarAutoHide();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();

  if (window.matchMedia) {
    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function (event) {
      if (!stored()) apply(event.matches ? 'dark' : 'light', false);
    };
    if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', onChange);
    else if (mediaQuery.addListener) mediaQuery.addListener(onChange);
  }
})();
