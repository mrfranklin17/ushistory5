/*
 * Teacher Dashboard for The Revolution Trail.
 * Reads the progress codes and files students export from the game, keeps them
 * in this browser's localStorage, and summarizes growth on each standard.
 */
(function () {
  'use strict';

  const STD = window.RT_STANDARDS, C = window.RT_CONTENT, LM = C.landmarks;
  const KEY = 'revolutionTrail.teacher.v1';
  const CODE_PREFIX = 'RT1:';
  const LEVEL_NAMES = { 1: 'Beginning', 2: 'Approaching', 3: 'Meeting', 4: 'Extending' };
  const CODES = Object.keys(STD.ela);
  const TOP = (function () { try { return window.self === window.top; } catch (e) { return false; } })();

  const store = {
    get: function () { try { const raw = window.localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } },
    set: function (v) { try { window.localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  let db = store.get() || { students: {}, overrides: {} };
  let selected = null;

  // ------------------------------------------------------------ helpers
  function el(tag, props) {
    const node = document.createElement(tag);
    if (props) Object.keys(props).forEach(function (k) {
      const v = props[k];
      if (v == null || v === false) return;
      if (k === 'class') node.className = v;
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? '' : v);
    });
    for (let i = 2; i < arguments.length; i++) add(node, arguments[i]);
    return node;
  }
  function add(node, kid) {
    if (kid == null || kid === false) return;
    if (Array.isArray(kid)) { kid.forEach(function (k) { add(node, k); }); return; }
    node.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function avg(a) { return a.length ? a.reduce(function (t, x) { return t + x; }, 0) / a.length : null; }
  function fmt1(n) { return n == null ? '' : n.toFixed(1); }
  function save() { store.set(db); }
  function words(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9'\s-]/g, ' ').split(/\s+/).filter(Boolean); }
  function studentName(s) { return s.names[0] + ' & ' + s.names[1] + (s.sample ? ' (sample)' : ''); }

  function decodeCode(code) {
    const clean = String(code || '').trim();
    if (clean[0] === '{') return JSON.parse(clean);
    if (clean.indexOf(CODE_PREFIX) !== 0) throw new Error('prefix');
    const bin = atob(clean.slice(CODE_PREFIX.length).replace(/\s+/g, ''));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  function valid(s) { return s && s.v === 1 && Array.isArray(s.names) && Array.isArray(s.results); }

  function ov(id) { if (!db.overrides[id]) db.overrides[id] = { journal: {}, report: null }; return db.overrides[id]; }
  function journalLevel(s, j) { const o = db.overrides[s.id]; return o && o.journal[j.lm] ? Number(o.journal[j.lm]) : j.level; }
  function reportLevel(s) { const o = db.overrides[s.id]; return o && o.report ? Number(o.report) : (s.report && s.report.level) || null; }

  function series(s, code) {
    if (code === 'W.5.8') return s.journal.slice().sort(function (a, b) { return a.n - b.n; }).map(function (j) { return { n: j.n, level: journalLevel(s, j) }; });
    return s.results.filter(function (r) { return r.std === code; }).sort(function (a, b) { return a.n - b.n; }).map(function (r) { return { n: r.n, level: r.level }; });
  }
  function growth(s, code) {
    const pts = series(s, code);
    const half = Math.ceil(pts.length / 2);
    const lv = function (a) { return a.map(function (p) { return p.level; }); };
    const early = avg(lv(pts.slice(0, half))), late = avg(lv(pts.slice(pts.length - half)));
    return { pts: pts, early: early, late: late, delta: pts.length > 1 ? late - early : null };
  }
  function stopsDone(s) { const set = new Set(); s.results.forEach(function (r) { set.add(r.n); }); return set.size; }

  function badge(level, text) {
    if (level == null) return el('span', { class: 'muted' }, '—');
    const lv = clamp(Math.round(level), 1, 4);
    return el('span', { class: 'lv lv-' + lv, title: LEVEL_NAMES[lv] }, text || LEVEL_NAMES[lv]);
  }
  function arrow(d) {
    if (d == null) return el('span', { class: 'muted' }, '—');
    if (d > 0.2) return el('span', { class: 'growth-up' }, '▲ +' + d.toFixed(1));
    if (d < -0.2) return el('span', { class: 'growth-down' }, '▼ ' + d.toFixed(1));
    return el('span', null, '→ ' + (d >= 0 ? '+' : '') + d.toFixed(1));
  }

  // ------------------------------------------------------------ import
  function addStudent(s) {
    if (!valid(s)) return false;
    if (!s.id) s.id = 'student-' + Math.random().toString(36).slice(2, 9);
    delete s.checkpoint;
    db.students[s.id] = s;
    return true;
  }

  async function doImport() {
    const msg = document.getElementById('import-msg');
    const text = document.getElementById('import-code').value;
    const files = document.getElementById('import-files').files;
    let added = 0, failed = 0;
    const chunks = text.split(/\s+(?=RT1:)|\n\s*\n/).map(function (t) { return t.trim(); }).filter(Boolean);
    chunks.forEach(function (c) { try { if (addStudent(decodeCode(c))) added++; else failed++; } catch (e) { failed++; } });
    for (let i = 0; i < files.length; i++) {
      try { if (addStudent(decodeCode(await files[i].text()))) added++; else failed++; } catch (e) { failed++; }
    }
    save();
    document.getElementById('import-code').value = '';
    document.getElementById('import-files').value = '';
    msg.textContent = (added ? 'Added ' + added + ' student result' + (added > 1 ? 's' : '') + '. ' : '') +
      (failed ? failed + ' item' + (failed > 1 ? 's' : '') + ' could not be read. Check that each code starts with RT1: and was copied completely.' : '') ||
      'Paste a code or choose a file first.';
    render();
  }

  // ------------------------------------------------------------ class summary
  function renderClass() {
    const box = document.getElementById('class-summary');
    const note = document.getElementById('class-note');
    const list = Object.values(db.students);
    box.replaceChildren();
    if (!list.length) {
      note.textContent = 'No students yet. Add progress codes above, or load a sample class to see how the dashboard works.';
      return;
    }
    const samples = list.filter(function (s) { return s.sample; }).length;
    note.textContent = list.length + ' student pair' + (list.length > 1 ? 's' : '') + (samples ? ' (' + samples + ' are fictional samples)' : '') +
      '. "Late in the trip" is the average level over the second half of each student’s attempts. Growth compares it with the first half.';
    const rows = CODES.map(function (code) {
      const gs = list.map(function (s) { return growth(s, code); }).filter(function (g) { return g.pts.length; });
      const dist = [0, 0, 0, 0];
      gs.forEach(function (g) { dist[clamp(Math.round(g.late), 1, 4) - 1]++; });
      const improved = gs.filter(function (g) { return g.delta != null && g.delta > 0.2; }).length;
      const total = gs.length || 1;
      return el('tr', null,
        el('th', { scope: 'row' }, el('span', { class: 'std-code' }, code), ' ', STD.ela[code].kid),
        el('td', null, el('div', { class: 'dist', role: 'img', 'aria-label': dist.map(function (n, i) { return n + ' ' + LEVEL_NAMES[i + 1]; }).join(', ') },
          dist.map(function (n, i) { return n ? el('span', { class: 'dist-seg lv-' + (i + 1), style: 'flex-grow:' + n, title: n + ' ' + LEVEL_NAMES[i + 1] }, String(n)) : null; }))),
        el('td', { class: 'num' }, fmt1(avg(gs.map(function (g) { return g.early; })))),
        el('td', { class: 'num' }, fmt1(avg(gs.map(function (g) { return g.late; })))),
        el('td', { class: 'num' }, improved + ' of ' + gs.length + ' (' + Math.round(improved / total * 100) + '%)'));
    });
    box.append(el('div', { class: 'table-wrap' }, el('table', { class: 'table t-table' },
      el('thead', null, el('tr', null, ['Standard', 'Late-trip level (students)', 'Avg early', 'Avg late', 'Improved'].map(function (h) { return el('th', { scope: 'col' }, h); }))),
      el('tbody', null, rows))));
    box.append(el('p', { class: 'level-key' }, [1, 2, 3, 4].map(function (n) { return el('span', null, el('span', { class: 'lv lv-' + n }, LEVEL_NAMES[n]), ' ' + STD.levels[n].note + '. '); })));
  }

  // ------------------------------------------------------------ student table
  function renderStudents() {
    const box = document.getElementById('students');
    const list = Object.values(db.students).sort(function (a, b) { return studentName(a).localeCompare(studentName(b)); });
    box.replaceChildren();
    if (!list.length) { box.append(el('p', { class: 'note' }, 'Student rows appear here after you add results.')); return; }
    const head = ['Student', 'Stops'].concat(CODES, ['Map', 'Timeline', 'Report', '']);
    box.append(el('div', { class: 'table-wrap' }, el('table', { class: 'table t-table t-students' },
      el('thead', null, el('tr', null, head.map(function (h) { return el('th', { scope: 'col' }, h); }))),
      el('tbody', null, list.map(function (s) {
        const navOk = s.nav.filter(function (n) { return n.correct; }).length;
        return el('tr', { class: selected === s.id ? 'is-selected' : '' },
          el('th', { scope: 'row' }, studentName(s), el('span', { class: 'muted t-small' }, (s.mode === 'trailblazer' ? 'Trailblazer' : 'Explorer') + (s.phase === 'done' ? ' · finished' : ' · in progress'))),
          el('td', { class: 'num' }, stopsDone(s) + '/10'),
          CODES.map(function (code) {
            const g = growth(s, code);
            if (!g.pts.length) return el('td', { class: 'muted' }, '—');
            return el('td', { class: 'cell-growth' }, badge(g.late, fmt1(g.early) + '→' + fmt1(g.late)), ' ', arrow(g.delta));
          }),
          el('td', { class: 'num' }, navOk + '/' + s.nav.length),
          el('td', { class: 'num' }, s.timeline && s.timeline.order ? s.timeline.order.correct + '/' + s.timeline.order.total : '—'),
          el('td', null, badge(reportLevel(s))),
          el('td', null, el('div', { class: 'actions' },
            el('button', { type: 'button', class: 'btn btn-small', onclick: function () { selected = s.id; render(); document.getElementById('detail-card').scrollIntoView({ behavior: 'smooth' }); } }, 'View'),
            el('button', { type: 'button', class: 'btn btn-small btn-ghost', 'aria-label': 'Remove ' + studentName(s), onclick: function () { delete db.students[s.id]; delete db.overrides[s.id]; if (selected === s.id) selected = null; save(); render(); } }, 'Remove'))));
      })))));
  }

  // ------------------------------------------------------------ student detail
  function sourceLabel(lm, id) {
    if (id === 'scene') return 'Scene at ' + lm.place;
    const v = lm.voices.filter(function (o) { return o.id === id; })[0];
    return v ? v.name : id;
  }

  function renderDetail() {
    const card = document.getElementById('detail-card');
    const box = document.getElementById('detail');
    const s = selected && db.students[selected];
    card.hidden = !s;
    box.replaceChildren();
    if (!s) return;
    const o = ov(s.id);

    box.append(el('p', { class: 'screen-sub' }, studentName(s) + ' · ' + (s.mode === 'trailblazer' ? 'Trailblazer' : 'Explorer') + ' mode · last saved ' + (s.updated ? new Date(s.updated).toLocaleString() : 'unknown') + (s.teacher ? ' · teacher: ' + s.teacher : '')));

    box.append(el('h3', { class: 't-h3' }, 'Growth by standard'));
    box.append(el('div', { class: 'table-wrap' }, el('table', { class: 'table t-table' },
      el('thead', null, el('tr', null, ['Standard', 'Level at each stop', 'Early', 'Late', 'Growth'].map(function (h) { return el('th', { scope: 'col' }, h); }))),
      el('tbody', null, CODES.map(function (code) {
        const g = growth(s, code);
        return el('tr', null,
          el('th', { scope: 'row' }, el('span', { class: 'std-code' }, code), ' ', STD.ela[code].kid),
          el('td', null, el('span', { class: 'dots' }, g.pts.map(function (p) { return el('span', { class: 'dot lv-' + p.level, title: 'Stop ' + (p.n + 1) + ': ' + LEVEL_NAMES[p.level] }, String(p.n + 1)); }))),
          el('td', null, badge(g.early, fmt1(g.early))), el('td', null, badge(g.late, fmt1(g.late))), el('td', null, arrow(g.delta)));
      })))));

    box.append(el('h3', { class: 't-h3' }, 'Field Report answers'));
    box.append(el('div', { class: 'table-wrap' }, el('table', { class: 'table t-table' },
      el('thead', null, el('tr', null, ['Stop', 'ELA', 'History', 'Grade 5', 'Grade 4 step back', 'Grade 6 challenge', 'Level'].map(function (h) { return el('th', { scope: 'col' }, h); }))),
      el('tbody', null, s.results.slice().sort(function (a, b) { return a.n - b.n; }).map(function (r) {
        const yn = function (v) { return v === true ? el('span', { class: 'growth-up' }, 'Correct') : v === false ? el('span', { class: 'growth-down' }, 'Missed') : el('span', { class: 'muted' }, 'Not asked'); };
        return el('tr', null, el('td', null, (r.n + 1) + '. ' + LM[r.n].name), el('td', null, r.std), el('td', null, r.ss), el('td', null, yn(r.core)), el('td', null, yn(r.scaffold)), el('td', null, yn(r.ext)), el('td', null, badge(r.level)));
      })))));

    box.append(el('h3', { class: 't-h3' }, 'Time Journal notes (W.5.8)'));
    box.append(el('p', { class: 'note' }, 'Levels are estimated by the game from length, history vocabulary, paraphrasing and sources listed. Change any level after reading the note.'));
    s.journal.slice().sort(function (a, b) { return a.n - b.n; }).forEach(function (j) {
      const lm = LM[j.n];
      const sel = el('select', { id: 'ov-j-' + j.lm, 'aria-label': 'Teacher level for stop ' + (j.n + 1) + ' journal' },
        el('option', { value: '' }, 'Use game estimate (' + LEVEL_NAMES[j.level] + ')'),
        [1, 2, 3, 4].map(function (n) { return el('option', { value: String(n), selected: String(o.journal[j.lm]) === String(n) }, n + ' ' + LEVEL_NAMES[n]); }));
      sel.addEventListener('change', function () { if (sel.value) o.journal[j.lm] = sel.value; else delete o.journal[j.lm]; save(); renderClass(); renderStudents(); });
      box.append(el('article', { class: 'doc doc-compact t-note' },
        el('p', { class: 'doc-tag' }, 'Stop ' + (j.n + 1) + ' · ' + lm.name),
        el('p', { class: 't-prompt' }, lm.journal.prompt),
        el('p', null, j.text),
        j.trust ? el('p', null, el('em', null, 'Most trusted source: '), j.trust) : null,
        el('p', { class: 'doc-basis' }, 'Sources: ' + (j.sources.map(function (id) { return sourceLabel(lm, id); }).join('; ') || 'none') + ' · ' + j.words + ' words · ' + Math.round((j.copyRatio || 0) * 100) + '% matches source wording' + (j.revisions ? ' · revised ' + j.revisions + ' time' + (j.revisions > 1 ? 's' : '') : '')),
        el('div', { class: 't-override' }, el('label', { for: 'ov-j-' + j.lm }, 'Teacher level'), sel)));
    });

    box.append(el('h3', { class: 't-h3' }, 'Class report (W.5.1, W.5.9, SL.5.4, SSS1.5.2, SSS4.5.1, H4.5.1)'));
    if (!s.report) { box.append(el('p', { class: 'note' }, 'Not started yet.')); return; }
    const r = s.report;
    const q = C.finale.questions.filter(function (x) { return x.id === r.question; })[0];
    const rsel = el('select', { id: 'ov-report', 'aria-label': 'Teacher level for the class report' },
      el('option', { value: '' }, 'Use game estimate (' + (r.level ? LEVEL_NAMES[r.level] : 'not finished') + ')'),
      [1, 2, 3, 4].map(function (n) { return el('option', { value: String(n), selected: String(o.report) === String(n) }, n + ' ' + LEVEL_NAMES[n]); }));
    rsel.addEventListener('change', function () { o.report = rsel.value || null; save(); renderStudents(); });
    box.append(el('article', { class: 'doc t-note' },
      el('p', { class: 'doc-tag' }, 'Compelling question'),
      el('h4', null, q ? q.text : '(no question chosen)'),
      el('p', null, el('strong', null, 'Claim: '), r.claim || '—'),
      (r.evidence || []).filter(function (e) { return e.journal !== ''; }).map(function (e, k) {
        const j = s.journal.filter(function (x) { return String(x.n) === String(e.journal); })[0];
        return el('div', { class: 'ev-out' }, el('p', { class: 'ev-where' }, 'Evidence ' + (k + 1) + ': ' + LM[Number(e.journal)].name), el('p', null, j ? '“' + j.text + '”' : ''), el('p', null, 'This shows that ' + (e.explain || '—')));
      }),
      el('p', null, el('strong', null, 'Another point of view: '), r.perspective || '—'),
      el('p', null, el('strong', null, 'Why it matters today: '), r.conclusion || '—'),
      el('div', { class: 't-override' }, el('label', { for: 'ov-report' }, 'Teacher level'), rsel)));
  }

  // ------------------------------------------------------------ reference
  function renderReference() {
    const lv = document.getElementById('levels-ref');
    lv.replaceChildren(
      el('p', { class: 'note' }, 'Learning Commons does not publish learning components or progressions for these standards, so each Field Report question set uses the Washington grade 4, 5 and 6 versions of the same standard. Students see the grade 5 question first. A miss leads to the grade 4 version; a correct answer unlocks the optional grade 6 challenge.'),
      el('div', { class: 'table-wrap' }, el('table', { class: 'table t-table' },
        el('thead', null, el('tr', null, ['Skill', 'Level 2: grade 4 version', 'Level 3: grade 5 standard', 'Level 4: grade 6 version'].map(function (h) { return el('th', { scope: 'col' }, h); }))),
        el('tbody', null, CODES.map(function (code) {
          const s = STD.ela[code];
          return el('tr', null, el('th', { scope: 'row' }, el('span', { class: 'std-code' }, code), ' ', s.kid),
            el('td', { class: 't-small' }, el('strong', null, s.below + ' '), STD.progression[s.below].text),
            el('td', { class: 't-small' }, el('strong', null, code + ' '), s.text),
            el('td', { class: 't-small' }, el('strong', null, s.above + ' '), STD.progression[s.above].text));
        })))));
    const sr = document.getElementById('standards-ref');
    const row = function (code, s) { return el('tr', null, el('th', { scope: 'row' }, code), el('td', { class: 't-small' }, s.text), el('td', { class: 't-small muted t-uuid' }, s.uuid)); };
    sr.replaceChildren(
      el('p', { class: 'note' }, 'Statements and CASE identifiers retrieved from the Learning Commons knowledge graph for the Washington jurisdiction.'),
      el('div', { class: 'table-wrap' }, el('table', { class: 'table t-table' },
        el('thead', null, el('tr', null, ['Code', 'Statement', 'CASE identifier'].map(function (h) { return el('th', { scope: 'col' }, h); }))),
        el('tbody', null,
          el('tr', { class: 't-group' }, el('td', { colspan: '3' }, 'Social studies, grade 5')),
          Object.keys(STD.ss).map(function (k) { return row(k, STD.ss[k]); }),
          el('tr', { class: 't-group' }, el('td', { colspan: '3' }, 'ELA, tracked at every stop')),
          CODES.map(function (k) { return row(k, STD.ela[k]); }),
          el('tr', { class: 't-group' }, el('td', { colspan: '3' }, 'ELA, final class report')),
          Object.keys(STD.elaFinal).map(function (k) { return row(k, STD.elaFinal[k]); })))));
  }

  // ------------------------------------------------------------ CSV
  function csvCell(v) {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function csv(rows) { return rows.map(function (r) { return r.map(csvCell).join(','); }).join('\n'); }

  function summaryCSV() {
    const head = ['student', 'partner', 'sample', 'mode', 'stops_completed'];
    CODES.forEach(function (c) { head.push(c + '_early', c + '_late', c + '_growth'); });
    head.push('map_correct', 'map_total', 'timeline_in_order', 'causes_matched', 'report_level_game', 'report_level_teacher', 'last_saved');
    const rows = [head];
    Object.values(db.students).forEach(function (s) {
      const row = [s.names[0], s.names[1], s.sample ? 'yes' : 'no', s.mode, stopsDone(s)];
      CODES.forEach(function (c) { const g = growth(s, c); row.push(fmt1(g.early), fmt1(g.late), g.delta == null ? '' : g.delta.toFixed(1)); });
      const o = db.overrides[s.id] || {};
      row.push(s.nav.filter(function (n) { return n.correct; }).length, s.nav.length,
        s.timeline && s.timeline.order ? s.timeline.order.correct : '', s.timeline && s.timeline.causes ? s.timeline.causes.correct : '',
        s.report && s.report.level || '', o.report || '', s.updated || '');
      rows.push(row);
    });
    return csv(rows);
  }
  function itemCSV() {
    const rows = [['student', 'partner', 'type', 'stop', 'landmark', 'ela_standard', 'ss_standard', 'grade5_correct', 'grade4_correct', 'grade6_correct', 'level', 'level_name', 'game_date']];
    const yn = function (v) { return v === true ? 'yes' : v === false ? 'no' : ''; };
    Object.values(db.students).forEach(function (s) {
      s.results.forEach(function (r) { rows.push([s.names[0], s.names[1], 'field_report', r.n + 1, LM[r.n].name, r.std, r.ss, yn(r.core), yn(r.scaffold), yn(r.ext), r.level, LEVEL_NAMES[r.level], r.date]); });
      s.journal.forEach(function (j) { const lv = journalLevel(s, j); rows.push([s.names[0], s.names[1], 'journal', j.n + 1, LM[j.n].name, 'W.5.8', '', '', '', '', lv, LEVEL_NAMES[lv], j.date]); });
      s.nav.forEach(function (n) { rows.push([s.names[0], s.names[1], 'map_check', n.leg + 1, LM[n.leg].name, '', 'G1.5.1', yn(n.correct), '', '', '', '', n.date]); });
    });
    return csv(rows);
  }
  function copyCSV(text) {
    const msg = document.getElementById('csv-msg');
    const fb = document.getElementById('csv-fallback');
    const fail = function () { msg.textContent = 'Copying was blocked. Select the text below and copy it.'; fb.hidden = false; fb.value = text; fb.focus(); fb.select(); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { msg.textContent = 'Copied. Paste into a spreadsheet.'; fb.hidden = true; }, fail);
      else fail();
    } catch (e) { fail(); }
  }
  function downloadCSV(text, name) {
    const a = el('a', { href: URL.createObjectURL(new Blob([text], { type: 'text/csv' })), download: name });
    document.body.append(a); a.click(); a.remove();
  }

  // ------------------------------------------------------------ sample class (fictional)
  function seeded(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    return function () { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
  }
  function sampleClass() {
    const rnd = seeded('revolution-trail-sample');
    const people = [['Ava', 'Sam', 2.0, 0.17], ['Jordan', 'Lee', 1.5, 0.2], ['Mateo', 'Ivy', 2.7, 0.1], ['Priya', 'Noah', 3.0, 0.07], ['Kai', 'June', 1.8, 0.04], ['Lena', 'Omar', 2.5, -0.02]];
    return people.map(function (p, idx) {
      const base = p[2], slope = p[3];
      const lvAt = function (n, spread) { return clamp(Math.round(base + slope * n + (rnd() - 0.5) * spread), 1, 4); };
      const results = [], journal = [], nav = [], lmState = {};
      LM.forEach(function (lm, n) {
        lmState[lm.id] = { scene: true, voices: {}, journal: true, report: true, arrived: lm.landing.date };
        lm.report.forEach(function (rs) {
          const level = lvAt(n, 1.4);
          results.push({ lm: lm.id, n: n, std: rs.std, ss: rs.ss, level: level, core: level >= 3, scaffold: level <= 2 ? level === 2 : null, ext: level === 4 ? true : (level === 3 && rnd() < 0.5 ? false : null), picks: {}, date: lm.landing.date, ts: 0 });
        });
        const jl = lvAt(n, 1);
        const k = lm.journal.keywords;
        const text = jl >= 3
          ? 'At ' + lm.place.split(',')[0] + ' we learned about ' + k[0] + ' and ' + k[1] + '. ' + lm.voices[0].name + ' and ' + lm.voices[1].name + ' saw it differently because they had different reasons. The ' + k[2] + ' mattered because it changed what happened next.'
          : jl === 2 ? 'We learned about ' + k[0] + '. It was important to the people there.' : 'it was cool';
        journal.push({ lm: lm.id, n: n, std: 'W.5.8', text: text, trust: jl === 4 ? 'The scene, because it tells both sides.' : '', sources: jl >= 3 ? ['scene', lm.voices[0].id, lm.voices[1].id] : jl === 2 ? ['scene'] : [], words: words(text).length, copyRatio: 0.04, copied: false, level: jl, revisions: jl < 3 && rnd() < 0.4 ? 1 : 0, date: lm.landing.date });
        nav.push({ leg: n, lm: lm.id, ss: 'G1.5.1', correct: rnd() < 0.45 + base / 8, date: lm.landing.date });
      });
      const rl = lvAt(9, 1);
      return {
        v: 1, id: 'sample-' + idx, sample: true, names: [p[0], p[1]], teacher: '', mode: idx % 3 === 2 ? 'trailblazer' : 'explorer',
        updated: new Date(Date.UTC(2026, 9, 20 + idx, 15, 0)).toISOString(), leg: 9, phase: 'done', lm: lmState,
        results: results, journal: journal, nav: nav, checks: [], glossary: [],
        timeline: { order: { correct: clamp(Math.round(base * 2.5 + rnd() * 2), 2, 10), total: 10 }, causes: { correct: clamp(Math.round(base * 1.5 + rnd()), 1, 6), total: 6 } },
        report: { question: ['everyone', 'cause', 'victory', 'today'][idx % 4], claim: 'The Revolution changed who held power, but not everyone gained the same freedom.',
          evidence: [{ journal: '0', explain: 'Phillis Wheatley pointed out that people demanding liberty also held Africans in slavery.' }, { journal: '3', explain: 'the Declaration promised equal rights while Jem was still enslaved.' }, { journal: '8', explain: 'the Three-Fifths Compromise protected slavery inside the Constitution.' }],
          perspective: 'A Patriot like John Adams might say the Revolution started a fight for rights that kept growing.', conclusion: 'People today still use the Bill of Rights to protect speech and religion.', level: rl },
        stats: { days: 60, foraged: 20, recalls: 0, nurse: 0, crossings: 7 }
      };
    });
  }

  // ------------------------------------------------------------ wire up
  function render() { renderClass(); renderStudents(); renderDetail(); }

  document.getElementById('import-btn').addEventListener('click', doImport);
  document.getElementById('sample-btn').addEventListener('click', function () {
    sampleClass().forEach(addStudent);
    save();
    document.getElementById('import-msg').textContent = 'Added 6 fictional sample students. Remove them before adding your class, or keep them for comparison.';
    render();
  });
  const clearBtn = document.getElementById('clear-btn');
  let armed = false;
  clearBtn.addEventListener('click', function () {
    if (!armed) { armed = true; clearBtn.textContent = 'Click again to remove everyone'; setTimeout(function () { armed = false; clearBtn.textContent = 'Remove all students'; }, 4000); return; }
    armed = false;
    clearBtn.textContent = 'Remove all students';
    db = { students: {}, overrides: {} };
    selected = null;
    save();
    document.getElementById('import-msg').textContent = 'All students removed from this browser.';
    render();
  });
  document.getElementById('copy-summary').addEventListener('click', function () { copyCSV(summaryCSV()); });
  document.getElementById('copy-items').addEventListener('click', function () { copyCSV(itemCSV()); });
  if (TOP) {
    const ds = document.getElementById('dl-summary'), di = document.getElementById('dl-items');
    ds.hidden = false; di.hidden = false;
    ds.addEventListener('click', function () { downloadCSV(summaryCSV(), 'revolution-trail-summary.csv'); });
    di.addEventListener('click', function () { downloadCSV(itemCSV(), 'revolution-trail-items.csv'); });
  }

  // A first visit shows the sample class, so the dashboard opens with something to read.
  if (!Object.keys(db.students).length && !store.get()) { sampleClass().forEach(addStudent); save(); }
  selected = Object.keys(db.students)[0] || null;
  renderReference();
  render();
})();
