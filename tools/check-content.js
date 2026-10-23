// Checks js/content.js for mistakes that would break the game.
// Usage: node tools/check-content.js
const { STD, C } = require('./load');
const problems = [];
const terms = (text) => (String(text).match(/\[\[([^\]]+)\]\]/g) || []).map((m) => m.slice(2, -2).toLowerCase());

C.landmarks.forEach((lm, i) => {
  const where = 'Stop ' + (i + 1) + ' (' + lm.id + ')';
  if (lm.report.length !== 3) problems.push(where + ': expected 3 Field Report sets');
  lm.report.forEach((rs) => {
    if (!STD.ela[rs.std]) problems.push(where + ': unknown ELA standard ' + rs.std);
    if (!STD.ss[rs.ss]) problems.push(where + ': unknown social studies standard ' + rs.ss);
    ['core', 'scaffold', 'extension'].forEach((tier) => {
      const item = rs[tier];
      if (!item) { problems.push(where + ' ' + rs.std + ': missing ' + tier + ' item'); return; }
      if (item.choices.length < 3) problems.push(where + ' ' + rs.std + ' ' + tier + ': needs at least 3 choices');
      if (new Set(item.choices).size !== item.choices.length) problems.push(where + ' ' + rs.std + ' ' + tier + ': duplicate choices');
      if (!item.why) problems.push(where + ' ' + rs.std + ' ' + tier + ': missing explanation');
    });
  });
  if (new Set(lm.navigator.choices).size !== lm.navigator.choices.length) problems.push(where + ': duplicate navigator choices');
  lm.scene.forEach((p) => terms(p).forEach((t) => { if (!C.glossary[t]) problems.push(where + ': glossary has no entry for "' + t + '"'); }));
  lm.voices.forEach((v) => {
    if (['real', 'fictional', 'document'].indexOf(v.kind) === -1) problems.push(where + ' ' + v.id + ': kind must be real, fictional or document');
    if (!v.basis) problems.push(where + ' ' + v.id + ': every voice needs a basis note');
    terms(v.role + ' ' + v.text).forEach((t) => { if (!C.glossary[t]) problems.push(where + ' ' + v.id + ': glossary has no entry for "' + t + '"'); });
  });
  if (!lm.recall || lm.recall.length < 1) problems.push(where + ': needs at least one recall question');
  if (lm.landing.river && lm.landing.river.mile >= lm.landing.miles) problems.push(where + ': river must come before the end of the leg');
});

if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log('Content checks passed: ' + C.landmarks.length + ' stops, ' + C.landmarks.length * 9 + ' Field Report items.');
