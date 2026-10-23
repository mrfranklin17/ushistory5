/*
 * Story and assessment content for The Revolution Trail.
 *
 * Conventions
 * - {A}, {B} and {T} are replaced with the two travelers' names and the teacher's name.
 * - [[term]] in scene text becomes a tappable glossary word (see glossary below).
 * - In every question, the FIRST choice is the correct one. The game shuffles
 *   choices before showing them.
 * - Each Field Report set targets one ELA standard at three grain sizes, taken from
 *   the Washington progression in standards.js:
 *     core      = grade 5 standard (asked first)
 *     scaffold  = grade 4 version (asked only if the core item is missed)
 *     extension = grade 6 version (offered only if the core item is correct)
 * - Voices are labeled "real" (a real person; exact words appear only in `quote`),
 *   "document" (a real document), or "fictional" (an invented character based on
 *   the historical record).
 */
window.RT_CONTENT = {
  intro: [
    { stamp: 'FRIDAY, 3:12 P.M. — 2026', text: `{T} writes on the board: HISTORY REPORT DUE MONDAY. "What happened in the American Revolution, and why does it matter?" {A} and {B} look at each other. They have not started. At all.` },
    { stamp: '4:45 P.M. — THE SCHOOL LIBRARY', text: `Hunting for books, {B} bumps into a squeaky old book cart in the back corner. A tiny screen blinks: C.A.R.T. — CHRONO-ARCHIVE RETRIEVAL TROLLEY. It has exactly one button. The button says CHECK OUT.` },
    { stamp: '4:46 P.M.', text: `{A} presses it. (Of course {A} presses it.) The cart rattles. Books flap like birds. The library spins into a blur of candlelight, horses, and three-cornered hats.` },
    { stamp: 'THUD.', text: `A frosty field. Chimney smoke. A man with a wheelbarrow stares at your hoodies. The cart's screen glows: LOCATION: PROVIDENCE, RHODE ISLAND. DATE: DECEMBER 8, 1773. RETURN STATUS: DENIED. REASON: RESEARCH INCOMPLETE. COLLECT NOTES AT 10 HISTORIC STOPS TO RETURN.` },
    { stamp: 'C.A.R.T. SAYS', text: `{B}: "So we have to actually do the research?" {A}: "In person. In 1773. This is either the worst thing that has ever happened to us, or the most excellent." C.A.R.T.: TIP: IT IS DECEMBER. YOU ARE WEARING HOODIES. VISIT THE GENERAL STORE.` }
  ],

  start: {
    town: 'Providence, Rhode Island',
    store: { name: "Pell's General Store", keeper: 'Mistress Ruth Pell', priceMult: 1,
      greeting: `"Strange clothes you two have! Heading to Boston? You'll want warm wool coats in December, food for the road, a spare wheel or two for that odd cart, and some remedies in case you take sick."`,
      fact: 'Colonists counted money in pounds, shillings and pence: 12 pence made 1 shilling, and 20 shillings made 1 pound. Under British trade laws, colonists shipped raw materials such as lumber and furs to Britain and bought finished goods such as cloth and tea back.' }
  },

  landmarks: [
    // ------------------------------------------------------------------ 1
    {
      id: 'boston1773', name: 'The Boston Tea Party', place: 'Boston, Massachusetts', when: 'December 16, 1773', year: 1773,
      lat: 42.36, lon: -71.06, art: 'harbor',
      landing: { town: 'Providence, Rhode Island', date: '1773-12-08', miles: 50, lat: 41.82, lon: -71.41 },
      navigator: {
        stem: 'Your cart landed in Providence, Rhode Island. Find Boston on the map. Boston is in which colony?',
        choices: ['Massachusetts', 'Rhode Island', 'Connecticut', 'New York'],
        why: 'Boston is the largest town in the colony of Massachusetts, which is part of New England.'
      },
      news: [
        'A traveler says Rhode Islanders burned a British customs ship, the Gaspee, near Providence in 1772. They were angry about British officials searching their ships.',
        'Everyone on the road is talking about the tea ships waiting in Boston Harbor.'
      ],
      scene: [
        `Boston is one of the biggest towns in the thirteen colonies. But it does not feel calm. Ten years ago, Britain won a long and costly war against France, called the French and Indian War. To help pay for it, the British [[Parliament]] began passing [[taxes]] on the colonies. There was the Stamp Act of 1765. There were also taxes on glass, paper and tea.`,
        `Many colonists said, "No taxation without [[representation]]!" They meant that Parliament should not tax them, because the colonists had no [[representatives]] in Parliament to vote for them.`,
        `Now there is a new law, the [[Tea Act]] of 1773. It actually makes British tea cheaper. But it keeps a tax on tea. It also lets one company, the [[East India Company]], control the tea trade. Three ships full of tea are tied up at Griffin's [[Wharf]]. Colonists refuse to let the tea be unloaded. The royal governor refuses to send the ships away.`,
        `On the night of December 16, dozens of men and boys climb onto the ships. Some are disguised as Mohawk Indians. That costume borrowed a real Native nation's identity. In about three hours, they dump 342 chests of tea into Boston Harbor.`,
        `In a shop window, you see a copy of Paul Revere's famous picture of the Boston Massacre. In 1770, British soldiers fired into a crowd and killed five colonists. One of them was Crispus Attucks, a sailor of African and Native American ancestry.`
      ],
      voices: [
        { id: 'sam', name: 'Sam Whitcomb', role: '14-year-old printer’s [[apprentice]], a Patriot', kind: 'fictional', account: 'firsthand',
          text: `Last night I helped throw the tea into the harbor! We were careful. We broke open only the tea chests and damaged nothing else on the ships. When one man tried to sneak tea home in his coat, we stopped him. This was a protest, not a robbery. Parliament keeps taxing us, but we have no one in Parliament to speak for us. If we let this tea land and pay the tax, we are saying Parliament may tax us whenever it wishes. Liberty is worth more than tea.`,
          basis: 'Fictional character based on accounts of the Boston Tea Party.' },
        { id: 'margaret', name: 'Margaret Lowell', role: 'Boston shop owner, a Loyalist', kind: 'fictional', account: 'secondhand',
          text: `Destroying tea is destroying property! That tea belonged to the East India Company, and someone must pay for it. I am loyal to King George III. Britain's army and navy protected us during the war with France, and that war cost a great deal of money. Is it so wrong to help pay for our own protection? Besides, this tea is cheaper than ever. I was home in bed when it happened, but I fear these Sons of Liberty. They call it a protest, yet they break the law and frighten anyone who disagrees with them. Mark my words, the king will punish all of Boston for this.`,
          basis: 'Fictional character based on the views of Boston Loyalists.' },
        { id: 'phillis', name: 'Phillis Wheatley', role: 'Poet in Boston, recently freed from slavery', kind: 'real', account: 'document',
          text: `I was taken from West Africa as a child and enslaved here in Boston. This year my book of poems was printed in London, the first book of poetry published by an African American woman, and I have just been freed. Everyone in Boston is shouting about liberty. But many of the same people who demand liberty from Britain hold Africans in slavery. That love of freedom belongs to every person, not only to some.`,
          quote: 'In every human Breast, God has implanted a Principle, which we call Love of Freedom; it is impatient of Oppression, and pants for Deliverance.',
          quoteSource: 'Letter from Phillis Wheatley to Samson Occom, a Mohegan minister, February 11, 1774',
          basis: 'Real person. The quote is her exact words from a letter she wrote two months later. The other words are adapted from her life story.' }
      ],
      report: [
        { std: 'RI.5.4', ss: 'E2.5.1',
          core: { stem: 'The scene says Parliament should not tax the colonists "because the colonists had no representatives in Parliament to vote for them." What does representatives mean?',
            choices: ['People chosen to speak and vote for a group', 'Soldiers who protect a town', 'Merchants who sell tea', 'Taxes paid on goods'],
            why: 'Representatives are people chosen to speak and vote for others. The colonists had none in Parliament.' },
          scaffold: { stem: 'The scene says Parliament began passing taxes on the colonies. What is a tax?',
            choices: ['Money people must pay to the government', 'A ship that carries goods', 'A law that makes tea cheaper', 'A protest at night'],
            why: 'A tax is money people must pay to a government.' },
          extension: { stem: 'Margaret Lowell says the Sons of Liberty "break the law." Sam Whitcomb calls the same night "a protest, not a robbery." Why does Sam choose the word protest?',
            choices: ['Protest makes the action sound like a fair stand for rights, while robbery makes it sound like a crime', 'Protest and robbery mean exactly the same thing', 'Robbery was not a word in 1773', 'Sam wants to admit that the tea was stolen'],
            why: 'Words carry feelings (connotations). Sam picks a word that makes his side sound fair and brave.' } },
        { std: 'RI.5.6', ss: 'H3.5.1',
          core: { stem: 'Sam Whitcomb and Margaret Lowell both describe the Boston Tea Party. What is the most important difference in their points of view?',
            choices: ['Sam sees it as a protest for rights; Margaret sees it as lawbreaking that destroyed property', 'Sam says it happened at night; Margaret says it happened in the morning', 'Both of them think it was a terrible crime', 'Sam is loyal to the king and Margaret is a Patriot'],
            why: 'They agree on what happened, but Sam (a Patriot) and Margaret (a Loyalist) judge it in opposite ways.' },
          scaffold: { stem: 'Sam says, "Last night I helped throw the tea into the harbor!" Margaret says she was home in bed. Which choice is true?',
            choices: ["Sam's account is firsthand because he was there; Margaret's is secondhand because she only heard about it", 'Both accounts are firsthand', 'Both accounts are secondhand', "Margaret's account is firsthand because she owns a shop"],
            why: 'A firsthand account comes from someone who was there. A secondhand account comes from someone who was not.' },
          extension: { stem: "What is Phillis Wheatley's point of view, and how does she get it across?",
            choices: ['Liberty belongs to everyone; she shows this by pointing out that people who demand liberty also hold Africans in slavery', 'The tea tax is fair; she shows this by listing what the war with France cost', 'Boston should obey the king; she shows this by quoting the governor', 'Poems matter more than politics; she shows this by describing her book'],
            why: 'Wheatley uses the colonists’ own words about liberty to show that slavery contradicts them.' } },
        { std: 'RI.5.3', ss: 'H1.5.1',
          core: { stem: 'Based on the scene, how are the Tea Act and the Boston Tea Party related?',
            choices: ['The Tea Act kept a tax on tea and gave one company control of the trade, so colonists protested by dumping the tea', 'The Tea Party happened first, so Parliament passed the Tea Act to celebrate', 'The Tea Act ended every tax, so the colonists threw a party', 'They are not related to each other'],
            why: 'The Tea Act (cause) led to the Boston Tea Party (effect).' },
          scaffold: { stem: 'Why did colonists refuse to let the tea be unloaded?',
            choices: ['The tea still carried a tax they believed was unfair', 'The tea was rotten', 'The ships were too small to unload', 'The ships came from France'],
            why: 'The scene explains that the Tea Act kept a tax on tea.' },
          extension: { stem: 'The scene explains the French and Indian War before it describes the Tea Party. Why does the author include this background?',
            choices: ["To show that Britain's war debt led to new taxes, which led to protests like the Tea Party", 'To show that France planned the Tea Party', 'To explain how tea is made', 'To prove the war was fought in Boston'],
            why: 'The background builds a chain: war debt, then taxes, then protest.' } }
      ],
      journal: { prompt: 'What happened at the Boston Tea Party, and why did people disagree about it?',
        keywords: ['tax', 'tea', 'protest', 'parliament', 'representation', 'property', 'liberty', 'loyalist', 'patriot', 'slavery', 'freedom'] },
      recall: [
        { q: 'What did colonists dump into Boston Harbor in December 1773?', choices: ['Tea', 'Coffee', 'Gunpowder'] },
        { q: 'What did "No taxation without representation" mean?', choices: ['Colonists should not be taxed without a vote in Parliament', 'Colonists wanted lower prices on tea', 'Colonists wanted a new king'] }
      ]
    },

    // ------------------------------------------------------------------ 2
    {
      id: 'philadelphia1774', name: 'The First Continental Congress', place: 'Philadelphia, Pennsylvania', when: 'September 1774', year: 1774,
      lat: 39.95, lon: -75.17, art: 'hall',
      bridge: [
        'Parliament punishes Boston for the Tea Party.',
        'June 1, 1774: the Boston Port Act closes Boston Harbor until the tea is paid for.',
        'Other colonies send food and money to help the people of Boston.'
      ],
      landing: { town: 'New York City, New York', date: '1774-08-25', miles: 95, lat: 40.71, lon: -74.01,
        river: { mile: 65, name: 'Delaware River at Trenton Ferry', depth: [3.5, 5.5], width: 800, fordable: true, ferry: 3 } },
      navigator: {
        stem: 'Your cart landed in New York City. Find Philadelphia on the map. Which direction will you travel?',
        choices: ['Southwest', 'Northeast', 'Northwest', 'East'],
        why: 'Philadelphia is south and west of New York City, so you travel southwest.'
      },
      news: [
        'A post rider says the Massachusetts delegates, John and Samuel Adams, passed through New York last week on their way to Philadelphia.',
        "A merchant grumbles that Boston's port has been closed since June 1. No ships can go in or out."
      ],
      store: { name: 'Market Street Shops', keeper: 'a Market Street shopkeeper', priceMult: 1,
        greeting: '"Welcome to Philadelphia, the biggest city in the colonies! Buy what you need. Just don’t ask for British tea. Folks here won’t buy it."',
        fact: 'A boycott is a choice not to buy something. Colonists hoped that if they stopped buying British goods, British merchants would lose money and pressure Parliament to change its laws.' },
      scene: [
        `Philadelphia is the largest city in the colonies. About 30,000 people live here. It has brick sidewalks, street lamps, and a library started by Benjamin Franklin.`,
        `After the Boston Tea Party, Parliament punished Massachusetts with new laws. The British called them the Coercive Acts. Colonists called them the [[Intolerable Acts]]. (Intolerable means too harsh to put up with.) The laws closed Boston's port until the tea was paid for. They took away much of Massachusetts's right to govern itself. They also made it easier to house British soldiers in colonists' buildings.`,
        `Other colonies worried. "If Parliament can do this to Massachusetts, it can do it to us." So twelve colonies sent [[delegates]] to meet in Philadelphia at Carpenters' Hall. Only Georgia did not send anyone. The meeting began on September 5, 1774. It is called the First [[Continental Congress]].`,
        `The delegates do not agree on everything. Some want to make peace with Britain. Others want to resist strongly. In the end, they agree to [[boycott]] British goods, which means refusing to buy them. They also send a [[petition]], a formal written request, to King George III. It asks him to fix their complaints. The delegates agree to meet again in May 1775 if nothing changes.`
      ],
      voices: [
        { id: 'jadams', name: 'John Adams', role: 'Delegate from Massachusetts, a lawyer', kind: 'real', account: 'firsthand',
          text: `My colony is suffering. Boston's port is closed, so ships cannot bring food or carry away goods, and many people have lost their work. Four years ago I defended British soldiers in court after the Boston Massacre, because everyone deserves a fair trial. So I do not hate the British. But this is about rights. First, Parliament has punished a whole town for the actions of a few. Second, we have no vote in Parliament. Third, if the colonies stand together, Britain will have to listen. A boycott will hurt British merchants, and they will pressure Parliament to change its mind.`,
          basis: 'Real person. These words are adapted and simplified from his ideas. They are not his exact words.' },
        { id: 'galloway', name: 'Joseph Galloway', role: 'Delegate from Pennsylvania', kind: 'real', account: 'firsthand',
          text: `I love America too, but I believe we are safest as part of Britain. I have proposed a Plan of Union. The colonies would have their own American council that works together with Parliament. That way, we could solve our problems without a war. Breaking away from the most powerful empire in the world would be dangerous, because Britain has the greatest navy on Earth. A boycott may only make the king angrier. My plan lost by a single colony's vote. But I still believe compromise is wiser than rebellion.`,
          basis: 'Real person. These words are adapted and simplified. Galloway later sided with Britain and became a Loyalist.' },
        { id: 'hannah', name: 'Hannah Brewster', role: 'Philadelphia weaver', kind: 'fictional', account: 'firsthand',
          text: `If we stop buying British cloth, we must make our own! My friends and I hold spinning bees, where we gather to spin thread and weave cloth together. We call our homespun cloth a badge of liberty. Women cannot be delegates, but the boycott only works if families choose not to buy British goods, and most of that choosing happens at home.`,
          basis: 'Fictional character based on women who made homespun cloth to support boycotts.' }
      ],
      report: [
        { std: 'RI.5.2', ss: 'H1.5.2',
          core: { stem: 'Which choice states TWO main ideas of the Philadelphia scene?',
            choices: ['Parliament punished Massachusetts with harsh laws, and twelve colonies met and agreed to boycott British goods and petition the king', 'Philadelphia has brick sidewalks, and Georgia did not send delegates', 'Benjamin Franklin started a library, and the meeting began on September 5', 'The delegates agreed on everything, and they declared independence'],
            why: 'Main ideas are the big points. Sidewalks and dates are supporting details.' },
          scaffold: { stem: 'What is the main idea of the scene?',
            choices: ["Colonies came together in Philadelphia to respond to Britain's harsh laws", 'Philadelphia has street lamps', 'Georgia stayed home', 'Carpenters’ Hall is made of brick'],
            why: 'Most of the scene explains why the colonies met and what they decided.' },
          extension: { stem: 'Which is the best objective summary, one that does not include personal opinions?',
            choices: ['After Britain punished Massachusetts, delegates from twelve colonies met in Philadelphia, agreed to boycott British goods, and petitioned the king', 'The brave delegates stood up to the cruel, unfair king', 'The Congress was a silly idea that wasted everyone’s time', 'Joseph Galloway had the best plan, and everyone else was wrong'],
            why: 'An objective summary sticks to what happened and leaves out words like brave, cruel or silly.' } },
        { std: 'RI.5.8', ss: 'E1.5.1',
          core: { stem: 'John Adams makes the point that the colonies should stand together and boycott British goods. Which reason supports that point?',
            choices: ['A boycott will hurt British merchants, who will pressure Parliament to change its mind', 'He once defended British soldiers in court', 'Philadelphia is the largest city in the colonies', 'Breaking away from Britain would be dangerous'],
            why: 'Adams connects the boycott to a result: unhappy British merchants pushing Parliament. The last choice is Galloway’s reason, not Adams’s.' },
          scaffold: { stem: 'John Adams says Massachusetts is suffering. What evidence does he give?',
            choices: ["Boston's port is closed, so ships cannot bring food and many people have lost work", 'He is a lawyer', 'He likes Philadelphia', 'Twelve colonies sent delegates'],
            why: 'The closed port and lost jobs are evidence of suffering.' },
          extension: { stem: 'Joseph Galloway makes several claims. Which claim does he NOT support with any reason or evidence?',
            choices: ['"A boycott may only make the king angrier."', '"Breaking away... would be dangerous." (He says Britain has the greatest navy on Earth.)', '"We could solve our problems without a war." (He explains how his American council would work.)'],
            why: 'Galloway gives reasons for the other claims, but he gives none for why a boycott would anger the king.' } },
        { std: 'RI.5.1', ss: 'H2.5.2',
          core: { stem: 'Hannah could not be a delegate, but she believes she still has power. Which quote BEST supports this inference?',
            choices: ['"Women cannot be delegates, but the boycott only works if families choose not to buy British goods, and most of that choosing happens at home."', '"My friends and I hold spinning bees."', '"We call our homespun cloth a badge of liberty."', '"A boycott will hurt British merchants."'],
            why: 'This quote names what Hannah cannot do and then explains the power she does have.' },
          scaffold: { stem: 'What detail shows how Hannah and her friends replace British cloth?',
            choices: ['They hold spinning bees to make their own thread and cloth', 'They sail to Britain to buy it', 'They become delegates', 'They buy cloth from the East India Company'],
            why: 'Hannah describes spinning bees, where they make homespun cloth.' },
          extension: { stem: 'Which pair of quotes, from two different speakers, best supports the analysis that the boycott was meant to put money pressure on Britain?',
            choices: ['Adams: "A boycott will hurt British merchants" AND Hannah: "If we stop buying British cloth, we must make our own!"', 'Galloway: "compromise is wiser than rebellion" AND Adams: "I defended British soldiers"', 'Scene: "brick sidewalks" AND Hannah: "spinning bees"', 'Scene: "Georgia did not send anyone" AND Galloway: "Plan of Union"'],
            why: 'Both quotes show colonists refusing to spend money on British goods.' } }
      ],
      journal: { prompt: 'What did the First Continental Congress decide, and why did delegates disagree?',
        keywords: ['intolerable', 'boycott', 'petition', 'delegate', 'congress', 'galloway', 'adams', 'unite', 'together', 'british goods', 'cloth'] },
      recall: [
        { q: 'What did the First Continental Congress agree to do?', choices: ['Boycott British goods', 'Declare independence', 'Build a navy'] },
        { q: 'What did colonists call the laws that punished Boston?', choices: ['The Intolerable Acts', 'The Tea Act', 'The Bill of Rights'] }
      ]
    },

    // ------------------------------------------------------------------ 3
    {
      id: 'lexington1775', name: 'Lexington and Concord', place: 'Lexington, Massachusetts', when: 'April 19, 1775', year: 1775,
      lat: 42.45, lon: -71.23, art: 'green',
      bridge: [
        'October 1774: the First Continental Congress ends.',
        'Militia companies across Massachusetts train and collect weapons.',
        'March 1775: in Virginia, Patrick Henry urges colonists to prepare for war.'
      ],
      landing: { town: 'Springfield, Massachusetts', date: '1775-04-13', miles: 85, lat: 42.10, lon: -72.59 },
      navigator: {
        stem: 'Your cart landed in Springfield, Massachusetts. Find Lexington, near Boston. Which direction will you travel?',
        choices: ['East', 'West', 'North', 'South'],
        why: 'Lexington is east of Springfield, close to the Atlantic coast.'
      },
      news: [
        'Militia companies are drilling on every town green you pass.',
        'News from Virginia: Patrick Henry gave a fiery speech last month. People later remembered it ending, "Give me liberty, or give me death!"',
        'Folks say the British general in Boston wants to seize the colonists’ gunpowder.'
      ],
      scene: [
        `Massachusetts feels like a powder keg. General Thomas Gage is the British commander in Boston. He learns that colonists are storing gunpowder and weapons in the town of Concord. On the night of April 18, about 700 British soldiers, called [[regulars]] or [[Redcoats]], march out of Boston to seize the supplies.`,
        `The colonists have a warning system. Two lanterns hang in the steeple of Boston's Old North Church. They signal that the soldiers are crossing the water by boat. Paul Revere and William Dawes ride through the night to warn the countryside. Local [[militia]] gather on Lexington's town green. Some are [[minutemen]], volunteers who promised to be ready at a minute's notice.`,
        `At dawn on April 19, about 77 militiamen face the British troops. A shot rings out. No one knows for sure who fired first. When the smoke clears, eight colonists are dead. Prince Estabrook, an enslaved Black man who served in the Lexington militia, is wounded.`,
        `The British march on to Concord. But thousands of militia arrive from nearby towns. At Concord's North Bridge, the militia fire back. The British retreat to Boston, and they are under fire the whole way. The American Revolutionary War has begun.`
      ],
      voices: [
        { id: 'parker', name: 'Captain John Parker', role: 'Commander of the Lexington militia', kind: 'real', account: 'firsthand',
          text: `When the British soldiers came, I ordered my men to scatter and not to fire. But the soldiers rushed at us furiously, fired upon us, and killed eight of our men. We gave them no reason to shoot.`,
          basis: 'Real person. Adapted and simplified from his sworn statement of April 25, 1775, which Massachusetts leaders quickly sent to Britain.' },
        { id: 'pitcairn', name: 'Major John Pitcairn', role: 'British officer, Royal Marines', kind: 'real', account: 'firsthand',
          text: `As we came to Lexington, I ordered my soldiers not to fire, only to surround the rebels and take their weapons. Then some of the rebels, hiding behind a wall, fired several shots at my soldiers. Only then did my men fire back, without my orders.`,
          basis: 'Real person. Adapted and simplified from his report to General Gage, April 1775.' },
        { id: 'historian', name: 'A Historian Today', role: 'From a book in your school library', kind: 'fictional', account: 'secondhand',
          text: `Historians have studied every account of Lexington. Most agree that neither side's commanders ordered the first shot. It may have come from a nervous soldier, a militiaman, or someone watching from nearby. Both sides had reasons to blame the other. The colonists wanted support from other colonies and from people in Britain. The British officers did not want to be blamed for starting a war.`,
          basis: 'A modern secondhand account written for this game. It summarizes what historians generally conclude.' }
      ],
      report: [
        { std: 'RI.5.6', ss: 'H3.5.1',
          core: { stem: 'Parker and Pitcairn describe the same moment. How are their accounts alike, and how are they different?',
            choices: ['Both say they ordered their men not to fire, but each blames the other side for the first shot', 'Both say the colonists fired first', 'Both say the British fired first', 'They agree on everything'],
            why: 'Both leaders say they told their side not to fire. Their points of view split on who shot first.' },
          scaffold: { stem: 'Which account is a SECONDHAND account of the battle?',
            choices: ["The historian's account", "Captain Parker's account", "Major Pitcairn's account", 'All of them are firsthand'],
            why: 'The historian was not there and is retelling what others reported.' },
          extension: { stem: "Massachusetts leaders quickly sent Parker's statement to Britain. What was most likely the PURPOSE of Parker's statement?",
            choices: ['To convince people, including people in Britain, that the British started the fighting and the colonists were innocent', 'To entertain children with an exciting story', 'To apologize to the British army', 'To explain how to load a musket'],
            why: 'The historian explains that colonists wanted support from people in Britain, so blaming the British served that purpose.' } },
        { std: 'RI.5.1', ss: 'SSS1.5.1',
          core: { stem: 'Which quote BEST supports the inference that no one can be completely sure who fired first?',
            choices: ['Historian: "It may have come from a nervous soldier, a militiaman, or someone watching from nearby."', 'Parker: "We gave them no reason to shoot."', 'Pitcairn: "some of the rebels, hiding behind a wall, fired several shots"', 'Scene: "eight colonists are dead."'],
            why: 'The historian lists several possibilities, which shows the answer is uncertain.' },
          scaffold: { stem: 'According to the scene, how did colonists signal that the British were coming by water?',
            choices: ['Two lanterns hung in the Old North Church steeple', 'Every bell in Concord rang', 'They sent a letter to King George', 'They fired a cannon'],
            why: 'The scene describes two lanterns in the steeple.' },
          extension: { stem: 'A classmate says, "The historian thinks both sides had reasons to blame each other." Which evidence best supports this analysis?',
            choices: ['"The colonists wanted support from other colonies and from people in Britain. The British officers did not want to be blamed for starting a war."', '"about 700 British soldiers, called regulars or Redcoats, march out of Boston"', '"Paul Revere and William Dawes ride through the night."', '"Eight colonists are dead."'],
            why: 'This evidence names a reason for each side.' } },
        { std: 'RI.5.9', ss: 'H1.5.1',
          core: { stem: 'You are writing a report about Lexington. Which sentence best COMBINES information from the scene and at least two accounts?',
            choices: ['On April 19, 1775, British troops and Lexington militia clashed; Parker and Pitcairn each blamed the other for the first shot, and historians still are not sure who fired it', 'Paul Revere rode a horse', 'Major Pitcairn was a Royal Marine', 'The colonists won the whole war at Lexington'],
            why: 'This sentence uses the scene, Parker, Pitcairn and the historian.' },
          scaffold: { stem: 'Which sentence uses information from BOTH the scene and Captain Parker?',
            choices: ['Eight colonists died at Lexington, and Captain Parker said his men had been ordered not to fire', 'Eight colonists died at Lexington', 'Pitcairn’s soldiers marched from Boston', 'Revere rode through the night'],
            why: 'The first part comes from the scene and the second part comes from Parker.' },
          extension: { stem: "How does the historian's presentation of Lexington differ from Parker's and Pitcairn's?",
            choices: ['The historian weighs all the evidence and admits uncertainty, while Parker and Pitcairn each present their own side as certain', 'The historian was at Lexington, and they were not', 'The historian says the British definitely fired first', 'There is no difference'],
            why: 'Eyewitnesses with a stake in the outcome sound certain. The historian compares sources and is careful.' } }
      ],
      journal: { prompt: 'What happened at Lexington and Concord? Why do the accounts disagree about who fired first?',
        keywords: ['militia', 'minutemen', 'redcoats', 'regulars', 'concord', 'gunpowder', 'first shot', 'revere', 'parker', 'pitcairn', 'blame', 'war'] },
      recall: [
        { q: 'Where were the first battles of the Revolutionary War fought?', choices: ['Lexington and Concord', 'Yorktown', 'Trenton'] },
        { q: 'Who were the minutemen?', choices: ['Militia volunteers ready to fight at short notice', 'British officers', 'Clockmakers in Boston'] }
      ]
    },

    // ------------------------------------------------------------------ 4
    {
      id: 'philadelphia1776', name: 'The Declaration of Independence', place: 'Philadelphia, Pennsylvania', when: 'July 1776', year: 1776,
      lat: 39.95, lon: -75.17, art: 'hall',
      bridge: [
        'May 1775: the Second Continental Congress meets and creates the Continental Army, led by George Washington.',
        'June 1775: the Battle of Bunker Hill. The British win, but more than 1,000 of their soldiers are killed or wounded.',
        'March 1776: cannons hauled from Fort Ticonderoga force the British to leave Boston.'
      ],
      landing: { town: 'Lancaster, Pennsylvania', date: '1776-06-27', miles: 65, lat: 40.04, lon: -76.31 },
      navigator: {
        stem: 'Your cart landed in Lancaster, Pennsylvania. Which direction is Philadelphia?',
        choices: ['East', 'West', 'North', 'South'],
        why: 'Philadelphia is almost straight east of Lancaster.'
      },
      news: [
        'A traveler says Henry Knox and his team dragged cannons about 300 miles from Fort Ticonderoga to Boston last winter. The British left Boston in March.',
        'A farmer reads Common Sense aloud to his neighbors by the road. Some nod. Some shake their heads.'
      ],
      store: { name: 'Market Street Shops', keeper: 'a Market Street shopkeeper', priceMult: 1.25,
        greeting: '"Prices are up, I’m afraid. The war makes goods scarce."',
        fact: 'War causes shortages. When there is less of something that people want, its price usually goes up.' },
      scene: [
        `A lot has changed in a year. After Lexington and Concord, the Second Continental Congress began meeting in Philadelphia in May 1775. It created the Continental Army. It chose George Washington of Virginia to lead it. Fighting spread, but many colonists still hoped to make peace with the king.`,
        `Then, in January 1776, Thomas Paine published a [[pamphlet]] called Common Sense. He used plain, powerful words. He said it made no sense for a small island to rule a huge continent across an ocean. He wrote that "there is something very absurd, in supposing a continent to be perpetually governed by an island." Tens of thousands of copies were sold. People argued about it everywhere.`,
        `In June, Congress asked a small group of delegates to write a statement. It would explain why the colonies should be independent. Thomas Jefferson, a 33-year-old delegate from Virginia, wrote most of it. On July 2, 1776, Congress voted for independence. On July 4, it approved the final words of the [[Declaration of Independence]].`,
        `The Declaration says that people have natural rights. It says that governments get their power from the [[consent of the governed]], which means the agreement of the people. It also lists the colonists' [[grievances]] (complaints) against King George III.`
      ],
      voices: [
        { id: 'declaration', name: 'The Declaration of Independence', role: 'Approved by Congress, July 4, 1776', kind: 'document', account: 'document',
          text: `Plain-language version: Some truths are so clear that they do not need to be proven. All people are created equal. They have rights that cannot be taken away. These include life, liberty, and the chance to seek happiness. People create governments to protect these rights. A government gets its fair power from the agreement of the people. Then the Declaration lists grievances against the king. He taxed the colonists without their consent. He cut off their trade. He kept armies among them in peacetime without the consent of their own lawmakers.`,
          quote: 'We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness. — That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed. ... For imposing Taxes on us without our Consent.',
          quoteSource: 'Declaration of Independence, July 4, 1776',
          basis: 'Real document. The quote is exact. The plain-language version is a simplified retelling.' },
        { id: 'abigail', name: 'Abigail Adams', role: 'Writer in Massachusetts, wife of John Adams', kind: 'real', account: 'document',
          text: `Plain-language version: While you write the new laws, John, remember women. Be more generous and fair to them than leaders in the past have been. Do not give husbands unlimited power over their wives.`,
          quote: 'I desire you would Remember the Ladies, and be more generous and favourable to them than your ancestors. Do not put such unlimited power into the hands of the Husbands.',
          quoteSource: 'Letter from Abigail Adams to John Adams, March 31, 1776',
          basis: 'Real person. The quote is her exact words, with her original spelling.' },
        { id: 'jem', name: 'Jem', role: 'A man who escaped slavery in Virginia', kind: 'fictional', account: 'firsthand',
          text: `The delegates say all men are created equal. Then why am I enslaved? Last November, the royal governor of Virginia, Lord Dunmore, promised freedom to enslaved people who escaped from Patriot owners and fought for the British. Many of us ran to British lines. For me, the king's side offers freedom, and the Patriot side offers chains. When I hear the word liberty, I want to know: liberty for whom?`,
          basis: "Fictional character based on the thousands of enslaved people who escaped to British lines after Dunmore's Proclamation of November 1775." }
      ],
      report: [
        { std: 'RI.5.8', ss: 'C1.5.2',
          core: { stem: 'The Declaration makes the point that the king treated the colonies unfairly. Which piece of evidence from the Declaration supports this point?',
            choices: ['"For imposing Taxes on us without our Consent"', '"We hold these truths to be self-evident"', '"Remember the Ladies"', 'Congress voted for independence on July 2'],
            why: 'Taxing people without their consent is one of the grievances, the evidence against the king.' },
          scaffold: { stem: 'According to the Declaration, why do people create governments?',
            choices: ['To protect people’s rights', 'To collect taxes for the king', 'To build armies', 'To choose a new king'],
            why: '"To secure these rights, Governments are instituted among Men."' },
          extension: { stem: "The Declaration's argument goes in steps. Which choice traces the argument in the right order?",
            choices: ['People have natural rights, then governments exist to protect them, then the king violated those rights, so the colonies may form a new government', 'The king is kind, so taxes are fair, so the colonies should stay loyal', 'Independence is declared, then people get rights, then grievances are invented', 'The grievances are listed, then the king agrees, then there is peace'],
            why: 'The argument starts with a principle, shows how the king broke it, and ends with independence.' } },
        { std: 'RI.5.4', ss: 'C1.5.2',
          core: { stem: '"We hold these truths to be self-evident." Using the plain-language version, what does self-evident mean?',
            choices: ['So clearly true that it does not need to be proven', 'Secret and hidden', 'Written by oneself', 'Proven false'],
            why: 'The plain-language version says "so clear that they do not need to be proven."' },
          scaffold: { stem: 'The scene says the Declaration lists the colonists’ grievances. What are grievances?',
            choices: ['Complaints about unfair treatment', 'Gifts for the king', 'Soldiers in the army', 'Holidays'],
            why: 'The scene defines grievances as complaints.' },
          extension: { stem: 'Thomas Paine called British rule over America "absurd." Why might Paine choose absurd instead of a milder word like unwise?',
            choices: ['Absurd makes the idea sound ridiculous, so readers feel silly staying loyal', 'Absurd is a legal word for taxes', 'Absurd and unwise have the same strength', 'Absurd means very smart'],
            why: 'Strong words carry strong feelings. Paine wanted readers to laugh at the idea of an island ruling a continent.' } },
        { std: 'RI.5.2', ss: 'H2.5.2',
          core: { stem: 'Which choice states TWO main ideas of the scene?',
            choices: ['Common Sense pushed many colonists toward independence, and in July 1776 Congress voted for and approved the Declaration of Independence', 'Jefferson was 33, and Paine wrote a pamphlet', 'Washington was from Virginia, and Congress met in May', 'Philadelphia was hot, and the delegates were tired'],
            why: 'The first choice gives the big points. The others are details or are not in the text.' },
          scaffold: { stem: "What is the main idea of Abigail Adams's letter?",
            choices: ['The new government should treat women more fairly', 'Women should stay out of politics', 'The king should be kinder to husbands', 'John should come home soon'],
            why: 'She asks John to "Remember the Ladies" in the new laws.' },
          extension: { stem: "Which is the best objective summary of Jem's account?",
            choices: ['Jem points out that the Declaration says all men are equal while he is enslaved, and he explains that the British promised freedom to enslaved people who joined them', 'Jem is right, and the delegates are terrible people', 'Jem loves the king more than anyone', 'Jem is a Patriot soldier who supports the Declaration'],
            why: 'An objective summary reports what Jem says without adding the reader’s own judgments.' } }
      ],
      journal: { prompt: 'What does the Declaration of Independence say, and who was left out of its promise?',
        keywords: ['declaration', 'rights', 'equal', 'independence', 'jefferson', 'grievances', 'consent', 'common sense', 'paine', 'abigail', 'women', 'dunmore', 'enslaved', 'liberty'] },
      recall: [
        { q: 'Who wrote most of the Declaration of Independence?', choices: ['Thomas Jefferson', 'George Washington', 'Thomas Paine'] },
        { q: 'Which pamphlet convinced many colonists to support independence?', choices: ['Common Sense', 'The Boston Gazette', "Poor Richard's Almanack"] }
      ]
    },

    // ------------------------------------------------------------------ 5
    {
      id: 'trenton1776', name: 'Crossing the Delaware', place: 'Trenton, New Jersey', when: 'December 26, 1776', year: 1776,
      lat: 40.22, lon: -74.76, art: 'river',
      bridge: [
        'Summer 1776: a huge British army lands near New York City.',
        'August 1776: Washington’s army loses the Battle of Long Island.',
        'Fall 1776: the British capture New York City and chase Washington’s army across New Jersey into Pennsylvania.'
      ],
      landing: { town: 'Philadelphia, Pennsylvania', date: '1776-12-17', miles: 40, lat: 39.95, lon: -75.17,
        river: { mile: 31, name: "Delaware River at McConkey's Ferry", special: 'delaware1776', depth: [6, 8], width: 800, fordable: false, ferry: 0 } },
      navigator: {
        stem: 'Your cart landed in Philadelphia. Find Trenton, New Jersey. Which direction will you travel?',
        choices: ['Northeast', 'Southwest', 'Southeast', 'West'],
        why: 'Trenton is north and east of Philadelphia, up the Delaware River.'
      },
      news: [
        'Congress has fled Philadelphia for Baltimore, afraid the British will attack the city.',
        'Soldiers say Thomas Paine has written a new essay called The American Crisis, and officers are reading it aloud to the troops.'
      ],
      scene: [
        `The winter of 1776 is a dark time for the Patriots. Since summer, Washington's army has lost battle after battle. The British captured New York City. Then they chased the Continental Army across New Jersey. Many soldiers' [[enlistments]], the time they agreed to serve, end on December 31. Then they plan to go home. Washington wrote to his brother, "I think the game is pretty near up."`,
        `Washington makes a daring plan. On Christmas night, his army will cross the icy Delaware River. They will surprise the [[Hessian]] soldiers camped in Trenton, New Jersey. Hessians were German soldiers hired by the British.`,
        `The crossing is miserable. Sleet and snow blow across the river. Big, flat-bottomed [[Durham boats]] carry soldiers, horses and cannons through floating chunks of ice. The army falls hours behind schedule.`,
        `Early on the morning of December 26, the Americans march into Trenton and attack. The battle is over in about an hour. The Americans capture about 900 Hessians, and very few Americans are hurt. It is a small battle, but it gives the Patriots new hope. Many soldiers agree to stay in the army.`
      ],
      voices: [
        { id: 'paine', name: 'Thomas Paine', role: 'Writer, The American Crisis', kind: 'real', account: 'document',
          text: `Plain-language version: These are hard times that test people's courage. Soldiers and patriots who only show up when things are easy will quit now. But anyone who stays and serves deserves everyone's thanks. The harder the fight, the greater the victory will feel.`,
          quote: 'These are the times that try men’s souls. The summer soldier and the sunshine patriot will, in this crisis, shrink from the service of their country; but he that stands by it now, deserves the love and thanks of man and woman. ... the harder the conflict, the more glorious the triumph.',
          quoteSource: 'Thomas Paine, The American Crisis, December 1776',
          basis: 'Real person. The quote is his exact words. Washington had it read to his troops.' },
        { id: 'elijah', name: 'Elijah Cole', role: '16-year-old Continental soldier from Massachusetts', kind: 'fictional', account: 'firsthand',
          text: `My shoes are worn through, so I wrapped my feet in rags. Before we marched, an officer read Mr. Paine's words to us. Something inside me stood up straighter. We crossed the river in the dark, pushing ice away with poles, then marched nine miles through sleet. Two men in our army froze to death on the road. When we reached Trenton, the Hessians were taken by surprise. My enlistment ends on December 31, but after this, I'm thinking of signing up again.`,
          basis: "Fictional character based on soldiers' memoirs of the Trenton campaign." },
        { id: 'johann', name: 'Johann Becker', role: 'Hessian corporal from Germany', kind: 'fictional', account: 'firsthand',
          text: `I come from Hesse, in Germany. My prince rents soldiers to the British king, so here I am, far from home, fighting in a war that is not my own. We celebrated Christmas. The storm was so bad that our officers did not think anyone would attack. Then, at dawn, the Americans were everywhere. Now I am a prisoner. To my surprise, the Americans gave us food.`,
          basis: 'Fictional character based on records of Hessian soldiers. Several thousand Hessians later stayed in America after the war.' }
      ],
      report: [
        { std: 'RI.5.3', ss: 'H2.5.1',
          core: { stem: "How are Thomas Paine's writing and the soldiers' choices related, according to the scene and Elijah's account?",
            choices: ["Paine's words were read to the soldiers and gave them courage to keep fighting at a hopeless time", 'Paine led the soldiers across the river', "Paine's words convinced the soldiers to go home", 'Paine was a Hessian officer'],
            why: 'Elijah says that after hearing Paine, "something inside me stood up straighter."' },
          scaffold: { stem: 'Why did Washington attack on Christmas night?',
            choices: ['To surprise the Hessians before many soldiers’ enlistments ended', 'Because the weather was sunny', 'Because the British asked him to', 'To celebrate Christmas with the Hessians'],
            why: 'The scene explains that the army was about to shrink and that a surprise attack could change things.' },
          extension: { stem: 'How does the scene help readers understand why Trenton mattered, even though it was a small battle?',
            choices: ['It first describes months of defeats and soldiers about to leave, so the victory stands out as a turning point for hope', 'It lists the name of every soldier', 'It explains Hessian recipes', 'It describes the battle as very long'],
            why: 'The author sets up the bad news first, which makes the victory feel bigger.' } },
        { std: 'RI.5.1', ss: 'H3.5.1',
          core: { stem: 'Which quote best supports the inference that Johann did not choose this war for himself?',
            choices: ['"My prince rents soldiers to the British king, so here I am, far from home, fighting in a war that is not my own."', '"We celebrated Christmas."', '"To my surprise, the Americans gave us food."', '"the harder the conflict, the more glorious the triumph."'],
            why: 'Johann says his prince rented him out and calls it "a war that is not my own."' },
          scaffold: { stem: 'According to the scene, who were the Hessians?',
            choices: ['German soldiers hired by the British', 'Patriot farmers from New Jersey', 'French sailors', 'Members of Congress'],
            why: 'The scene says Hessians were German soldiers hired by the British.' },
          extension: { stem: 'Paine warns about the "summer soldier." Which evidence from Elijah’s account best shows that Elijah is NOT a summer soldier?',
            choices: ['"after this, I’m thinking of signing up again."', '"My shoes are worn through."', '"the Hessians were taken by surprise."', '"marched nine miles through sleet."'],
            why: 'A summer soldier quits when times are hard. Elijah plans to stay.' } },
        { std: 'RI.5.4', ss: 'H1.5.2',
          core: { stem: 'Paine writes, "These are the times that try men’s souls." In this sentence, what does try mean?',
            choices: ['To test or strain very hard', 'To attempt to do something', 'To taste food', 'To put on trial in a court'],
            why: 'Try has several meanings. Here the context is hardship, so it means to test or strain.' },
          scaffold: { stem: 'The scene says soldiers’ enlistments were ending. What is an enlistment?',
            choices: ['The time a soldier agreed to serve in the army', 'A list of groceries', 'A type of boat', 'A Hessian holiday'],
            why: 'The scene explains it right after the word: "the time they agreed to serve."' },
          extension: { stem: 'Paine writes, "the harder the conflict, the more glorious the triumph." What does he mean?',
            choices: ['A victory feels greater when it is won through great difficulty', 'People should avoid fighting', 'Soldiers should give up in winter', 'A triumph is a hard conflict'],
            why: 'Paine compares the size of the struggle to the size of the reward.' } }
      ],
      journal: { prompt: 'What happened at Trenton, and why did it give the Patriots hope?',
        keywords: ['delaware', 'washington', 'hessian', 'trenton', 'crossing', 'surprise', 'paine', 'crisis', 'hope', 'enlistment', 'christmas', 'ice'] },
      recall: [
        { q: 'Whom did Washington surprise at Trenton?', choices: ['Hessian soldiers', 'French sailors', 'Oneida warriors'] },
        { q: 'Which river did Washington’s army cross on Christmas night, 1776?', choices: ['The Delaware River', 'The Hudson River', 'The James River'] }
      ]
    },

    // ------------------------------------------------------------------ 6
    {
      id: 'saratoga1777', name: 'The Turning Point at Saratoga', place: 'Saratoga, New York', when: 'October 1777', year: 1777,
      lat: 43.0, lon: -73.64, art: 'battlefield',
      bridge: [
        'January 1777: Washington wins again at Princeton.',
        'Summer 1777: British General Howe sails to capture Philadelphia.',
        'At the same time, British General Burgoyne marches south from Canada into New York.'
      ],
      landing: { town: 'Oriskany, New York (Oneida homelands)', date: '1777-09-18', miles: 110, lat: 43.16, lon: -75.33,
        river: { mile: 80, name: 'Mohawk River near Schenectady', depth: [2, 4.5], width: 500, fordable: true, ferry: 3 } },
      navigator: {
        stem: 'Your cart landed near Oriskany, in the Mohawk River valley. Find Saratoga. Which direction will you travel?',
        choices: ['East', 'West', 'North', 'South'],
        why: 'Saratoga is east of Oriskany, near the Hudson River.'
      },
      news: [
        'Word arrives: the British have captured Philadelphia, the American capital.',
        'People say Patriot militia won a battle near Bennington in August and took supplies that Burgoyne badly needed.',
        'You pass Oneida villages. An Oneida family shares roasted corn and tells you this land has been their home for countless generations.'
      ],
      store: { name: "Army Sutler's Wagon", keeper: 'a sutler (a merchant who follows an army)', priceMult: 1.6,
        greeting: '"Supplies are scarce out here, friends. Prices are what they are."',
        fact: 'Congress printed paper money called Continental dollars to pay for the war. It printed so much that the money lost most of its value. People started saying something useless was "not worth a Continental."' },
      scene: [
        `In 1777, the British have a big plan: split the colonies in two. General John Burgoyne will march south from Canada to Albany, New York. If the British control the Hudson River valley, New England will be cut off from the other colonies.`,
        `But Burgoyne's march goes badly. His army moves slowly through thick forests. Americans chop down trees to block the roads. Help from other British armies never arrives. In September and October, American forces battle Burgoyne's army near Saratoga. General Horatio Gates leads them, with fighters under Benedict Arnold and Daniel Morgan. Soon Burgoyne's army is surrounded and short on food. On October 17, 1777, Burgoyne [[surrenders]] his whole army of about 6,000 soldiers.`,
        `The victory at Saratoga is a [[turning point]]. It convinces France that the Americans can win. In February 1778, France signs a treaty of [[alliance]]. France sends money, soldiers and a navy to help.`,
        `The war also divides the [[Haudenosaunee]] [[Confederacy]], also called the Six Nations. The six nations are the Mohawk, Oneida, Onondaga, Cayuga, Seneca and Tuscarora. Their alliance had kept peace among them for centuries. Most Haudenosaunee nations sided with the British. They hoped Britain would protect their lands from colonists moving west. The Oneida and many Tuscarora sided with the Americans. In August 1777, at the Battle of Oriskany, Haudenosaunee people fought on both sides.`
      ],
      voices: [
        { id: 'tyonajanegen', name: 'Tyonajanegen', role: 'Oneida woman who fought at the Battle of Oriskany', kind: 'real', account: 'firsthand',
          text: `At Oriskany, I rode into battle beside my husband, Han Yerry. When his hand was wounded, I loaded his gun so he could keep fighting. Our nation chose to stand with the Americans. We have lived near the colonists for years, and many of us listened to the missionary Samuel Kirkland. But it breaks my heart that at Oriskany, we faced our Mohawk and Seneca relatives on the other side. This war is tearing apart a Confederacy that kept peace among our nations for centuries.`,
          basis: 'Real person, honored by the Oneida Indian Nation. Her words here are imagined, based on historical accounts of her life.' },
        { id: 'brant', name: 'Thayendanegea (Joseph Brant)', role: 'Mohawk leader allied with Britain', kind: 'real', account: 'firsthand',
          text: `I have traveled to London and met King George III. The king's officials promised to respect our lands. The [[Proclamation of 1763]] tried to stop colonists from settling west of the mountains. But many colonists ignore that line. They want our land. If the colonists win this war, who will stop them from taking more? That is why the Mohawk stand with the British. It is not because we love the king. It is because we must protect our homes and our people.`,
          basis: 'Real person. His words here are adapted and imagined, based on his speeches and letters.' },
        { id: 'franklin1777', name: 'Benjamin Franklin', role: 'American representative in Paris, France', kind: 'real', account: 'firsthand',
          text: `Congress sent me to France to ask for help. The French love my fur cap, but their king's ministers have been careful. They secretly sent us some gunpowder and supplies, but they would not openly join the war until they believed we could win. When the news of Saratoga reached Paris in December, everything changed. Now France is ready to sign a treaty of alliance with the United States.`,
          basis: 'Real person. These words are adapted and simplified. They are not his exact words.' }
      ],
      report: [
        { std: 'RI.5.6', ss: 'G2.5.1',
          core: { stem: 'Tyonajanegen and Thayendanegea (Joseph Brant) are both Haudenosaunee. How do their points of view differ?',
            choices: ["Tyonajanegen's Oneida Nation supported the Americans, while Brant's Mohawk sided with the British to protect their lands from colonists", 'Both of them supported the British', 'Both of them supported the Americans', 'Neither of them cared about the war'],
            why: 'They belong to the same Confederacy but chose different sides for different reasons.' },
          scaffold: { stem: "What does Tyonajanegen's firsthand account tell you that the scene does NOT?",
            choices: ['How it felt to fight against her own relatives, and how she helped her husband in battle', 'The date of the French treaty', 'How many soldiers Burgoyne had', 'Where Canada is'],
            why: 'Firsthand accounts add personal details and feelings that a secondhand summary leaves out.' },
          extension: { stem: 'How does Brant convey his point of view?',
            choices: ['He asks a question, "who will stop them from taking more?", to show his fear for Mohawk land', 'He lists the dates of battles', 'He describes his clothing', 'He tells a joke about the king'],
            why: 'His question makes listeners imagine what would happen if the colonists won.' } },
        { std: 'RI.5.3', ss: 'H1.5.1',
          core: { stem: 'How did the Battle of Saratoga lead to help from France?',
            choices: ['The American victory convinced France that the Americans could win, so France signed an alliance in 1778', 'France lost at Saratoga and had to pay the Americans', 'Burgoyne was a French general', 'France had already joined the war before Saratoga'],
            why: 'Saratoga (cause) led to the French alliance (effect).' },
          scaffold: { stem: "Why did Burgoyne's army surrender?",
            choices: ['It was surrounded and short on food, and help never came', 'It won the battle and went home', 'The king ordered it home for the winter', 'It ran out of tea'],
            why: 'The scene describes a slow march, missing help and no food.' },
          extension: { stem: 'How does Franklin’s account add to the scene’s explanation that Saratoga was a "turning point"?',
            choices: ["It shows from France's side why the news of Saratoga changed France's decision", 'It describes the fighting near Saratoga', 'It explains Haudenosaunee history', 'It says that Saratoga did not matter'],
            why: 'The scene says what happened; Franklin explains why it changed France’s mind.' } },
        { std: 'RI.5.9', ss: 'G3.5.1',
          core: { stem: 'Which statement combines information from the scene AND both Haudenosaunee accounts?',
            choices: ['The Revolution split the Haudenosaunee Confederacy: the Mohawk and most nations sided with Britain to protect their lands, the Oneida sided with the Americans, and relatives fought each other at Oriskany', 'The Mohawk lived in New York', 'Burgoyne surrendered on October 17', 'Franklin wore a fur cap in France'],
            why: 'This statement uses the scene, Tyonajanegen and Brant together.' },
          scaffold: { stem: 'Using the scene and Brant’s account, why did many Haudenosaunee nations side with Britain?',
            choices: ['They hoped Britain would protect their lands from colonists moving west', 'They wanted to move to London', 'Britain paid them in tea', 'They did not know there was a war'],
            why: 'Both texts connect the choice to protecting land.' },
          extension: { stem: "How does the scene's presentation of the war differ from Tyonajanegen's?",
            choices: ['The scene focuses on armies and alliances, while Tyonajanegen focuses on how the war divided families and nations', 'Both focus only on France', 'The scene is firsthand and hers is secondhand', 'They tell exactly the same story'],
            why: 'Different authors choose different things to focus on.' } }
      ],
      journal: { prompt: 'Why was Saratoga a turning point? How did the war affect the Haudenosaunee?',
        keywords: ['saratoga', 'burgoyne', 'turning point', 'france', 'french', 'alliance', 'haudenosaunee', 'oneida', 'mohawk', 'brant', 'land', 'oriskany'] },
      recall: [
        { q: 'Why was the Battle of Saratoga a turning point?', choices: ['It convinced France to join the war', 'It ended the war', 'The British captured Boston'] },
        { q: 'Which Haudenosaunee nation sided with the Americans?', choices: ['The Oneida', 'The Mohawk', 'The Seneca'] }
      ]
    },

    // ------------------------------------------------------------------ 7
    {
      id: 'valleyforge1777', name: 'Winter at Valley Forge', place: 'Valley Forge, Pennsylvania', when: 'Winter 1777–1778', year: 1777,
      lat: 40.10, lon: -75.44, art: 'camp',
      bridge: [
        'September 1777: Washington’s army loses at Brandywine, and the British capture Philadelphia.',
        'October 1777: Burgoyne surrenders at Saratoga.',
        'November 1777: Congress approves the Articles of Confederation, a plan for a national government.'
      ],
      landing: { town: 'York, Pennsylvania', date: '1777-12-08', miles: 70, lat: 39.96, lon: -76.73,
        river: { mile: 12, name: "Susquehanna River at Wright's Ferry", depth: [4, 6.5], width: 5000, fordable: false, ferry: 4 } },
      navigator: {
        stem: 'Congress has fled to York, Pennsylvania, because the British captured Philadelphia. Find Valley Forge. Which direction will you travel?',
        choices: ['East', 'West', 'North', 'South'],
        why: 'Valley Forge is east of York, about 20 miles from Philadelphia.'
      },
      news: [
        'Congress is meeting in York now. Delegates are arguing about how to feed and pay the army.',
        'You pass soldiers walking with rags tied around their feet.'
      ],
      scene: [
        `In September 1777, the British captured Philadelphia, the American capital. Congress escaped west, first to Lancaster and then to York. The British stay warm in Philadelphia for the winter. Meanwhile, Washington's army of about 12,000 soldiers marches to Valley Forge, about 20 miles away. They arrive on December 19, 1777.`,
        `The soldiers build more than 1,000 log huts. Food, shoes, blankets and clothing are in short supply. Disease is the biggest danger. Illnesses like typhus, smallpox and dysentery spread through the crowded camp. Nearly 2,000 soldiers die during the winter and spring, mostly from disease.`,
        `But Valley Forge is also where the army grows stronger. In February 1778, a Prussian officer named Baron Friedrich von Steuben arrives. He teaches the soldiers to [[drill]]: to march, move and fight together like a professional army. Washington also orders new soldiers to be [[inoculated]] against smallpox.`,
        `In the spring comes great news: France has joined the war on the American side. When the army leaves Valley Forge in June 1778, it is tougher and better trained than ever.`
      ],
      voices: [
        { id: 'martin', name: 'Joseph Plumb Martin', role: 'Private from Connecticut, joined the army at 15', kind: 'real', account: 'firsthand',
          text: `This winter, we are starving. For Thanksgiving, Congress ordered us a special meal. Each of us got half a gill of rice (about two spoonfuls) and a tablespoon of vinegar! Many of us have no shoes. You could track our army by the blood our bare feet left on the frozen ground. Still, we stay. We built our own huts, and we keep going.`,
          basis: 'Real person. Adapted and simplified from his memoir, published in 1830, more than 50 years after Valley Forge.' },
        { id: 'polly', name: 'Polly Cooper', role: 'Oneida woman', kind: 'real', account: 'firsthand',
          text: `When we heard the American soldiers were starving, Oneida men and I carried white corn hundreds of miles to Valley Forge. The soldiers tried to eat the corn raw, which made them sick, so I showed them how to cook it properly. They wanted to pay me, but I said no. Helping friends in need is what we do.`,
          basis: "Real person in Oneida Nation history. This story is passed down by the Oneida Nation, which still keeps a shawl said to be Martha Washington's thank-you gift. Her words here are imagined.",
          after: 'Few written records from the time mention the Oneida corn. Much of what we know comes from Oneida oral history, the history a nation passes down by telling it.' },
        { id: 'steuben', name: 'Baron Friedrich von Steuben', role: 'Prussian officer, the army’s drillmaster', kind: 'real', account: 'firsthand',
          text: `When I arrived, I saw brave soldiers, but each group marched and fought in its own way. So I trained one company of about 100 men myself, and then they taught the others. I speak little English, so I sometimes shout in German and French, and my helper translates! American soldiers are different from European soldiers. In Europe, you tell a soldier "Do this," and he does it. Here, I must explain the reason why, and then he does it.`,
          basis: 'Real person. These words are adapted and simplified, based on a well-known letter he wrote to a friend in Europe. They are not his exact words.' }
      ],
      report: [
        { std: 'RI.5.1', ss: 'H2.5.1',
          core: { stem: 'Which quote BEST supports the inference that the soldiers at Valley Forge were extremely determined?',
            choices: ['Martin: "Still, we stay. We built our own huts, and we keep going."', 'Martin: "Each of us got half a gill of rice... and a tablespoon of vinegar!"', 'Scene: "Congress escaped west, first to Lancaster and then to York."', 'Von Steuben: "I sometimes shout in German and French."'],
            why: 'Staying and working through terrible conditions shows determination. The rice quote shows hunger, not determination.' },
          scaffold: { stem: 'According to the scene, what was the biggest danger to soldiers at Valley Forge?',
            choices: ['Disease', 'British attacks every day', 'Wild animals', 'Floods'],
            why: 'The scene says disease was the biggest danger.' },
          extension: { stem: 'A classmate claims, "Even Congress did not take good care of the soldiers." Which evidence best supports this analysis?',
            choices: ['Martin says Congress’s special Thanksgiving meal was only "half a gill of rice... and a tablespoon of vinegar"', 'Von Steuben trained about 100 men', 'Polly Cooper refused to be paid', 'The army left Valley Forge in June 1778'],
            why: 'If even a "special" meal from Congress was that small, the soldiers were not well supplied.' } },
        { std: 'RI.5.2', ss: 'H1.5.2',
          core: { stem: 'Which choice states TWO main ideas of the Valley Forge scene?',
            choices: ['The army suffered from hunger, cold and disease, and the army also grew stronger through training and good news from France', 'Congress went to York, and the huts were made of logs', 'Von Steuben came from Prussia, and the army left in June', 'The British were warm, and Washington had a horse'],
            why: 'The scene is about suffering AND growing stronger. The other choices are details.' },
          scaffold: { stem: "What is the main idea of Polly Cooper's account?",
            choices: ['The Oneida helped starving American soldiers by bringing corn and showing them how to cook it', 'Corn should always be eaten raw', 'Polly Cooper wanted to be paid', 'Martha Washington made shawls'],
            why: 'Her whole account is about bringing help to the soldiers.' },
          extension: { stem: "Which is the best summary of von Steuben's account, without opinions?",
            choices: ['Von Steuben trained a model company that taught the others, worked through a translator, and found he had to explain reasons to American soldiers', 'Von Steuben was the greatest hero of the whole war', 'American soldiers were lazy and needed shouting', 'Von Steuben spoke perfect English'],
            why: 'An objective summary keeps to his main points without praising or judging.' } },
        { std: 'RI.5.8', ss: 'H2.5.2',
          core: { stem: 'Von Steuben makes the point that American soldiers are different from European soldiers. What evidence does he give?',
            choices: ['In Europe soldiers obey without question, but Americans want to know the reason why', 'He arrived in February 1778', 'He trained about 100 men', 'He shouts in German'],
            why: 'He compares how each kind of soldier responds to an order.' },
          scaffold: { stem: 'The scene says the army grew stronger at Valley Forge. Which reason supports that point?',
            choices: ['Von Steuben taught the soldiers to march and fight together', 'Nearly 2,000 soldiers died', 'Congress fled to York', 'Soldiers had no shoes'],
            why: 'Training made the army stronger. The other choices are hardships.' },
          extension: { stem: 'The scene claims the army left Valley Forge "tougher and better trained than ever." Which TWO details support this claim?',
            choices: ["Von Steuben's drill training and the smallpox inoculations", 'The log huts and the warm British in Philadelphia', 'Congress moving to Lancaster and then York', 'The shortages of shoes and blankets'],
            why: 'Training and protection from disease both strengthened the army.' } }
      ],
      journal: { prompt: 'Describe life at Valley Forge. How did the army survive and grow stronger?',
        keywords: ['valley forge', 'winter', 'huts', 'disease', 'hunger', 'starving', 'steuben', 'training', 'drill', 'oneida', 'polly cooper', 'corn', 'smallpox', 'shoes'] },
      recall: [
        { q: 'Who trained the Continental Army at Valley Forge?', choices: ['Baron von Steuben', 'General Burgoyne', 'Lord Cornwallis'] },
        { q: 'What was the biggest danger to soldiers at Valley Forge?', choices: ['Disease', 'Sharks', 'Earthquakes'] }
      ]
    },

    // ------------------------------------------------------------------ 8
    {
      id: 'yorktown1781', name: 'Victory at Yorktown', place: 'Yorktown, Virginia', when: 'October 1781', year: 1781,
      lat: 37.24, lon: -76.51, art: 'siege',
      bridge: [
        '1778: France joins the war. The fighting moves south.',
        '1778–1780: the British capture Savannah, Georgia, and Charleston, South Carolina.',
        '1780: American general Benedict Arnold secretly switches to the British side.',
        '1781: in Massachusetts, Elizabeth Freeman, an enslaved woman, sues for her freedom in court, and wins.'
      ],
      landing: { town: 'Richmond, Virginia', date: '1781-09-18', miles: 75, lat: 37.54, lon: -77.44,
        river: { mile: 35, name: 'Chickahominy River', depth: [2, 4], width: 300, fordable: true, ferry: 2 } },
      navigator: {
        stem: 'Yorktown sits on a peninsula. Look at the map. Which two rivers is it between?',
        choices: ['The York River and the James River', 'The Hudson River and the Delaware River', 'The Mohawk River and the Hudson River', 'The Potomac River and the Susquehanna River'],
        why: 'Yorktown is on the York River. The James River flows to the south of the peninsula.'
      },
      news: [
        'People say a French fleet beat the British navy near the mouth of the Chesapeake Bay in early September.',
        'A farmer says Benedict Arnold, the American hero of Saratoga who switched sides, raided Richmond with British troops in January.'
      ],
      store: { name: 'Camp Market', keeper: 'a Virginia farmer selling to the armies', priceMult: 1.4,
        greeting: '"The French army pays in silver coins, so we farmers are glad to sell to them. Paper money? Not so much."',
        fact: 'Silver and gold coins held their value during the war, but paper Continental dollars lost value. Farmers and merchants often wanted coins instead of paper money.' },
      scene: [
        `After Saratoga, much of the fighting moved south. British General Charles Cornwallis won battles in the Carolinas. Then he marched into Virginia. In the summer of 1781, he set up camp at Yorktown, a tobacco port on the York River. He waited there for British ships to bring supplies, or to carry his army away.`,
        `Washington sees a chance. He and the French General Rochambeau march their armies hundreds of miles, from New York down to Virginia. Meanwhile, a French fleet under Admiral de Grasse defeats British ships at the mouth of the Chesapeake Bay. Now Cornwallis is trapped. American and French armies surround him on land. French ships block him at sea.`,
        `For about three weeks, the allies dig trenches closer and closer. They fire cannons day and night. This is called a [[siege]]. On October 19, 1781, Cornwallis surrenders more than 7,000 soldiers.`,
        `Fighting does not end right away, but Britain's leaders realize they cannot win. In 1783, the [[Treaty]] of Paris officially recognizes the United States as an independent nation.`
      ],
      voices: [
        { id: 'armistead', name: 'James Armistead', role: 'Enslaved man from Virginia who served as a spy', kind: 'real', account: 'firsthand',
          text: `With my enslaver's permission, I volunteered to serve the Marquis de Lafayette. He is a young French general fighting for the Americans. Lafayette sent me into General Cornwallis's camp. I pretended to be a runaway who wanted to help the British. The British even asked me to spy on the Americans! But I brought the real information to Lafayette. I told him about Cornwallis's soldiers and his plans.`,
          basis: "Real person. His words here are imagined, based on historical records, including a 1784 letter in which Lafayette praised his service.",
          after: 'After the war, Virginia freed some enslaved men who had fought as soldiers, but not spies like James. He had to ask the Virginia legislature for his freedom, with Lafayette’s letter to support him. He was finally freed in 1787 and took the name James Armistead Lafayette.' },
        { id: 'moreau', name: 'Lieutenant Jean-Baptiste Moreau', role: 'French army officer', kind: 'fictional', account: 'firsthand',
          text: `Our French soldiers, ships and money helped make this victory possible. Admiral de Grasse's fleet blocked the British ships, and our engineers know how to run a siege. I am also surprised by the American army. I see many Black soldiers, especially in the regiment from Rhode Island, and they are among the best-trained soldiers here. Today I am proud. We helped a new nation win its freedom.`,
          basis: 'Fictional character based on the diaries of French officers at Yorktown, who wrote about Black soldiers in the 1st Rhode Island Regiment.' },
        { id: 'cornwallis', name: 'General Charles Cornwallis', role: 'British commander at Yorktown', kind: 'real', account: 'firsthand',
          text: `Plain-language version: I am ashamed to report that I have been forced to give up Yorktown and Gloucester and surrender my army as prisoners of war to the joined armies of America and France. The French fleet blocked the help I was promised. Enemy cannons pounded us day and night.`,
          quote: 'I have the mortification to inform your Excellency that I have been forced to give up the posts of York and Gloucester, and to surrender the troops under my command, by capitulation on the 19th instant, as prisoners of war to the combined forces of America and France.',
          quoteSource: 'Letter from Cornwallis to General Henry Clinton, October 20, 1781',
          basis: 'Real person. The quote is from his letter. The plain-language version is simplified.' }
      ],
      report: [
        { std: 'RI.5.3', ss: 'H1.5.1',
          core: { stem: "How are the French navy's victory at sea and Cornwallis's surrender related?",
            choices: ['French ships blocked British ships from reaching Yorktown, so Cornwallis was trapped and had to surrender', 'French ships brought supplies to Cornwallis', 'The French navy surrendered first', 'They are not related'],
            why: 'With no escape by sea, Cornwallis was trapped.' },
          scaffold: { stem: 'Why did Cornwallis camp at Yorktown?',
            choices: ['To wait for British ships to bring supplies or carry his army away', 'To grow tobacco', 'To meet Washington for dinner', 'Because Yorktown was the capital'],
            why: 'The scene explains he was waiting for British ships.' },
          extension: { stem: 'How does Cornwallis’s letter support the scene’s point that Yorktown was won by allies working together?',
            choices: ['He says he surrendered "to the combined forces of America and France," showing that both countries were needed', 'He says only Americans fought', 'He says the British won', 'He never mentions his enemy'],
            why: 'Even the losing general names both countries.' } },
        { std: 'RI.5.9', ss: 'H2.5.2',
          core: { stem: "Which sentence combines information from James Armistead's AND the French officer's accounts to explain how Black Americans contributed at Yorktown?",
            choices: ['James Armistead spied on Cornwallis for Lafayette, and Black soldiers, like those in the Rhode Island Regiment, fought in the siege', 'The French had a large navy', 'Cornwallis wrote a letter to Clinton', 'Yorktown is on the York River'],
            why: 'This sentence joins details from both accounts.' },
          scaffold: { stem: 'Using the scene and Armistead’s account, how did Lafayette learn about Cornwallis’s plans?',
            choices: ['James Armistead pretended to spy for the British but brought real information to Lafayette', 'Cornwallis told him', 'He read it in a newspaper', 'De Grasse’s ships spotted them'],
            why: 'Armistead was a double agent.' },
          extension: { stem: 'How does Cornwallis present the surrender compared with how the scene presents it?',
            choices: ['Cornwallis focuses on his shame and on being trapped, while the scene explains the larger plan that trapped him and what it meant for the war', 'Both celebrate a British victory', 'The scene is firsthand and Cornwallis is secondhand', 'They are exactly the same'],
            why: 'Cornwallis tells his own side; the scene shows the bigger picture.' } },
        { std: 'RI.5.6', ss: 'H3.5.1',
          core: { stem: "How do Cornwallis's and the French officer's points of view about Yorktown differ?",
            choices: ['Cornwallis feels shame about a defeat, while the French officer feels proud of a victory his country helped win', 'Both feel proud', 'Both feel ashamed', 'Both think Britain won'],
            why: 'The same event looks very different to the winner and the loser.' },
          scaffold: { stem: "Is James Armistead's account firsthand or secondhand, and why?",
            choices: ["Firsthand, because he was inside Cornwallis's camp himself", 'Secondhand, because he heard about it from Lafayette', 'Secondhand, because he read about it later', 'Firsthand, because he lived in France'],
            why: 'He saw the British camp with his own eyes.' },
          extension: { stem: "Read the “What happened next” note for James Armistead. What does it show about his experience of the Revolution?",
            choices: ['He helped win liberty for the nation but still had to struggle for years to win his own freedom', 'He was freed the day after the battle', 'He moved to France with Lafayette', 'He became a British general'],
            why: 'The note shows a gap between the Revolution’s promise and his own life.' } }
      ],
      journal: { prompt: 'How did the Americans and French win at Yorktown? Who helped make the victory possible?',
        keywords: ['yorktown', 'cornwallis', 'french', 'france', 'de grasse', 'rochambeau', 'lafayette', 'armistead', 'siege', 'surrender', 'navy', 'treaty', 'spy'] },
      recall: [
        { q: 'Who helped the Americans trap Cornwallis at Yorktown?', choices: ['The French army and navy', 'Hessian soldiers', 'The Spanish army alone'] },
        { q: 'What did the Treaty of Paris (1783) do?', choices: ['Recognized the United States as independent', 'Started the war', 'Created the Bill of Rights'] }
      ]
    },

    // ------------------------------------------------------------------ 9
    {
      id: 'philadelphia1787', name: 'The Constitutional Convention', place: 'Philadelphia, Pennsylvania', when: 'Summer 1787', year: 1787,
      lat: 39.95, lon: -75.17, art: 'hall',
      bridge: [
        '1783: the Treaty of Paris ends the war. The new nation’s border stretches west to the Mississippi River, across the lands of many Native nations who were never asked.',
        '1786: struggling farmers in Massachusetts rebel. It is called Shays’ Rebellion.',
        'Many leaders worry that the national government is too weak.'
      ],
      landing: { town: 'Baltimore, Maryland', date: '1787-05-17', miles: 100, lat: 39.29, lon: -76.61,
        river: { mile: 35, name: 'Susquehanna River at the Lower Ferry', depth: [4, 7], width: 4000, fordable: false, ferry: 3 } },
      navigator: {
        stem: 'Your cart landed in Baltimore, Maryland. Which direction is Philadelphia?',
        choices: ['Northeast', 'Southwest', 'Northwest', 'South'],
        why: 'Philadelphia is north and east of Baltimore.'
      },
      news: [
        'A post rider says George Washington arrived in Philadelphia on May 13, greeted by cheering crowds.',
        'Travelers argue about Shays’ Rebellion. Some say the farmers were wrong to rebel. Others say high taxes left them no choice.'
      ],
      store: { name: 'Market Street Shops', keeper: 'a Market Street shopkeeper', priceMult: 1.1,
        greeting: '"Peace at last, and prices are steadier! Though every state prints its own money, which makes trading a puzzle."',
        fact: 'Under the Articles of Confederation, states printed their own money and sometimes taxed goods from other states. That made trade between states difficult.' },
      scene: [
        `The United States won its independence. But it is having trouble working as one country. Its first plan of government was the [[Articles of Confederation]]. It made the national government weak on purpose. After their experience with the king, Americans feared a powerful government. Under the Articles, Congress could not collect taxes. Each state acted almost like its own country. When farmers rebelled in Massachusetts in 1786, the national government could do little.`,
        `So in May 1787, delegates from twelve states meet at the Pennsylvania State House. Today we call it Independence Hall. Rhode Island refuses to come. The delegates keep their talks secret. George Washington is chosen to lead the meeting. James Madison of Virginia takes careful notes.`,
        `The delegates argue about a lot. Big states want representation based on population. Small states want every state to have an equal vote. In the Great [[Compromise]], they create a Congress with two parts. In the House of Representatives, states with more people get more representatives. In the Senate, each state gets two senators.`,
        `Delegates also argue about slavery. In the [[Three-Fifths Compromise]], they agree to count three out of every five enslaved people when deciding how many representatives a state gets. This gave slaveholding states more power.`,
        `On September 17, 1787, 39 delegates sign the new [[Constitution]]. It divides power among three [[branches]]. The legislative branch makes laws. The executive branch carries out laws. The judicial branch decides what laws mean. Next, at least nine states must [[ratify]], or officially approve, it.`
      ],
      voices: [
        { id: 'franklin1787', name: 'Benjamin Franklin', role: 'Delegate from Pennsylvania, age 81', kind: 'real', account: 'firsthand',
          text: `Plain-language version: I admit there are parts of this Constitution I don't like right now. But I'm not sure I'll never like them. The older I get, the more I doubt my own judgment. I agree to this Constitution, with all its faults, because I think we need a national government. During the convention, I often looked at the sun painted on the back of Washington's chair. I wondered if it was rising or setting. Now I know: it is a rising sun.`,
          quote: 'I confess that there are several parts of this constitution which I do not at present approve, but I am not sure I shall never approve them. ... I agree to this Constitution with all its faults, if they are such; because I think a general Government necessary for us.',
          quoteSource: 'Speech by Benjamin Franklin, September 17, 1787, recorded by James Madison',
          basis: 'Real person. The quote is his recorded words. The sun story was also recorded by Madison.' },
        { id: 'mason', name: 'George Mason', role: 'Delegate from Virginia who refused to sign', kind: 'real', account: 'firsthand',
          text: `I helped write Virginia's Declaration of Rights, and I will not sign this Constitution. Why? There is no declaration of rights in it. Nothing in it promises freedom of speech, freedom of religion, or a fair trial by jury. The new national government will be powerful. Without a list of rights, what will protect the people from it?`,
          quote: 'There is no Declaration of Rights.',
          quoteSource: "George Mason, Objections to This Constitution of Government, 1787",
          basis: 'Real person. The quote is the first line of his written objections. The other words are adapted.' },
        { id: 'allen', name: 'Richard Allen', role: 'Minister in Philadelphia, born into slavery', kind: 'real', account: 'firsthand',
          text: `I was born enslaved, and I bought my own freedom. This spring, Absalom Jones and I started the Free African Society here in Philadelphia to help free Black families. The delegates meeting down the street talk about liberty, yet they agreed to count enslaved people as three-fifths of a person, just to give slave states more power. They also agreed that Congress cannot stop the slave trade until 1808. Pennsylvania has begun to end slavery step by step. I believe the fight for real freedom will go on.`,
          basis: 'Real person. His words here are imagined, based on his life and writings.' }
      ],
      report: [
        { std: 'RI.5.8', ss: 'C2.5.1',
          core: { stem: 'George Mason makes the point that he will not sign the Constitution. Which reason does he give?',
            choices: ['It has no declaration of rights to protect freedoms like speech, religion and trial by jury', 'It gives small states too much power', 'Washington led the meeting', 'The talks were secret'],
            why: 'Mason connects his refusal to the missing list of rights.' },
          scaffold: { stem: 'The scene says the Articles of Confederation made the national government weak. What evidence supports this?',
            choices: ['Congress could not collect taxes, and it could do little during the farmers’ rebellion', 'Washington led the meeting', 'Delegates signed on September 17', 'Rhode Island stayed home'],
            why: 'Without taxes or power to act, the government was weak.' },
          extension: { stem: "Trace Franklin's argument. Which choice shows his claim AND his reason?",
            choices: ['Claim: we should accept the Constitution with its faults. Reason: the nation needs a national government, and his own doubts might be wrong', 'Claim: the sun is setting. Reason: it is painted on a chair', 'Claim: the Constitution is perfect. Reason: everyone agreed', 'Claim: Rhode Island was right. Reason: the talks were secret'],
            why: 'Franklin admits faults but gives a reason to agree anyway.' } },
        { std: 'RI.5.4', ss: 'C2.5.1',
          core: { stem: 'The delegates reach the Great Compromise. Based on the text, what is a compromise?',
            choices: ['An agreement in which each side gives up something to settle a disagreement', 'A complete win for one side', 'A secret meeting', 'A kind of tax'],
            why: 'Big states and small states each got part of what they wanted.' },
          scaffold: { stem: 'According to the scene, what does ratify mean?',
            choices: ['To officially approve', 'To tear up', 'To write by hand', 'To argue'],
            why: 'The scene says "ratify, or officially approve."' },
          extension: { stem: 'Franklin wondered whether the sun on Washington’s chair was "rising" or "setting." What do these words mean as Franklin uses them?',
            choices: ['Rising stands for a hopeful new beginning for the country; setting would mean the country was failing', 'They tell what time the meeting ended', 'They describe the weather in Philadelphia', 'They describe the chair being moved'],
            why: 'Franklin uses the sun as a symbol (figurative language) for the nation’s future.' } },
        { std: 'RI.5.2', ss: 'C1.5.2',
          core: { stem: 'Which choice states TWO main ideas of the scene?',
            choices: ['The Articles of Confederation made the national government too weak, and delegates wrote a new Constitution by making compromises', 'The talks were secret, and Madison took notes', 'Rhode Island refused to come, and Washington led the meeting', 'There were 39 signers, and the State House was made of brick'],
            why: 'The scene explains the problem and the solution. The others are details.' },
          scaffold: { stem: "What is the main idea of Richard Allen's account?",
            choices: ['Leaders talk about liberty, but the Constitution protected slavery, so the fight for freedom will continue', 'The Free African Society is a kind of bank', 'Philadelphia is a great city to visit', 'Allen agrees with every part of the Constitution'],
            why: 'Allen points out the gap between words about liberty and the protection of slavery.' },
          extension: { stem: "Which is the best objective summary of George Mason's account?",
            choices: ['Mason refused to sign because the Constitution lacked a declaration of rights to protect people from a powerful national government', 'Mason was a stubborn grump who ruined the convention', 'Mason was the wisest person in the room', 'Mason wanted a king'],
            why: 'An objective summary states his reason without calling him names or praising him.' } }
      ],
      journal: { prompt: 'Why did the states need a new Constitution? What compromises did the delegates make, and who disagreed?',
        keywords: ['articles', 'confederation', 'constitution', 'compromise', 'great compromise', 'three-fifths', 'branches', 'ratify', 'mason', 'rights', 'franklin', 'senate', 'house', 'slavery'] },
      recall: [
        { q: 'Which agreement created a Congress with a House and a Senate?', choices: ['The Great Compromise', 'The Intolerable Acts', 'The Treaty of Paris'] },
        { q: 'Why did George Mason refuse to sign the Constitution?', choices: ['It had no bill of rights', 'It had too many rights', 'It made him king'] }
      ]
    },

    // ------------------------------------------------------------------ 10
    {
      id: 'newyork1789', name: 'A New Government and the Bill of Rights', place: 'New York City, New York', when: '1789–1791', year: 1789,
      lat: 40.71, lon: -74.01, art: 'city',
      bridge: [
        '1787–1788: Americans debate the Constitution in newspapers. Federalists support it. Anti-Federalists warn it is too powerful.',
        'June 1788: New Hampshire becomes the ninth state to ratify. The Constitution becomes the law of the land.',
        'Early 1789: George Washington is elected the first president. Every elector votes for him.'
      ],
      landing: { town: 'Trenton, New Jersey', date: '1789-04-21', miles: 60, lat: 40.22, lon: -74.76,
        river: { mile: 52, name: 'Hudson River crossing to Manhattan', depth: [10, 14], width: 4000, fordable: false, ferry: 2 } },
      navigator: {
        stem: 'Your cart landed in Trenton, New Jersey. Which direction is New York City?',
        choices: ['Northeast', 'Southwest', 'West', 'South'],
        why: 'New York City is north and east of Trenton.'
      },
      news: [
        'In Trenton, women and girls built an arch of flowers over a bridge for Washington and sang as he passed beneath it.',
        'People say Washington will travel the last stretch to New York on a decorated barge.'
      ],
      scene: [
        `By the summer of 1788, enough states had ratified the Constitution. But many states agreed only after being promised that a bill of rights would be added. The first presidential election chose George Washington. Every elector voted for him.`,
        `New York City is the nation's first [[capital]]. On April 30, 1789, Washington takes the [[oath of office]] on the balcony of Federal Hall on Wall Street. Crowds cheer below. This is his [[inauguration]].`,
        `The new Congress gets to work. James Madison once thought a bill of rights was not needed. Now he leads the effort to write one. In September 1789, Congress sends twelve [[amendments]] to the states. Ten of them are ratified on December 15, 1791.`,
        `These first ten amendments are called the [[Bill of Rights]]. They protect freedoms like freedom of religion, speech, the press and assembly. They also protect the right to a fair trial by jury. The Constitution can be amended, or changed. So later generations can keep working to make its promises true for more people.`
      ],
      voices: [
        { id: 'washington', name: 'George Washington', role: 'First President of the United States', kind: 'real', account: 'document',
          text: `Plain-language version: Keeping liberty alive depends on this experiment. So does proving that a government run by the people can work. And this experiment is in the hands of the American people.`,
          quote: 'the preservation of the sacred fire of liberty, and the destiny of the Republican model of Government, are justly considered as deeply, perhaps as finally staked, on the experiment entrusted to the hands of the American people.',
          quoteSource: 'George Washington, First Inaugural Address, April 30, 1789',
          basis: 'Real person. The quote is his exact words.' },
        { id: 'maclay', name: 'Senator William Maclay', role: 'Senator from Pennsylvania who watched the speech', kind: 'real', account: 'firsthand',
          text: `Plain-language version: This great man was more nervous than he ever was when cannons and muskets were pointed at him in battle. He trembled. Several times, he could barely read his speech.`,
          quote: 'This great man was agitated and embarrassed more than ever he was by the levelled Cannon or pointed Musket. He trembled, and several times could scarce make out to read.',
          quoteSource: 'Diary of Senator William Maclay, April 30, 1789',
          basis: 'Real person. The quote is from his diary.' },
        { id: 'firstamend', name: 'The First Amendment', role: 'Part of the Bill of Rights, ratified December 15, 1791', kind: 'document', account: 'document',
          text: `Plain-language version: Congress cannot set up an official religion. It cannot stop people from practicing their religion. It cannot take away freedom of speech or freedom of the press. People have the right to gather peacefully. They also have the right to ask the government to fix problems or wrongs.`,
          quote: 'Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances.',
          quoteSource: 'First Amendment to the U.S. Constitution, 1791',
          basis: 'Real document. The quote is exact.' }
      ],
      report: [
        { std: 'RI.5.9', ss: 'C1.5.2',
          core: { stem: 'In 1787, George Mason refused to sign the Constitution, writing, "There is no Declaration of Rights." Which statement combines his concern with the First Amendment?',
            choices: ['Mason worried the Constitution did not protect rights, and the Bill of Rights, including the First Amendment’s protection of speech and religion, answered that worry', 'Mason wrote the First Amendment by himself', 'The First Amendment made Mason president', 'Mason and the First Amendment both protect the king'],
            why: 'This statement connects a text from 1787 with a text from 1791.' },
          scaffold: { stem: 'Using the scene and the First Amendment, which two freedoms does the Bill of Rights protect?',
            choices: ['Freedom of religion and freedom of speech', 'Freedom from taxes and freedom from school', 'The right to be king and the right to vote twice', 'Freedom to ignore laws and freedom to own ships'],
            why: 'Both texts name religion and speech.' },
          extension: { stem: "How does Senator Maclay's presentation of the inauguration differ from Washington's own words?",
            choices: ["Washington's speech sounds calm and serious about liberty's experiment, while Maclay shows a nervous Washington who trembled", 'Both describe a confident speech', 'Maclay was not there', 'Washington describes himself trembling'],
            why: 'A speaker presents his ideas; an observer notices how he seemed.' } },
        { std: 'RI.5.1', ss: 'C2.5.2',
          core: { stem: 'Which quote best supports the inference that Washington believed the American people were responsible for the success of the new government?',
            choices: ['"the experiment entrusted to the hands of the American people."', '"He trembled."', '"Congress shall make no law respecting an establishment of religion"', 'Scene: "Every elector voted for him."'],
            why: 'Washington says the experiment is "entrusted to the hands of the American people."' },
          scaffold: { stem: 'According to the scene, where did Washington take the oath of office?',
            choices: ['On the balcony of Federal Hall in New York City', 'At Valley Forge', 'In Boston Harbor', 'At Independence Hall in Philadelphia'],
            why: 'The scene names Federal Hall on Wall Street.' },
          extension: { stem: 'A classmate says, "The First Amendment lets people take part in their government, not just obey it." Which evidence best supports this analysis?',
            choices: ['"the right of the people peaceably to assemble, and to petition the Government for a redress of grievances."', '"Congress shall make no law respecting an establishment of religion"', '"He trembled."', 'Scene: "New York City is the nation’s first capital."'],
            why: 'Gathering and petitioning are ways people take action in their government.' } },
        { std: 'RI.5.4', ss: 'C4.5.1',
          core: { stem: 'The First Amendment protects the right to petition for "a redress of grievances." Using the plain-language version, what does redress mean?',
            choices: ['To fix or make right', 'To get dressed again', 'To ignore', 'To write a poem'],
            why: 'The plain-language version says "ask the government to fix problems or wrongs."' },
          scaffold: { stem: 'The scene says Congress sent amendments to the states. What is an amendment?',
            choices: ['A change or addition to the Constitution', 'A kind of army', 'A capital city', 'A vote for president'],
            why: 'The Bill of Rights is made of the first ten amendments, or additions, to the Constitution.' },
          extension: { stem: 'Washington called the new government an "experiment." Why is that a powerful word choice?',
            choices: ['It suggests the government is a test that could succeed or fail depending on the people', 'It means the government is a science lab', 'It means the government is finished and perfect', 'It means Washington was a scientist'],
            why: 'An experiment is a test with an unknown result. That makes the people’s choices matter.' } }
      ],
      journal: { prompt: 'What rights does the Bill of Rights protect, and why did Americans want it?',
        keywords: ['bill of rights', 'amendment', 'first amendment', 'speech', 'religion', 'press', 'assembly', 'assemble', 'petition', 'washington', 'inauguration', 'madison', 'rights'] },
      recall: [
        { q: 'What are the first ten amendments to the Constitution called?', choices: ['The Bill of Rights', 'The Articles of Confederation', 'Common Sense'] },
        { q: 'Who was the first president of the United States?', choices: ['George Washington', 'John Adams', 'Benjamin Franklin'] }
      ]
    }
  ],

  finale: {
    home: [
      { stamp: 'DECEMBER 15, 1791', text: `The Bill of Rights is ratified. C.A.R.T.'s screen turns green: RESEARCH COMPLETE. RETURN APPROVED. HAVE A MOST EXCELLENT DAY.` },
      { stamp: 'MONDAY, 8:15 A.M. — 2026', text: `{A} and {B} tumble out of the supply closet with a squeaky book cart, eighteen years of notes, and a faint smell of campfire. {T} looks up. "Perfect timing. You two are presenting first."` }
    ],
    timeline: [
      { id: 'fiw', label: 'The French and Indian War ends', year: 1763 },
      { id: 'stamp', label: 'Parliament passes the Stamp Act', year: 1765 },
      { id: 'tea', label: 'The Boston Tea Party', year: 1773 },
      { id: 'congress1', label: 'The First Continental Congress meets', year: 1774 },
      { id: 'lex', label: 'Battles of Lexington and Concord', year: 1775 },
      { id: 'decl', label: 'The Declaration of Independence is approved', year: 1776 },
      { id: 'sara', label: 'The American victory at Saratoga', year: 1777 },
      { id: 'york', label: 'Cornwallis surrenders at Yorktown', year: 1781 },
      { id: 'const', label: 'Delegates sign the Constitution', year: 1787 },
      { id: 'bor', label: 'The Bill of Rights is ratified', year: 1791 }
    ],
    causes: [
      { effect: 'Parliament passes new taxes, like the Stamp Act and the Tea Act', cause: "Britain's debt from the French and Indian War" },
      { effect: 'Parliament passes the Intolerable Acts', cause: 'The Boston Tea Party' },
      { effect: 'Twelve colonies send delegates to the First Continental Congress', cause: 'The Intolerable Acts' },
      { effect: 'France signs an alliance with the United States', cause: 'The American victory at Saratoga' },
      { effect: 'Delegates meet to write a new Constitution', cause: 'A weak national government under the Articles of Confederation' },
      { effect: 'Congress adds the Bill of Rights', cause: 'Anti-Federalists like George Mason demand protection for rights' }
    ],
    questions: [
      { id: 'cause', text: 'What caused the colonists to fight for independence?' },
      { id: 'everyone', text: 'Was the American Revolution a revolution for everyone?' },
      { id: 'victory', text: 'Who made the American victory possible?' },
      { id: 'today', text: 'How did the Revolution lead to the government we have today?' }
    ]
  },

  glossary: {
    'parliament': 'The group of lawmakers that made laws for Great Britain and its colonies.',
    'taxes': 'Money people must pay to a government.',
    'representation': 'Having someone chosen to speak and vote for you in government.',
    'representatives': 'People chosen to speak and vote for a group of people.',
    'tea act': 'A 1773 law that made British tea cheaper but kept a tax on it and gave the East India Company control of the tea trade.',
    'east india company': 'A large British trading company that shipped tea and other goods.',
    'wharf': 'A platform built along the shore where ships tie up to load and unload.',
    'apprentice': 'A young person who works for a skilled worker to learn a trade.',
    'intolerable acts': 'The colonists’ name for the 1774 laws that punished Massachusetts for the Boston Tea Party.',
    'delegates': 'People chosen to represent others at a meeting.',
    'continental congress': 'The meeting of delegates from the colonies, and later the states, that led the colonies during the Revolution.',
    'boycott': 'Refusing to buy or use something as a protest.',
    'petition': 'A formal written request to someone in power.',
    'regulars': 'Full-time, professional soldiers. Colonists used it for British soldiers.',
    'redcoats': 'A nickname for British soldiers, who wore red coats.',
    'militia': 'Ordinary citizens trained to fight when needed.',
    'minutemen': 'Militia members who promised to be ready to fight at a minute’s notice.',
    'pamphlet': 'A short printed booklet about one topic.',
    'declaration of independence': 'The 1776 document announcing that the thirteen colonies were free from British rule, and explaining why.',
    'consent of the governed': 'The idea that a government gets its power from the agreement of the people.',
    'grievances': 'Complaints about unfair treatment.',
    'enlistments': 'The length of time soldiers agree to serve in the army.',
    'hessian': 'A German soldier hired by the British during the Revolution. Many came from Hesse.',
    'durham boats': 'Large, flat-bottomed boats used to carry heavy loads on rivers.',
    'surrenders': 'Gives up to the enemy.',
    'turning point': 'An event that changes the direction of what happens next.',
    'alliance': 'An agreement between nations or groups to work together.',
    'haudenosaunee': 'The Six Nations (Mohawk, Oneida, Onondaga, Cayuga, Seneca and Tuscarora), whose homelands include much of present-day New York. The name means People of the Longhouse.',
    'confederacy': 'A group of nations or states joined together for a shared purpose.',
    'proclamation of 1763': 'A British order that drew a line along the Appalachian Mountains and told colonists not to settle west of it.',
    'drill': 'To practice marching and fighting moves over and over until a group can do them together.',
    'inoculated': 'Given a small, controlled dose of a disease so the body learns to fight it. It was an early form of vaccination.',
    'siege': 'Surrounding a place and cutting off its supplies to force it to surrender.',
    'treaty': 'A formal agreement between nations.',
    'articles of confederation': 'The first plan of government for the United States, used from 1781 to 1789.',
    'compromise': 'An agreement in which each side gives up something it wanted.',
    'three-fifths compromise': 'The 1787 agreement to count three out of every five enslaved people when deciding a state’s number of representatives.',
    'constitution': 'The written plan for the U.S. government, signed in 1787. It is still in use today.',
    'branches': 'The three parts of the U.S. government: legislative, executive and judicial.',
    'ratify': 'To officially approve.',
    'capital': 'The city where a government meets.',
    'oath of office': 'A promise a new leader makes to do the job faithfully.',
    'inauguration': 'The ceremony that begins a leader’s time in office.',
    'amendments': 'Changes or additions to the Constitution.',
    'bill of rights': 'The first ten amendments to the Constitution, ratified in 1791. They protect individual freedoms.'
  }
};
