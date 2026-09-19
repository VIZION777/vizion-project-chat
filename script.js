(() => {
  const site = document.querySelector('.site');
  const home = document.getElementById('homeScreen');
  const ritual = document.getElementById('ritualScreen');
  const menuToggle = document.getElementById('menuToggle');
  const menuPanel = document.getElementById('menuPanel');
  const menuBackdrop = document.getElementById('menuBackdrop');
  const openRitual = document.getElementById('openRitual');
  const addEnergy = document.getElementById('addEnergy');
  const slider = document.getElementById('energySlider');
  const sigil = document.getElementById('sigilWrap');
  const counter = document.getElementById('curseCounter');
  const randomPunishment = document.getElementById('randomPunishment');
  const punishment = document.getElementById('punishment');
  const form = document.getElementById('ritualForm');
  const toast = document.getElementById('toast');
  const acceptMagic = document.getElementById('acceptMagic');

  const punishments = [
    'Щоб Wi-Fi ловив тільки біля роутера',
    'Щоб кава завжди остигала за 30 секунд',
    'Щоб зарядка зникала саме коли треба',
    'Щоб будильник дзвонив у вихідний',
    'Щоб реклама не пропускалась',
    'Щоб доставка запізнювалась рівно на 11 хвилин',
    'Щоб після прання завжди губилась одна шкарпетка',
    'Щоб телефон падав тільки екраном вниз'
  ];

  const format = n => new Intl.NumberFormat('uk-UA').format(n);
  const currentCount = () => parseInt(counter.textContent.replace(/\s/g, ''), 10) || 4351;

  const setCount = n => {
    counter.textContent = format(n);
    try { localStorage.setItem('curseCount', String(n)); } catch (_) {}
  };

  try {
    const saved = Number(localStorage.getItem('curseCount'));
    if (Number.isFinite(saved) && saved >= 4351) counter.textContent = format(saved);
  } catch (_) {}

  function updateEnergy(value) {
    const v = Math.max(0, Math.min(100, Number(value) || 0));
    sigil.style.setProperty('--energy', String(v / 100));
    const scale = 0.96 + (v / 100) * 0.08;
    sigil.style.transform = `scale(${scale})`;
  }

  function go(screen) {
    home.classList.remove('is-active');
    ritual.classList.remove('is-active');
    screen.classList.add('is-active');
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openMenu() {
    menuPanel.classList.add('open');
    menuBackdrop.classList.add('show');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuPanel.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    menuPanel.classList.remove('open');
    menuBackdrop.classList.remove('show');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuPanel.setAttribute('aria-hidden', 'true');
  }

  function showToast(text) {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(window.__curseToast);
    window.__curseToast = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  openRitual.addEventListener('click', () => go(ritual));

  addEnergy.addEventListener('click', () => {
    const next = Math.min(100, Number(slider.value) + 12);
    slider.value = String(next);
    updateEnergy(next);
    setCount(currentCount() + 1);
    showToast('Енергію підкинуто');
  });

  slider.addEventListener('input', e => updateEnergy(e.target.value));
  updateEnergy(slider.value);

  randomPunishment.addEventListener('click', () => {
    punishment.value = punishments[Math.floor(Math.random() * punishments.length)];
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const who = document.getElementById('who').value.trim() || 'Невідомий персонаж';
    setCount(currentCount() + 1);

    site.classList.remove('ritual-running');
    void site.offsetWidth;
    site.classList.add('ritual-running');

    showToast(`Ритуал для «${who}» запущено`);
    setTimeout(() => site.classList.remove('ritual-running'), 2400);
  });

  menuToggle.addEventListener('click', () => {
    menuPanel.classList.contains('open') ? closeMenu() : openMenu();
  });

  menuBackdrop.addEventListener('click', closeMenu);

  document.querySelectorAll('[data-screen]').forEach(btn => {
    btn.addEventListener('click', () => {
      go(btn.dataset.screen === 'home' ? home : ritual);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  acceptMagic.addEventListener('click', () => {
    acceptMagic.closest('.magic-banner').style.display = 'none';
  });
})();