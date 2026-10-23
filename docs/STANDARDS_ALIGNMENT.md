# Standards alignment

Every standard statement and CASE identifier in this game was retrieved from the **Learning Commons knowledge graph** (CASE Network) for the **Washington** jurisdiction. The same data lives in [`js/standards.js`](../js/standards.js), which the game and the Teacher Dashboard both read.

This file is generated from `js/content.js` and `js/standards.js`. If you edit the questions, regenerate it so the tables stay accurate (see the end of this file).

## How literacy growth is measured

Learning Commons publishes learning components and progressions for math, but not for these ELA or social studies standards. So the game builds its growth scale from the Washington grade 4, 5 and 6 versions of each reading and writing standard, which Learning Commons does publish:

| Level | Name | What the student showed |
|---|---|---|
| 1 | Beginning | Missed the grade 5 and grade 4 versions of the skill |
| 2 | Approaching | Showed the grade 4 version of the skill |
| 3 | Meeting | Showed the grade 5 standard on the first try |
| 4 | Extending | Also showed the grade 6 version of the skill |

At each stop, a Field Report set opens with the **grade 5** item. A miss leads to the **grade 4** version of the same skill (a step back). A correct answer unlocks an optional **grade 6** Excellence Challenge. Every set records one level from 1 to 4, so each standard collects 4 or 5 data points spread across the trip. The Teacher Dashboard compares the average of the first half of a student’s attempts with the average of the second half.

Time Journal notes (`W.5.8`) are leveled by the game using a transparent checklist: at least 20 words, at least 2 history vocabulary words, written in the student’s own words (or quoted), and at least 1 source listed. Level 4 adds the grade 6 expectations from `W.6.8`: two or more sources and a reason for trusting one of them. Teachers can override any journal or report level in the dashboard.

| Skill | Level 2: grade 4 version | Level 3: grade 5 standard | Level 4: grade 6 version |
|---|---|---|---|
| `RI.5.1` Quote & Infer | `RI.4.1` Refer to details and examples in a text when explaining what the text says explicitly and when drawing inferences from the text. | Quote accurately from a text when explaining what the text says explicitly and when drawing inferences from the text. | `RI.6.1` Cite textual evidence to support analysis of what the text says explicitly as well as inferences drawn from the text. |
| `RI.5.2` Main Ideas & Summary | `RI.4.2` Determine the main idea of a text and explain how it is supported by key details; summarize the text. | Determine two or more main ideas of a text and explain how they are supported by key details; summarize the text. | `RI.6.2` Determine a central idea of a text and how it is conveyed through particular details; provide a summary of the text distinct from personal opinions or judgments. |
| `RI.5.3` Connect Events & People | `RI.4.3` Explain events, procedures, ideas, or concepts in a historical, scientific, or technical text, including what happened and why, based on specific information in the text. | Explain the relationships or interactions between two or more individuals, events, ideas, or concepts in a historical, scientific, or technical text based on specific information in the text. | `RI.6.3` Analyze in detail how a key individual, event, or idea is introduced, illustrated, and elaborated in a text (e.g., through examples or anecdotes). |
| `RI.5.4` Word Detective | `RI.4.4` Determine the meaning of general academic and domain-specific words or phrases in a text relevant to a grade 4 topic or subject area. | Determine the meaning of general academic and domain-specific words and phrases in a text relevant to a grade 5 topic or subject area. | `RI.6.4` Determine the meaning of words and phrases as they are used in a text, including figurative, connotative, and technical meanings. |
| `RI.5.6` Compare Points of View | `RI.4.6` Compare and contrast a firsthand and secondhand account of the same event or topic; describe the differences in focus and the information provided. | Analyze multiple accounts of the same event or topic, noting important similarities and differences in the point of view they represent. | `RI.6.6` Determine an author's point of view or purpose in a text and explain how it is conveyed in the text. |
| `RI.5.8` Reasons & Evidence | `RI.4.8` Explain how an author uses reasons and evidence to support particular points in a text. | Explain how an author uses reasons and evidence to support particular points in a text, identifying which reasons and evidence support which point(s). | `RI.6.8` Trace and evaluate the argument and specific claims in a text, distinguishing claims that are supported by reasons and evidence from claims that are not. |
| `RI.5.9` Combine Sources | `RI.4.9` Integrate information from two texts on the same topic in order to write or speak about the subject knowledgeably. | Integrate information from several texts on the same topic in order to write or speak about the subject knowledgeably. | `RI.6.9` Compare and contrast one author's presentation of events with that of another (e.g., a memoir written by and a biography on the same person). |
| `W.5.8` Research Notes | `W.4.8` Recall relevant information from experiences or gather relevant information from print and digital sources; take notes and categorize information, and provide a list of sources. | Recall relevant information from experiences or gather relevant information from print and digital sources; summarize or paraphrase information in notes and finished work, and provide a list of sources. | `W.6.8` Gather relevant information from multiple print and digital sources; assess the credibility of each source; and quote or paraphrase the data and conclusions of others while avoiding plagiarism and providing basic bibliographic information for sources. |

