// Buyer's guides, keyed by town slug. Each guide is a public page at
// /:slug/buyers-guide (prerendered; see scripts/site-paths.mjs) and is emailed
// to anyone who requests it from the town page (form "buyers-guide").
//
// Content is Nicholas's own copy (Manhasset: PDF dated Nov 5, 2026). Each
// section is a list of blocks the page renders:
//   { type: 'p', text, lead? }            paragraph, optional bold lead-in
//   { type: 'bullets', items: [{ lead?, text }] }
//   { type: 'steps', items: [{ lead, text }] }   numbered
//   { type: 'facts', rows: [[label, value]] }
//   { type: 'table', columns: [..], rows: [[..]] }  rendered as stacked cards
//   { type: 'faq', items: [{ q, a }] }
//   { type: 'h3', text }
const p = (text, lead) => (lead ? { type: 'p', lead, text } : { type: 'p', text });
const bullets = (items) => ({ type: 'bullets', items: items.map((i) => (Array.isArray(i) ? { lead: i[0], text: i[1] } : { text: i })) });
const steps = (items) => ({ type: 'steps', items: items.map(([lead, text]) => ({ lead, text })) });

export const guides = {
  manhasset: {
    slug: 'manhasset',
    town: 'Manhasset',
    title: 'Manhasset Buyer’s Guide | Nicholas Liappas, Compass',
    metaDescription: 'Nicholas Liappas’s guide to buying in Manhasset, NY: the villages and school zoning, housing stock, taxes, the LIRR commute, and how buying in New York works.',
    heading: 'Manhasset Buyer’s Guide',
    subtitle: 'What to know before you buy on the North Shore',
    updated: 'November 2026',
    publishedAt: '2026-11-05',
    modifiedAt: '2026-11-05',
    intro: 'Manhasset isn’t just one of the most desirable places to live in New York; it’s one of the most desirable in the country. It has a top-ranked school district, a sub-40-minute train ride to Midtown, Manhasset Bay at its doorstep, and streets lined with classic Colonial and Tudor homes. It’s a small, close-knit community, and the bar to entry is high. For those who buy here, it’s worth it.',
    sections: [
      {
        id: 'why-manhasset',
        heading: 'Why Manhasset',
        blocks: [
          p('What Manhasset is known for:'),
          bullets([
            ['Schools.', 'The Manhasset school district consistently ranks among the best in New York State.'],
            ['The commute.', 'One of the shortest train rides to Manhattan on Long Island.'],
            ['Community.', 'A tight-knit town where neighbors know each other and local traditions run deep.'],
            ['Space with access.', 'A popular move from Queens and the city for more room without giving up proximity.'],
          ]),
          p('Manhasset is not an affordable entry point to the North Shore. Prices are among the highest on Long Island, inventory is thin, and well-priced homes routinely draw multiple offers. If budget is the priority, we’ll gladly show you nearby towns that offer more for the money.', 'A note on price.'),
          p('I grew up in Manhasset. I know its streets, its people and its history personally, and I’ve sold many homes here. When you buy with The Liappas Team, you get someone who knows this market inside and out.', 'Why listen to us:'),
        ],
      },
      {
        id: 'at-a-glance',
        heading: 'Manhasset at a glance',
        blocks: [
          p('Manhasset is a hamlet on Long Island’s North Shore, about 17 miles from Penn Station, wrapped around the southern end of Manhasset Bay.'),
          { type: 'facts', rows: [
            ['Location', 'North Shore of Nassau County, Town of North Hempstead'],
            ['Train to Midtown', 'About 40 minutes; under 30 on peak express trains'],
            ['Population', '8,176 in the hamlet itself (2020 Census); roughly 13,500 including Munsey Park, Plandome and Plandome Heights'],
            ['Households', '2,790 in the hamlet (2020 Census)'],
            ['School district', 'Manhasset Union Free School District (for most addresses; see Schools)'],
          ] },
          p('“Manhasset” is a name, not a single government. The hamlet itself is unincorporated and governed by the Town of North Hempstead. Inside and around it sit several incorporated villages, each with its own mayor, building department and village tax: Munsey Park, Plandome and Plandome Heights are entirely within greater Manhasset, and parts of Flower Hill, Plandome Manor and North Hills are too. Which one a home is in affects your tax bill, your permit process for renovations, and in some cases your parking and park access.', 'How it’s governed.'),
          p('The 11030 mailing address covers areas zoned to other districts. Always confirm the school district for the specific property before you make an offer. We do this for every client.', 'A Manhasset address doesn’t guarantee Manhasset schools.'),
        ],
      },
      {
        id: 'villages',
        heading: 'Villages and neighborhoods',
        blocks: [
          p('Each part of Manhasset has its own feel. Here’s a quick guide; ask us for the street-by-street detail.'),
          { type: 'table', columns: ['Area', 'What it’s like', 'School district'], rows: [
            ['Munsey Park (village)', 'A planned 1920s community developed by the Metropolitan Museum of Art on publisher Frank Munsey’s estate. Uniform Colonial homes, Olmsted Brothers landscaping, streets named for American artists. Walk to Munsey Park Elementary. About 2,800 residents.', 'Manhasset'],
            ['Plandome (village)', 'Quiet, entirely residential village on Manhasset Bay with its own LIRR station, village green and part of Plandome Country Club. No commercial district. About 1,450 residents.', 'Manhasset'],
            ['Plandome Heights (village)', 'Small village between downtown and the bay, with early 20th-century Spanish-style homes alongside later Colonials; winding roads and cul-de-sacs on the west side. About 1,000 residents.', 'Manhasset'],
            ['Plandome Manor (village)', 'Former estate country on Manhasset Bay and Leeds Pond, with larger properties and a private country club. About 800 residents.', 'Manhasset for most; Port Washington on the eastern side'],
            ['Flower Hill (village, part)', 'Large, mostly residential village that straddles three school districts. Only the Manhasset-zoned section belongs here.', 'Manhasset, Roslyn or Port Washington, depending on the street'],
            ['North Hills (village, part)', 'Newer, upscale developments south of Northern Boulevard.', 'Varies; confirm by address'],
            ['Strathmore', 'The Strathmore sections (North and South Strathmore, Strathmore Village, Strathmore–Vanderbilt) are classic, established neighborhoods of Colonials and Tudors on tree-lined streets, close to schools and shopping.', 'Manhasset'],
            ['Norgate', 'A smaller established neighborhood of traditional single-family homes.', 'Manhasset'],
            ['Unincorporated Manhasset (incl. Manhasset Valley, Bayview, Shorehaven, Terrace Manor, Manhasset Park, Manhasset Gardens)', 'The heart of town, near Plandome Road and the train. More variety in home size and price, including the most accessible entry points into Manhasset.', 'Manhasset for most addresses'],
            ['Spinney Hill', 'Has a Manhasset mailing address, but is zoned for Great Neck schools.', 'Great Neck'],
            ['Manhasset Hills (nearby)', 'A separate hamlet south of the LIE that shares the Manhasset name. Popular with buyers who want the name and North Shore access at a lower price.', 'Herricks (not Manhasset)'],
          ] },
        ],
      },
      {
        id: 'schools',
        heading: 'Schools',
        blocks: [
          p('For most buyers, schools are the reason they look at Manhasset first. The Manhasset Union Free School District consistently ranks among the top school districts in New York State and the nation.'),
          { type: 'table', columns: ['School', 'Grades', 'Notes'], rows: [
            ['Munsey Park Elementary', 'K–6', 'One of two elementary schools; students are zoned by address'],
            ['Shelter Rock Elementary', 'K–6', 'The other elementary school; zoned by address'],
            ['Manhasset Secondary School', '7–12', 'Every student in the district attends, middle and high school on one campus'],
          ] },
          p('The district is small, about 3,000 students, which is part of its appeal: kids from both elementary schools come together in seventh grade and graduate as one class.'),
          p('Several areas with a Manhasset mailing address are zoned for other districts: Spinney Hill and parts of southern Manhasset go to Great Neck, parts of Flower Hill go to Roslyn or Port Washington, and the eastern side of Plandome Manor goes to Port Washington. Manhasset Hills is a separate community altogether. We verify the school district for every property against the tax lot and with the district before our clients make an offer.', 'Watch for zoning traps.'),
          { type: 'h3', text: 'Schools and child care by age' },
          p('Manhasset has options at every stage, from infant care through high school. Many programs span more than one age group; each is listed under its main one.'),
          { type: 'table', columns: ['Stage', 'Options in Manhasset'], rows: [
            ['Day care (infants and toddlers)', 'Harbor Child Care at North Shore University Hospital, 300 Community Dr (12 weeks to 3 years) · Manhasset KinderCare, 1355 Northern Blvd (infants through Pre-K, before- and after-school) · North Shore Early Childhood Center (infants through preschool)'],
            ['Nursery schools', 'The Congregational Day Nursery School at the Congregational Church of Manhasset (toddlers, Pre-K) · North Shore Nursery (toddlers, Pre-K) · Gan Shalom Nursery School (infants through Pre-K)'],
            ['Preschools', 'Our Lady of Grace Montessori School, 29 Shelter Rock Rd (ages 3–10) · Outlook Montessori (toddlers, Pre-K) · Adventures in Learning (preschool, Pre-K, after-school, camp) · Manhasset Great Neck EOC (Pre-K) · St. Mary’s Elementary (Pre-K)'],
            ['Elementary', 'Munsey Park Elementary (public, K–6) · Shelter Rock Elementary (public, K–6) · St. Mary’s Elementary School, 1340 Northern Blvd (Catholic, Pre-K–8)'],
            ['Middle school', 'Manhasset Secondary School, grades 7–8 (public) · St. Mary’s Elementary, grades 6–8 (Catholic)'],
            ['High school', 'Manhasset Secondary School, grades 9–12 (public; National Blue Ribbon School, 98% graduation rate, 26 AP courses) · St. Mary’s High School, 51 Clapham Ave (Catholic, co-ed, 9–12)'],
          ] },
          p('Before- and after-school care is available at both public elementary schools through the Manhasset Afterschool Xperience.'),
        ],
      },
      {
        id: 'housing',
        heading: 'Housing stock and architecture',
        blocks: [
          p('Manhasset is known for traditional architecture, built mostly in the 1920s through the 1950s, with newer construction mixed in where older homes have been replaced.'),
          bullets([
            ['Colonials', 'are the signature style, especially in Munsey Park, where the village was designed around them.'],
            ['Tudors and Spanish-style homes', 'from the 1920s and 1930s appear throughout the Plandomes and the established neighborhoods.'],
            ['Capes, ranches and split-levels', 'from the postwar years offer a more accessible way into town. Few remain, and many have been expanded or rebuilt.'],
            ['New construction and teardowns.', 'Buyers increasingly replace smaller homes with new builds. Village and town rules on setbacks, height and lot coverage shape what you can build, so it’s worth checking before you buy.'],
            ['Condos, co-ops and townhomes.', 'Options are limited. Georgetown Commons is a beautiful community very close to the LIRR.'],
          ]),
          p('With a background in construction, I walk every showing looking at what’s behind the walls, not just the finishes. The most common surprises in older Manhasset homes are cesspools nearing the end of their life, outdated electrical and plumbing, water in basements, and unpermitted renovations. For any home you’re considering, I can give you a sense of what a renovation or new build would cost.', 'A builder’s eye on older homes.'),
        ],
      },
      {
        id: 'market',
        heading: 'The market and what your budget buys',
        blocks: [
          p('Manhasset is a competitive market: well-priced homes move quickly and often draw multiple offers. Ask us for current numbers on the streets and price range you care about.'),
          bullets([
            ['Under $1.5M:', 'typically a smaller or older home, often a Cape, ranch or split-level, or a home that needs work, mostly in unincorporated Manhasset.'],
            ['$1.5M–$3M:', 'the core of the market. Colonials and Tudors in established neighborhoods such as Munsey Park and Strathmore.'],
            ['$3M and up:', 'updated homes, new construction, larger lots, and waterfront or water-view homes in Plandome.'],
          ]),
          p('Inventory typically peaks in spring, when competition is also highest. Late fall and winter have fewer listings but fewer competing buyers, and sellers who list then are often motivated.', 'Timing.'),
          p('Manhasset has historically held its value well through market cycles, because demand from buyers consistently outpaces the supply of homes.', 'Long-term value.'),
        ],
      },
      {
        id: 'taxes',
        heading: 'Taxes and carrying costs',
        blocks: [
          p('Property taxes are the cost buyers most often underestimate, so plan for them from the start.'),
          p('A Manhasset tax bill combines several layers: Nassau County, the Town of North Hempstead, special districts (such as water, fire, sewer, park and library), and the school district, which is the largest share. Homes inside an incorporated village also pay a village tax, which covers village services.', 'How your tax bill is built.'),
          p('It may reflect exemptions or a grievance reduction that won’t carry over to you. Nassau County reassesses property values, and homeowners can challenge their assessment each year through the county’s Assessment Review Commission. The filing window opens in January and typically closes in early spring. Many owners use a grievance firm that works on contingency.', 'Don’t rely on the seller’s tax bill.'),
          p('New homeowners can apply for the New York State STAR credit, which reduces school taxes for households under the income limit. Seniors, veterans and others may qualify for additional exemptions.', 'STAR and exemptions.'),
          p('Other carrying costs to budget for:'),
          bullets([
            'Homeowners insurance, plus flood insurance for homes in a flood zone near the bay',
            'Heating fuel: natural gas where lines exist; some older homes still heat with oil',
            'Cesspool or septic maintenance on homes without sewer service',
            'Commuter parking permits and any club or village fees',
          ]),
        ],
      },
      {
        id: 'commute',
        heading: 'Commute and transportation',
        blocks: [
          p('Manhasset has one of the shortest commutes on Long Island: about 40 minutes to Midtown by train, and under 30 minutes on peak express trains.'),
          bullets([
            ['LIRR Port Washington Branch.', 'Manhasset and Plandome both have stations. The branch is electrified with frequent service, and trains run to both Penn Station and Grand Central Madison with the same running time, so you can choose the terminal closest to your office. Peak express trains stop only at Plandome, Manhasset and Great Neck before running nonstop to the city. No transfer at Jamaica is needed.'],
            ['Station parking.', 'The Manhasset Park District runs the commuter lots at Manhasset station. Most spaces are reserved for district residents with a permit; a limited number are first-come, first-served at a higher rate. The Village of Plandome issues permits for its own lots at Plandome station. Many homes near Plandome Road and in the Plandomes are within walking distance of a station.'],
            ['Driving.', 'Northern Boulevard (Route 25A) runs through town, with quick access to the Long Island Expressway and the Cross Island Parkway. Expect around 80 minutes to Midtown at rush hour.'],
            ['Airports.', 'LaGuardia and JFK are both a short drive by Long Island standards.'],
          ]),
        ],
      },
      {
        id: 'lifestyle',
        heading: 'Lifestyle',
        blocks: [
          p('Manhasset offers big-name shopping, a walkable small-town downtown, and the water, all within a few minutes of home.'),
          bullets([
            ['Shopping.', 'The Miracle Mile on Northern Boulevard is one of the most prestigious shopping districts in the country, anchored by Americana Manhasset, open since 1956. For everyday errands, Plandome Road has bakeries, delis, coffee shops, restaurants and a movie theater, and Munsey Park Plaza includes Whole Foods.'],
            ['Dining.', 'Local favorites include Angie’s, Schout Bay Tavern, Louie’s, Umberto’s, Gino’s and Villa Milano.'],
            ['Parks and outdoors.', 'Manhasset Valley Park (about 27 acres of fields, paths, a playground and the town’s 9/11 memorial), Whitney Pond Park, Mary Jane Davies Green, Leeds Pond, and the Manhasset Park District’s neighborhood parks. North Shore beaches are a short drive away.'],
            ['Clubs and recreation.', 'Plandome Country Club (golf), Strathmore Vanderbilt Country Club (pool), and nearby North Hempstead Country Club in Port Washington (golf), all with tennis among their amenities. Yacht and swim clubs line the North Shore.'],
            ['On the water.', 'Manhasset Bay is one of the North Shore’s busiest boating harbors, with marinas, yacht clubs and moorings along its shores.'],
            ['Community.', 'The Manhasset Public Library, beside the historic Quaker Meeting House, is a hub of town life. Youth sports, town traditions and an active network of houses of worship make it easy to get involved.'],
            ['Healthcare.', 'North Shore University Hospital, Northwell Health’s flagship, is right in Manhasset. St. Francis Hospital, a nationally known heart center, is next door in Flower Hill.'],
          ]),
        ],
      },
      {
        id: 'process',
        heading: 'Buying in Manhasset: process and strategy',
        blocks: [
          p('Buying in New York works differently than in most states. Attorneys negotiate the contract, and nothing is binding until both sides sign it. Here’s how it unfolds.'),
          steps([
            ['Get pre-approved.', 'At Manhasset prices, most buyers need a jumbo loan, which comes with stricter requirements for down payment, reserves and documentation. A strong pre-approval from a lender sellers recognize makes your offer more credible.'],
            ['Define your must-haves.', 'Decide early on school district, distance to the train, lot size, and whether you’ll take on renovation.'],
            ['Search, including off-market.', 'Some of the best Manhasset homes never hit the open market. Through Compass Private Exclusives and our local relationships, we can show you homes before other buyers see them.'],
            ['Make an offer and negotiate.', 'Offers in New York are verbal or written but not binding. When multiple buyers are interested, sellers often call for “highest and best” offers by a deadline.'],
            ['Attorney review and contract.', 'Once an offer is accepted, the seller’s attorney drafts the contract and your attorney reviews it and orders a title search. You sign and put down a deposit, typically 10% of the price, and the seller countersigns.'],
            ['Inspection, appraisal and mortgage commitment.', 'The home inspection usually happens before contracts are signed. Your lender then orders an appraisal and issues the mortgage commitment.'],
            ['Title, survey and closing.', 'Your attorney clears title and reviews the survey, and you do a final walkthrough before closing.'],
          ]),
          p('How we help you win without overpaying:'),
          bullets([
            ['Price by the comps, not by emotion.', 'We show you what comparable homes actually sold for, so you know where the ceiling is.'],
            ['Make your offer cleaner, not just bigger.', 'A strong pre-approval, a larger down payment, a flexible closing date or a quick inspection can beat a higher price.'],
            ['Plan for the appraisal.', 'When bidding goes above recent sales, decide in advance how much of any appraisal gap you’re willing to cover.'],
          ]),
        ],
      },
      {
        id: 'due-diligence',
        heading: 'Due diligence checklist',
        blocks: [
          p('Older homes have character, and they can hide expensive problems. Use this list before you sign a contract.'),
          bullets([
            'Confirm the school district for the specific property, not just the mailing address',
            'Sewer or cesspool: much of Manhasset, including Munsey Park and Plandome Heights, isn’t sewered. Have the cesspool inspected and know the replacement cost',
            'Flood zone and elevation, especially for homes near Manhasset Bay and Leeds Pond',
            'Open permits and certificates of occupancy with the town or village; unpermitted work can delay a closing',
            'Underground or abandoned oil tanks: test or confirm proper removal',
            'Roof, foundation, drainage, and signs of water in the basement',
            'Age of the electrical and plumbing systems in pre-war homes',
            'Village rules on renovations, additions, tree removal and fences, if you plan changes',
            'The current tax bill, and whether it reflects exemptions or reductions that won’t carry over',
          ]),
          p('Once you have an accepted offer, schedule the engineer’s inspection right away and keep every step on schedule. If you move too slowly, the seller can lose faith and move on to a backup offer. Time kills deals.', 'The deal-breaker we see most: moving too slowly.'),
        ],
      },
      {
        id: 'why-us',
        heading: 'Why The Liappas Team',
        blocks: [
          p('We’re Manhasset locals who know this market house by house, and we bring a builder’s eye to every showing.'),
          bullets([
            ['Born and raised here.', 'I grew up in Manhasset. I know which streets flood, which blocks walk to the train, and which homes have been well cared for.'],
            ['A proven track record.', 'Many successful sales in Manhasset over the years.'],
            ['A builder’s eye.', 'My background in construction means I spot structural, mechanical and permit issues during the showing, before you’ve committed.'],
            ['The Compass advantage.', 'Early access to off-market homes through Compass Private Exclusives, real-time market data, and the reach of one of the country’s largest brokerages.'],
          ]),
        ],
      },
      {
        id: 'faq',
        heading: 'Frequently asked questions',
        blocks: [
          { type: 'faq', items: [
            { q: 'How competitive is the Manhasset market?', a: 'Very. Well-priced homes typically sell quickly, often above asking and with multiple offers. Ask us for current numbers.' },
            { q: 'Which Manhasset addresses aren’t in the Manhasset school district?', a: 'Spinney Hill and parts of southern Manhasset are zoned for Great Neck; parts of Flower Hill go to Roslyn or Port Washington; and the eastern side of Plandome Manor goes to Port Washington. Manhasset Hills is a separate community in the Herricks district. Always confirm by property.' },
            { q: 'What will my property taxes be?', a: 'It depends on the home’s assessed value, whether it sits in an incorporated village, its school district, and any exemptions. Manhasset’s commercial tax base along the Miracle Mile, including the Americana, helps support the school district. Before you make an offer, we’ll pull the current tax bill and walk you through what to expect as the new owner.' },
            { q: 'How long is the commute to Manhattan?', a: 'About 40 minutes by LIRR to Penn Station or Grand Central Madison, and under 30 minutes on peak express trains.' },
            { q: 'Should I buy renovated or renovate myself?', a: 'Renovated homes cost more up front but let you move right in, which matters when the school year starts. Renovating yourself can add value, but budget for permits, village approvals and surprises behind the walls. We can help you estimate costs before you buy.' },
            { q: 'When is the best time of year to buy?', a: 'Spring brings the most listings and the most competition. Fall and winter bring fewer buyers and often more motivated sellers.' },
          ] },
        ],
      },
    ],
    cta: {
      heading: 'Ready to find your home in Manhasset?',
      text: 'Let’s start with a conversation. Book a buyer consultation and we’ll review your goals, budget and timeline and map out the right neighborhoods for you. Or ask for a custom market report on the streets and price range you care about, or a private tour of the neighborhoods.',
    },
    sources: [
      'U.S. Census Bureau QuickFacts: Manhasset CDP',
      'Manhasset, New York – Wikipedia; village pages for Munsey Park, Plandome, Plandome Heights, Plandome Manor, Flower Hill',
      'Manhasset Union Free School District – Wikipedia; Niche rankings',
      'Manhasset station – Wikipedia; MTA: Port Washington Branch express trains',
      'Manhasset Park District – Wikipedia; Manhasset Valley Park – Wikipedia',
      'Child care and private schools: childcarecenter.us, Harbor Child Care, Our Lady of Grace Montessori, St. Mary’s Elementary – Niche, St. Mary’s High School – Wikipedia, Manhasset Secondary School – Wikipedia',
      'North Hempstead Country Club – Wikipedia',
    ],
  },
};
