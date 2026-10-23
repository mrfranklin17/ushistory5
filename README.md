# The Revolution Trail

An Oregon Trail-style history game for 5th graders. Two students press the wrong button on a squeaky library book cart and land in December 1773. C.A.R.T., the time-traveling cart, won't bring them home until they collect research notes at 10 historic stops, from the Boston Tea Party to the Bill of Rights in 1791. Then they return to class and present what they learned.

It is aligned to **Washington State grade 5 social studies** (U.S. history to 1791) and **Washington ELA reading and writing standards**, using standard statements retrieved from the Learning Commons knowledge graph. The ELA standards drive an assessment that tracks each student's reading growth across the whole trip.

## Play

Open `index.html` in a browser. There is nothing to install and no build step.

To share it with a class, publish the repository with GitHub Pages (**Settings → Pages → Deploy from a branch →** your default branch, `/ (root)`). Students open the Pages link; teachers open `teacher.html` on the same site.

## What's in the game

- **10 historic stops:** Boston Tea Party, First Continental Congress, Lexington and Concord, the Declaration of Independence, crossing the Delaware to Trenton, Saratoga, Valley Forge, Yorktown, the Constitutional Convention, and Washington's inauguration with the Bill of Rights.
- **30 historical voices** that disagree with each other: Patriots and Loyalists, Phillis Wheatley, Abigail Adams, John Parker and John Pitcairn on who fired first, Oneida and Mohawk leaders, Joseph Plumb Martin, James Armistead, George Mason, Richard Allen and more. Each one is labeled as a real person, a real document, or a fictional character based on history, and exact quotes are shown separately with citations.
- **The Oregon Trail loop:** a general store, pace and rations, seasonal weather, river crossings (including Christmas night 1776 with Washington's army), a foraging mini-game, and random events, including C.A.R.T. announcing that its battery has died of dysentery.
- **Reading assessment at every stop:** three Field Report question sets per stop. Each set asks the grade 5 version of a reading standard first. A miss leads to the grade 4 version; a correct answer unlocks an optional grade 6 Excellence Challenge. That places each answer on a 4-level scale, and each standard is measured 4 or 5 times across the trip.
- **Research notes (W.5.8)** in a Time Journal, checked for length, history vocabulary, paraphrasing and sources. The town printer pays for good notes.
- **Back in class:** a timeline challenge, cause-and-effect matching, an opinion report built from the student's own notes, and a slide view for presenting.
- **A results screen** with a growth tracker for every reading and writing standard, and a progress code to hand in.
- **A 1770s look:** aged paper, Caslon type, hand-tinted maps, sealed-letter pop-ups and a certificate at the end, while C.A.R.T. and the 2026 scenes stay on glowing screens. An easier-to-read font is one checkbox away.
- **A Teacher Dashboard** (`teacher.html`) that reads students' progress codes and shows class-wide and per-student growth, every answer and journal note, teacher overrides, and CSV export. It opens with a fictional sample class so you can see how it works.

## Standards

| Area | Standards |
|---|---|
| Social studies (Washington, grade 5) | H1.5.1, H1.5.2, H2.5.1, H2.5.2, H3.5.1, H4.5.1, C1.5.2, C2.5.1, C2.5.2, C4.5.1, E1.5.1, E2.5.1, G1.5.1, G2.5.1, G3.5.1, SSS1.5.1, SSS1.5.2, SSS2.5.1, SSS4.5.1 |
| ELA tracked at every stop | RI.5.1, RI.5.2, RI.5.3, RI.5.4, RI.5.6, RI.5.8, RI.5.9, W.5.8 |
| ELA in the final report | W.5.1, W.5.9, SL.5.4 |
| Growth scale (grade 4 and 6 neighbors) | RI.4.1-RI.4.9 and RI.6.1-RI.6.9 for the skills above, W.4.8, W.6.8 |

Full tables, with where each standard is assessed and every CASE identifier, are in [docs/STANDARDS_ALIGNMENT.md](docs/STANDARDS_ALIGNMENT.md).

## Docs

- [Teacher guide](docs/TEACHER_GUIDE.md): pacing, collecting results, reading the dashboard, the report rubric, discussion prompts, content notes and accommodations.
- [Game design](docs/GAME_DESIGN.md): story, mechanics, assessment design and data.
- [Standards alignment](docs/STANDARDS_ALIGNMENT.md): generated from the game's content.
- [Playtest review](docs/PLAYTEST_REVIEW.md): student-experience findings, what was fixed, and what to watch for in a pilot.

## Privacy

There is no server and no tracking. The game saves progress in the browser's localStorage. Students hand in work by copying a progress code or downloading a progress file. The Teacher Dashboard stores the codes you add in your own browser only. Codes contain the names students type and their answers and writing, so handle them like any other student work.

## Project layout

```
index.html            the game
teacher.html          the Teacher Dashboard
css/style.css         shared styles
css/teacher.css       dashboard styles
js/standards.js       Washington standards from Learning Commons (text and CASE IDs)
js/content.js         all story text, voices, questions and glossary
js/game.js            game engine
js/map.js             SVG map of the thirteen colonies
js/scene.js           pixel-art scenes
js/teacher.js         dashboard logic
tools/check-content.js   validates content.js
tools/alignment.js       regenerates docs/STANDARDS_ALIGNMENT.md
docs/                 teacher guide, design and alignment
```

To edit questions or history text, change `js/content.js`, then run `node tools/check-content.js`.