## Where each standard is assessed

| Stop | Event | Date | Field Report set 1 | Set 2 | Set 3 | Voices (real, fictional or document) |
|---|---|---|---|---|---|---|
| 1 | The Boston Tea Party | December 16, 1773 | `RI.5.4` + `E2.5.1` | `RI.5.6` + `H3.5.1` | `RI.5.3` + `H1.5.1` | Sam Whitcomb (fictional); Margaret Lowell (fictional); Phillis Wheatley (real) |
| 2 | The First Continental Congress | September 1774 | `RI.5.2` + `H1.5.2` | `RI.5.8` + `E1.5.1` | `RI.5.1` + `H2.5.2` | John Adams (real); Joseph Galloway (real); Hannah Brewster (fictional) |
| 3 | Lexington and Concord | April 19, 1775 | `RI.5.6` + `H3.5.1` | `RI.5.1` + `SSS1.5.1` | `RI.5.9` + `H1.5.1` | Captain John Parker (real); Major John Pitcairn (real); A Historian Today (fictional) |
| 4 | The Declaration of Independence | July 1776 | `RI.5.8` + `C1.5.2` | `RI.5.4` + `C1.5.2` | `RI.5.2` + `H2.5.2` | The Declaration of Independence (document); Abigail Adams (real); Jem (fictional) |
| 5 | Crossing the Delaware | December 26, 1776 | `RI.5.3` + `H2.5.1` | `RI.5.1` + `H3.5.1` | `RI.5.4` + `H1.5.2` | Thomas Paine (real); Elijah Cole (fictional); Johann Becker (fictional) |
| 6 | The Turning Point at Saratoga | October 1777 | `RI.5.6` + `G2.5.1` | `RI.5.3` + `H1.5.1` | `RI.5.9` + `G3.5.1` | Tyonajanegen (real); Thayendanegea (Joseph Brant) (real); Benjamin Franklin (real) |
| 7 | Winter at Valley Forge | Winter 1777–1778 | `RI.5.1` + `H2.5.1` | `RI.5.2` + `H1.5.2` | `RI.5.8` + `H2.5.2` | Joseph Plumb Martin (real); Polly Cooper (real); Baron Friedrich von Steuben (real) |
| 8 | Victory at Yorktown | October 1781 | `RI.5.3` + `H1.5.1` | `RI.5.9` + `H2.5.2` | `RI.5.6` + `H3.5.1` | James Armistead (real); Lieutenant Jean-Baptiste Moreau (fictional); General Charles Cornwallis (real) |
| 9 | The Constitutional Convention | Summer 1787 | `RI.5.8` + `C2.5.1` | `RI.5.4` + `C2.5.1` | `RI.5.2` + `C1.5.2` | Benjamin Franklin (real); George Mason (real); Richard Allen (real) |
| 10 | A New Government and the Bill of Rights | 1789–1791 | `RI.5.9` + `C1.5.2` | `RI.5.1` + `C2.5.2` | `RI.5.4` + `C4.5.1` | George Washington (real); Senator William Maclay (real); The First Amendment (document) |

Every stop also has a Navigator Check (`G1.5.1`) before the leg begins and a Time Journal entry (`W.5.8`).

