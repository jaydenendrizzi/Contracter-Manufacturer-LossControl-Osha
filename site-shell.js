'use strict';

// Presentation only. Visits, reports and local storage stay with the existing tools.
(() => {
  const main = document.querySelector('body > main');
  const oldHeader = document.querySelector('body > header');
  if (!main || !oldHeader) return;

  const page = location.pathname.split('/').pop() || 'index.html';
  const isIndex = page === 'index.html';
  const pages = {
    'handouts.html': 'Handouts',
    'clients.html': 'Clients',
    'backup.html': 'Backup & offline',
    'content-review.html': 'Content review', 'team.html': 'Team workspace'
  };
  const views = {lookup: 'Site lookup', prospects: 'Prospects', industry: 'Industry risk', walk: 'Walkthrough', library: 'Library', stats: 'Visit stats'};
  const paths = {
    walk: 'M9 5H6v15h12V5h-3M9 3h6v4H9zM9 12h6M9 16h4',
    handouts: 'M7 3h8l4 4v14H5V3h2M14 3v5h5M8 12h8M8 16h6',
    clients: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M17 4a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-4',
    lookup: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    prospects: 'M3 20V10h4v10M10 20V4h4v16M17 20V7h4v13',
    industry: 'M3 21V10l6 3V8l6 3V3h4l2 18H3M7 17h1M12 17h1M17 17h1',
    library: 'M4 3h5v18H4zM9 3h5v18H9M17 3l4 17-4 1-3-17z',
    stats: 'M3 3v18h18M7 15l4-5 4 3 5-8',
    backup: 'M5 16a4 4 0 0 1-1-8 7 7 0 0 1 13-2 5 5 0 0 1 2 10M12 12v10M8 18l4 4 4-4',
    menu: 'M4 6h16M4 12h16M4 18h16',
    close: 'M6 6l12 12M6 18L18 6'
  };
  const icon = name => `<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]}"></path></svg>`;
  const href = view => isIndex ? '#' + view : 'index.html#' + view;
  const originalLinks = [...oldHeader.querySelectorAll('.tabs a')];
  const link = (key, label, target) => {
    const a = originalLinks.find(a => a.getAttribute('href') === target) || document.createElement('a');
    a.href = target;
    a.dataset.shellKey = key;
    a.innerHTML = icon(key) + `<span>${label}</span>`;
    return a;
  };
  const sidebar = document.createElement('aside');
  sidebar.className = 'lc-sidebar';
  sidebar.id = 'lc-navigation';
  sidebar.setAttribute('aria-label', 'Loss Control navigation');
  const logo = oldHeader.querySelector('img');
  sidebar.innerHTML = `<a class="lc-brand" href="${href('lookup')}" aria-label="R&R Loss Control home"><span class="lc-logo"></span><strong>Loss Control<small>R&R INSURANCE</small></strong></a><button class="lc-close" type="button" aria-label="Close navigation">${icon('close')}</button><nav class="tabs lc-nav" aria-label="Tools"><p class="lc-nav-label">WORKSPACE</p></nav><div class="lc-sidebar-bottom"><a class="lc-backup-link" href="team.html">${icon('clients')}<span>Team workspace</span></a><p>Made for the walk.<small>Visits, handouts and follow-through.</small></p><a class="lc-backup-link" href="backup.html">${icon('backup')}<span>Backup & offline</span></a></div>`;
  // Keep the embedded R&R logo node used by the existing visit PDF renderer.
  if (logo) sidebar.querySelector('.lc-logo').append(logo);
  const nav = sidebar.querySelector('nav');
  nav.append(link('walk', 'Walkthrough', href('walk')), link('handouts', 'Handouts', 'handouts.html'), link('clients', 'Clients', 'clients.html'));
  const researchLabel = document.createElement('p');
  researchLabel.className = 'lc-nav-label lc-research-label';
  researchLabel.textContent = 'RESEARCH';
  nav.append(researchLabel);
  for (const [key, label] of [['lookup', 'Site lookup'], ['prospects', 'Prospects'], ['industry', 'Industry risk'], ['library', 'Library'], ['stats', 'Visit stats']]) nav.append(link(key, label, href(key)));

  const skip = document.createElement('a');
  skip.className = 'lc-skip';
  main.id = main.id || 'lc-main';
  main.tabIndex = -1;
  skip.href = '#' + main.id;
  skip.textContent = 'Skip to content';
  // A skip link must not change the hash router's current view.
  skip.addEventListener('click', event => { event.preventDefault(); main.focus(); main.scrollIntoView({block: 'start'}); });
  const workspace = document.createElement('div');
  workspace.className = 'lc-workspace';
  const bar = document.createElement('header');
  bar.className = 'lc-topbar';
  bar.innerHTML = `<button class="lc-menu" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="lc-navigation">${icon('menu')}</button><a class="lc-mobile-brand" href="${href('lookup')}" aria-label="R&R Loss Control home"><img src="rr-logo.png" alt="R&R Insurance"></a><div class="lc-breadcrumb"><span>Loss Control</span><span aria-hidden="true">/</span><b></b></div><a class="lc-top-backup" href="backup.html">${icon('backup')}<span>Offline & backups</span></a>`;
  const back = oldHeader.querySelector('a:not(.brand)');
  if (!isIndex && back) {
    const contextLink = document.createElement('a');
    contextLink.className = 'lc-back-link';
    contextLink.href = back.getAttribute('href');
    contextLink.textContent = back.textContent;
    main.prepend(contextLink);
  }
  const backdrop = document.createElement('button');
  backdrop.className = 'lc-backdrop';
  backdrop.type = 'button';
  backdrop.hidden = true;
  backdrop.tabIndex = -1;
  backdrop.setAttribute('aria-label', 'Close navigation');
  document.body.prepend(skip, sidebar, backdrop);
  oldHeader.replaceWith(workspace);
  workspace.append(bar, main);
  document.body.classList.add('lc-ready');

  const menu = bar.querySelector('button');
  const close = sidebar.querySelector('button');
  const mobile = matchMedia('(max-width: 900px)');
  let open = false;
  function setOpen(next, restoreFocus = true) {
    open = next && mobile.matches;
    document.body.classList.toggle('lc-menu-open', open);
    backdrop.hidden = !open;
    menu.setAttribute('aria-expanded', String(open));
    workspace.inert = open;
    sidebar.inert = mobile.matches && !open;
    if (open) {
      sidebar.setAttribute('role', 'dialog');
      sidebar.setAttribute('aria-modal', 'true');
      close.focus();
    } else {
      sidebar.removeAttribute('role');
      sidebar.removeAttribute('aria-modal');
      if (restoreFocus && mobile.matches) menu.focus();
    }
  }
  menu.addEventListener('click', () => setOpen(!open));
  close.addEventListener('click', () => setOpen(false));
  backdrop.addEventListener('click', () => setOpen(false));
  sidebar.addEventListener('click', event => {
    if (event.target.closest('a') && open) { setOpen(false, false); main.focus({preventScroll: true}); }
  });
  document.addEventListener('keydown', event => {
    if (!open) return;
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
    if (event.key === 'Tab') {
      const items = [...sidebar.querySelectorAll('a,button')];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  mobile.addEventListener('change', () => { const hadFocus = sidebar.contains(document.activeElement); setOpen(false, false); if (mobile.matches && hadFocus) menu.focus(); });

  function sync() {
    const view = Object.hasOwn(views, location.hash.slice(1)) ? location.hash.slice(1) : 'lookup';
    const current = isIndex ? view : page.replace('.html', '');
    for (const a of nav.querySelectorAll('a')) {
      if (a.dataset.shellKey === current) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    }
    const backup = sidebar.querySelector('a[href="backup.html"]');
    if (page === 'backup.html') backup.setAttribute('aria-current', 'page');
    if (page === 'team.html') sidebar.querySelector('a[href="team.html"]').setAttribute('aria-current','page');
    bar.querySelector('.lc-breadcrumb b').textContent = isIndex ? views[view] : pages[page] || 'Loss Control';
  }
  addEventListener('hashchange', sync);
  setOpen(false, false);
  sync();
})();
