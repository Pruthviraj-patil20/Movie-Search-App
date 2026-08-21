/**
 * Skeleton Loader Generators
 */

export const skeleton = {
  /**
   * Single Card Skeleton HTML
   */
  card() {
    return `
      <div class="skeleton-card" aria-hidden="true">
        <div class="skeleton skeleton-poster"></div>
        <div class="skeleton-card-body">
          <div class="skeleton skeleton-card-title"></div>
          <div class="skeleton skeleton-card-meta"></div>
        </div>
      </div>
    `;
  },

  /**
   * Grid of Card Skeletons
   */
  grid(count = 10) {
    return Array.from({ length: count }, () => this.card()).join('');
  },

  /**
   * Carousel of Skeletons
   */
  carousel(count = 6) {
    const cards = Array.from(
      { length: count },
      () => `<div class="carousel-item">${this.card()}</div>`
    ).join('');

    return `
      <div class="carousel-wrapper">
        <div class="carousel-container">${cards}</div>
      </div>
    `;
  },

  /**
   * Hero Skeleton
   */
  hero() {
    return `
      <div class="skeleton-hero" aria-hidden="true">
        <div class="skeleton-hero-content">
          <div class="skeleton" style="width: 120px; height: 24px; border-radius: 4px;"></div>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line short"></div>
          <div style="display: flex; gap: 12px; margin-top: 12px;">
            <div class="skeleton skeleton-btn"></div>
            <div class="skeleton skeleton-btn" style="width: 120px;"></div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Movie Details Skeleton
   */
  details() {
    return `
      <div class="details-container section" style="padding-top: calc(var(--navbar-height) + 2rem);" aria-hidden="true">
        <div class="details-poster-wrap skeleton" style="height: 460px;"></div>
        <div class="details-info">
          <div class="skeleton" style="width: 200px; height: 20px;"></div>
          <div class="skeleton" style="width: 80%; height: 50px; border-radius: 8px;"></div>
          <div class="skeleton" style="width: 60%; height: 24px;"></div>
          <div class="skeleton" style="width: 100%; height: 40px;"></div>
          <div class="skeleton" style="width: 100%; height: 100px; border-radius: 8px;"></div>
          <div class="skeleton" style="width: 100%; height: 120px; border-radius: 8px;"></div>
        </div>
      </div>
    `;
  }
};