| ELA standard | Skill | Stops | Data points |
|---|---|---|---|
| `RI.5.1` | Quote & Infer | 2, 3, 5, 7, 10 | 5 |
| `RI.5.2` | Main Ideas & Summary | 2, 4, 7, 9 | 4 |
| `RI.5.3` | Connect Events & People | 1, 5, 6, 8 | 4 |
| `RI.5.4` | Word Detective | 1, 4, 5, 9, 10 | 5 |
| `RI.5.6` | Compare Points of View | 1, 3, 6, 8 | 4 |
| `RI.5.8` | Reasons & Evidence | 2, 4, 7, 9 | 4 |
| `RI.5.9` | Combine Sources | 3, 6, 8, 10 | 4 |
| `W.5.8` | Research Notes | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 | 10 |
| `W.5.1`, `W.5.9`, `SL.5.4` | Opinion writing, evidence, presenting | Final class report and presentation | 1 |

### Social studies

| Code | Statement | Where it appears |
|---|---|---|
| `H1.5.1` | Create timelines to demonstrate historical events caused by other important events. | Stop 1; Stop 3; Stop 6; Stop 8; final timeline and cause-and-effect challenge |
| `H1.5.2` | Demonstrate how the following themes and developments help to define eras in U.S. history from time immemorial to 1791: development of tribal nations in North America (time immemorial to 1791); encounter, colonization, and devastation (1492-1763); revolution and constitution (1763-1791). | Stop 2; Stop 5; Stop 7; the time jumps between eras |
| `H2.5.1` | Analyze and explain how individuals have caused change in United States history. | Stop 5; Stop 7 |
| `H2.5.2` | Analyze and explain how people from various cultural and ethnic groups have shaped United States history. | Stop 2; Stop 4; Stop 7; Stop 8 |
| `H3.5.1` | Explain why individuals and groups in the American colonies differed in their perspectives. | Stop 1; Stop 3; Stop 5; Stop 8 |
| `H4.5.1` | Recognize and explain that significant historical events in the United States have implications for current decisions and influence the future. | final report: why it matters today |
| `C1.5.2` | Identify core virtues and democratic principles found in foundational national documents that guide government, societies, and communities. | Stop 4; Stop 4; Stop 9; Stop 10 |
| `C2.5.1` | Distinguish the responsibilities and powers of government officials at various levels and branches of government and in different times and places. | Stop 9; Stop 9 |
| `C2.5.2` | Explain how a democracy relies on people’s responsible participation, and draw implications for how individuals should participate. | Stop 10 |
| `C4.5.1` | Demonstrate how civic participation relates to rights and responsibilities. | Stop 10 |
| `E1.5.1` | Analyze and explain the benefits of the decisions that colonists made to meet their wants and needs. | Stop 2; stores and boycott decisions |
| `E2.5.1` | Describe how colonial American economic systems worked. | Stop 1; store facts on colonial money, trade and inflation |
| `G1.5.1` | Construct and use maps to show and analyze information about European settlement in the United States. | Navigator Check at all 10 stops; map with the Proclamation Line and Native homelands |
| `G2.5.1` | Compare and analyze the impact of the European colonists’ movement to the Americas on the land of Native American peoples. | Stop 6 |
| `G3.5.1` | Describe the impact of European settlements on Native American tribes. | Stop 6 |
| `SSS1.5.1` | Evaluate the relevance of facts used in forming a position on an issue or event. | Stop 3 |
| `SSS1.5.2` | Construct arguments using claims and evidence from multiple sources. | final report: claim and evidence from several stops |
| `SSS2.5.1` | Explain how supporting questions help answer compelling questions in an inquiry. | final report: choosing a compelling question |
| `SSS4.5.1` | Research multiple perspectives to take a position on a public or historical issue in a paper or presentation. | final report: another point of view |

## CASE identifiers

