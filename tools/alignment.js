// Prints docs/STANDARDS_ALIGNMENT.md from js/content.js and js/standards.js.
// Usage: node tools/alignment.js > docs/STANDARDS_ALIGNMENT.md
const { STD: S, C } = require('./load');
const o = [];

o.push('# Standards alignment', '');
o.push('Every standard statement and CASE identifier in this game was retrieved from the **Learning Commons knowledge graph** (CASE Network) for the **Washington** jurisdiction. The same data lives in [`js/standards.js`](../js/standards.js), which the game and the Teacher Dashboard both read.', '');
o.push('This file is generated from `js/content.js` and `js/standards.js`. If you edit the questions, regenerate it so the tables stay accurate (see the end of this file).', '');

o.push('## How literacy growth is measured', '');
o.push('Learning Commons publishes learning components and progressions for math, but not for these ELA or social studies standards. So the game builds its growth scale from the Washington grade 4, 5 and 6 versions of each reading and writing standard, which Learning Commons does publish:', '');
o.push('| Level | Name | What the student showed |', '|---|---|---|');
[1, 2, 3, 4].forEach((n) => o.push(`| ${n} | ${S.levels[n].name} | ${S.levels[n].note} |`));
o.push('');
o.push('At each stop, a Field Report set opens with the **grade 5** item. A miss leads to the **grade 4** version of the same skill (a step back). A correct answer unlocks an optional **grade 6** Excellence Challenge. Every set records one level from 1 to 4, so each standard collects 4 or 5 data points spread across the trip. The Teacher Dashboard compares the average of the first half of a student’s attempts with the average of the second half.', '');
o.push('Time Journal notes (`W.5.8`) are leveled by the game using a transparent checklist: at least 20 words, at least 2 history vocabulary words, written in the student’s own words (or quoted), and at least 1 source listed. Level 4 adds the grade 6 expectations from `W.6.8`: two or more sources and a reason for trusting one of them. Teachers can override any journal or report level in the dashboard.', '');
o.push('| Skill | Level 2: grade 4 version | Level 3: grade 5 standard | Level 4: grade 6 version |', '|---|---|---|---|');
Object.keys(S.ela).forEach((k) => {
  const e = S.ela[k];
  o.push(`| \`${k}\` ${e.kid} | \`${e.below}\` ${S.progression[e.below].text} | ${e.text} | \`${e.above}\` ${S.progression[e.above].text} |`);
});

o.push('', '## Where each standard is assessed', '');
o.push('| Stop | Event | Date | Field Report set 1 | Set 2 | Set 3 | Voices (real, fictional or document) |', '|---|---|---|---|---|---|---|');
C.landmarks.forEach((lm, i) => {
  o.push(`| ${i + 1} | ${lm.name} | ${lm.when} | ${lm.report.map((r) => '`' + r.std + '` + `' + r.ss + '`').join(' | ')} | ${lm.voices.map((v) => v.name + ' (' + v.kind + ')').join('; ')} |`);
});
o.push('', 'Every stop also has a Navigator Check (`G1.5.1`) before the leg begins and a Time Journal entry (`W.5.8`).', '');

const count = {};
C.landmarks.forEach((lm, i) => lm.report.forEach((r) => { (count[r.std] = count[r.std] || []).push(i + 1); }));
o.push('| ELA standard | Skill | Stops | Data points |', '|---|---|---|---|');
Object.keys(S.ela).forEach((k) => {
  const st = k === 'W.5.8' ? C.landmarks.map((_, i) => i + 1) : (count[k] || []);
  o.push(`| \`${k}\` | ${S.ela[k].kid} | ${st.join(', ')} | ${st.length} |`);
});
o.push('| `W.5.1`, `W.5.9`, `SL.5.4` | Opinion writing, evidence, presenting | Final class report and presentation | 1 |');

o.push('', '### Social studies', '');
const ss = {};
C.landmarks.forEach((lm, i) => lm.report.forEach((r) => { (ss[r.ss] = ss[r.ss] || []).push('Stop ' + (i + 1)); }));
const extra = {
  'G1.5.1': ['Navigator Check at all 10 stops', 'map with the Proclamation Line and Native homelands'],
  'H1.5.1': ['final timeline and cause-and-effect challenge'],
  'H1.5.2': ['the time jumps between eras'],
  'H4.5.1': ['final report: why it matters today'],
  'SSS1.5.2': ['final report: claim and evidence from several stops'],
  'SSS2.5.1': ['final report: choosing a compelling question'],
  'SSS4.5.1': ['final report: another point of view'],
  'E1.5.1': ['stores and boycott decisions'],
  'E2.5.1': ['store facts on colonial money, trade and inflation']
};
o.push('| Code | Statement | Where it appears |', '|---|---|---|');
Object.keys(S.ss).forEach((k) => o.push(`| \`${k}\` | ${S.ss[k].text} | ${(ss[k] || []).concat(extra[k] || []).join('; ') || 'background content'} |`));

o.push('', '## CASE identifiers', '', '| Code | Grade | CASE identifier |', '|---|---|---|');
Object.keys(S.ss).forEach((k) => o.push(`| \`${k}\` | 5 | \`${S.ss[k].uuid}\` |`));
Object.keys(S.ela).forEach((k) => o.push(`| \`${k}\` | 5 | \`${S.ela[k].uuid}\` |`));
Object.keys(S.elaFinal).forEach((k) => o.push(`| \`${k}\` | 5 | \`${S.elaFinal[k].uuid}\` |`));
Object.keys(S.progression).forEach((k) => o.push(`| \`${k}\` | ${S.progression[k].grade} | \`${S.progression[k].uuid}\` |`));

o.push('', '## Regenerating this file', '', '```sh', 'node tools/alignment.js > docs/STANDARDS_ALIGNMENT.md', '```', '');
process.stdout.write(o.join('\n'));
