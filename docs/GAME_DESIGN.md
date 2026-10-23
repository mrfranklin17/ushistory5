# The Revolution Trail: game design

## Premise

On a Friday afternoon, two 5th graders are assigned a history report due Monday: *What happened in the American Revolution, and why does it matter?* In the school library they find C.A.R.T. (Chrono-Archive Retrieval Trolley), a squeaky book cart with one button labeled CHECK OUT. They press it and land in Providence, Rhode Island, on December 8, 1773.

C.A.R.T. refuses to return them until their research is complete. They must collect notes at 10 historic stops between 1773 and 1791, then bring them home and present to the class.

The tone borrows from *Bill and Ted's Excellent Adventure*: two kids, wildly out of place in history, cheerful and a little goofy, who end up taking the past seriously. Instead of kidnapping historical figures for their report, they listen to them. The gameplay borrows from *The Oregon Trail*: buy supplies, choose pace and rations, cross rivers, survive surprises, and reach the next landmark.

## Design goals

1. **History content is the game.** Students cannot leave a stop until they read the scene, hear every voice, write notes, and give a Field Report. The trail is the reward loop between stops.
2. **Measure reading growth over time.** Each ELA reading standard is assessed 4 or 5 times across the trip with the same three-tier structure, so a teacher can compare early and late performance.
3. **Many perspectives.** Washington's standards ask students to explain why people in the colonies differed in their perspectives (`H3.5.1`) and how people from many cultural and ethnic groups shaped U.S. history (`H2.5.2`). Every stop has two or three voices that disagree, including Loyalists, enslaved and free Black Americans, women, Native nations on both sides of the war, Hessian and French soldiers, and Anti-Federalists.
4. **Honest sources.** Every voice is labeled as a real person, a real document, or a fictional character. Exact quotations appear only in a separate "Exact words" box with a citation. Everything else is labeled as adapted or imagined. Fictional characters are composites based on the historical record.
5. **Gentle by default.** Explorer mode halves health losses so a struggling reader is never knocked out of the history by the survival game. No one dies: a critically ill traveler triggers C.A.R.T.'s "Nurse Mode" (rest at a farmhouse), and running out of everything triggers an "Emergency Recall" to the last landing spot with emergency rations.

## Core loop

```
Time jump ("Meanwhile, in history...")
  -> Navigator Check (map skills, G1.5.1)
  -> Travel leg (pace, rations, weather, events, river, foraging)
  -> Historic stop
       Look around (scene with tappable vocabulary)
       Talk to people (2-3 accounts)
       Time Journal (W.5.8 notes, paid by the town printer)
       Field Report (3 tiered reading question sets)
       Store (at some stops)
  -> next time jump
After stop 10: timeline, cause and effect, class report, presentation, results
```

## The 10 stops

| # | Stop | Date | Landing spot and leg | Voices |
|---|---|---|---|---|
| 1 | Boston Tea Party | Dec 1773 | Providence, RI, 50 miles | Sam Whitcomb (fictional Patriot apprentice), Margaret Lowell (fictional Loyalist), Phillis Wheatley |
| 2 | First Continental Congress | Sep 1774 | New York City, 95 miles, Delaware River | John Adams, Joseph Galloway, Hannah Brewster (fictional weaver) |
| 3 | Lexington and Concord | Apr 1775 | Springfield, MA, 85 miles | Capt. John Parker, Maj. John Pitcairn, a historian today |
| 4 | Declaration of Independence | Jul 1776 | Lancaster, PA, 65 miles | The Declaration, Abigail Adams, Jem (fictional, escaped slavery) |
| 5 | Crossing the Delaware and Trenton | Dec 1776 | Philadelphia, 40 miles, crossing with Washington's army | Thomas Paine, Elijah Cole (fictional soldier), Johann Becker (fictional Hessian) |
| 6 | Saratoga | Oct 1777 | Oriskany, NY (Oneida homelands), 110 miles, Mohawk River | Tyonajanegen (Oneida), Thayendanegea / Joseph Brant (Mohawk), Benjamin Franklin |
| 7 | Valley Forge | Winter 1777-78 | York, PA, 70 miles, Susquehanna River | Joseph Plumb Martin, Polly Cooper (Oneida), Baron von Steuben |
| 8 | Yorktown | Oct 1781 | Richmond, VA, 75 miles, Chickahominy River | James Armistead, Lt. Moreau (fictional French officer), Gen. Cornwallis |
| 9 | Constitutional Convention | Summer 1787 | Baltimore, MD, 100 miles, Susquehanna River | Benjamin Franklin, George Mason, Richard Allen |
| 10 | Inauguration and Bill of Rights | 1789-1791 | Trenton, NJ, 60 miles, Hudson River | George Washington, Sen. William Maclay, the First Amendment |

Each time jump shows a short "Meanwhile" list of what happened between stops (Bunker Hill, the fall of New York, the French alliance, Elizabeth Freeman's freedom suit, Shays' Rebellion and more), so the timeline stays continuous.

C.A.R.T.'s aim is a little off, so each jump lands the travelers a few days' walk from the next stop. That keeps every leg short enough to finish in a class period while staying true to real geography.