| Code | Grade | CASE identifier |
|---|---|---|
| `H1.5.1` | 5 | `8debc73d-6cdb-478d-aaf0-e5e5214b03f9` |
| `H1.5.2` | 5 | `9790b997-c30b-4174-80e3-bc639313e2dd` |
| `H2.5.1` | 5 | `b8079290-9a6e-47f2-bc07-cabc28466e5a` |
| `H2.5.2` | 5 | `b1b0ab7c-46e2-431c-9919-d0cd27fa44c2` |
| `H3.5.1` | 5 | `b5ac12e7-ae32-48d2-8d43-70f2dd611dcf` |
| `H4.5.1` | 5 | `cf5bc140-5f7a-46a3-b7e5-b6ba47ec1e52` |
| `C1.5.2` | 5 | `45ea214f-343a-41e3-859a-b8ef49656ca9` |
| `C2.5.1` | 5 | `ec7645f9-bf25-4189-b27e-1e49d19a72a9` |
| `C2.5.2` | 5 | `64393038-bc67-4802-9238-7113adac5b46` |
| `C4.5.1` | 5 | `b3e79efb-a16c-4c9d-9fab-48a910722a3c` |
| `E1.5.1` | 5 | `7c52434e-9a76-456b-9067-d7ad8a75c703` |
| `E2.5.1` | 5 | `52eef29b-2167-4cb7-8e0b-19eba0903d0c` |
| `G1.5.1` | 5 | `13ea33b9-04c6-4a7c-a032-0eb5b52efd92` |
| `G2.5.1` | 5 | `db546ac7-f5b6-49af-90a8-dd6062f9437e` |
| `G3.5.1` | 5 | `c561d4b3-4f2f-4b90-8a37-96e6b85a742a` |
| `SSS1.5.1` | 5 | `011fc3ce-425e-40a6-abb1-ecfdafd31c83` |
| `SSS1.5.2` | 5 | `59c65141-f86e-4fe9-b9c4-fbb554641276` |
| `SSS2.5.1` | 5 | `26e6d1c0-efce-4e83-87c3-faa72e0d7bb3` |
| `SSS4.5.1` | 5 | `b72d7f0f-57e9-464a-b6db-cefefca5f94a` |
| `RI.5.1` | 5 | `661ce5a6-d7cc-11e8-824f-0242ac160002` |
| `RI.5.2` | 5 | `661fb598-d7cc-11e8-824f-0242ac160002` |
| `RI.5.3` | 5 | `66215516-d7cc-11e8-824f-0242ac160002` |
| `RI.5.4` | 5 | `661ce9f7-d7cc-11e8-824f-0242ac160002` |
| `RI.5.6` | 5 | `66215731-d7cc-11e8-824f-0242ac160002` |
| `RI.5.8` | 5 | `661fba5e-d7cc-11e8-824f-0242ac160002` |
| `RI.5.9` | 5 | `6621593a-d7cc-11e8-824f-0242ac160002` |
| `W.5.8` | 5 | `66208cff-d7cc-11e8-824f-0242ac160002` |
| `W.5.1` | 5 | `661e5423-d7cc-11e8-824f-0242ac160002` |
| `W.5.9` | 5 | `662209ef-d7cc-11e8-824f-0242ac160002` |
| `SL.5.4` | 5 | `661de2d3-d7cc-11e8-824f-0242ac160002` |
| `RI.4.1` | 4 | `661ef12d-d7cc-11e8-824f-0242ac160002` |
| `RI.6.1` | 6 | `661cee33-d7cc-11e8-824f-0242ac160002` |
| `RI.4.2` | 4 | `661fae72-d7cc-11e8-824f-0242ac160002` |
| `RI.6.2` | 6 | `661fbcc8-d7cc-11e8-824f-0242ac160002` |
| `RI.4.3` | 4 | `66214f2d-d7cc-11e8-824f-0242ac160002` |
| `RI.6.3` | 6 | `66215b3b-d7cc-11e8-824f-0242ac160002` |
| `RI.4.4` | 4 | `661ce165-d7cc-11e8-824f-0242ac160002` |
| `RI.6.4` | 6 | `661cf32b-d7cc-11e8-824f-0242ac160002` |
| `RI.4.6` | 4 | `6621513c-d7cc-11e8-824f-0242ac160002` |
| `RI.6.6` | 6 | `66215d38-d7cc-11e8-824f-0242ac160002` |
| `RI.4.8` | 4 | `661fb33b-d7cc-11e8-824f-0242ac160002` |
| `RI.6.8` | 6 | `661fc1e1-d7cc-11e8-824f-0242ac160002` |
| `RI.4.9` | 4 | `662152fa-d7cc-11e8-824f-0242ac160002` |
| `RI.6.9` | 6 | `66215f39-d7cc-11e8-824f-0242ac160002` |
| `W.4.8` | 4 | `662084f7-d7cc-11e8-824f-0242ac160002` |
| `W.6.8` | 6 | `66209310-d7cc-11e8-824f-0242ac160002` |

## Regenerating this file

```sh
node tools/alignment.js > docs/STANDARDS_ALIGNMENT.md
```
