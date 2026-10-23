/*
 * The Revolution Trail: game engine.
 * Depends on standards.js, content.js, map.js and scene.js (loaded first).
 */
(function () {
  'use strict';

  const C = window.RT_CONTENT, STD = window.RT_STANDARDS, MAP = window.RT_MAP, SCENE = window.RT_SCENE;
  const LM = C.landmarks;
  const SAVE_KEY = 'revolutionTrail.save.v1';
  const CODE_PREFIX = 'RT1:';
  let DAY_MS = 850;
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DEFAULT_NAMES = ['Maya', 'Theo'];
  const TOP_LEVEL = (function () { try { return window.self === window.top; } catch (e) { return false; } })();

  const MODES = {
    explorer: { label: 'Explorer', money: 140, harm: 0.5, events: 0.13, note: 'A gentler trail, so students can focus on the history.' },
    trailblazer: { label: 'Trailblazer', money: 90, harm: 1, events: 0.18, note: 'The classic trail. Supplies and choices matter more.' }
  };
  const PACE = {
    steady: { label: 'Steady', miles: 14, harm: 0, note: 'About 14 miles a day. Easy on everyone.' },
    strenuous: { label: 'Strenuous', miles: 18, harm: 1.5, note: 'About 18 miles a day. Tiring.' },
    grueling: { label: 'Grueling', miles: 22, harm: 3, note: 'About 22 miles a day. Exhausting.' }
  };
  const RATIONS = {
    filling: { label: 'Filling', lbs: 3, heal: 1.5, note: '3 pounds of food per person each day. Meals are big and healthy.' },
    meager: { label: 'Meager', lbs: 2, heal: -0.5, note: '2 pounds per person each day. Everyone is a little hungry.' },
    bare: { label: 'Bare bones', lbs: 1, heal: -2.5, note: '1 pound per person each day. Everyone is very hungry.' }
  };
  const ITEMS = {
    food: { label: 'Food', unit: '10 lbs', price: 2, desc: 'Bread, salt pork, dried peas and cornmeal.' },
    coat: { label: 'Wool coat', unit: 'each', price: 12, desc: 'Keeps one traveler warm in winter.' },
    wheel: { label: 'Spare cart wheel', unit: 'each', price: 8, desc: 'Roads are rough. Wheels crack.' },
    remedy: { label: 'Remedy', unit: 'each', price: 4, desc: 'Herbal medicine for colds, fevers and aches.' }
  };
  const COLD = { 'snow': 5, 'very cold': 5, 'cold': 3 };
  const FERRY_RESERVE = 8;
  const LEVEL_NAMES = { 1: 'Beginning', 2: 'Approaching', 3: 'Meeting', 4: 'Extending' };
  // Screens set in 2026 use the modern "screen" look; everything else looks like 1770s print.
  const ERA_2026 = ['intro', 'home', 'jump', 'present'];
  const TIER_LABEL = { core: 'Grade 5 question', scaffold: 'Step-back question', extension: 'Excellence Challenge' };

  let S = null;
  const ui = { main: null, hud: null, screen: '', scene: null };
  const loop = { on: false, timer: 0, pending: false };

  // ------------------------------------------------------------ utilities
  const storage = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } },
    remove: function (k) { try { window.localStorage.removeItem(k); } catch (e) { /* storage unavailable */ } }
  };

  function el(tag, props) {
    const node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        const v = props[k];
        if (v == null || v === false) return;
        if (k === 'class') node.className = v;
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? '' : v);
      });
    }
    for (let i = 2; i < arguments.length; i++) append(node, arguments[i]);
    return node;
  }
  function append(node, kid) {
    if (kid == null || kid === false) return;
    if (Array.isArray(kid)) { kid.forEach(function (k) { append(node, k); }); return; }
    node.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function rand(lo, hi) { return lo + Math.random() * (hi - lo); }
  function randInt(lo, hi) { return Math.floor(rand(lo, hi + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function uid() { return Math.random().toString(36).slice(2, 9) + Date.now().toString(36); }

  function hashSeed(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return function () { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
  }
  function seededShuffle(arr, seed) {
    const r = hashSeed(seed), a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  function parseDate(s) { const p = s.split('-').map(Number); return new Date(Date.UTC(p[0], p[1] - 1, p[2])); }
  function isoDate(dt) { return dt.toISOString().slice(0, 10); }
  function addDays(s, n) { const dt = parseDate(s); dt.setUTCDate(dt.getUTCDate() + n); return isoDate(dt); }
  function fmtDate(s) { const dt = parseDate(s); return MONTHS[dt.getUTCMonth()] + ' ' + dt.getUTCDate() + ', ' + dt.getUTCFullYear(); }
  function monthOf(s) { return parseDate(s).getUTCMonth(); }
  function yearOf(s) { return parseDate(s).getUTCFullYear(); }

  function fill(text) {
    if (!S) return text;
    return String(text).replace(/\{A\}/g, S.names[0]).replace(/\{B\}/g, S.names[1]).replace(/\{T\}/g, S.teacher || 'Your teacher');
  }
  function plain(text) { return fill(text).replace(/\[\[([^\]]+)\]\]/g, '$1'); }
  function rich(text) {
    const frag = document.createDocumentFragment();
    fill(text).split(/\[\[([^\]]+)\]\]/).forEach(function (part, i) {
      if (i % 2 === 0) { if (part) frag.append(part); return; }
      const def = C.glossary[part.toLowerCase()];
      if (!def) { frag.append(part); return; }
      frag.append(el('button', { type: 'button', class: 'term', onclick: function () { showTerm(part, def); } }, part));
    });
    return frag;
  }
  function words(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9'\s-]/g, ' ').split(/\s+/).filter(Boolean); }
  function wordCount(s) { return words(s).length; }

  // ------------------------------------------------------------ keyboard
  const keys = {
    map: new Map(),
    bind: function (k, fn) { this.map.set(k, fn); },
    clear: function () { this.map = new Map(); },
    save: function () { return new Map(this.map); },
    restore: function (m) { this.map = m; }
  };
  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const tag = (e.target && e.target.tagName) || '';
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;
    const k = e.key === ' ' ? 'Space' : e.key;
    if ((k === 'Enter' || k === 'Space') && /^(BUTTON|A|SUMMARY)$/.test(tag)) return;
    const fn = keys.map.get(k);
    if (fn) { e.preventDefault(); fn(); }
  });

  // ------------------------------------------------------------ speech
  let speaking = null;
  function stopSpeech() {
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { /* not supported */ }
    if (speaking) speaking.textContent = 'Read aloud';
    speaking = null;
  }
  function readAloud(getText) {
    if (!S || !S.readAloud || !('speechSynthesis' in window)) return null;
    const b = el('button', { type: 'button', class: 'btn btn-small' }, 'Read aloud');
    b.addEventListener('click', function () {
      if (speaking === b) { stopSpeech(); return; }
      stopSpeech();
      try {
        const u = new SpeechSynthesisUtterance(getText());
        u.rate = 0.95;
        u.onend = function () { if (speaking === b) { speaking = null; b.textContent = 'Read aloud'; } };
        speaking = b;
        b.textContent = 'Stop reading';
        window.speechSynthesis.speak(u);
      } catch (e) { speaking = null; }
    });
    return b;
  }

  // ------------------------------------------------------------ screens, menus, modals
  function show(name) {
    stopSpeech();
    if (name !== 'travel') stopLoop();
    ui.screen = name;
    document.body.classList.toggle('era-2026', ERA_2026.indexOf(name) !== -1);
    document.body.classList.toggle('easy-read', !!(S && S.easyFont));
    const nodes = Array.prototype.slice.call(arguments, 1);
    ui.main.replaceChildren();
    nodes.forEach(function (n) { append(ui.main, n); });
    keys.clear();
    ui.main.querySelectorAll('[data-key]').forEach(function (b) {
      keys.bind(b.getAttribute('data-key'), function () { if (!b.disabled && b.isConnected) b.click(); });
    });
    window.scrollTo(0, 0);
    const target = ui.main.querySelector('[data-focus]') || ui.main.querySelector('h1, h2');
    if (target) { target.setAttribute('tabindex', '-1'); try { target.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
    renderHUD();
  }

  function heading(text, eyebrow, sub) {
    return el('header', { class: 'screen-head' },
      eyebrow ? el('p', { class: 'eyebrow' }, eyebrow) : null,
      el('h2', { class: 'screen-title' }, text),
      sub ? el('p', { class: 'screen-sub' }, sub) : null);
  }

  function menu(items) {
    const list = el('ol', { class: 'menu' });
    let n = 0;
    items.forEach(function (it) {
      if (!it) return;
      n++;
      const num = n;
      const b = el('button', { type: 'button', class: 'menu-btn' + (it.done ? ' is-done' : ''), disabled: it.disabled || null, 'data-key': !it.disabled && num <= 9 ? String(num) : null, onclick: it.action },
        el('span', { class: 'menu-num' }, num + '.'),
        el('span', { class: 'menu-label' }, it.label),
        it.note ? el('span', { class: 'menu-note' }, it.note) : null);
      list.append(el('li', null, b));
    });
    return list;
  }

  function btn(label, onclick, cls) {
    return el('button', { type: 'button', class: 'btn ' + (cls || ''), onclick: onclick }, label);
  }

  function backBtn(label, fn) {
    return el('button', { type: 'button', class: 'btn btn-ghost', 'data-key': 'Escape', onclick: fn }, label || 'Back');
  }

  function roman(n) {
    return ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][n] || String(n);
  }
  // A pixel scene framed like an engraved plate in an old book.
  function plate(canvas, caption) {
    return el('figure', { class: 'plate' }, canvas, caption ? el('figcaption', null, caption) : null);
  }

  function cart(text) {
    return el('p', { class: 'cart-says' }, el('span', { class: 'cart-tag' }, 'C.A.R.T.'), ' ', fill(text));
  }

  function modal(opts) {
    return new Promise(function (resolve) {
      const saved = keys.save();
      keys.clear();
      const prev = document.activeElement;
      let closed = false;
      const fromCart = /C\.A\.R\.T\./.test((opts.eyebrow || '') + ' ' + opts.title);
      const box = el('div', { class: 'modal ' + (fromCart ? 'modal-cart ' : '') + (opts.cls || ''), role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'modal-title' });
      if (opts.eyebrow) box.append(el('p', { class: 'eyebrow' }, fill(opts.eyebrow)));
      box.append(el('h2', { id: 'modal-title', class: 'modal-title' }, fill(opts.title)));
      (opts.body || []).forEach(function (b) { box.append(typeof b === 'string' ? el('p', null, rich(b)) : b); });
      const buttons = opts.buttons || [{ label: 'Continue', value: true }];
      const row = el('div', { class: 'modal-actions' });
      buttons.forEach(function (b, i) {
        const label = buttons.length > 1 ? (i + 1) + '. ' + b.label : b.label;
        row.append(el('button', { type: 'button', class: 'btn' + (i === 0 ? ' btn-primary' : ''), disabled: b.disabled || null, onclick: function () { close(b.value); } }, label));
        if (!b.disabled) keys.bind(String(i + 1), function () { close(b.value); });
      });
      if (buttons.length === 1) {
        keys.bind('Enter', function () { close(buttons[0].value); });
        keys.bind('Space', function () { close(buttons[0].value); });
      }
      if (opts.escape !== undefined) keys.bind('Escape', function () { close(opts.escape); });
      box.append(row);
      const overlay = el('div', { class: 'overlay' }, box);
      document.body.append(overlay);
      const first = row.querySelector('button:not([disabled])');
      if (first) first.focus();
      function close(v) {
        if (closed) return;
        closed = true;
        overlay.remove();
        keys.restore(saved);
        if (prev && prev.isConnected && prev.focus) { try { prev.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
        resolve(v);
      }
    });
  }

  function showTerm(word, def) {
    if (S && S.glossary.indexOf(word.toLowerCase()) === -1) { S.glossary.push(word.toLowerCase()); save(); }
    return modal({ eyebrow: 'Word Detective', title: word, body: [def], escape: true, cls: 'modal-small' });
  }

  // ------------------------------------------------------------ state
  function fresh(opts) {
    return {
      v: 1, id: uid(), created: new Date().toISOString(), updated: null,
      names: opts.names, teacher: opts.teacher, mode: opts.mode, readAloud: opts.readAloud, easyFont: !!opts.easyFont,
      food: 0, shillings: MODES[opts.mode].money, wheels: 0, remedies: 0, coats: 0, health: [100, 100],
      pace: 'steady', rations: 'filling', weather: 'cold',
      date: LM[0].landing.date, leg: 0, miles: 0, riverDone: false, riverDepth: null,
      phase: 'intro', lm: {}, newsSeen: {},
      results: [], journal: [], nav: [], checks: [], glossary: [],
      timeline: null, report: null,
      stats: { days: 0, foraged: 0, recalls: 0, nurse: 0, crossings: 0 },
      checkpoint: null, finished: null
    };
  }
  function lmState(id) {
    if (!S.lm[id]) S.lm[id] = { scene: false, voices: {}, journal: false, report: false, arrived: null };
    return S.lm[id];
  }
  function save() {
    if (!S) return;
    S.updated = new Date().toISOString();
    storage.set(SAVE_KEY, JSON.stringify(S));
  }
  function loadSave() {
    const raw = storage.get(SAVE_KEY);
    if (!raw) return null;
    try { const s = JSON.parse(raw); return valid(s) ? s : null; } catch (e) { return null; }
  }
  function valid(s) { return s && s.v === 1 && Array.isArray(s.names) && Array.isArray(s.results) && typeof s.leg === 'number'; }

  function setCheckpoint() {
    S.checkpoint = { food: S.food, shillings: S.shillings, wheels: S.wheels, remedies: S.remedies, coats: S.coats,
      health: S.health.slice(), date: S.date, pace: S.pace, rations: S.rations };
  }

  function encodeCode(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    let bin = '';
    bytes.forEach(function (b) { bin += String.fromCharCode(b); });
    return CODE_PREFIX + btoa(bin);
  }
  function decodeCode(code) {
    const clean = String(code || '').trim();
    if (clean[0] === '{') return JSON.parse(clean);
    if (clean.indexOf(CODE_PREFIX) !== 0) throw new Error('prefix');
    const bin = atob(clean.slice(CODE_PREFIX.length).replace(/\s+/g, ''));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  function exportObj() {
    const o = JSON.parse(JSON.stringify(S));
    o.checkpoint = null;
    o.score = computeScore();
    return o;
  }

  // ------------------------------------------------------------ HUD
  function healthWord(h) { return h >= 70 ? 'Good' : h >= 45 ? 'Fair' : h >= 20 ? 'Poor' : 'Very poor'; }
  function avgHealth() { return (S.health[0] + S.health[1]) / 2; }

  function renderHUD() {
    const hide = !S || ['title', 'setup', 'intro', 'load', 'howto', 'home', 'present', 'timeline', 'causes', 'report-builder', 'report-view', 'results'].indexOf(ui.screen) !== -1;
    ui.hud.hidden = hide;
    if (hide) return;
    const atStop = S.phase === 'landmark';
    const idx = Math.min(ui.screen === 'jump' ? S.leg + 1 : S.leg, LM.length - 1);
    const lm = LM[idx];
    const set = function (id, v) { const n = document.getElementById(id); if (n) n.textContent = v; };
    set('hud-where-label', atStop ? 'You are at' : 'Heading to');
    set('hud-stop', 'Stop ' + (idx + 1) + ' of ' + LM.length + ': ' + lm.place.split(',')[0]);
    const dt = parseDate(S.date);
    set('hud-date', MONTHS[dt.getUTCMonth()].slice(0, 3) + ' ' + dt.getUTCDate() + ', ' + dt.getUTCFullYear());
    set('hud-weather', S.weather);
    set('hud-health', healthWord(avgHealth()));
    set('hud-food', Math.round(S.food) + ' lbs · ' + daysOfFood() + ' days');
    set('hud-money', String(S.shillings));
    const hb = document.getElementById('hud-health');
    if (hb) hb.dataset.level = healthWord(avgHealth()).replace(' ', '-').toLowerCase();
  }

  // ------------------------------------------------------------ title and setup
  function titleScreen() {
    S = null;
    const saved = loadSave();
    const cv = el('canvas', { class: 'pixel title-art', width: '320', height: '120', 'aria-hidden': 'true' });
    show('title',
      el('section', { class: 'title-screen' },
        el('p', { class: 'eyebrow' }, 'A Most Excellent History Adventure'),
        el('h1', { class: 'game-title', 'data-focus': true }, 'The Revolution Trail'),
        el('p', { class: 'title-long' }, 'Being a True Account of Two Scholars of the Fifth Grade, Who Were Carried Back to the Year 1773 by a Library Book Cart, and Who Witnessed the Birth of the United States.'),
        el('p', { class: 'fleuron', 'aria-hidden': 'true' }, '\u2766 \u2766 \u2766'),
        el('p', { class: 'title-sub' }, 'From the Boston Tea Party in 1773 to the Bill of Rights in 1791.'),
        plate(cv, 'The Travellers and their Cart, December 1773.'),
        menu([
          { label: 'Start a new journey', action: setupScreen },
          saved ? { label: 'Continue ' + saved.names[0] + ' and ' + saved.names[1] + '’s journey', note: 'Stop ' + (Math.min(saved.leg, LM.length - 1) + 1) + ' of ' + LM.length + ', ' + fmtDate(saved.date), action: function () { resume(saved); } } : null,
          saved ? { label: 'Get a progress code for your teacher', action: function () { S = saved; codeScreen(titleScreen); } } : null,
          { label: 'Load a progress code', action: loadCodeScreen },
          { label: 'How to play', action: howToScreen }
        ]),
        el('p', { class: 'imprint' }, 'Printed in the Year MMXXVI, and Sold by C.A.R.T.'),
        el('p', { class: 'fineprint' }, 'Teachers: ', el('a', { href: 'teacher.html' }, 'open the Teacher Dashboard'), ' to see class results and literacy growth.')));
    const sc = SCENE.travel(cv);
    sc.set({ season: 'winter', weather: 'snow', coats: 0 });
    sc.start();
    ui.scene = sc;
  }

  function howToScreen() {
    show('howto',
      heading('How to play', 'Field guide'),
      el('div', { class: 'prose' },
        el('p', null, 'You and your best friend are stuck in the past. C.A.R.T., a time-traveling library book cart, will only bring you home after you collect research notes at 10 historic stops between 1773 and 1791.'),
        el('h3', null, 'On the trail'),
        el('ul', null,
          el('li', null, 'Buy supplies: food, warm coats, spare wheels and remedies.'),
          el('li', null, 'Choose your pace and food rations. Faster travel and smaller meals wear people down.'),
          el('li', null, 'Cross rivers, forage for food, and handle surprises along the way.'),
          el('li', null, 'Press Space or Enter, or tap the button, to stop and size up the situation.')),
        el('h3', null, 'At each historic stop'),
        el('ul', null,
          el('li', null, 'Look around to read what is happening.'),
          el('li', null, 'Talk to people. They will not all agree, and that is the point.'),
          el('li', null, 'Write notes in your Time Journal in your own words, and list your sources. The town printer pays for good notes.'),
          el('li', null, 'Give your Field Report: three reading questions. Get one right and you can try an Excellence Challenge.')),
        el('h3', null, 'Back in class'),
        el('p', null, 'Put events in order, connect causes and effects, and build your class report from your own notes. Then see how your reading skills grew over the whole trip.'),
        el('p', null, 'Keyboard: number keys pick menu choices. Escape goes back.')),
      backBtn('Back to title', titleScreen));
  }

  function setupScreen() {
    const nameA = el('input', { id: 'name-a', type: 'text', maxlength: '20', autocomplete: 'off', placeholder: DEFAULT_NAMES[0] });
    const nameB = el('input', { id: 'name-b', type: 'text', maxlength: '20', autocomplete: 'off', placeholder: DEFAULT_NAMES[1] });
    const teacher = el('input', { id: 'teacher-name', type: 'text', maxlength: '40', autocomplete: 'off', placeholder: 'For example: Mr. Lee' });
    const modeExplorer = el('input', { id: 'mode-explorer', type: 'radio', name: 'mode', value: 'explorer', checked: true });
    const modeTrail = el('input', { id: 'mode-trailblazer', type: 'radio', name: 'mode', value: 'trailblazer' });
    const ra = el('input', { id: 'read-aloud', type: 'checkbox', checked: true });
    const easy = el('input', { id: 'easy-font', type: 'checkbox' });
    const form = el('form', { class: 'setup-form', novalidate: true },
      el('div', { class: 'field' }, el('label', { for: 'name-a' }, 'Your name'), nameA),
      el('div', { class: 'field' }, el('label', { for: 'name-b' }, 'Your time-travel partner’s name'), nameB,
        el('p', { class: 'hint' }, 'Playing alone? Name your partner anything you like.')),
      el('div', { class: 'field' }, el('label', { for: 'teacher-name' }, 'Your teacher’s name (optional)'), teacher),
      el('fieldset', { class: 'field' }, el('legend', null, 'Choose your trail'),
        el('label', { class: 'radio', for: 'mode-explorer' }, modeExplorer, el('span', null, el('strong', null, 'Explorer. '), MODES.explorer.note)),
        el('label', { class: 'radio', for: 'mode-trailblazer' }, modeTrail, el('span', null, el('strong', null, 'Trailblazer. '), MODES.trailblazer.note))),
      el('label', { class: 'check', for: 'read-aloud' }, ra, el('span', null, 'Show Read aloud buttons')),
      el('label', { class: 'check', for: 'easy-font' }, easy, el('span', null, 'Use an easier-to-read font instead of the old-style printing')),
      el('div', { class: 'actions' }, el('button', { type: 'submit', class: 'btn btn-primary' }, 'Begin the journey')));
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const clean = function (v, d) { v = String(v || '').replace(/\s+/g, ' ').trim(); return v || d; };
      S = fresh({
        names: [clean(nameA.value, DEFAULT_NAMES[0]), clean(nameB.value, DEFAULT_NAMES[1])],
        teacher: clean(teacher.value, ''),
        mode: modeTrail.checked ? 'trailblazer' : 'explorer',
        readAloud: ra.checked,
        easyFont: easy.checked
      });
      save();
      introScreen(0);
    });
    show('setup', heading('Who is going on this journey?', 'New journey'), form, backBtn('Back to title', titleScreen));
    nameA.focus();
  }

  function loadCodeScreen() {
    const ta = el('textarea', { id: 'load-code', rows: '6', placeholder: 'Paste a progress code that starts with RT1:' });
    const msg = el('p', { class: 'form-msg', role: 'status' });
    show('load',
      heading('Load a progress code', 'Continue on another computer'),
      el('p', null, 'Paste the progress code you copied at the end of a session.'),
      el('div', { class: 'field' }, el('label', { for: 'load-code' }, 'Progress code'), ta), msg,
      el('div', { class: 'actions' },
        btn('Load journey', function () {
          try {
            const s = decodeCode(ta.value);
            if (!valid(s)) throw new Error('invalid');
            S = s;
            save();
            resume(S);
          } catch (e) {
            msg.textContent = 'That code did not work. Check that you copied the whole code, starting with RT1:';
          }
        }, 'btn-primary'),
        backBtn('Back to title', titleScreen)));
    ta.focus();
  }

  function resume(saved) {
    S = saved;
    if (!S.checkpoint) setCheckpoint();
    switch (S.phase) {
      case 'intro': return introScreen(0);
      case 'store0': return storeScreen(C.start.store, afterStartStore, -1);
      case 'nav': return navigatorScreen(S.leg);
      case 'travel': return travelMenu();
      case 'river': return riverScreen();
      case 'landmark': return hubScreen(S.leg);
      case 'jump': return jumpScreen(S.leg + 1);
      case 'home': return homeScreen(0);
      case 'timeline': return timelineScreen();
      case 'causes': return causesScreen();
      case 'report': return reportBuilder();
      case 'done': return resultsScreen();
      default: return hubScreen(Math.min(S.leg, LM.length - 1));
    }
  }

  // ------------------------------------------------------------ intro story
  function introScreen(i) {
    S.phase = 'intro';
    const panel = C.intro[i];
    const last = i === C.intro.length - 1;
    const next = function () { if (last) { S.phase = 'store0'; save(); storeScreen(C.start.store, afterStartStore, -1); } else introScreen(i + 1); };
    show('intro',
      el('section', { class: 'story' },
        el('p', { class: 'story-stamp' }, fill(panel.stamp)),
        el('p', { class: 'story-text', 'data-focus': true }, fill(panel.text)),
        el('div', { class: 'actions' },
          btn(last ? 'Go to the general store' : 'Next', next, 'btn-primary'),
          i > 0 ? btn('Back', function () { introScreen(i - 1); }, 'btn-ghost') : null),
        el('p', { class: 'story-dots', 'aria-hidden': 'true' }, C.intro.map(function (_, k) { return k === i ? '■' : '□'; }).join(' '))));
    keys.bind('Enter', next);
    keys.bind('Space', next);
  }

  function afterStartStore() {
    navigatorScreen(0);
  }

  // ------------------------------------------------------------ store
  function itemPrice(key, mult) { return Math.ceil(ITEMS[key].price * (mult || 1)); }

  function foodPerDay() { return RATIONS[S.rations].lbs * 2; }
  function daysOfFood() { return Math.floor(S.food / foodPerDay()); }

  // How far it is from a stop (-1 = the starting store) to the next store, and how much food that takes.
  function foodPlan(fromStop) {
    let miles = 0, days = 0, idx = -1;
    for (let j = fromStop + 1; j < LM.length; j++) {
      miles += LM[j].landing.miles;
      days += Math.ceil(LM[j].landing.miles / PACE.steady.miles) + 2; // spare days for weather and surprises
      if (LM[j].landing.river && LM[j].landing.river.special) days += 7; // waiting for Christmas night, 1776
      if (LM[j].store) { idx = j; break; }
    }
    return { idx: idx, miles: miles, days: days, lbs: Math.ceil(days * RATIONS.filling.lbs * 2 / 10) * 10 };
  }
  function winterAhead(fromStop, toStop) {
    for (let j = Math.max(0, fromStop + 1); j <= (toStop === -1 ? LM.length - 1 : toStop); j++) {
      const m = monthOf(LM[j].landing.date);
      if (m === 11 || m <= 1) return true;
    }
    return false;
  }
  function planText(plan) {
    return plan.idx === -1
      ? 'This is the last store. The rest of the trip is about ' + plan.miles + ' miles, or about ' + plan.days + ' days.'
      : 'The next store is in ' + LM[plan.idx].place.split(',')[0] + ' (stop ' + (plan.idx + 1) + '), about ' + plan.miles + ' miles away. That is about ' + plan.days + ' days on the road.';
  }

  function storeScreen(cfg, onDone, fromStop) {
    const qty = { food: 0, coat: 0, wheel: 0, remedy: 0 };
    const max = { food: 40, coat: Math.max(0, 2 - S.coats), wheel: Math.max(0, 3 - S.wheels), remedy: Math.max(0, 6 - S.remedies) };
    const plan = foodPlan(fromStop == null ? S.leg : fromStop);
    const coldAhead = winterAhead(fromStop == null ? S.leg : fromStop, plan.idx);
    const want = {
      food: Math.min(max.food, Math.max(0, Math.ceil((plan.lbs - S.food) / 10))),
      coat: coldAhead ? max.coat : 0,
      wheel: S.wheels === 0 ? 1 : 0,
      remedy: Math.max(0, 2 - S.remedies)
    };
    const rows = el('div', { class: 'store-rows' });
    const totalEl = el('p', { class: 'store-total', 'aria-live': 'polite' });
    const buyBtn = btn('Buy these supplies', buy, 'btn-primary');
    const listBtn = btn('Use C.A.R.T.\u2019s list', useList);
    function useList() {
      Object.keys(want).forEach(function (k) { qty[k] = want[k]; });
      const budget = Math.max(0, S.shillings - FERRY_RESERVE);
      ['remedy', 'wheel', 'food', 'coat'].forEach(function (k) { while (total() > budget && qty[k] > 0) qty[k]--; });
      draw();
    }

    function total() { return Object.keys(qty).reduce(function (t, k) { return t + qty[k] * itemPrice(k, cfg.priceMult); }, 0); }
    function draw() {
      rows.replaceChildren();
      Object.keys(ITEMS).forEach(function (k) {
        const it = ITEMS[k];
        const price = itemPrice(k, cfg.priceMult);
        const have = k === 'food' ? Math.round(S.food) + ' lbs' : S[k === 'coat' ? 'coats' : k === 'wheel' ? 'wheels' : 'remedies'];
        rows.append(el('div', { class: 'store-row' },
          el('div', { class: 'store-item' }, el('strong', null, it.label), el('span', { class: 'store-desc' }, it.desc),
            el('span', { class: 'store-have' }, 'You have: ' + have)),
          el('div', { class: 'store-price' }, price + ' shillings ', el('span', { class: 'muted' }, 'per ' + it.unit)),
          el('div', { class: 'stepper' },
            el('button', { type: 'button', class: 'step', 'aria-label': 'Fewer ' + it.label, disabled: qty[k] <= 0 || null, onclick: function () { qty[k]--; draw(); } }, '−'),
            el('span', { class: 'step-qty', 'aria-label': it.label + ' quantity' }, k === 'food' ? (qty[k] * 10) + ' lbs' : qty[k]),
            el('button', { type: 'button', class: 'step', 'aria-label': 'More ' + it.label, disabled: qty[k] >= max[k] || null, onclick: function () { qty[k]++; draw(); } }, '+'))));
      });
      const t = total();
      totalEl.textContent = 'Total: ' + t + ' shillings. You have ' + S.shillings + '. After buying: ' + (S.shillings - t) + '.';
      totalEl.classList.toggle('is-over', t > S.shillings);
      buyBtn.disabled = t === 0 || t > S.shillings;
    }
    function buy() {
      const t = total();
      if (t > S.shillings || t === 0) return;
      S.shillings -= t;
      S.food += qty.food * 10; S.coats += qty.coat; S.wheels += qty.wheel; S.remedies += qty.remedy;
      Object.keys(qty).forEach(function (k) { qty[k] = 0; });
      max.coat = Math.max(0, 2 - S.coats); max.wheel = Math.max(0, 3 - S.wheels); max.remedy = Math.max(0, 6 - S.remedies);
      save();
      draw();
      renderHUD();
      totalEl.textContent = 'Purchased! You now have ' + S.shillings + ' shillings left.';
    }
    async function leave() {
      const m = monthOf(S.date);
      const winter = m === 11 || m <= 1;
      if (S.food < plan.lbs * 0.6) {
        const go = await modal({ eyebrow: 'C.A.R.T. warning', title: 'NOT ENOUGH FOOD', body: ['You have ' + Math.round(S.food) + ' pounds of food. ' + planText(plan), 'C.A.R.T. suggests about ' + plan.lbs + ' pounds. Without food, travelers get sick.'], buttons: [{ label: 'Go back and buy food', value: false }, { label: 'Leave anyway', value: true }], escape: false });
        if (!go) return;
      }
      if ((winter || coldAhead) && S.coats < 2) {
        const go = await modal({ eyebrow: 'C.A.R.T. warning', title: winter ? 'IT IS WINTER' : 'WINTER IS COMING', body: [(S.coats === 0 ? 'Neither of you has' : 'Only one of you has') + ' a wool coat. Travelers without coats lose health in the cold.'], buttons: [{ label: 'Go back and buy coats', value: false }, { label: 'Leave anyway', value: true }], escape: false });
        if (!go) return;
      }
      save();
      onDone();
    }
    const listItems = [
      'Food: about ' + plan.lbs + ' pounds (you have ' + Math.round(S.food) + '). Two travelers eat about ' + foodPerDay() + ' pounds a day.',
      coldAhead ? 'Wool coats: 2, one for each of you (you have ' + S.coats + '). Cold weather is ahead.' : 'Wool coats: you have ' + S.coats + ' of 2.',
      'Spare wheel: at least 1 (you have ' + S.wheels + ').',
      'Remedies: about 2 (you have ' + S.remedies + ').',
      'Save about ' + FERRY_RESERVE + ' shillings for river ferries.'
    ];
    show('store',
      heading(cfg.name, 'Store', cfg.keeper),
      el('p', { class: 'keeper-says' }, cfg.greeting),
      el('aside', { class: 'shopping-list' },
        el('p', { class: 'fact-tag' }, 'C.A.R.T.\u2019s shopping list'),
        el('p', null, planText(plan)),
        el('ul', null, listItems.map(function (t) { return el('li', null, t); })),
        el('div', { class: 'actions' }, listBtn)),
      cfg.priceMult > 1 ? el('p', { class: 'note' }, 'Prices here are ' + Math.round((cfg.priceMult - 1) * 100) + '% higher than in 1773.') : null,
      rows,
      el('div', { class: 'store-bar' }, totalEl, el('div', { class: 'actions' }, buyBtn, backBtn('Leave the store', leave))),
      el('aside', { class: 'fact' }, el('p', { class: 'fact-tag' }, 'Colonial economics'), el('p', null, cfg.fact)));
    draw();
  }

  // ------------------------------------------------------------ map
  function mapOpts(position, view) {
    const legs = [];
    const cur = Math.min(S.leg, LM.length - 1);
    for (let i = 0; i <= cur; i++) {
      legs.push({ from: LM[i].landing, to: LM[i], state: i < S.leg ? 'done' : 'current' });
    }
    const lm = LM[cur];
    return {
      view: view,
      leg: { from: lm.landing, to: { lat: lm.lat, lon: lm.lon, name: lm.place.split(',')[0] } },
      legs: legs,
      stops: pinGroups(),
      position: position
    };
  }

  // Philadelphia is three stops, so stops that share a place share one pin.
  function pinGroups() {
    const groups = {};
    LM.forEach(function (m, i) {
      const key = m.lat + ',' + m.lon;
      const state = i < S.leg ? 'done' : i === S.leg ? 'current' : 'future';
      if (!groups[key]) groups[key] = { lat: m.lat, lon: m.lon, ns: [], states: [] };
      groups[key].ns.push(i + 1);
      groups[key].states.push(state);
    });
    return Object.keys(groups).map(function (k) {
      const g = groups[k];
      const has = function (st) { return g.states.indexOf(st) !== -1; };
      return { lat: g.lat, lon: g.lon, n: g.ns.join(', '), place: LM[g.ns[0] - 1].place.split(',')[0], state: has('current') ? 'current' : !has('future') ? 'done' : has('done') ? 'partial' : 'future' };
    });
  }

  function mapFigure(opts) {
    const holder = el('div', { class: 'map-holder' });
    const nativeBox = el('input', { id: 'map-native', type: 'checkbox' });
    const views = [['leg', 'This leg'], ['trip', 'Whole trip'], ['all', 'All 13 colonies']];
    opts.view = opts.view || 'leg';
    const tabs = el('div', { class: 'map-views', role: 'group', 'aria-label': 'Map view' });
    views.forEach(function (vw) {
      const b = el('button', { type: 'button', class: 'map-view-btn', 'aria-pressed': String(opts.view === vw[0]) }, vw[1]);
      b.addEventListener('click', function () {
        opts.view = vw[0];
        Array.prototype.forEach.call(tabs.children, function (t) { t.setAttribute('aria-pressed', String(t === b)); });
        draw();
      });
      tabs.append(b);
    });
    function draw() { opts.native = nativeBox.checked; holder.innerHTML = MAP.render(opts); }
    nativeBox.addEventListener('change', draw);
    draw();
    return el('figure', { class: 'map' }, tabs, holder,
      el('figcaption', { class: 'map-legend' },
        el('span', { class: 'lg lg-ne' }, 'New England'), el('span', { class: 'lg lg-mid' }, 'Middle Colonies'), el('span', { class: 'lg lg-south' }, 'Southern Colonies'),
        el('span', { class: 'lg lg-proc' }, 'Proclamation Line'),
        el('label', { class: 'check check-small', for: 'map-native' }, nativeBox, el('span', null, 'Show some Native homelands (approximate)'))));
  }

  function currentPosition() {
    const lm = LM[S.leg];
    const t = clamp(S.miles / lm.landing.miles, 0, 1);
    return MAP.lerp(lm.landing, lm, t);
  }

  function mapScreen(back) {
    const onTrail = S.phase === 'travel' || S.phase === 'river';
    show('map', heading('Map of the colonies', fmtDate(S.date)),
      mapFigure(mapOpts(onTrail ? currentPosition() : null, onTrail ? 'leg' : 'trip')),
      el('p', { class: 'note' }, '"This leg" shows where C.A.R.T. landed you (square) and where you are going (circle). "Whole trip" shows all 10 stops. Philadelphia is stops 2, 4 and 9.'),
      backBtn('Back', back));
  }

  // ------------------------------------------------------------ navigator check (G1.5.1)
  function navigatorScreen(i) {
    S.phase = 'nav';
    S.leg = i;
    save();
    const lm = LM[i];
    const q = lm.navigator;
    const done = S.nav.some(function (n) { return n.leg === i; });
    const choicesBox = el('div', { class: 'choices' });
    const feedback = el('div', { class: 'feedback', 'aria-live': 'polite' });
    const opts = mapOpts(null, 'leg');

    function finish() {
      setCheckpoint();
      S.phase = 'travel';
      save();
      travelScreen();
    }
    if (done) { finish(); return; }

    seededShuffle(q.choices, S.id + lm.id + 'nav').forEach(function (choice, k) {
      const b = el('button', { type: 'button', class: 'choice', 'data-key': String(k + 1) }, el('span', { class: 'choice-key' }, (k + 1) + ''), el('span', null, choice));
      b.addEventListener('click', function () { answer(choice, b); });
      choicesBox.append(b);
    });
    function answer(choice, b) {
      if (choicesBox.dataset.locked) return;
      choicesBox.dataset.locked = '1';
      const correct = choice === q.choices[0];
      S.nav.push({ leg: i, lm: lm.id, ss: 'G1.5.1', correct: correct, pick: choice, date: S.date, ts: Date.now() });
      save();
      Array.prototype.forEach.call(choicesBox.children, function (c) { c.disabled = true; if (c.textContent.slice(1) === q.choices[0]) c.classList.add('is-correct'); });
      if (!correct) b.classList.add('is-wrong');
      feedback.replaceChildren(
        el('p', { class: correct ? 'fb-good' : 'fb-bad' }, correct ? 'Correct! Good navigating.' : 'Not quite. The answer is: ' + q.choices[0] + '.'),
        el('p', null, q.why),
        el('p', { class: 'muted' }, 'You need to travel about ' + lm.landing.miles + ' miles to reach ' + lm.place + '.'),
        btn('Start traveling', finish, 'btn-primary'));
      keys.clear();
      keys.bind('Enter', finish);
      const fb = feedback.querySelector('button');
      if (fb) fb.focus();
    }
    show('nav',
      heading('Navigator check', 'Stop ' + (i + 1) + ' of ' + LM.length + ' · Map skills', 'C.A.R.T. landed you in ' + lm.landing.town + ' on ' + fmtDate(S.date) + '.'),
      el('div', { class: 'split' },
        mapFigure(opts),
        el('div', { class: 'q-panel' }, el('p', { class: 'q-stem' }, q.stem), choicesBox, feedback)));
  }

  // ------------------------------------------------------------ travel
  function rollWeather(dateStr) {
    const m = monthOf(dateStr), r = Math.random();
    if (m === 11 || m <= 1) return r < 0.25 ? 'snow' : r < 0.6 ? 'very cold' : 'cold';
    if (m <= 4) return r < 0.3 ? 'rain' : r < 0.6 ? 'cool' : 'mild';
    if (m <= 7) return r < 0.15 ? 'rain' : r < 0.5 ? 'hot' : 'warm';
    return r < 0.2 ? 'rain' : r < 0.6 ? 'cool' : 'clear';
  }
  function weatherSpeed(w) { return w === 'snow' ? 0.55 : w === 'rain' ? 0.75 : w === 'very cold' ? 0.85 : 1; }

  function eat(days) { S.food = Math.max(0, S.food - RATIONS[S.rations].lbs * 2 * days); }
  function dailyHealth(rest) {
    const harm = MODES[S.mode].harm;
    for (let i = 0; i < 2; i++) {
      let d = rest ? 5 : RATIONS[S.rations].heal - PACE[S.pace].harm;
      if (S.food <= 0) d = -6;
      const cold = COLD[S.weather] || 0;
      if (cold) d -= S.coats > i ? 0.5 : cold;
      if (S.weather === 'hot') d -= S.pace === 'grueling' ? 2 : 1;
      if (d < 0) d *= harm;
      S.health[i] = Math.round(clamp(S.health[i] + d, 0, 100) * 10) / 10;
    }
  }
  function passDays(n, rest) {
    for (let k = 0; k < n; k++) {
      S.date = addDays(S.date, 1);
      S.weather = rollWeather(S.date);
      S.stats.days++;
      eat(1);
      dailyHealth(rest);
    }
  }
  function hurt(i, amount) { S.health[i] = Math.round(clamp(S.health[i] - amount * MODES[S.mode].harm, 0, 100) * 10) / 10; }

  function sceneState() {
    const lm = LM[S.leg];
    const left = lm.landing.miles - S.miles;
    return {
      season: SCENE.seasonOf(monthOf(S.date)),
      weather: S.weather === 'snow' ? 'snow' : S.weather === 'rain' ? 'rain' : 'clear',
      townIn: left <= 12 ? clamp(1 - left / 12, 0.15, 1) : 0,
      coats: S.coats
    };
  }

  function statusGrid() {
    const lm = LM[S.leg];
    const item = function (k, v, cls) { return el('div', { class: 'stat ' + (cls || '') }, el('dt', null, k), el('dd', null, v)); };
    const river = lm.landing.river;
    const next = river && !S.riverDone ? river.name.split(' at ')[0].split(' near ')[0] : lm.place.split(',')[0];
    const toNext = river && !S.riverDone ? river.mile - S.miles : lm.landing.miles - S.miles;
    return el('dl', { class: 'status-grid' },
      item('Date', fmtDate(S.date)), item('Weather', S.weather),
      item('Health', S.names[0] + ': ' + healthWord(S.health[0]) + ' · ' + S.names[1] + ': ' + healthWord(S.health[1])),
      item('Food', Math.round(S.food) + ' lbs, about ' + daysOfFood() + ' days'), item('Next landmark', next), item('Miles to go', Math.max(0, Math.round(toNext))));
  }

  function travelScreen() {
    S.phase = 'travel';
    save();
    const cv = el('canvas', { class: 'pixel', width: '320', height: '120', 'aria-hidden': 'true' });
    const statusHolder = el('div', { class: 'status-holder' }, statusGrid());
    const log = el('p', { class: 'trail-log', role: 'status', 'aria-live': 'polite' }, S.lastLog || ('On the road from ' + LM[S.leg].landing.town + '.'));
    show('travel',
      el('section', { class: 'travel' },
        el('h2', { class: 'visually-hidden' }, 'On the trail to ' + LM[S.leg].place),
        plate(cv, 'On the road to ' + LM[S.leg].place.split(',')[0] + ', ' + MONTHS[monthOf(S.date)] + ' ' + yearOf(S.date) + '.'),
        statusHolder, log,
        el('div', { class: 'actions' }, btn('Size up the situation', travelMenu, 'btn-primary')),
        S.leg === 0 ? cart('TIP: I MOVE ON MY OWN. STOP ANY TIME TO CHANGE PACE, REST, FORAGE FOR FOOD OR LOOK AT THE MAP.') : null,
        el('p', { class: 'hint' }, 'Press Space or Enter to stop.')));
    ui.scene = SCENE.travel(cv);
    ui.scene.set(sceneState());
    ui.statusHolder = statusHolder;
    ui.log = log;
    keys.bind('Space', travelMenu);
    keys.bind('Enter', travelMenu);
    startLoop();
  }

  function updateTravelUI() {
    if (ui.screen !== 'travel') return;
    ui.statusHolder.replaceChildren(statusGrid());
    ui.log.textContent = S.lastLog || '';
    ui.scene.set(sceneState());
    renderHUD();
  }

  function startLoop() {
    if (loop.on) return;
    loop.on = true;
    if (ui.scene) ui.scene.start();
    if (!loop.pending) queueDay();
  }
  function stopLoop() {
    loop.on = false;
    loop.pending = false;
    clearTimeout(loop.timer);
    if (ui.scene) ui.scene.stop();
  }
  function queueDay() {
    loop.pending = true;
    loop.timer = setTimeout(function () {
      loop.pending = false;
      if (!loop.on) return;
      dayStep().then(function () { if (loop.on && ui.screen === 'travel' && !loop.pending) queueDay(); });
    }, DAY_MS);
  }

  async function dayStep() {
    const lm = LM[S.leg];
    S.date = addDays(S.date, 1);
    S.weather = rollWeather(S.date);
    S.stats.days++;
    let miles = PACE[S.pace].miles * weatherSpeed(S.weather) * (avgHealth() < 40 ? 0.8 : 1) * (S.food <= 0 ? 0.8 : 1);
    miles = Math.max(4, Math.round(miles));
    const river = lm.landing.river;
    let atRiver = false;
    if (river && !S.riverDone && S.miles + miles >= river.mile) { miles = Math.max(0, river.mile - S.miles); atRiver = true; }
    S.miles = Math.min(lm.landing.miles, S.miles + miles);
    eat(1);
    dailyHealth(false);
    const notes = [];
    if (S.food <= 0) notes.push('You are out of food!');
    if ((COLD[S.weather] || 0) && S.coats < 2) notes.push('It is ' + S.weather + ' and someone has no coat.');
    S.lastLog = fmtDate(S.date) + ': you traveled ' + miles + ' miles. ' + notes.join(' ');
    save();
    updateTravelUI();
    if (await checkCritical()) return;
    if (S.miles >= lm.landing.miles) { stopLoop(); arriveScreen(); return; }
    if (daysOfFood() <= 2 && S.foodWarned !== S.leg) {
      S.foodWarned = S.leg;
      stopLoop();
      const plan = foodPlan(S.leg - 1);
      await modal({ eyebrow: 'C.A.R.T. warning', title: S.food <= 0 ? 'OUT OF FOOD' : 'FOOD IS RUNNING LOW',
        body: [S.food <= 0 ? 'You have no food left. Hungry travelers get sick and walk slower.' : 'You have about ' + daysOfFood() + ' days of food left.',
          plan.idx === -1 ? 'There are no more stores on this trip.' : 'The next store is in ' + LM[plan.idx].place.split(',')[0] + ' (stop ' + (plan.idx + 1) + ').',
          'Ideas: stop and forage for food, or change to meager rations so your food lasts longer.'],
        buttons: [{ label: 'Size up the situation', value: 'menu' }, { label: 'Keep going', value: 'go' }] }).then(function (v) {
        if (v === 'menu') travelMenu(); else if (ui.screen === 'travel') startLoop();
      });
      return;
    }
    if (atRiver) { stopLoop(); riverScreen(); return; }
    if (Math.random() < MODES[S.mode].events) {
      stopLoop();
      await randomEvent();
      if (ui.screen === 'travel' && S.phase === 'travel') { updateTravelUI(); if (!(await checkCritical())) startLoop(); }
    }
  }

  async function checkCritical() {
    const who = S.health[0] <= 0 ? 0 : S.health[1] <= 0 ? 1 : -1;
    if (who === -1) return false;
    stopLoop();
    const canRest = S.food >= 24 || S.shillings >= 6;
    if (canRest) {
      await modal({ eyebrow: 'C.A.R.T. alert', title: 'TRAVELER HEALTH CRITICAL',
        body: [S.names[who] + ' is too sick to go on. C.A.R.T. switches to NURSE MODE. A kind family lets you rest in their farmhouse for 4 days.'] });
      if (S.food < 24) { S.shillings -= 6; S.food += 24; }
      passDays(4, true);
      S.health = S.health.map(function (h) { return Math.max(h, 45); });
      S.stats.nurse++;
    } else {
      await modal({ eyebrow: 'C.A.R.T. alert', title: 'EMERGENCY RECALL',
        body: ['No food, no money, and ' + S.names[who] + ' is very sick. C.A.R.T. zaps you back to where it landed you and hands out emergency rations.', 'Tip: keep your pace steady and your rations filling, and buy food at every store.'] });
      const cp = S.checkpoint;
      Object.assign(S, { food: Math.max(cp.food, 40), shillings: Math.max(cp.shillings, 10), wheels: cp.wheels, remedies: cp.remedies, coats: cp.coats,
        health: [80, 80], date: cp.date, pace: 'steady', rations: 'filling', miles: 0, riverDone: false, riverDepth: null });
      S.stats.recalls++;
    }
    S.lastLog = 'Rested and ready to go.';
    if (S.phase === 'river') S.phase = 'travel';
    save();
    if (S.phase === 'travel') travelMenu();
    return true;
  }

  function travelMenu() {
    if (ui.screen === 'travel-menu') return;
    stopLoop();
    S.phase = 'travel';
    save();
    show('travel-menu',
      heading('Size up the situation', 'On the trail to ' + LM[S.leg].place),
      statusGrid(),
      menu([
        { label: 'Continue on the trail', action: travelScreen },
        { label: 'Check supplies', action: function () { suppliesScreen(travelMenu); } },
        { label: 'Look at the map', action: function () { mapScreen(travelMenu); } },
        { label: 'Change pace', note: PACE[S.pace].label, action: paceScreen },
        { label: 'Change food rations', note: RATIONS[S.rations].label, action: rationsScreen },
        { label: 'Stop to rest', action: restScreen },
        { label: 'Forage for food', action: forageScreen },
        { label: 'Read your Time Journal', action: function () { journalBook(travelMenu); } },
        { label: 'Get a progress code for your teacher', action: function () { codeScreen(travelMenu); } },
        { label: 'Save and go to the title screen', action: function () { save(); titleScreen(); } }
      ]));
  }

  function choiceScreen(title, sub, table, current, onPick) {
    show('choose', heading(title, 'On the trail', sub),
      menu(Object.keys(table).map(function (k) {
        return { label: table[k].label, note: (k === current ? '(current) ' : '') + table[k].note, action: function () { onPick(k); } };
      })),
      backBtn('Back', travelMenu));
  }
  function paceScreen() {
    choiceScreen('Change pace', 'Faster travel tires everyone out.', PACE, S.pace, function (k) { S.pace = k; save(); travelMenu(); });
  }
  function rationsScreen() {
    choiceScreen('Change food rations', 'Smaller meals save food but hurt health.', RATIONS, S.rations, function (k) { S.rations = k; save(); travelMenu(); });
  }
  function restScreen() {
    show('rest', heading('Stop to rest', 'On the trail', 'Resting helps health but uses food and time.'),
      menu([1, 2, 3].map(function (n) {
        return { label: 'Rest ' + n + ' day' + (n > 1 ? 's' : ''), note: 'Uses about ' + n * RATIONS[S.rations].lbs * 2 + ' lbs of food', action: async function () {
          passDays(n, true);
          save();
          await modal({ title: 'You rested for ' + n + ' day' + (n > 1 ? 's' : '') + '.', body: [S.names[0] + ': ' + healthWord(S.health[0]) + '. ' + S.names[1] + ': ' + healthWord(S.health[1]) + '.'] });
          if (!(await checkCritical())) travelMenu();
        } };
      })),
      backBtn('Back', travelMenu));
  }

  function suppliesScreen(back) {
    const row = function (k, v) { return el('tr', null, el('th', { scope: 'row' }, k), el('td', null, v)); };
    const healthRows = S.names.map(function (n, i) {
      return el('tr', null, el('th', { scope: 'row' }, n),
        el('td', null, el('span', { class: 'bar' }, el('span', { class: 'bar-fill', style: 'width:' + Math.round(S.health[i]) + '%' })), ' ' + healthWord(S.health[i])));
    });
    const useRemedy = S.remedies > 0 ? S.names.map(function (n, i) {
      return S.health[i] < 100 ? btn('Give ' + n + ' a remedy', function () { S.remedies--; S.health[i] = Math.min(100, S.health[i] + 18); save(); suppliesScreen(back); }) : null;
    }) : [];
    show('supplies', heading('Supplies', fmtDate(S.date)),
      el('table', { class: 'table' }, el('tbody', null,
        row('Food', Math.round(S.food) + ' pounds'), row('Money', S.shillings + ' shillings'), row('Wool coats', S.coats + ' of 2'),
        row('Spare wheels', S.wheels), row('Remedies', S.remedies), row('Pace', PACE[S.pace].label), row('Rations', RATIONS[S.rations].label),
        row('Words looked up', S.glossary.length))),
      el('h3', null, 'Health'),
      el('table', { class: 'table' }, el('tbody', null, healthRows)),
      el('div', { class: 'actions' }, useRemedy, backBtn('Back', back)));
  }

  // ------------------------------------------------------------ random events
  async function randomEvent() {
    const m = monthOf(S.date);
    const winter = m === 11 || m <= 1;
    const lm = LM[S.leg];
    const year = yearOf(S.date);
    const pool = [[3, evIllness], [2, evWheel], [2, evWeather], [1, evLost], [winter ? 0.5 : 2, evFood], [1, evFarmer], [1, evThief], [1.5, evGag], [1, evPeddler]];
    if (S.leg > 0) pool.push([3, evCheckpoint]);
    const seen = S.newsSeen[lm.id] || 0;
    if (lm.news && seen < lm.news.length) pool.push([4, evNews]);
    if (year >= 1775 && year <= 1778) pool.push([1, evSmallpox]);
    const totalW = pool.reduce(function (t, p) { return t + p[0]; }, 0);
    let r = Math.random() * totalW;
    for (let i = 0; i < pool.length; i++) { r -= pool[i][0]; if (r <= 0) { await pool[i][1](); break; } }
    save();
  }

  async function evIllness() {
    const i = randInt(0, 1);
    const m = monthOf(S.date);
    const options = ['a bad cold', 'a fever', 'a sprained ankle', 'dysentery'];
    if (m === 11 || m <= 1) options.push('frostbitten toes');
    const what = pick(options);
    hurt(i, randInt(12, 20));
    const body = [S.names[i] + ' has ' + what + '.'];
    const title = /ankle|toes/.test(what) ? 'Someone is hurt' : 'Someone is sick';
    if (what === 'dysentery') body.push('(Yes, really. Dysentery, a disease spread by dirty water, was common in the 1700s, especially in army camps.)');
    if (S.remedies > 0) {
      const use = await modal({ eyebrow: 'Trouble on the trail', title: title, body: body.concat(['You have ' + S.remedies + ' remedies.']), buttons: [{ label: 'Use a remedy', value: true }, { label: 'Save it for later', value: false }] });
      if (use) { S.remedies--; S.health[i] = Math.min(100, S.health[i] + 18); }
    } else {
      await modal({ eyebrow: 'Trouble on the trail', title: title, body: body.concat(['You have no remedies. Resting or eating filling meals will help.']) });
    }
  }
  async function evWheel() {
    if (S.wheels > 0) {
      S.wheels--;
      passDays(1, false);
      await modal({ eyebrow: 'Trouble on the trail', title: 'A wheel broke', body: ['One of C.A.R.T.’s wheels cracked on a rock. You replace it with a spare. You lose a day.', 'Spare wheels left: ' + S.wheels + '.'] });
      return;
    }
    const pay = S.shillings >= 6;
    const choice = await modal({ eyebrow: 'Trouble on the trail', title: 'A wheel broke', body: ['One of C.A.R.T.’s wheels cracked on a rock, and you have no spare.'],
      buttons: [{ label: 'Pay a blacksmith 6 shillings (lose 1 day)', value: 'pay', disabled: !pay }, { label: 'Fix it yourselves (lose 3 days)', value: 'fix' }] });
    if (choice === 'pay') { S.shillings -= 6; passDays(1, false); } else passDays(3, false);
  }
  async function evWeather() {
    const m = monthOf(S.date);
    if (m === 11 || m <= 1) {
      S.weather = 'snow';
      passDays(2, false);
      await modal({ eyebrow: 'Weather', title: 'Blizzard', body: ['Heavy snow buries the road. You wait it out for 2 days.'] });
    } else {
      S.weather = 'rain';
      passDays(1, false);
      await modal({ eyebrow: 'Weather', title: 'Muddy roads', body: ['Heavy rain turns the road into thick mud. C.A.R.T. gets stuck. You lose a day.'] });
    }
  }
  async function evLost() {
    passDays(1, false);
    await modal({ eyebrow: 'Trouble on the trail', title: 'Lost in the fog', body: ['Thick fog rolls in, and {A} takes a wrong turn. You lose a day finding the road again.'] });
  }
  async function evFood() {
    const m = monthOf(S.date);
    const what = m <= 1 || m === 11 ? 'frozen cranberries in a bog' : m <= 5 ? 'wild strawberries' : m <= 7 ? 'blackberries' : pick(['wild apples', 'hickory nuts']);
    const lbs = randInt(10, 20);
    S.food += lbs;
    await modal({ eyebrow: 'Good luck', title: 'Wild food', body: ['{B} spots ' + what + '. You gather ' + lbs + ' pounds of food.'] });
  }
  async function evFarmer() {
    S.food += 12;
    S.health = S.health.map(function (h) { return Math.min(100, h + 8); });
    await modal({ eyebrow: 'Good luck', title: 'A kind farmer', body: ['A farm family invites you in for bread and stew, and sends you off with 12 pounds of food. Everyone feels better.'] });
  }
  async function evThief() {
    const lost = Math.min(Math.round(S.food), randInt(8, 20));
    S.food -= lost;
    await modal({ eyebrow: 'Trouble on the trail', title: 'A thief in the night', body: [lost > 0 ? 'In the night, someone takes ' + lost + ' pounds of food from the cart.' : 'A thief searches the cart in the night, but there is no food to steal.'] });
  }
  async function evNews() {
    const lm = LM[S.leg];
    const k = S.newsSeen[lm.id] || 0;
    S.newsSeen[lm.id] = k + 1;
    await modal({ eyebrow: 'News on the road', title: 'A post rider gallops past', body: [lm.news[k]] });
  }
  async function evGag() {
    const lines = [
      'C.A.R.T.’s screen flickers: YOUR BATTERY HAS DIED OF DYSENTERY. Then it turns back on. {A} and {B} decide not to ask.',
      '{B} holds a phone up to the sky, looking for Wi-Fi. There will be no Wi-Fi for about 220 years.',
      'C.A.R.T. plays a song from 2026 at full volume. A horse looks deeply offended.',
      '{A} tries to explain pizza delivery to a farmer. The farmer slowly backs away.',
      'C.A.R.T.: REMINDER: YOUR LIBRARY BOOKS ARE DUE IN... ERROR. DATE NOT FOUND.',
      '{A} sneezes. "Bless you," says a stranger in a powdered wig. {B} whispers, "That was a real powdered wig."'
    ];
    await modal({ eyebrow: 'Meanwhile', title: 'C.A.R.T. moment', body: [pick(lines)] });
  }
  async function evPeddler() {
    const choice = await modal({ eyebrow: 'On the road', title: 'A traveling peddler', body: ['A peddler with a heavy pack offers you a deal.', 'You have ' + S.shillings + ' shillings.'],
      buttons: [{ label: 'Buy a spare wheel (10 shillings)', value: 'wheel', disabled: S.shillings < 10 || S.wheels >= 3 }, { label: 'Buy a remedy (5 shillings)', value: 'remedy', disabled: S.shillings < 5 || S.remedies >= 6 }, { label: 'No, thank you', value: null }], escape: null });
    if (choice === 'wheel') { S.shillings -= 10; S.wheels++; }
    if (choice === 'remedy') { S.shillings -= 5; S.remedies++; }
  }
  async function evSmallpox() {
    const choice = await modal({ eyebrow: 'Danger ahead', title: 'Smallpox in the next town', body: ['You hear that smallpox has broken out in the next town.', 'Smallpox killed many people in the 1700s. In 1777, Washington ordered his soldiers inoculated, an early and risky form of vaccination that saved many lives.'],
      buttons: [{ label: 'Take the long way around (2 extra days)', value: 'around' }, { label: 'Keep going and hope for the best', value: 'go' }] });
    if (choice === 'around') { passDays(2, false); return; }
    if (Math.random() < 0.35) {
      const i = randInt(0, 1);
      hurt(i, 25);
      await modal({ eyebrow: 'Danger ahead', title: 'Oh no', body: [S.names[i] + ' caught a fever passing through town. Rest and remedies will help.'] });
    } else {
      await modal({ eyebrow: 'Danger ahead', title: 'Phew', body: ['You pass through quickly and stay healthy.'] });
    }
  }
  async function evCheckpoint() {
    const year = yearOf(S.date);
    const asker = year >= 1783 ? 'A curious tavern keeper' : (S.leg % 2 ? 'A Redcoat patrol' : 'Patriot militia guards');
    const src = LM[randInt(0, S.leg - 1)];
    const item = pick(src.recall);
    const opts = seededShuffle(item.choices, item.q + S.stats.days);
    const pickChoice = await modal({ eyebrow: 'Checkpoint', title: asker + ' stops you!',
      body: ['"Strange clothes. Who are you? Prove you know what is going on around here."', el('p', { class: 'q-stem' }, item.q)],
      buttons: opts.map(function (o) { return { label: o, value: o }; }) });
    const correct = pickChoice === item.choices[0];
    S.checks.push({ lm: src.id, q: item.q, correct: correct, date: S.date, ts: Date.now() });
    if (correct) {
      S.shillings += 1;
      await modal({ eyebrow: 'Checkpoint', title: 'They let you pass', body: ['"Hmph. You know your news." One of them even tosses you a shilling.'] });
    } else {
      passDays(1, false);
      await modal({ eyebrow: 'Checkpoint', title: 'Held for questioning', body: ['They are suspicious and keep you until morning. You lose a day.', 'The answer was: ' + item.choices[0] + '.'] });
    }
  }

  // ------------------------------------------------------------ foraging mini-game
  function forageScreen() {
    const season = SCENE.seasonOf(monthOf(S.date));
    const kinds = {
      winter: ['nuts', 'fish'], spring: ['berries', 'greens', 'fish'], summer: ['berries', 'corn', 'fish', 'apple'], fall: ['apple', 'nuts', 'corn', 'fish']
    }[season];
    const LBS = { apple: 4, berries: 3, greens: 2, corn: 5, nuts: 3, fish: 6 };
    const cv = el('canvas', { class: 'pixel forage-canvas', width: '320', height: '180', 'aria-label': 'Foraging game. Click or tap food before it disappears.' });
    const info = el('p', { class: 'trail-log', 'aria-live': 'polite' }, 'Click or tap food before it disappears. Avoid the bees!');
    const startBtn = btn('Start foraging (20 seconds)', play, 'btn-primary');
    const quickBtn = btn('Quick forage instead', quick);
    show('forage', heading('Forage for food', 'One day', 'Gather food from the woods and streams. You can carry 50 pounds back to the cart.'),
      cv, info, el('div', { class: 'actions' }, startBtn, quickBtn, backBtn('Back', travelMenu)));
    const ctx = cv.getContext('2d');
    drawBg();

    function drawBg() {
      const ground = { winter: '#e8edf1', spring: '#7aab59', summer: '#679d4b', fall: '#b5904c' }[season];
      ctx.fillStyle = ground; ctx.fillRect(0, 0, 320, 180);
      ctx.fillStyle = '#41566e'; ctx.fillRect(0, 140, 320, 40);
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      for (let i = 0; i < 40; i++) ctx.fillRect((i * 83) % 320, (i * 37) % 130, 3, 2);
    }
    function sprite(t, x, y) {
      const r = function (c, a, b, w, h) { ctx.fillStyle = c; ctx.fillRect(Math.round(x + a), Math.round(y + b), w, h); };
      switch (t) {
        case 'apple': r('#c8442f', -4, -3, 8, 7); r('#5a4030', 0, -6, 1, 3); r('#4f9a5a', 1, -6, 3, 2); break;
        case 'berries': r('#3b2a6b', -4, -2, 3, 3); r('#3b2a6b', 0, -3, 3, 3); r('#3b2a6b', -2, 1, 3, 3); r('#4f9a5a', -1, -5, 2, 2); break;
        case 'greens': r('#3f8f3a', -4, -2, 8, 4); r('#5fb054', -2, -5, 4, 4); break;
        case 'corn': r('#e8c040', -2, -6, 4, 11); r('#4f9a5a', -4, -2, 2, 7); r('#4f9a5a', 2, -2, 2, 7); break;
        case 'nuts': r('#7a5634', -3, -3, 6, 6); r('#4a3220', -3, -4, 6, 2); break;
        case 'fish': r('#c9d3dc', -6, -2, 11, 4); r('#c9d3dc', 5, -3, 3, 6); r('#1b1b22', -4, -1, 1, 1); break;
        case 'bee': r('#e8c040', -3, -2, 7, 4); r('#1b1b22', -1, -2, 1, 4); r('#1b1b22', 2, -2, 1, 4); r('#ffffff', -2, -5, 3, 3); break;
      }
    }
    function quick() {
      const got = season === 'winter' ? randInt(5, 15) : randInt(12, 30);
      finish(got, 0);
    }
    function play() {
      startBtn.disabled = true; quickBtn.disabled = true;
      const items = [];
      let got = 0, stings = 0, t0 = performance.now(), lastSpawn = 0, raf = 0;
      const spawnEvery = season === 'winter' ? 1000 : 600;
      function onHit(e) {
        const rect = cv.getBoundingClientRect();
        const x = (e.clientX - rect.left) * 320 / rect.width, y = (e.clientY - rect.top) * 180 / rect.height;
        for (let i = items.length - 1; i >= 0; i--) {
          const it = items[i];
          if (Math.abs(it.x - x) < 11 && Math.abs(it.y - y) < 11) {
            items.splice(i, 1);
            if (it.t === 'bee') { stings++; info.textContent = 'Ouch! A bee sting.'; }
            else { got = Math.min(50, got + LBS[it.t]); info.textContent = got + ' pounds gathered.'; }
            break;
          }
        }
      }
      cv.addEventListener('pointerdown', onHit);
      function frame(now) {
        if (ui.screen !== 'forage') { cv.removeEventListener('pointerdown', onHit); return; }
        const elapsed = now - t0;
        if (now - lastSpawn > spawnEvery) {
          lastSpawn = now;
          const isBee = season !== 'winter' && Math.random() < 0.15;
          const t = isBee ? 'bee' : pick(kinds);
          const y = t === 'fish' ? rand(148, 172) : rand(14, 130);
          items.push({ t: t, x: rand(14, 306), y: y, born: now });
        }
        for (let i = items.length - 1; i >= 0; i--) if (now - items[i].born > 1700) items.splice(i, 1);
        drawBg();
        items.forEach(function (it) { sprite(it.t, it.x, it.y); });
        ctx.fillStyle = '#1b1f38'; ctx.fillRect(0, 0, 320, 6);
        ctx.fillStyle = '#f4b942'; ctx.fillRect(0, 0, 320 * Math.max(0, 1 - elapsed / 20000), 6);
        if (elapsed >= 20000 || got >= 50) { cv.removeEventListener('pointerdown', onHit); finish(got, stings); return; }
        raf = window.requestAnimationFrame(frame);
      }
      raf = window.requestAnimationFrame(frame);
    }
    async function finish(got, stings) {
      passDays(1, false);
      S.food += got;
      S.stats.foraged += got;
      if (stings) hurt(randInt(0, 1), stings * 3);
      save();
      await modal({ eyebrow: 'Foraging', title: 'You gathered ' + got + ' pounds of food', body: [got >= 50 ? 'Your arms are full! That is all you can carry.' : season === 'winter' ? 'Winter makes food hard to find.' : 'Not bad for a day in the woods.'] });
      if (!(await checkCritical())) travelMenu();
    }
  }

  // ------------------------------------------------------------ rivers
  function riverScreen() {
    S.phase = 'river';
    const lm = LM[S.leg];
    const r = lm.landing.river;
    if (r.special === 'delaware1776') return delawareScreen(r);
    if (S.riverDepth == null) S.riverDepth = Math.round(rand(r.depth[0], r.depth[1]) * 10) / 10;
    save();
    const cv = el('canvas', { class: 'pixel', width: '320', height: '120', 'aria-hidden': 'true' });
    show('river',
      heading(r.name, 'River crossing', fmtDate(S.date) + ' · Weather: ' + S.weather),
      plate(cv, r.name + '.'),
      el('p', null, 'The river is ' + S.riverDepth + ' feet deep and about ' + r.width.toLocaleString() + ' feet across. You have ' + S.shillings + ' shillings.'),
      cart('TIP: WADING IS SAFEST WHEN THE RIVER IS LESS THAN 2.5 FEET DEEP. A FERRY COSTS MONEY BUT IS ALWAYS SAFE.'),
      menu([
        { label: 'Try to wade across (ford the river)', note: r.fordable ? (S.riverDepth < 2.5 ? 'Looks shallow' : S.riverDepth < 4 ? 'Risky' : 'Very risky') : 'Too deep and wide to wade', disabled: !r.fordable, action: ford },
        { label: 'Take the ferry', note: r.ferry + ' shillings', disabled: S.shillings < r.ferry, action: ferry },
        S.shillings < r.ferry ? { label: 'Work for the ferry crew to pay your way', note: 'Not enough shillings? Load cargo for 2 days', action: work } : null,
        { label: 'Wait a day to see if the river changes', action: wait },
        { label: 'Learn about crossing rivers in the 1700s', action: learn }
      ]));
    SCENE.landmark(cv, 'river', SCENE.seasonOf(monthOf(S.date)));
    async function ford() {
      const d = S.riverDepth;
      let msg;
      if (d < 2.5 || (d < 4 && Math.random() < 0.5)) msg = 'You wade across, pushing C.A.R.T. through the cold water. Wet feet, but everyone is safe!';
      else {
        const lost = Math.round(S.food * (d < 4 ? 0.2 : 0.3));
        S.food -= lost;
        const lines = ['The current knocks C.A.R.T. sideways! You lose ' + lost + ' pounds of food.'];
        if (d >= 4) {
          if (S.wheels > 0) { S.wheels--; lines.push('A wheel snaps off and floats away. You put on a spare.'); } else { passDays(1, false); lines.push('A wheel cracks. You lose a day fixing it.'); }
          hurt(0, 10); hurt(1, 10);
          lines.push('Everyone is soaked and freezing.');
        }
        msg = lines.join(' ');
      }
      await crossed('Fording the river', msg);
    }
    async function ferry() {
      S.shillings -= r.ferry;
      await crossed('Taking the ferry', 'The ferry operator poles you across on a flat wooden boat. Safe and dry!');
    }
    async function work() {
      passDays(2, false);
      await crossed('Working for your crossing', 'You spend two days loading barrels and crates onto the ferry. Then the crew carries you across for free.');
    }
    async function wait() {
      passDays(1, false);
      S.riverDepth = Math.round(clamp(S.riverDepth + rand(-0.8, 0.5), 1, 15) * 10) / 10;
      save();
      if (!(await checkCritical())) riverScreen();
    }
    async function learn() {
      await modal({ eyebrow: 'Did you know?', title: 'Crossing rivers in the 1700s', body: [
        'There were very few bridges over big rivers. Travelers waded across shallow places called fords, or paid a ferry to carry them across on a flat boat.',
        'Rivers were also highways. Boats carried crops, lumber and furs to port towns, which is one reason so many colonial towns grew up along rivers.'] });
      riverScreen();
    }
  }
  async function crossed(title, msg) {
    S.riverDone = true;
    S.riverDepth = null;
    S.stats.crossings++;
    S.phase = 'travel';
    S.lastLog = 'Across the river!';
    save();
    await modal({ eyebrow: 'River crossing', title: title, body: [msg] });
    if (!(await checkCritical())) travelScreen();
  }
  function delawareScreen(r) {
    save();
    const cv = el('canvas', { class: 'pixel', width: '320', height: '120', 'aria-hidden': 'true' });
    const before = S.date < '1776-12-25';
    show('river',
      heading(r.name, 'River crossing', before ? 'December 1776' : fmtDate(S.date)),
      plate(cv, 'The Delaware River, Christmas 1776.'),
      el('p', null, before
        ? 'Washington’s army is camped along the river, getting ready for something secret. An officer looks at C.A.R.T. and shrugs. "Christmas night, we cross. If you can push that thing, you can come."'
        : 'Sleet stings your face. Chunks of ice spin past in the black water. Soldiers are loading big Durham boats with cannons and horses.'),
      menu([
        { label: before ? 'Camp with the army and cross on Christmas night' : 'Help load the boats and cross with the army', action: go },
        { label: 'Learn about the crossing', action: learn }
      ]));
    SCENE.landmark(cv, 'river', 'winter');
    async function go() {
      let waited = 0;
      while (S.date < '1776-12-25' && waited < 10) { passDays(1, true); waited++; }
      S.weather = 'snow';
      const cold = S.coats < 2;
      if (cold) { hurt(0, S.coats > 0 ? 2 : 8); hurt(1, 8); }
      await crossed('Christmas night, 1776', (waited ? 'You camp with the soldiers for ' + waited + ' day' + (waited > 1 ? 's' : '') + '. ' : '') +
        'On Christmas night you help push C.A.R.T. onto a Durham boat. Soldiers use poles to shove ice away. It takes hours to cross in the storm. ' + (cold ? 'Without warm coats, you are frozen to the bone.' : 'Your wool coats keep you going.'));
    }
    async function learn() {
      await modal({ eyebrow: 'Did you know?', title: 'The crossing of the Delaware', body: [
        'About 2,400 soldiers crossed the Delaware River on the night of December 25 and 26, 1776, along with horses and 18 cannons.',
        'The boats were Durham boats, long flat-bottomed boats normally used to carry iron ore and grain. Sailors and fishermen from Marblehead, Massachusetts, many of them Black and Native American, helped row the army across.'] });
      delawareScreen(r);
    }
  }

  // ------------------------------------------------------------ landmarks
  function allVoicesRead(lm) {
    const st = lmState(lm.id);
    return lm.voices.every(function (v) { return st.voices[v.id]; });
  }

  async function arriveScreen() {
    const lm = LM[S.leg];
    const st = lmState(lm.id);
    st.arrived = S.date;
    S.phase = 'landmark';
    S.lastLog = '';
    save();
    hubScreen(S.leg, true);
  }

  function hubScreen(i, justArrived) {
    S.phase = 'landmark';
    S.leg = i;
    save();
    const lm = LM[i];
    const st = lmState(lm.id);
    const nRead = lm.voices.filter(function (v) { return st.voices[v.id]; }).length;
    const ready = st.scene && nRead === lm.voices.length;
    const canLeave = st.journal && st.report;
    const cv = el('canvas', { class: 'pixel', width: '320', height: '120', 'aria-hidden': 'true' });
    const last = i === LM.length - 1;
    const check = function (done, label) { return el('li', { class: done ? 'is-done' : '' }, el('span', { class: 'tick', 'aria-hidden': 'true' }, done ? '✓' : '·'), label + (done ? ' (done)' : '')); };
    const next = !st.scene ? 'look' : nRead < lm.voices.length ? 'talk' : !st.report ? 'report' : !st.journal ? 'journal' : 'go';
    const nextMsg = { look: 'NEXT STEP: LOOK AROUND.', talk: 'NEXT STEP: TALK TO EVERYONE HERE.', report: 'NEXT STEP: GIVE YOUR FIELD REPORT. (YOU CAN WRITE YOUR JOURNAL NOTES BEFORE OR AFTER.)',
      journal: 'NEXT STEP: WRITE YOUR TIME JOURNAL NOTES.', go: last ? 'RESEARCH COMPLETE. READY TO GO HOME.' : 'RESEARCH LOGGED. READY TO JUMP.' }[next];
    const plan = foodPlan(i);
    const hungry = !lm.store && daysOfFood() < plan.days;
    const startHere = function (k) { return next === k ? 'Start here' : null; };
    show('hub',
      heading(lm.name, 'Stop ' + (i + 1) + ' of ' + LM.length + (justArrived ? ' · You have arrived!' : ''), lm.place + ' · ' + lm.when),
      el('div', { class: 'hub' },
        el('div', { class: 'hub-menu' }, menu([
          { label: 'Look around', note: startHere('look'), done: st.scene, action: function () { sceneScreen(i); } },
          { label: 'Talk to people', note: nRead + ' of ' + lm.voices.length + ' heard', done: nRead === lm.voices.length, action: function () { voicesScreen(i); } },
          { label: 'Write in your Time Journal', note: startHere('journal'), done: st.journal, action: function () { journalScreen(i); } },
          { label: st.report ? 'Field Report complete' : 'Give your Field Report', note: ready ? '3 questions' : 'Look around and talk to everyone first', done: st.report, disabled: st.report || !ready, action: function () { reportScreen(i); } },
          lm.store ? { label: 'Visit the ' + lm.store.name, note: foodNote(i), action: function () { storeScreen(lm.store, function () { hubScreen(i); }, i); } } : null,
          { label: 'Check supplies', action: function () { suppliesScreen(function () { hubScreen(i); }); } },
          { label: 'Look at the map', action: function () { mapScreen(function () { hubScreen(i); }); } },
          { label: 'Save, or get a progress code', action: function () { codeScreen(function () { hubScreen(i); }); } },
          { label: last ? 'Return to 2026' : 'Continue on the trail', note: canLeave ? (last ? 'Research complete!' : 'C.A.R.T. is ready to jump') : 'Finish your journal and Field Report first', disabled: !canLeave, action: function () { if (last) homeScreen(0); else jumpScreen(i + 1); } }
        ])),
        el('div', { class: 'hub-side' },
          plate(cv, 'Plate ' + roman(i + 1) + '. ' + lm.name + ', ' + lm.when + '.'),
          el('aside', { class: 'hub-checklist' },
            el('p', { class: 'fact-tag' }, 'Research checklist'),
            el('ul', null, check(st.scene, 'Look around'), check(nRead === lm.voices.length, 'Talk to everyone'), check(st.report, 'Field Report'), check(st.journal, 'Time Journal notes')),
            cart(nextMsg),
            hungry ? cart('FOOD CHECK: NO STORE HERE. YOU HAVE ABOUT ' + daysOfFood() + ' DAYS OF FOOD, AND THE NEXT STORE IS ABOUT ' + plan.days + ' DAYS AWAY. FORAGE ON THE TRAIL OR USE SMALLER RATIONS.') : null))));
    SCENE.landmark(cv, lm.art, SCENE.seasonOf(monthOf(S.date)));
  }

  function foodNote(i) {
    const plan = foodPlan(i);
    const need = plan.days;
    return 'You have about ' + daysOfFood() + ' days of food. ' + (daysOfFood() < need ? 'Buy more here: the next part of the trip takes about ' + need + ' days.' : 'That should get you to the next store.');
  }

  function sceneScreen(i) {
    const lm = LM[i];
    lmState(lm.id).scene = true;
    save();
    const back = function () { hubScreen(i); };
    show('scene',
      heading(lm.name, 'Look around', lm.place + ' · ' + lm.when),
      el('div', { class: 'actions actions-top' }, readAloud(function () { return lm.scene.map(plain).join(' '); })),
      el('article', { class: 'prose reading' }, lm.scene.map(function (p) { return el('p', null, rich(p)); })),
      el('p', { class: 'fleuron', 'aria-hidden': 'true' }, '\u2766'),
      el('p', { class: 'hint' }, 'Tap an underlined word to see what it means.'),
      el('div', { class: 'actions' }, btn('Talk to people', function () { voicesScreen(i); }, 'btn-primary'), backBtn('Back to ' + lm.place.split(',')[0], back)));
  }

  function voiceTag(v) {
    // Firsthand or secondhand is left for students to work out, since Field Reports ask about it.
    return { real: 'Real person', fictional: 'Fictional character based on history', document: 'Real document' }[v.kind];
  }

  function voicesScreen(i) {
    const lm = LM[i];
    const st = lmState(lm.id);
    show('voices',
      heading('Talk to people', lm.place + ' · ' + lm.when, 'People here see things differently. Hear from everyone.'),
      menu(lm.voices.map(function (v) {
        return { label: v.name, note: plain(v.role) + ' · ' + voiceTag(v), done: st.voices[v.id], action: function () { voiceScreen(i, v); } };
      })),
      el('div', { class: 'actions' }, backBtn('Back to ' + lm.place.split(',')[0], function () { hubScreen(i); })));
  }

  function voiceDoc(v, compact) {
    return el('article', { class: 'doc doc-kind-' + v.kind + (compact ? ' doc-compact' : '') },
      el('p', { class: 'doc-tag' }, voiceTag(v)),
      el('h3', { class: 'doc-name' }, v.name),
      el('p', { class: 'doc-role' }, rich(v.role)),
      el('div', { class: 'doc-body' }, el('p', null, rich(v.text))),
      v.quote ? el('blockquote', { class: 'doc-quote' }, el('p', { class: 'doc-quote-tag' }, 'Exact words'), el('p', null, '“' + v.quote + '”'), el('cite', null, v.quoteSource)) : null,
      v.after ? el('div', { class: 'doc-after' }, el('p', { class: 'doc-quote-tag' }, 'What happened next'), el('p', null, v.after)) : null,
      el('p', { class: 'doc-basis' }, v.basis));
  }

  function voiceScreen(i, v) {
    const lm = LM[i];
    lmState(lm.id).voices[v.id] = true;
    save();
    const others = lm.voices.filter(function (o) { return !lmState(lm.id).voices[o.id]; });
    show('voice',
      heading(v.name, 'Talk to people', lm.place + ' · ' + lm.when),
      el('div', { class: 'actions actions-top' }, readAloud(function () { return plain(v.text) + (v.quote ? ' Exact words: ' + v.quote : ''); })),
      voiceDoc(v),
      el('div', { class: 'actions' },
        others.length ? btn('Talk to ' + others[0].name, function () { voiceScreen(i, others[0]); }, 'btn-primary') : btn('Back to ' + lm.place.split(',')[0], function () { hubScreen(i); }, 'btn-primary'),
        backBtn('Everyone here', function () { voicesScreen(i); })));
  }

  function sourcesPanel(lm) {
    return el('details', { class: 'sources' },
      el('summary', null, 'Look back at the sources'),
      el('div', { class: 'sources-body' },
        el('h4', null, 'The scene'),
        lm.scene.map(function (p) { return el('p', null, plain(p)); }),
        lm.voices.map(function (v) { return voiceDoc(v, true); })));
  }

  // ------------------------------------------------------------ Time Journal (W.5.8)
  function landmarkSourceText(lm) {
    return lm.scene.map(plain).concat(lm.voices.map(function (v) { return plain(v.text) + ' ' + (v.quote || ''); }));
  }
  function copiedRatio(text, sources) {
    const strip = String(text).replace(/"[^"]*"|“[^”]*”/g, ' ');
    const w = words(strip);
    if (w.length < 6) return 0;
    const set = new Set();
    sources.forEach(function (s) { const sw = words(s); for (let i = 0; i + 5 <= sw.length; i++) set.add(sw.slice(i, i + 5).join(' ')); });
    let hits = 0, total = 0;
    for (let i = 0; i + 5 <= w.length; i++) { total++; if (set.has(w.slice(i, i + 5).join(' '))) hits++; }
    return total ? hits / total : 0;
  }
  function keywordHits(text, kws) {
    const t = ' ' + words(text).join(' ') + ' ';
    return kws.filter(function (k) { return t.indexOf(' ' + k) !== -1; }).length;
  }
  function journalChecks(entry, lm) {
    const kw = keywordHits(entry.text, lm.journal.keywords);
    return [
      { ok: entry.words >= 20, label: 'At least 20 words (' + entry.words + ' so far)' },
      { ok: kw >= 2, label: 'Uses at least 2 important history words (' + kw + ' found)' },
      { ok: !entry.copied, label: 'Written in your own words, or exact words are in quotation marks' },
      { ok: entry.sources.length >= 1, label: 'Lists at least 1 source' },
      { ok: entry.sources.length >= 2 && entry.words >= 30 && wordCount(entry.trust) >= 6, label: 'Historian’s Edge: 2 or more sources, 30+ words, and a reason you trust a source', bonus: true }
    ];
  }
  function journalLevel(entry, lm) {
    const c = journalChecks(entry, lm);
    if (entry.words < 10 || (!c[1].ok && entry.sources.length === 0)) return 1;
    if (!(c[0].ok && c[1].ok && c[2].ok && c[3].ok)) return 2;
    return c[4].ok ? 4 : 3;
  }

  function journalScreen(i) {
    const lm = LM[i];
    const st = lmState(lm.id);
    const prev = S.journal.filter(function (j) { return j.lm === lm.id; })[0];
    const ta = el('textarea', { id: 'journal-text', rows: '6', 'aria-describedby': 'journal-prompt' });
    ta.value = prev ? prev.text : '';
    const trust = el('textarea', { id: 'journal-trust', rows: '2' });
    trust.value = prev ? (prev.trust || '') : '';
    const counter = el('p', { class: 'hint', 'aria-live': 'polite' });
    const srcBoxes = [{ id: 'scene', label: 'The scene at ' + lm.place.split(',')[0] }].concat(lm.voices.map(function (v) { return { id: v.id, label: v.name }; }))
      .map(function (s) {
        const box = el('input', { type: 'checkbox', id: 'src-' + s.id, value: s.id, checked: prev && prev.sources.indexOf(s.id) !== -1 });
        return { box: box, node: el('label', { class: 'check', for: 'src-' + s.id }, box, el('span', null, s.label)) };
      });
    const result = el('div', { class: 'journal-result', 'aria-live': 'polite' });
    const live = el('ul', { class: 'checklist' });
    function draft() {
      const text = ta.value.trim();
      return { text: text, trust: trust.value.trim(), words: wordCount(text), copied: copiedRatio(text, landmarkSourceText(lm)) > 0.4,
        sources: srcBoxes.filter(function (s) { return s.box.checked; }).map(function (s) { return s.box.value; }) };
    }
    function updateLive() {
      counter.textContent = wordCount(ta.value) + ' words';
      live.replaceChildren.apply(live, journalChecks(draft(), lm).map(function (c) {
        return el('li', { class: c.ok ? 'is-done' : '' }, el('span', { class: 'tick', 'aria-hidden': 'true' }, c.ok ? '\u2713' : '\u00B7'), c.label);
      }));
    }
    ta.addEventListener('input', updateLive);
    trust.addEventListener('input', updateLive);
    srcBoxes.forEach(function (s) { s.box.addEventListener('change', updateLive); });
    updateLive();
    let warnedCopy = false;

    async function submit() {
      const entry = {
        lm: lm.id, n: i, std: 'W.5.8', text: ta.value.trim(), trust: trust.value.trim(),
        sources: srcBoxes.filter(function (s) { return s.box.checked; }).map(function (s) { return s.box.value; }),
        date: S.date, ts: Date.now()
      };
      entry.words = wordCount(entry.text);
      entry.copyRatio = Math.round(copiedRatio(entry.text, landmarkSourceText(lm)) * 100) / 100;
      entry.copied = entry.copyRatio > 0.4;
      if (entry.words < 5) { result.replaceChildren(el('p', { class: 'fb-bad' }, 'Write at least a couple of sentences first.')); return; }
      if (entry.copied && !warnedCopy) {
        warnedCopy = true;
        result.replaceChildren(el('p', { class: 'fb-bad' }, 'C.A.R.T. noticed that much of this matches the sources word for word. Try putting it in your own words. If you want to keep someone’s exact words, put them in quotation marks. Then save again.'));
        return;
      }
      entry.level = journalLevel(entry, lm);
      const before = S.journal.filter(function (j) { return j.lm === lm.id; })[0];
      entry.revisions = before ? (before.revisions || 0) + 1 : 0;
      const oldLevel = before ? before.level : 0;
      S.journal = S.journal.filter(function (j) { return j.lm !== lm.id; }).concat([entry]);
      st.journal = true;
      const pay = Math.max(0, entry.level * 2 - oldLevel * 2);
      S.shillings += pay;
      save();
      renderHUD();
      updateLive();
      result.replaceChildren(
        el('p', { class: 'fb-good' }, 'Saved to your Time Journal. ' + (pay ? 'The town printer pays you ' + pay + ' shillings for your news notes.' : '')),
        el('p', { class: 'muted' }, entry.level < 4 ? 'Want to earn more? Check off more of the list above and save again before you leave this stop.' : 'Most excellent notes!'),
        el('div', { class: 'actions' }, btn('Back to ' + lm.place.split(',')[0], function () { hubScreen(i); }, 'btn-primary')));
    }

    show('journal',
      heading('Time Journal', lm.place + ' · ' + lm.when, 'Write research notes for your class report. The town printer pays for good notes.'),
      el('div', { class: 'split split-journal' },
        el('div', null,
          el('div', { class: 'field' }, el('label', { for: 'journal-text', id: 'journal-prompt' }, lm.journal.prompt), el('p', { class: 'hint' }, 'Write 2 to 4 sentences in your own words. Include important details.'), ta, counter),
          el('fieldset', { class: 'field' }, el('legend', null, 'Which sources did you use?'), srcBoxes.map(function (s) { return s.node; })),
          el('div', { class: 'field' }, el('label', { for: 'journal-trust' }, 'Historian’s Edge (optional): Which source do you trust most here, and why?'), trust),
          el('div', { class: 'notes-check' }, el('p', { class: 'fact-tag' }, 'Great notes checklist'), live),
          el('div', { class: 'actions' }, btn('Save my notes', submit, 'btn-primary'), backBtn('Back to ' + lm.place.split(',')[0], function () { hubScreen(i); })),
          result),
        sourcesPanel(lm)));
    ta.focus();
  }

  function journalBook(back) {
    const entries = S.journal.slice().sort(function (a, b) { return a.n - b.n; });
    show('journal-book',
      heading('Your Time Journal', S.names[0] + ' and ' + S.names[1]),
      entries.length ? entries.map(function (j) {
        const lm = LM[j.n];
        return el('article', { class: 'doc doc-compact' },
          el('p', { class: 'doc-tag' }, 'Stop ' + (j.n + 1) + ' · ' + fmtDate(j.date)),
          el('h3', { class: 'doc-name' }, lm.name),
          el('p', null, j.text),
          el('p', { class: 'doc-basis' }, 'Sources: ' + sourceNames(lm, j.sources).join('; ')));
      }) : el('p', null, 'No notes yet. Write in your journal at each historic stop.'),
      S.glossary.length ? el('div', null, el('h3', null, 'Words you looked up'), el('p', null, S.glossary.join(', '))) : null,
      backBtn('Back', back));
  }

  function sourceNames(lm, ids) {
    return ids.map(function (id) {
      if (id === 'scene') return 'Scene notes, ' + lm.place + ', ' + lm.when;
      const v = lm.voices.filter(function (o) { return o.id === id; })[0];
      if (!v) return id;
      return v.name + ', ' + (v.quoteSource || plain(v.role)) + ' (' + (v.kind === 'fictional' ? 'fictional character' : v.kind === 'document' ? 'primary source' : 'real person, adapted') + ')';
    });
  }

  // ------------------------------------------------------------ Field Report (RI standards, tiered)
  function reportScreen(i) {
    const lm = LM[i];
    const st = lmState(lm.id);
    if (st.report) { hubScreen(i); return; }
    // If a report was interrupted, keep the answers already given and continue.
    const outcomes = S.results.filter(function (r) { return r.lm === lm.id; });
    let set = outcomes.length;

    function nextSet() {
      if (set >= lm.report.length) return summary();
      const rs = lm.report[set];
      const o = { lm: lm.id, n: i, std: rs.std, ss: rs.ss, core: null, scaffold: null, ext: null, picks: {}, date: S.date, ts: Date.now() };
      outcomes.push(o);
      ask(rs, 'core', o, function (ok, tryExt) {
        if (ok && tryExt) ask(rs, 'extension', o, function () { done(o); });
        else if (ok) done(o);
        else ask(rs, 'scaffold', o, function () { done(o); });
      });
    }
    function done(o) {
      o.level = o.core ? (o.ext ? 4 : 3) : (o.scaffold ? 2 : 1);
      S.results.push(o);
      save();
      set++;
      nextSet();
    }
    function ask(rs, tier, o, then) {
      const item = rs[tier === 'extension' ? 'extension' : tier];
      const sd = STD.ela[rs.std];
      const choicesBox = el('div', { class: 'choices' });
      const feedback = el('div', { class: 'feedback', 'aria-live': 'polite' });
      const shuffled = seededShuffle(item.choices, S.id + lm.id + set + tier);
      shuffled.forEach(function (choice, k) {
        const b = el('button', { type: 'button', class: 'choice', 'data-key': String(k + 1) }, el('span', { class: 'choice-key' }, String(k + 1)), el('span', null, choice));
        b.addEventListener('click', function () { answer(choice, b); });
        choicesBox.append(b);
      });
      function answer(choice, b) {
        if (choicesBox.dataset.locked) return;
        choicesBox.dataset.locked = '1';
        const ok = choice === item.choices[0];
        o[tier === 'extension' ? 'ext' : tier] = ok;
        o.picks[tier] = choice;
        Array.prototype.forEach.call(choicesBox.children, function (c, k) { c.disabled = true; if (shuffled[k] === item.choices[0]) c.classList.add('is-correct'); });
        if (!ok) b.classList.add('is-wrong');
        const lastSet = set === lm.report.length - 1;
        const nextLabel = lastSet ? 'Finish the Field Report' : 'Next question';
        const cont = function () { then(ok, false); };
        let msg, buttons;
        if (ok && tier === 'core') {
          msg = 'Correct! You unlocked an Excellence Challenge: a harder, grade 6 version of this skill. It is optional, and there is no penalty if you miss it.';
          buttons = [btn('Try the Excellence Challenge', function () { then(true, true); }, 'btn-primary'), btn('Skip it: ' + nextLabel.toLowerCase(), cont)];
        } else if (!ok && tier === 'core') {
          msg = 'Not quite. The correct answer is highlighted in green.';
          buttons = [btn('Try a related question', cont, 'btn-primary')];
        } else {
          msg = ok ? (tier === 'extension' ? 'Most excellent! You nailed the grade 6 challenge.' : 'Correct!') : 'Not quite. The correct answer is highlighted in green.';
          buttons = [btn(nextLabel, cont, 'btn-primary')];
        }
        feedback.replaceChildren(
          el('p', { class: ok ? 'fb-good' : 'fb-bad' }, msg),
          el('p', null, item.why),
          el('div', { class: 'actions' }, buttons));
        keys.clear();
        keys.bind('Enter', ok && tier === 'core' ? function () { then(true, true); } : cont);
        const fb = feedback.querySelector('button');
        if (fb) fb.focus();
      }
      show('report',
        heading('Field Report', lm.place + ' · Question ' + (set + 1) + ' of ' + lm.report.length),
        el('p', { class: 'skill-line' },
          el('span', { class: 'chip chip-std', title: rs.std }, 'Skill: ' + sd.kid),
          el('span', { class: 'chip chip-tier chip-' + tier }, TIER_LABEL[tier])),
        el('div', { class: 'q-panel' },
          el('p', { class: 'q-stem', 'data-focus': true }, item.stem),
          el('div', { class: 'actions actions-top' }, readAloud(function () { return item.stem + ' ' + shuffled.map(function (c, k) { return 'Choice ' + (k + 1) + ': ' + c + '.'; }).join(' '); })),
          choicesBox, feedback),
        sourcesPanel(lm));
    }
    function summary() {
      st.report = true;
      save();
      let pts = 0;
      outcomes.forEach(function (o) { pts += (o.core ? 100 : 0) + (o.ext ? 150 : 0) + (o.scaffold ? 50 : 0); });
      show('report-summary',
        heading('Field Report logged', lm.place + ' · ' + lm.when, pts + ' report points'),
        el('ul', { class: 'level-list' }, outcomes.map(function (o) {
          return el('li', null, el('span', { class: 'lv lv-' + o.level }, LEVEL_NAMES[o.level]), ' ', el('strong', null, o.std + ' ' + STD.ela[o.std].kid), el('span', { class: 'muted' }, ' · ' + STD.levels[o.level].note));
        })),
        cart('RESEARCH LOGGED. RETURN DATE RENEWED.'),
        el('div', { class: 'actions' }, btn('Back to ' + lm.place.split(',')[0], function () { hubScreen(i); }, 'btn-primary')));
      keys.bind('Enter', function () { hubScreen(i); });
    }
    nextSet();
  }

  // ------------------------------------------------------------ time jump
  function jumpScreen(next) {
    S.phase = 'jump';
    S.leg = next - 1;
    save();
    const from = LM[next - 1], to = LM[next];
    const yearEl = el('p', { class: 'jump-year', 'aria-hidden': 'true' }, String(from.year));
    const go = function () {
      S.leg = next;
      S.date = to.landing.date;
      S.miles = 0;
      S.riverDone = false;
      S.riverDepth = null;
      S.health = S.health.map(function (h) { return Math.min(100, h + 15); });
      S.weather = rollWeather(S.date);
      S.lastLog = '';
      save();
      navigatorScreen(next);
    };
    show('jump',
      el('section', { class: 'jump' },
        el('div', { class: 'jump-swirl', 'aria-hidden': 'true' }),
        yearEl,
        el('h2', { class: 'screen-title', 'data-focus': true }, 'C.A.R.T. is jumping to ' + fmtDate(to.landing.date)),
        el('div', { class: 'meanwhile' }, el('p', { class: 'fact-tag' }, 'Meanwhile, in history'), el('ul', null, (to.bridge || []).map(function (b) { return el('li', null, b); }))),
        cart('JUMP COMPLETE. EVERYONE FEELS RESTED. LANDING IN ' + to.landing.town.toUpperCase() + '.'),
        el('div', { class: 'actions' }, btn('Step out of the cart', go, 'btn-primary'))));
    keys.bind('Enter', go);
    keys.bind('Space', go);
    const target = to.year;
    let y = from.year;
    const tick = setInterval(function () {
      if (ui.screen !== 'jump' || y >= target) { clearInterval(tick); yearEl.textContent = String(target); return; }
      y++;
      yearEl.textContent = String(y);
    }, 280);
  }

  // ------------------------------------------------------------ finale
  function homeScreen(k) {
    S.phase = 'home';
    save();
    const panel = C.finale.home[k];
    const last = k === C.finale.home.length - 1;
    const next = function () { if (last) timelineScreen(); else homeScreen(k + 1); };
    show('home',
      el('section', { class: 'story' },
        el('p', { class: 'story-stamp' }, fill(panel.stamp)),
        el('p', { class: 'story-text', 'data-focus': true }, fill(panel.text)),
        el('div', { class: 'actions' }, btn(last ? 'Get ready to present' : 'Next', next, 'btn-primary'))));
    keys.bind('Enter', next);
    keys.bind('Space', next);
  }

  function timelineScreen() {
    S.phase = 'timeline';
    save();
    let order = seededShuffle(C.finale.timeline, S.id + 'timeline');
    const list = el('ol', { class: 'timeline-list' });
    const feedback = el('div', { class: 'feedback', 'aria-live': 'polite' });
    let checked = false;
    function move(idx, dir) {
      const j = idx + dir;
      if (j < 0 || j >= order.length) return;
      const t = order[idx]; order[idx] = order[j]; order[j] = t;
      draw(idx + dir, dir);
    }
    function draw(focusIdx, dir) {
      list.replaceChildren();
      order.forEach(function (ev, idx) {
        const correct = checked && C.finale.timeline[idx].id === ev.id;
        const up = el('button', { type: 'button', class: 'step', 'aria-label': 'Move "' + ev.label + '" earlier', disabled: checked || idx === 0 || null, onclick: function () { move(idx, -1); } }, '▲');
        const down = el('button', { type: 'button', class: 'step', 'aria-label': 'Move "' + ev.label + '" later', disabled: checked || idx === order.length - 1 || null, onclick: function () { move(idx, 1); } }, '▼');
        list.append(el('li', { class: 'timeline-item' + (checked ? (correct ? ' is-correct' : ' is-wrong') : '') },
          el('span', { class: 'timeline-pos' }, String(idx + 1)),
          el('span', { class: 'timeline-label' }, ev.label, checked ? el('span', { class: 'timeline-year' }, ' ' + ev.year) : null),
          el('span', { class: 'timeline-move' }, up, down)));
        if (focusIdx === idx) setTimeout(function () { (dir < 0 ? up : down).disabled ? (dir < 0 ? down : up).focus() : (dir < 0 ? up : down).focus(); }, 0);
      });
    }
    function check() {
      checked = true;
      const correct = order.filter(function (ev, idx) { return C.finale.timeline[idx].id === ev.id; }).length;
      S.timeline = { ss: 'H1.5.1', order: { correct: correct, total: order.length, picks: order.map(function (e) { return e.id; }) }, causes: S.timeline && S.timeline.causes || null };
      save();
      draw();
      feedback.replaceChildren(
        el('p', { class: correct >= 8 ? 'fb-good' : 'fb-bad' }, correct + ' of ' + order.length + ' events are in the right place.'),
        el('p', null, 'The years are now shown. Each event helped cause the ones after it.'),
        btn('Next: causes and effects', causesScreen, 'btn-primary'));
      checkBtn.hidden = true;
      feedback.querySelector('button').focus();
    }
    const checkBtn = btn('Check my timeline', check, 'btn-primary');
    show('timeline',
      heading('Timeline challenge', 'Back in class', 'Before you present, put these events in order from earliest to latest. Use the arrows to move them.'),
      list, el('div', { class: 'actions' }, checkBtn), feedback);
    draw();
  }

  function causesScreen() {
    S.phase = 'causes';
    save();
    const pairs = C.finale.causes;
    const causeOpts = seededShuffle(pairs.map(function (p) { return p.cause; }), S.id + 'causes');
    const selects = pairs.map(function (p, k) {
      const s = el('select', { id: 'cause-' + k },
        el('option', { value: '' }, 'Choose the cause...'),
        causeOpts.map(function (c) { return el('option', { value: c }, c); }));
      return s;
    });
    const feedback = el('div', { class: 'feedback', 'aria-live': 'polite' });
    const rows = el('div', { class: 'cause-rows' }, pairs.map(function (p, k) {
      return el('div', { class: 'cause-row', id: 'cause-row-' + k },
        el('label', { for: 'cause-' + k }, el('span', { class: 'muted' }, 'Effect: '), p.effect),
        el('div', { class: 'cause-select' }, el('span', { class: 'muted' }, 'Caused by: '), selects[k]));
    }));
    function check() {
      if (selects.some(function (s) { return !s.value; })) { feedback.replaceChildren(el('p', { class: 'fb-bad' }, 'Choose a cause for every effect first.')); return; }
      let correct = 0;
      selects.forEach(function (s, k) {
        const ok = s.value === pairs[k].cause;
        if (ok) correct++;
        s.disabled = true;
        const row = document.getElementById('cause-row-' + k);
        row.classList.add(ok ? 'is-correct' : 'is-wrong');
        if (!ok) row.append(el('p', { class: 'fb-bad' }, 'Answer: ' + pairs[k].cause));
      });
      S.timeline = S.timeline || { ss: 'H1.5.1', order: null };
      S.timeline.causes = { correct: correct, total: pairs.length, picks: selects.map(function (s) { return s.value; }) };
      save();
      feedback.replaceChildren(el('p', { class: correct >= 4 ? 'fb-good' : 'fb-bad' }, correct + ' of ' + pairs.length + ' causes matched.'), btn('Next: build your report', reportBuilder, 'btn-primary'));
      checkBtn.hidden = true;
      feedback.querySelector('button').focus();
    }
    const checkBtn = btn('Check my answers', check, 'btn-primary');
    show('causes', heading('Causes and effects', 'Back in class', 'Match each event with the event that caused it.'),
      rows, el('div', { class: 'actions' }, checkBtn), feedback);
  }

  function reportChecks(r) {
    const ev = (r.evidence || []).filter(function (e) { return e.journal != null && e.journal !== '' && wordCount(e.explain) >= 6; });
    const stops = new Set(ev.map(function (e) { return e.journal; }));
    return [
      { ok: !!r.question && wordCount(r.claim) >= 8, label: 'A claim that answers your question (8+ words)', std: 'W.5.1' },
      { ok: ev.length >= 3, label: '3 pieces of evidence from your journal, each explained (6+ words)', std: 'W.5.9' },
      { ok: stops.size >= 3, label: 'Evidence from at least 3 different stops', std: 'SSS1.5.2' },
      { ok: wordCount(r.perspective) >= 8, label: 'Another point of view (8+ words)', std: 'SSS4.5.1' },
      { ok: wordCount(r.conclusion) >= 8, label: 'Why it matters today (8+ words)', std: 'H4.5.1' }
    ];
  }
  function reportLevel(r) {
    const n = reportChecks(r).filter(function (c) { return c.ok; }).length;
    return n === 5 ? 4 : n === 4 ? 3 : n >= 2 ? 2 : 1;
  }

  function reportBuilder() {
    S.phase = 'report';
    S.report = S.report || { question: '', claim: '', evidence: [{ journal: '', explain: '' }, { journal: '', explain: '' }, { journal: '', explain: '' }], perspective: '', conclusion: '' };
    save();
    const r = S.report;
    const entries = S.journal.slice().sort(function (a, b) { return a.n - b.n; });
    const checklist = el('ul', { class: 'checklist' });
    const msg = el('p', { class: 'form-msg', role: 'status' });
    function refresh() { checklist.replaceChildren.apply(checklist, reportChecks(r).map(function (c) { return el('li', { class: c.ok ? 'is-done' : '' }, el('span', { class: 'tick', 'aria-hidden': 'true' }, c.ok ? '✓' : '·'), c.label); })); save(); }
    function area(id, val, rows, onIn) { const t = el('textarea', { id: id, rows: String(rows) }); t.value = val || ''; t.addEventListener('input', function () { onIn(t.value); refresh(); }); return t; }
    const qBox = el('fieldset', { class: 'field' }, el('legend', null, '1. Choose your compelling question'),
      C.finale.questions.map(function (q) {
        const input = el('input', { type: 'radio', name: 'report-q', id: 'q-' + q.id, value: q.id, checked: r.question === q.id });
        input.addEventListener('change', function () { r.question = q.id; refresh(); });
        return el('label', { class: 'radio', for: 'q-' + q.id }, input, el('span', null, q.text));
      }));
    const evBlocks = r.evidence.map(function (e, k) {
      const sel = el('select', { id: 'ev-' + k },
        el('option', { value: '' }, 'Choose a note from your Time Journal...'),
        entries.map(function (j) { return el('option', { value: String(j.n), selected: String(e.journal) === String(j.n) }, 'Stop ' + (j.n + 1) + ', ' + LM[j.n].name + ': ' + j.text.slice(0, 60) + (j.text.length > 60 ? '...' : '')); }));
      const preview = el('p', { class: 'ev-preview' });
      const showPreview = function () {
        const j = entries.filter(function (x) { return String(x.n) === sel.value; })[0];
        preview.textContent = j ? '“' + j.text + '”' : '';
      };
      sel.addEventListener('change', function () { e.journal = sel.value; showPreview(); refresh(); });
      showPreview();
      return el('div', { class: 'ev-block' },
        el('label', { for: 'ev-' + k }, 'Evidence ' + (k + 1)), sel, preview,
        el('label', { for: 'ev-' + k + '-explain' }, 'This shows that...'),
        area('ev-' + k + '-explain', e.explain, 2, function (v) { e.explain = v; }));
    });
    function finish() {
      const checks = reportChecks(r);
      if (!checks[0].ok || r.evidence.filter(function (e) { return e.journal !== '' && wordCount(e.explain) >= 6; }).length < 2) {
        msg.textContent = 'To finish, choose a question, write your claim, and explain at least 2 pieces of evidence.';
        return;
      }
      r.level = reportLevel(r);
      r.ts = Date.now();
      save();
      reportView();
    }
    show('report-builder',
      heading('Build your class report', 'Back in class', 'Answer a big question about the Revolution, using your own Time Journal notes as evidence.'),
      el('div', { class: 'split split-journal' },
        el('div', { class: 'report-form' },
          qBox,
          el('div', { class: 'field' }, el('label', { for: 'report-claim' }, '2. Your claim: your answer to the question'), area('report-claim', r.claim, 3, function (v) { r.claim = v; })),
          el('fieldset', { class: 'field' }, el('legend', null, '3. Your evidence'), evBlocks),
          el('div', { class: 'field' }, el('label', { for: 'report-perspective' }, '4. Another point of view: someone who saw it differently might say...'), area('report-perspective', r.perspective, 3, function (v) { r.perspective = v; })),
          el('div', { class: 'field' }, el('label', { for: 'report-conclusion' }, '5. Why does this still matter today?'), area('report-conclusion', r.conclusion, 3, function (v) { r.conclusion = v; })),
          el('div', { class: 'actions' }, btn('Finish my report', finish, 'btn-primary')), msg),
        el('aside', { class: 'hub-checklist' }, el('p', { class: 'fact-tag' }, 'Report checklist'), checklist,
          cart('TIP: THE BEST REPORTS USE NOTES FROM SEVERAL DIFFERENT STOPS.'))));
    refresh();
  }

  function reportParts() {
    const r = S.report;
    const q = C.finale.questions.filter(function (x) { return x.id === r.question; })[0];
    const ev = r.evidence.filter(function (e) { return e.journal !== ''; }).map(function (e) {
      const j = S.journal.filter(function (x) { return String(x.n) === String(e.journal); })[0];
      return { stop: LM[Number(e.journal)], note: j ? j.text : '', explain: e.explain, sources: j ? sourceNames(LM[j.n], j.sources) : [] };
    });
    const srcs = [];
    ev.forEach(function (e) { e.sources.forEach(function (s) { if (srcs.indexOf(s) === -1) srcs.push(s); }); });
    return { q: q ? q.text : '', claim: r.claim, ev: ev, perspective: r.perspective, conclusion: r.conclusion, sources: srcs };
  }
  function reportText() {
    const p = reportParts();
    const lines = [p.q, 'By ' + S.names[0] + ' and ' + S.names[1], '', 'Claim: ' + p.claim, ''];
    p.ev.forEach(function (e, k) { lines.push('Evidence ' + (k + 1) + ' (' + e.stop.name + ', ' + e.stop.when + '): ' + e.note, 'This shows that ' + e.explain, ''); });
    lines.push('Another point of view: ' + p.perspective, '', 'Why it matters today: ' + p.conclusion, '', 'Sources:');
    p.sources.forEach(function (s) { lines.push('- ' + s); });
    return lines.join('\n');
  }

  function reportView() {
    const p = reportParts();
    const copyMsg = el('p', { class: 'form-msg', role: 'status' });
    show('report-view',
      heading('Your class report', 'Ready to present'),
      el('article', { class: 'doc report-doc' },
        el('p', { class: 'doc-tag' }, 'Field report from the past'),
        el('h3', { class: 'doc-name' }, p.q),
        el('p', { class: 'doc-role' }, 'By ' + S.names[0] + ' and ' + S.names[1]),
        el('h4', null, 'Our claim'), el('p', null, p.claim),
        el('h4', null, 'Our evidence'),
        p.ev.map(function (e) { return el('div', { class: 'ev-out' }, el('p', { class: 'ev-where' }, e.stop.name + ', ' + e.stop.when), el('p', null, '“' + e.note + '”'), el('p', null, 'This shows that ' + e.explain)); }),
        el('h4', null, 'Another point of view'), el('p', null, p.perspective || '(not written yet)'),
        el('h4', null, 'Why it matters today'), el('p', null, p.conclusion || '(not written yet)'),
        el('h4', null, 'Sources'), el('ul', null, p.sources.map(function (s) { return el('li', null, s); }))),
      el('div', { class: 'actions no-print' },
        btn('Present to the class', presentScreen, 'btn-primary'),
        btn('Copy report text', function () { copyText(reportText(), copyMsg); }),
        TOP_LEVEL ? btn('Print', function () { window.print(); }) : null,
        btn('Edit report', reportBuilder),
        btn('See my results', resultsScreen)),
      copyMsg);
  }

  function presentScreen() {
    const p = reportParts();
    const slides = [
      { big: p.q, small: S.names[0] + ' and ' + S.names[1] + ' · Reporting live from 1773 to 1791' },
      { big: p.claim, small: 'Our claim' }
    ].concat(p.ev.map(function (e, k) { return { big: e.explain ? 'This shows that ' + e.explain : e.note, small: 'Evidence ' + (k + 1) + ': ' + e.stop.name + ', ' + e.stop.when, note: e.note }; }))
      .concat([{ big: p.perspective, small: 'Another point of view' }, { big: p.conclusion, small: 'Why it matters today' }, { big: 'Any questions?', small: 'Sources: ' + p.sources.length + ' primary and secondary sources from our Time Journal' }]);
    let k = 0;
    const stage = el('div', { class: 'slide', 'aria-live': 'polite' });
    function draw() {
      const s = slides[k];
      stage.replaceChildren();
      append(stage, [el('p', { class: 'slide-small' }, s.small), el('p', { class: 'slide-big' }, s.big || ''), s.note ? el('p', { class: 'slide-note' }, '“' + s.note + '”') : null, el('p', { class: 'slide-count' }, (k + 1) + ' / ' + slides.length)]);
    }
    const nextFn = function () { if (k < slides.length - 1) { k++; draw(); } };
    const prevFn = function () { if (k > 0) { k--; draw(); } };
    show('present', el('section', { class: 'present' }, el('h2', { class: 'visually-hidden' }, 'Presentation'), stage,
      el('div', { class: 'actions' }, btn('Previous', prevFn), btn('Next', nextFn, 'btn-primary'), backBtn('End presentation', reportView)),
      el('p', { class: 'hint' }, 'Use the arrow keys to move between slides. Speak clearly and at a steady pace.')));
    keys.bind('ArrowRight', nextFn); keys.bind('ArrowLeft', prevFn); keys.bind('Space', nextFn);
    draw();
  }

  // ------------------------------------------------------------ results
  function computeScore() {
    let learning = 0;
    S.results.forEach(function (r) { learning += (r.core ? 100 : 0) + (r.ext ? 150 : 0) + (r.scaffold ? 50 : 0); });
    S.journal.forEach(function (j) { learning += j.level * 40; });
    S.nav.forEach(function (n) { learning += n.correct ? 50 : 0; });
    S.checks.forEach(function (c) { learning += c.correct ? 25 : 0; });
    if (S.timeline) learning += ((S.timeline.order ? S.timeline.order.correct : 0) + (S.timeline.causes ? S.timeline.causes.correct : 0)) * 20;
    if (S.report && S.report.level) learning += S.report.level * 75;
    const survival = Math.round(avgHealth()) + Math.floor(S.food / 10) + S.shillings * 2 + S.wheels * 10 + S.remedies * 5 - S.stats.recalls * 50;
    const maxLearning = LM.length * 3 * 250 + LM.length * 160 + LM.length * 50 + (C.finale.timeline.length + C.finale.causes.length) * 20 + 300;
    return { learning: learning, survival: Math.max(0, survival), total: learning + Math.max(0, survival), pct: Math.round(learning / maxLearning * 100) };
  }
  function rank(pct) {
    if (pct >= 80) return 'Most Excellent Historian';
    if (pct >= 60) return 'Master Historian';
    if (pct >= 40) return 'Junior Historian';
    return 'Time Tourist';
  }

  function growthRows(data) {
    const order = Object.keys(STD.ela);
    return order.map(function (code) {
      const pts = code === 'W.5.8'
        ? data.journal.slice().sort(function (a, b) { return a.n - b.n; }).map(function (j) { return { n: j.n, level: j.level }; })
        : data.results.filter(function (r) { return r.std === code; }).sort(function (a, b) { return a.n - b.n; }).map(function (r) { return { n: r.n, level: r.level }; });
      const half = Math.ceil(pts.length / 2);
      const avg = function (a) { return a.length ? a.reduce(function (t, p) { return t + p.level; }, 0) / a.length : 0; };
      const early = avg(pts.slice(0, half)), late = avg(pts.slice(pts.length - half));
      return { code: code, kid: STD.ela[code].kid, pts: pts, early: pts.length ? Math.round(early * 10) / 10 : null, late: pts.length ? Math.round(late * 10) / 10 : null, growth: pts.length > 1 ? Math.round((late - early) * 10) / 10 : 0 };
    });
  }

  function growthTracker(data) {
    const rows = growthRows(data);
    return el('div', { class: 'table-wrap' }, el('table', { class: 'table growth' },
      el('thead', null, el('tr', null, el('th', { scope: 'col' }, 'Reading and writing skill'), el('th', { scope: 'col' }, 'Each time you practiced (stop number)'), el('th', { scope: 'col' }, 'Early in the trip'), el('th', { scope: 'col' }, 'Late in the trip'), el('th', { scope: 'col' }, 'Growth'))),
      el('tbody', null, rows.map(function (r) {
        const arrow = r.growth > 0.2 ? '▲ up' : r.growth < -0.2 ? '▼ down' : '→ steady';
        return el('tr', null,
          el('th', { scope: 'row' }, el('span', { class: 'std-code' }, r.code), ' ', r.kid),
          el('td', null, el('span', { class: 'dots' }, r.pts.length ? r.pts.map(function (p) { return el('span', { class: 'dot lv-' + p.level, title: 'Stop ' + (p.n + 1) + ': ' + LEVEL_NAMES[p.level] }, String(p.n + 1)); }) : el('span', { class: 'muted' }, 'Not yet'))),
          el('td', null, avgBadge(r.early)),
          el('td', null, avgBadge(r.late)),
          el('td', { class: r.growth > 0.2 ? 'growth-up' : r.growth < -0.2 ? 'growth-down' : '' }, r.pts.length > 1 ? arrow : '—'));
      }))));
  }

  function avgBadge(avg) {
    if (avg == null) return '—';
    const lv = clamp(Math.round(avg), 1, 4);
    return el('span', { class: 'lv lv-' + lv, title: 'Average level ' + avg }, LEVEL_NAMES[lv] + ' ' + avg.toFixed(1));
  }

  function levelKey() {
    return el('p', { class: 'level-key' }, [1, 2, 3, 4].map(function (n) {
      return el('span', null, el('span', { class: 'lv lv-' + n }, LEVEL_NAMES[n]), ' ' + STD.levels[n].note + '. ');
    }));
  }

  function copyText(text, msgEl, fallbackHolder) {
    const done = function () { msgEl.textContent = 'Copied!'; };
    const fail = function () {
      msgEl.textContent = 'Your browser blocked copying. Select the text below and copy it yourself.';
      if (fallbackHolder) { fallbackHolder.hidden = false; fallbackHolder.value = text; fallbackHolder.focus(); fallbackHolder.select(); }
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fail);
      else fail();
    } catch (e) { fail(); }
  }

  function codeScreen(back) {
    save();
    const msg = el('p', { class: 'form-msg', role: 'status' });
    const fallback = el('textarea', { id: 'code-fallback', rows: '4', readonly: true, hidden: true, 'aria-label': 'Progress code' });
    const code = encodeCode(exportObj());
    show('code',
      heading('Your progress code', 'Saved ' + fmtDate(S.date), 'Your journey is saved on this computer. A progress code lets you continue on another computer and lets your teacher see your work so far.'),
      el('div', { class: 'actions' },
        btn('Copy progress code', function () { copyText(code, msg, fallback); }, 'btn-primary'),
        TOP_LEVEL ? btn('Download progress file', download) : null,
        btn('Save and go to the title screen', titleScreen),
        backBtn('Back to the journey', back)),
      msg, fallback);
  }

  function resultsScreen() {
    S.phase = 'done';
    if (!S.finished) S.finished = new Date().toISOString();
    save();
    const sc = computeScore();
    const msg = el('p', { class: 'form-msg', role: 'status' });
    const fallback = el('textarea', { id: 'code-fallback', rows: '4', readonly: true, hidden: true, 'aria-label': 'Progress code' });
    const code = encodeCode(exportObj());
    const ssTally = {};
    S.results.forEach(function (r) { ssTally[r.ss] = ssTally[r.ss] || [0, 0]; ssTally[r.ss][1]++; if (r.core || r.scaffold) ssTally[r.ss][0]++; });
    const navOk = S.nav.filter(function (n) { return n.correct; }).length;
    show('results',
      el('section', { class: 'certificate', 'aria-labelledby': 'cert-rank' },
        el('p', { class: 'certificate-kicker' }, 'Be it known to all that'),
        el('p', { class: 'certificate-names' }, S.names[0] + ' & ' + S.names[1]),
        el('p', { class: 'certificate-text' }, 'scholars of the fifth grade, travelled from the year 1773 to the year 1791, witnessed the birth of the United States, and returned to report it to their class. They are hereby named'),
        el('h2', { class: 'certificate-rank', id: 'cert-rank', 'data-focus': true }, rank(sc.pct)),
        el('p', { class: 'certificate-text' }, 'Given this day, ' + new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + (S.teacher ? ', and witnessed by ' + S.teacher : '') + '.'),
        el('div', { class: 'seal', 'aria-hidden': 'true' }, 'R')),
      el('div', { class: 'score-row' },
        el('div', { class: 'score' }, el('p', { class: 'score-num' }, String(sc.learning)), el('p', { class: 'score-label' }, 'History points')),
        el('div', { class: 'score' }, el('p', { class: 'score-num' }, String(sc.survival)), el('p', { class: 'score-label' }, 'Trail survival bonus')),
        el('div', { class: 'score' }, el('p', { class: 'score-num' }, String(sc.total)), el('p', { class: 'score-label' }, 'Total score'))),
      el('h3', null, 'How your reading and writing grew'),
      levelKey(),
      growthTracker(S),
      el('h3', null, 'History, civics, economics and geography'),
      el('ul', { class: 'ss-list' },
        el('li', null, 'Map skills (G1.5.1): ' + navOk + ' of ' + S.nav.length + ' navigator checks correct'),
        S.timeline && S.timeline.order ? el('li', null, 'Timeline (H1.5.1): ' + S.timeline.order.correct + ' of ' + S.timeline.order.total + ' in order; ' + (S.timeline.causes ? S.timeline.causes.correct + ' of ' + S.timeline.causes.total + ' causes matched' : '')) : null,
        el('li', null, 'Checkpoint questions answered correctly: ' + S.checks.filter(function (c) { return c.correct; }).length + ' of ' + S.checks.length)),
      el('p', { class: 'hint' }, 'Questions understood for each social studies standard (the grade 5 question or the step-back question answered correctly):'),
      el('div', { class: 'ss-chips' }, Object.keys(ssTally).sort().map(function (k) {
        return el('span', { class: 'ss-chip', title: STD.ss[k] ? STD.ss[k].text : k }, el('span', { class: 'std-code' }, k), ' ' + ssTally[k][0] + '/' + ssTally[k][1]);
      })),
      el('h3', null, 'Share your results with your teacher'),
      el('p', null, 'Copy your progress code and paste it where your teacher tells you. It includes your answers, journal and report.'),
      el('div', { class: 'actions' },
        btn('Copy progress code', function () { copyText(code, msg, fallback); }, 'btn-primary'),
        TOP_LEVEL ? btn('Download progress file', download) : null,
        S.report ? btn('View my report', reportView) : null,
        btn('Back to title', titleScreen)),
      msg, fallback,
      el('p', { class: 'fineprint' }, 'Days on the trail: ' + S.stats.days + ' · Food foraged: ' + S.stats.foraged + ' lbs · Rivers crossed: ' + S.stats.crossings + ' · Nurse mode: ' + S.stats.nurse + ' · Emergency recalls: ' + S.stats.recalls));
  }

  function download() {
    try {
      const blob = new Blob([JSON.stringify(exportObj(), null, 1)], { type: 'application/json' });
      const a = el('a', { href: URL.createObjectURL(blob), download: 'revolution-trail-' + S.names.join('-').replace(/[^a-z0-9-]/gi, '') + '.json' });
      document.body.append(a);
      a.click();
      a.remove();
    } catch (e) { /* download not available */ }
  }

  // ------------------------------------------------------------ boot
  function init() {
    ui.main = document.getElementById('main');
    ui.hud = document.getElementById('hud');
  }
  function start(data) {
    init();
    if (data && data.save) {
      try { const s = JSON.parse(data.save); if (valid(s)) { resume(s); return; } } catch (e) { /* ignore */ }
    }
    titleScreen();
  }
  const hot = window.claude && window.claude.hot;
  if (hot && typeof hot.snapshot === 'function') {
    try { hot.snapshot(function () { return { save: S ? JSON.stringify(S) : null }; }); } catch (e) { /* ignore */ }
  }
  if (hot && typeof hot.ready === 'function') hot.ready(start);
  else start((hot && hot.data) || {});

  // Exposed for automated tests and the teacher dashboard.
  window.RT_GAME = { growthRows: growthRows, decodeCode: decodeCode, encodeCode: encodeCode, state: function () { return S; }, screen: function () { return ui.screen; }, setDayMs: function (ms) { DAY_MS = ms; } };
})();
