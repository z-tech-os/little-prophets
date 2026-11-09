/* ============================================
   Little Prophets - Main JavaScript
   Theme toggle, Sidebar, Loader, Offline Popup
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  // ---------- LOADER ----------
  const loader = document.getElementById('loader');
  if (loader) {
    // Simulate a short beautiful loading time
    setTimeout(() => {
      loader.classList.add('hidden');
      // Show offline popup after loader (only once per session)
      setTimeout(showOfflinePopup, 800);
    }, 1400);
  } else {
    showOfflinePopup();
  }

  // ---------- THEME TOGGLE ----------
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
  }

  // ---------- MOBILE SIDEBAR ----------
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarClose = document.getElementById('sidebarClose');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('active');
    if (sidebarOverlay) sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('active');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  // Close sidebar when a link is clicked
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', closeSidebar);
  });

  // ---------- OFFLINE / DOWNLOAD POPUP ----------
  function showOfflinePopup() {
    // Only show once per browser session
    if (sessionStorage.getItem('offlinePopupShown')) return;

    const popup = document.getElementById('offlinePopup');
    if (!popup) return;

    popup.classList.add('active');
    sessionStorage.setItem('offlinePopupShown', 'true');
  }

  // Close popup buttons
  const popupCloseBtns = document.querySelectorAll('[data-close-popup]');
  popupCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const popup = document.getElementById('offlinePopup');
      if (popup) popup.classList.remove('active');
    });
  });

  // "Download for Offline" button - registers service worker if available
  const downloadBtn = document.getElementById('downloadOfflineBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
          .then(() => {
            alert('Great! This site is now ready to work offline. You can close this tab and open it later without internet.');
            const popup = document.getElementById('offlinePopup');
            if (popup) popup.classList.remove('active');
          })
          .catch(() => {
            alert('Offline mode is ready in supported browsers. You can still bookmark this page!');
            const popup = document.getElementById('offlinePopup');
            if (popup) popup.classList.remove('active');
          });
      } else {
        alert('Your browser does not support offline mode, but you can still bookmark the page!');
        const popup = document.getElementById('offlinePopup');
        if (popup) popup.classList.remove('active');
      }
    });
  }

  // ---------- ACTIVE NAV LINK ----------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-desktop a, .sidebar-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href.includes(currentPage) || (currentPage === '' && href.includes('index')))) {
      link.classList.add('active');
    }
  });
});
