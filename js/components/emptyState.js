/**
 * Reusable Empty State Component
 */

export function createEmptyState(options = {}) {
  const {
    icon = 'film',
    title = 'No movies found',
    description = 'Try adjusting your search query or filters to find what you are looking for.',
    actionText = 'Discover Movies',
    actionHref = 'search.html',
    onActionClick = null
  } = options;

  let iconSvg = '';
  if (icon === 'bookmark') {
    iconSvg = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
  } else if (icon === 'heart') {
    iconSvg = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
  } else if (icon === 'search') {
    iconSvg = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
  } else if (icon === 'alert') {
    iconSvg = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  } else {
    iconSvg = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>`;
  }

  const el = document.createElement('div');
  el.className = 'empty-state';
  el.innerHTML = `
    <div class="empty-state-icon">${iconSvg}</div>
    <h3 class="empty-state-title">${title}</h3>
    <p class="empty-state-text">${description}</p>
    ${
      actionText
        ? `<a href="${actionHref}" class="btn btn-primary empty-state-btn">${actionText}</a>`
        : ''
    }
  `;

  if (onActionClick) {
    const btn = el.querySelector('.empty-state-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        if (!actionHref || actionHref === '#') {
          e.preventDefault();
        }
        onActionClick(e);
      });
    }
  }

  return el;
}
