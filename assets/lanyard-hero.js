(function () {
  const stage = document.querySelector('[data-lanyard]');
  let destroy = null;
  let navIntroReady = window.__portfolioNavIntroReady === true;
  let lanyardReady = false;
  let introReleased = false;
  let releaseTimer = 0;
  let onLanyardReady = null;
  const desktop = window.matchMedia('(min-width: 851px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealAndRelease = () => {
    if (!desktop.matches || !stage || !navIntroReady || !lanyardReady || introReleased) return;
    stage.classList.add('is-entering');
    introReleased = true;
    if (reducedMotion) return;
    releaseTimer = window.setTimeout(() => {
      if (desktop.matches && stage && destroy) stage.dispatchEvent(new Event('lanyard:release'));
    }, 500);
  };

  const mount = () => {
    if (!desktop.matches || !stage || destroy || typeof window.mountLanyard !== 'function') return;
    stage.classList.remove('is-entering');
    onLanyardReady = () => {
      lanyardReady = true;
      stage.classList.add('is-preloaded');
      revealAndRelease();
    };
    stage.addEventListener('lanyard:ready', onLanyardReady, { once: true });
    const unmount = window.mountLanyard(stage, {
      frontImage: '/images/profile-photo.png?v=refreshed-studio-20261017',
      backImage: '',
      imagePosition: { x: 0.5, y: 0.2 },
      cardColor: '#f8f7ff',
      strapColor: '#7052e8',
      strapLength: 0.44,
      strapWidth: 0.58,
      size: 0.34,
      anchor: 'elsewhere',
      gravity: 1,
      damping: 0.62,
      elasticity: 0.52,
      breeze: 0,
      interactive: true,
      intro: !reducedMotion,
      introPose: 'drop'
    });
    if (typeof unmount === 'function') destroy = unmount;
  };

  const sync = () => {
    if (desktop.matches) {
      mount();
      revealAndRelease();
      return;
    }
    if (!destroy) return;
    window.clearTimeout(releaseTimer);
    releaseTimer = 0;
    if (onLanyardReady) stage.removeEventListener('lanyard:ready', onLanyardReady);
    onLanyardReady = null;
    destroy();
    destroy = null;
    stage.classList.remove('is-entering');
    stage.classList.remove('is-preloaded');
    lanyardReady = false;
    introReleased = false;
  };

  window.addEventListener('portfolio:nav-intro-finished', () => {
    navIntroReady = true;
    revealAndRelease();
  }, { once: true });

  sync();
  desktop.addEventListener('change', sync);
})();