## Oregon Trail mechanics, adapted

| Oregon Trail | The Revolution Trail |
|---|---|
| Matt's General Store | Pell's General Store in Providence, then shops at later stops. Prices rise with wartime shortages (an economics lesson in itself). |
| Oxen, clothing, bullets, wagon parts | Food, wool coats, spare cart wheels, remedies |
| Pace and rations | Same: steady, strenuous, grueling; filling, meager, bare bones |
| Weather | Seasonal: snow and bitter cold in winter (coats matter at Boston, Trenton and Valley Forge), heat in summer |
| River crossings: ford, caulk, ferry, wait | Ford, ferry (shillings), wait a day. Christmas night 1776 is a special crossing with Washington's army. |
| Hunting | Foraging mini-game (tap food before it disappears, avoid bees), with a one-click alternative for accessibility |
| Random events | Illness (yes, including dysentery), broken wheels, mud, fog, thieves, kind farmers, peddlers, smallpox detours, post riders with real news, and C.A.R.T. glitches |
| Landmarks | Historic stops with reading, writing and assessment |
| "You have died of dysentery" | "YOUR BATTERY HAS DIED OF DYSENTERY," said by C.A.R.T., who then turns back on |

**Checkpoints** reward retrieval practice. A Redcoat patrol, Patriot guards or (after 1783) a curious tavern keeper may stop the travelers and ask a question about an earlier stop. A correct answer earns a shilling; a wrong one costs a day.

**Money for good notes.** The town printer pays for Time Journal entries based on their level, and pays the difference if a student revises and improves them. Better research means more supplies.

## Assessment design

### Field Reports (RI.5.1, 5.2, 5.3, 5.4, 5.6, 5.8, 5.9)

Every stop has three question sets, each targeting one reading standard and tagged with one social studies standard. Each set has three versions of the same skill, taken from Washington's grade 4, 5 and 6 standards (retrieved from Learning Commons):

```
Grade 5 item (core) --correct--> optional grade 6 Excellence Challenge
                    \--missed--> grade 4 step-back item
```

Outcomes become levels: 4 Extending, 3 Meeting, 2 Approaching, 1 Beginning. Feedback explains the answer after every item. A "Look back at the sources" panel is always available, because the standards are about using text evidence, not memory.

All questions are text-dependent: the answer is in the scene or the voices at that stop (or, at stop 10, in a quote from stop 9 that is reprinted in the question).

### Time Journal (W.5.8)

At every stop students write 2 to 4 sentences in their own words and check off the sources they used. The game checks:

- length (20+ words)
- history vocabulary from that stop (2+ key terms)
- paraphrasing: if more than 40% of five-word sequences match the sources and are not in quotation marks, C.A.R.T. asks for a rewrite once
- at least one source listed
- for level 4 (W.6.8): two or more sources and a reason for trusting one of them

Students see the checklist update as they write, so the success criteria are clear before they save, and they can revise before leaving the stop. Teachers can override any level.

### Final challenges

- **Timeline** (`H1.5.1`): put 10 events from 1763 to 1791 in order.
- **Cause and effect** (`H1.5.1`): match 6 effects with their causes.
- **Class report** (`W.5.1`, `W.5.9`, `SSS1.5.2`, `SSS2.5.1`, `SSS4.5.1`, `H4.5.1`): choose a compelling question, write a claim, pick three of their own journal notes as evidence and explain each, add another point of view, and explain why it matters today. The sources list is built from the sources they checked in their journal.
- **Presentation** (`SL.5.4`): the report becomes big-text slides for presenting to the class.

### Data and privacy

The game has no server. Progress saves in the browser's localStorage. At any time from the results screen, students copy a progress code (`RT1:` followed by base64-encoded JSON) or download a progress file. The Teacher Dashboard reads codes and files and stores them in the teacher's own browser. Progress codes contain the names students typed, their answers and their writing, so treat them like student work.

## Accessibility

- Readable type (Atkinson Hyperlegible) for all reading passages; pixel fonts only for headings and menus.
- Scene passages are written mostly at a grade 5 to 6 reading level (Flesch-Kincaid estimates of 5.2 to 7.9; the highest scores come from proper names such as Haudenosaunee).
- Maps zoom to the current leg and name both towns, with approximate colony borders, so map questions can be answered from the map. "Whole trip" and "All 13 colonies" views are one tap away.
- Each stop says what to do next, and C.A.R.T.'s shopping list does the food math so the survival game never blocks the history.
- Read aloud buttons on scenes, voices and questions (browser speech synthesis; can be turned off at setup).
- Every vocabulary word in a scene is tappable for a definition, and looked-up words are saved.
- Full keyboard play: number keys choose options, Space or Enter stops the wagon, Escape goes back.
- A one-click foraging option for students who cannot use the timed mini-game.
- Reduced-motion settings stop the animations.
- Works on Chromebooks, tablets and phones.

## Ideas for later

- More stops (Bunker Hill, Kings Mountain, Elizabeth Freeman's trial) and a Pacific Northwest epilogue for Washington's Since Time Immemorial curriculum.
- A class leaderboard or shared roster using a backend, if a school wants one.
- Spanish-language content.
