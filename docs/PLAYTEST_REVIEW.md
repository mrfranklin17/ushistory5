# Playtest review: student experience

**Date:** October 2026
**Method:** Scripted playthroughs of the whole game (title screen to results), capturing every screen and every kind of pop-up at Chromebook size (1366×768) and phone size (400px wide), in both Explorer and Trailblazer modes. Each screen was reviewed for what a 5th grader sees without scrolling, what they are asked to do, and whether they have what they need to do it. Reading levels were estimated with the Flesch-Kincaid formula. Every quotation in an answer choice was checked against its source text.

This review complements, but does not replace, a pilot with real students. Timing and frustration points are best confirmed by watching a class play.

## What worked well

- The loop is easy to follow once a student reaches the first stop: read, talk, write, answer, travel.
- Voice cards on parchment read clearly, and the "Exact words" boxes separate primary sources from adapted text.
- The step-back and challenge questions kept every student answering at a level where they could succeed.
- Keyboard play, read-aloud and tappable vocabulary all worked throughout.
- No JavaScript errors in any run.

## Problems found and fixed

| # | Problem a student would hit | Severity | Fix |
|---|---|---|---|
| 1 | **Map questions could not be answered from the map.** The map showed the whole coast at once, towns were unlabeled, pins overlapped around Philadelphia, and Boston's pin hid under Lexington's. On the first question, Boston actually sat closer to the "R.I." label than to "MASS." | High | Maps open zoomed to the current leg, with both towns named, approximate colony borders, and detailed river labels. "Whole trip" and "All 13 colonies" views are one tap away, with labeled, numbered stops. |
| 2 | **Students ran out of food without understanding why.** Nothing said how much food a leg needs, Boston has no store, and the only warning was a line of small text. In playtests the travelers were starving by stop 4. | High | Stores show C.A.R.T.'s shopping list: miles and days to the next store, food needed, coats if winter is ahead, and a one-tap "Use C.A.R.T.'s list". The HUD and trail status show days of food left. A warning pops up at 2 days left, with what to do. Stops without a store show a food check. |
| 3 | **Dead end at a river.** A deep river (no wading) plus too little money for the ferry left only "Wait a day", so the game could not continue. | High | Students can always work for the ferry crew (2 days). The shopping list keeps 8 shillings for ferries. |
| 4 | **Labels gave away answers.** Voice cards said "Firsthand account" or "Secondhand account", which answered several RI.5.6 and RI.4.6 questions. | High (assessment validity) | Cards now say only real person, real document, or fictional character. Students work out firsthand or secondhand themselves. |
| 5 | **Report checklist showed `[object HTMLLIElement]`** instead of the checklist. | High (bug) | Fixed. |
| 6 | **Presentation slides showed the word "null"** on slides without a quote. | Medium (bug) | Fixed. |
| 7 | **Scenes were hard to read independently.** Scene passages scored about grade 6.5 to 9.4, mostly because of long, multi-clause sentences. | Medium | Scenes were rewritten with shorter sentences (now about grade 5.2 to 7.9), keeping every fact and every phrase the questions quote. The hardest plain-language versions of documents were simplified too. |
| 8 | **One answer choice misquoted its source** (a Lexington RI.5.1 item), which matters for a "quote accurately" standard. | Medium | Corrected. All quotations in answer choices now match their sources exactly. |
| 9 | **The HUD said "Where: Stop 1: Boston" while the students were in Providence.** | Medium | The HUD now says "Heading to" on the trail and "You are at" at a stop. Money is labeled "Shillings" instead of "sh". |
| 10 | **No clear next step at a stop.** The menu and picture pushed the to-do list below the fold on a Chromebook. | Medium | The menu is first, the picture and checklist sit beside it, "Start here" marks the first task, and C.A.R.T. names the next step. |
| 11 | **Journal success criteria appeared only after saving.** | Medium | A "Great notes checklist" updates as the student types. |
| 12 | **After a missed grade 5 question, the feedback said "look back at the sources" while the right answer was already highlighted.** The challenge offer was an extra pop-up 30 times. | Low | Feedback now explains the correct answer before the step-back question. The Excellence Challenge is offered with two buttons in place. |
| 13 | **Teacher codes on student screens** ("Map skills (G1.5.1)", "History: E2.5.1", "(W.5.1, W.5.9)"). | Low | Removed from student headings; skills use their kid-friendly names. Codes remain in the results table and the dashboard. |
| 14 | **The store's Buy button was below the fold** on a Chromebook. | Low | The total and the Buy and Leave buttons stay pinned to the bottom of the screen while shopping. |
| 15 | Small things: "Someone is sick" for a sprained ankle; no guidance on safe river depth; no hint that the cart moves on its own. | Low | Fixed with clearer titles and C.A.R.T. tips. |

## Reading load and time

- About 4,300 words of scenes and voices across the trip (about 30 minutes of reading at 140 words per minute), plus 30 to 60 questions, 10 journal entries, and the finale.
- Expect about 12 to 15 minutes per stop for a typical pair, or 2.5 to 3.5 hours in total. The five-session pacing in the teacher guide fits this, with time left for discussion.

## Recommendations not yet built

1. **Pilot with one class** and note where pairs stall. The most likely spots are the first store, the first Field Report, and the class report builder.
2. **Vary the question formats.** Every Field Report question is multiple choice. "Tap the sentence that proves it" would assess RI.5.1 more directly and break up the routine by stop 6 or 7.
3. **Make the timeline drag-and-drop on touch screens.** Ten events with arrow buttons works, but it is slow.
4. **Watch Trailblazer equity.** In Trailblazer mode, money comes partly from journal quality, so a weaker writer can end the trip hungry. Explorer (the default) avoids this. Consider using Trailblazer only for enrichment.
5. **Keyword stuffing in journals.** The auto-level counts history words, so a student could game it. The teacher override covers this. Skim notes before trusting a 4.
6. **Reloading the page returns to the title screen.** "Continue" resumes instantly, but say so in your first-day directions.
