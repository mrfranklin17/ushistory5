/*
 * Standards data for The Revolution Trail.
 *
 * Every statement below was retrieved from the Learning Commons knowledge
 * graph (CASE Network) using the Washington jurisdiction. The caseIdentifierUUID
 * values let you look each statement up again in the CASE Network.
 *
 * Learning Commons does not publish learning components or progressions for
 * these ELA or social studies standards (its progression tool covers math only),
 * so the growth scale uses the Washington grade 4, 5 and 6 versions of each
 * reading and writing standard:
 *   Level 2 "Approaching" = the grade 4 version of the skill
 *   Level 3 "Meeting"     = the grade 5 standard
 *   Level 4 "Extending"   = the grade 6 version of the skill
 */
window.RT_STANDARDS = {
  source: 'Learning Commons knowledge graph (CASE Network), Washington jurisdiction',

  levels: {
    1: { name: 'Beginning', short: 'B', note: 'Missed the grade 5 and grade 4 versions of the skill' },
    2: { name: 'Approaching', short: 'A', note: 'Showed the grade 4 version of the skill' },
    3: { name: 'Meeting', short: 'M', note: 'Showed the grade 5 standard on the first try' },
    4: { name: 'Extending', short: 'E', note: 'Also showed the grade 6 version of the skill' }
  },

  // ELA standards tracked over time in every Field Report and Time Journal entry.
  ela: {
    'RI.5.1': {
      kid: 'Quote & Infer',
      text: 'Quote accurately from a text when explaining what the text says explicitly and when drawing inferences from the text.',
      uuid: '661ce5a6-d7cc-11e8-824f-0242ac160002',
      below: 'RI.4.1', above: 'RI.6.1'
    },
    'RI.5.2': {
      kid: 'Main Ideas & Summary',
      text: 'Determine two or more main ideas of a text and explain how they are supported by key details; summarize the text.',
      uuid: '661fb598-d7cc-11e8-824f-0242ac160002',
      below: 'RI.4.2', above: 'RI.6.2'
    },
    'RI.5.3': {
      kid: 'Connect Events & People',
      text: 'Explain the relationships or interactions between two or more individuals, events, ideas, or concepts in a historical, scientific, or technical text based on specific information in the text.',
      uuid: '66215516-d7cc-11e8-824f-0242ac160002',
      below: 'RI.4.3', above: 'RI.6.3'
    },
    'RI.5.4': {
      kid: 'Word Detective',
      text: 'Determine the meaning of general academic and domain-specific words and phrases in a text relevant to a grade 5 topic or subject area.',
      uuid: '661ce9f7-d7cc-11e8-824f-0242ac160002',
      below: 'RI.4.4', above: 'RI.6.4'
    },
    'RI.5.6': {
      kid: 'Compare Points of View',
      text: 'Analyze multiple accounts of the same event or topic, noting important similarities and differences in the point of view they represent.',
      uuid: '66215731-d7cc-11e8-824f-0242ac160002',
      below: 'RI.4.6', above: 'RI.6.6'
    },
    'RI.5.8': {
      kid: 'Reasons & Evidence',
      text: 'Explain how an author uses reasons and evidence to support particular points in a text, identifying which reasons and evidence support which point(s).',
      uuid: '661fba5e-d7cc-11e8-824f-0242ac160002',
      below: 'RI.4.8', above: 'RI.6.8'
    },
    'RI.5.9': {
      kid: 'Combine Sources',
      text: 'Integrate information from several texts on the same topic in order to write or speak about the subject knowledgeably.',
      uuid: '6621593a-d7cc-11e8-824f-0242ac160002',
      below: 'RI.4.9', above: 'RI.6.9'
    },
    'W.5.8': {
      kid: 'Research Notes',
      text: 'Recall relevant information from experiences or gather relevant information from print and digital sources; summarize or paraphrase information in notes and finished work, and provide a list of sources.',
      uuid: '66208cff-d7cc-11e8-824f-0242ac160002',
      below: 'W.4.8', above: 'W.6.8'
    }
  },

  // Grade 4 and grade 6 neighbors that define levels 2 and 4.
  progression: {
    'RI.4.1': { grade: 4, uuid: '661ef12d-d7cc-11e8-824f-0242ac160002', text: 'Refer to details and examples in a text when explaining what the text says explicitly and when drawing inferences from the text.' },
    'RI.6.1': { grade: 6, uuid: '661cee33-d7cc-11e8-824f-0242ac160002', text: 'Cite textual evidence to support analysis of what the text says explicitly as well as inferences drawn from the text.' },
    'RI.4.2': { grade: 4, uuid: '661fae72-d7cc-11e8-824f-0242ac160002', text: 'Determine the main idea of a text and explain how it is supported by key details; summarize the text.' },
    'RI.6.2': { grade: 6, uuid: '661fbcc8-d7cc-11e8-824f-0242ac160002', text: 'Determine a central idea of a text and how it is conveyed through particular details; provide a summary of the text distinct from personal opinions or judgments.' },
    'RI.4.3': { grade: 4, uuid: '66214f2d-d7cc-11e8-824f-0242ac160002', text: 'Explain events, procedures, ideas, or concepts in a historical, scientific, or technical text, including what happened and why, based on specific information in the text.' },
    'RI.6.3': { grade: 6, uuid: '66215b3b-d7cc-11e8-824f-0242ac160002', text: 'Analyze in detail how a key individual, event, or idea is introduced, illustrated, and elaborated in a text (e.g., through examples or anecdotes).' },
    'RI.4.4': { grade: 4, uuid: '661ce165-d7cc-11e8-824f-0242ac160002', text: 'Determine the meaning of general academic and domain-specific words or phrases in a text relevant to a grade 4 topic or subject area.' },
    'RI.6.4': { grade: 6, uuid: '661cf32b-d7cc-11e8-824f-0242ac160002', text: 'Determine the meaning of words and phrases as they are used in a text, including figurative, connotative, and technical meanings.' },
    'RI.4.6': { grade: 4, uuid: '6621513c-d7cc-11e8-824f-0242ac160002', text: 'Compare and contrast a firsthand and secondhand account of the same event or topic; describe the differences in focus and the information provided.' },
    'RI.6.6': { grade: 6, uuid: '66215d38-d7cc-11e8-824f-0242ac160002', text: "Determine an author's point of view or purpose in a text and explain how it is conveyed in the text." },
    'RI.4.8': { grade: 4, uuid: '661fb33b-d7cc-11e8-824f-0242ac160002', text: 'Explain how an author uses reasons and evidence to support particular points in a text.' },
    'RI.6.8': { grade: 6, uuid: '661fc1e1-d7cc-11e8-824f-0242ac160002', text: 'Trace and evaluate the argument and specific claims in a text, distinguishing claims that are supported by reasons and evidence from claims that are not.' },
    'RI.4.9': { grade: 4, uuid: '662152fa-d7cc-11e8-824f-0242ac160002', text: 'Integrate information from two texts on the same topic in order to write or speak about the subject knowledgeably.' },
    'RI.6.9': { grade: 6, uuid: '66215f39-d7cc-11e8-824f-0242ac160002', text: "Compare and contrast one author's presentation of events with that of another (e.g., a memoir written by and a biography on the same person)." },
    'W.4.8': { grade: 4, uuid: '662084f7-d7cc-11e8-824f-0242ac160002', text: 'Recall relevant information from experiences or gather relevant information from print and digital sources; take notes and categorize information, and provide a list of sources.' },
    'W.6.8': { grade: 6, uuid: '66209310-d7cc-11e8-824f-0242ac160002', text: 'Gather relevant information from multiple print and digital sources; assess the credibility of each source; and quote or paraphrase the data and conclusions of others while avoiding plagiarism and providing basic bibliographic information for sources.' }
  },

  // ELA standards assessed once, in the final class report.
  elaFinal: {
    'W.5.1': { kid: 'Opinion Writing', uuid: '661e5423-d7cc-11e8-824f-0242ac160002', text: 'Write opinion pieces on topics or texts, supporting a point of view with reasons and information' },
    'W.5.9': { kid: 'Use Evidence in Writing', uuid: '662209ef-d7cc-11e8-824f-0242ac160002', text: 'Draw evidence from literary or informational texts to support analysis, reflection, and research.' },
    'SL.5.4': { kid: 'Present a Report', uuid: '661de2d3-d7cc-11e8-824f-0242ac160002', text: 'Report on a topic or text or present an opinion, sequencing ideas logically and using appropriate facts and relevant, descriptive details to support main ideas or themes; speak clearly at an understandable pace.' }
  },

  // Washington grade 5 social studies standards (U.S. history to 1791).
  ss: {
    'H1.5.1': { strand: 'History', uuid: '8debc73d-6cdb-478d-aaf0-e5e5214b03f9', text: 'Create timelines to demonstrate historical events caused by other important events.' },
    'H1.5.2': { strand: 'History', uuid: '9790b997-c30b-4174-80e3-bc639313e2dd', text: 'Demonstrate how the following themes and developments help to define eras in U.S. history from time immemorial to 1791: development of tribal nations in North America (time immemorial to 1791); encounter, colonization, and devastation (1492-1763); revolution and constitution (1763-1791).' },
    'H2.5.1': { strand: 'History', uuid: 'b8079290-9a6e-47f2-bc07-cabc28466e5a', text: 'Analyze and explain how individuals have caused change in United States history.' },
    'H2.5.2': { strand: 'History', uuid: 'b1b0ab7c-46e2-431c-9919-d0cd27fa44c2', text: 'Analyze and explain how people from various cultural and ethnic groups have shaped United States history.' },
    'H3.5.1': { strand: 'History', uuid: 'b5ac12e7-ae32-48d2-8d43-70f2dd611dcf', text: 'Explain why individuals and groups in the American colonies differed in their perspectives.' },
    'H4.5.1': { strand: 'History', uuid: 'cf5bc140-5f7a-46a3-b7e5-b6ba47ec1e52', text: 'Recognize and explain that significant historical events in the United States have implications for current decisions and influence the future.' },
    'C1.5.2': { strand: 'Civics', uuid: '45ea214f-343a-41e3-859a-b8ef49656ca9', text: 'Identify core virtues and democratic principles found in foundational national documents that guide government, societies, and communities.' },
    'C2.5.1': { strand: 'Civics', uuid: 'ec7645f9-bf25-4189-b27e-1e49d19a72a9', text: 'Distinguish the responsibilities and powers of government officials at various levels and branches of government and in different times and places.' },
    'C2.5.2': { strand: 'Civics', uuid: '64393038-bc67-4802-9238-7113adac5b46', text: 'Explain how a democracy relies on people’s responsible participation, and draw implications for how individuals should participate.' },
    'C4.5.1': { strand: 'Civics', uuid: 'b3e79efb-a16c-4c9d-9fab-48a910722a3c', text: 'Demonstrate how civic participation relates to rights and responsibilities.' },
    'E1.5.1': { strand: 'Economics', uuid: '7c52434e-9a76-456b-9067-d7ad8a75c703', text: 'Analyze and explain the benefits of the decisions that colonists made to meet their wants and needs.' },
    'E2.5.1': { strand: 'Economics', uuid: '52eef29b-2167-4cb7-8e0b-19eba0903d0c', text: 'Describe how colonial American economic systems worked.' },
    'G1.5.1': { strand: 'Geography', uuid: '13ea33b9-04c6-4a7c-a032-0eb5b52efd92', text: 'Construct and use maps to show and analyze information about European settlement in the United States.' },
    'G2.5.1': { strand: 'Geography', uuid: 'db546ac7-f5b6-49af-90a8-dd6062f9437e', text: 'Compare and analyze the impact of the European colonists’ movement to the Americas on the land of Native American peoples.' },
    'G3.5.1': { strand: 'Geography', uuid: 'c561d4b3-4f2f-4b90-8a37-96e6b85a742a', text: 'Describe the impact of European settlements on Native American tribes.' },
    'SSS1.5.1': { strand: 'Social Studies Skills', uuid: '011fc3ce-425e-40a6-abb1-ecfdafd31c83', text: 'Evaluate the relevance of facts used in forming a position on an issue or event.' },
    'SSS1.5.2': { strand: 'Social Studies Skills', uuid: '59c65141-f86e-4fe9-b9c4-fbb554641276', text: 'Construct arguments using claims and evidence from multiple sources.' },
    'SSS2.5.1': { strand: 'Social Studies Skills', uuid: '26e6d1c0-efce-4e83-87c3-faa72e0d7bb3', text: 'Explain how supporting questions help answer compelling questions in an inquiry.' },
    'SSS4.5.1': { strand: 'Social Studies Skills', uuid: 'b72d7f0f-57e9-464a-b6db-cefefca5f94a', text: 'Research multiple perspectives to take a position on a public or historical issue in a paper or presentation.' }
  }
};
