// Buyer's guides, keyed by town slug. Each guide is a public page at
// /:slug/buyers-guide (prerendered; see scripts/site-paths.mjs) and is emailed
// to anyone who requests it from the town page (form "buyers-guide").
//
// Content is Nicholas's own copy (Manhasset: PDF dated Nov 5, 2026). Each
// section is a list of blocks the page renders:
//   { type: 'p', text, lead? }            paragraph, optional bold lead-in
//   { type: 'bullets', items: [{ lead?, text, sub?: [string] }] }
//   { type: 'steps', items: [{ lead, text }] }   numbered
//   { type: 'facts', rows: [[label, value]] }
//   { type: 'table', columns: [..], rows: [[..]] }  rendered as stacked cards
//   { type: 'faq', items: [{ q, a }] }
//   { type: 'h3', text }
const p = (text, lead) => (lead ? { type: 'p', lead, text } : { type: 'p', text });
const bullets = (items) => ({ type: 'bullets', items: items.map((i) => (Array.isArray(i) ? { lead: i[0], text: i[1], ...(i[2] ? { sub: i[2] } : {}) } : typeof i === 'string' ? { text: i } : i)) });
const steps = (items) => ({ type: 'steps', items: items.map(([lead, text]) => ({ lead, text })) });

// A guide can serve more than one town page (e.g. Roslyn + East Hills share one
// guide at /roslyn/buyers-guide). `alsoFor` lists the extra town slugs.
export function guideForTown(slug) {
  return guides[slug] || Object.values(guides).find((g) => (g.alsoFor || []).includes(slug)) || null;
}

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
  'port-washington': {
    slug: 'port-washington',
    town: 'Port Washington',
    title: 'Port Washington Buyer’s Guide | Nicholas Liappas, Compass',
    metaDescription: 'Nicholas Liappas’s guide to buying in Port Washington, NY: villages, school zones, waterfront homes, taxes, the LIRR commute and how buying in New York works.',
    heading: 'Port Washington Buyer’s Guide',
    subtitle: 'What to know before you buy on the North Shore',
    updated: 'November 2026',
    publishedAt: '2026-11-09',
    modifiedAt: '2026-11-09',
    intro: 'Port Washington is a true waterfront town: surrounded by Manhasset Bay, Hempstead Harbor and Long Island Sound, with a lively downtown, a highly regarded school district, and its own train line into Manhattan. It offers a wider range of homes and prices than most North Shore towns, from condos near the water to estates in Sands Point, and a strong sense of community that ties it all together.',
    sections: [
      {
        id: 'why-port-washington',
        heading: 'Why Port Washington',
        blocks: [
          p('What Port Washington is known for:'),
          bullets([
            ['The water.', 'Marinas, yacht clubs, a waterfront walkway, beaches and some of the best boating on the North Shore.'],
            ['The commute.', 'Port Washington is the first stop on its own LIRR branch, with direct service to Penn Station and Grand Central Madison.'],
            ['Schools.', 'The Port Washington school district is well regarded across Long Island.'],
            ['A real downtown.', 'Main Street and the streets around it are full of restaurants, shops and coffee spots you can walk to.'],
            ['Range.', 'Condos, co-ops, starter homes, classic Colonials and waterfront estates, all in one town.'],
          ]),
          p('Port Washington is one of the more desirable towns on the North Shore, and well-priced homes draw strong interest. Its range of housing, though, means there are more ways in than in many neighboring towns.', 'A note on price.'),
          p('I live in Port Washington. I know its neighborhoods, its waterfront and its people firsthand, and I can tell you what it’s actually like to live on any given street.', 'Why listen to us:'),
        ],
      },
      {
        id: 'at-a-glance',
        heading: 'Port Washington at a glance',
        blocks: [
          p('Port Washington sits on the Cow Neck Peninsula on Long Island’s North Shore, about 20 miles by rail from Penn Station, with Manhasset Bay to the west and Hempstead Harbor to the east.'),
          { type: 'facts', rows: [
            ['Location', 'Cow Neck Peninsula, Nassau County, Town of North Hempstead'],
            ['Train to Midtown', 'End of the line on the LIRR Port Washington Branch, with direct trains to Penn Station and Grand Central Madison'],
            ['Population', '16,753 in the hamlet itself (2020 Census); more than 30,000 including the surrounding villages'],
            ['Households', '5,925 in the hamlet (2020 Census)'],
            ['School district', 'Port Washington Union Free School District'],
          ] },
          p('Like Manhasset, “Port Washington” is a community, not a single government. The hamlet is unincorporated and governed by the Town of North Hempstead. Around it are four incorporated villages that are entirely part of greater Port Washington: Sands Point, Baxter Estates, Manorhaven and Port Washington North. Parts of Flower Hill and Plandome Manor are too. Each village has its own government, building department and village tax. Port Washington also has its own police district, and Sands Point has its own police department.', 'How it’s governed.'),
          p('Almost every Port Washington address is in the Port Washington school district, which serves all four villages, the hamlet, and parts of Flower Hill and Plandome Manor. It’s still worth confirming for any home near the borders with Manhasset or Roslyn.', 'School district is simpler here.'),
        ],
      },
      {
        id: 'villages',
        heading: 'Villages and neighborhoods',
        blocks: [
          p('Each part of Port Washington has its own feel. Here’s a quick guide; ask us for the street-by-street detail.'),
          { type: 'table', columns: ['Area', 'What it’s like', 'School district'], rows: [
            ['Sands Point (village)', 'The estate section at the tip of the peninsula, and Fitzgerald’s “East Egg” in The Great Gatsby. Large lots (two-acre zoning for new subdivisions), no commercial zoning, its own police department, and home to Sands Point Preserve. About 2,700 residents.', 'Port Washington'],
            ['Manorhaven (village)', '“The Pearl of Manhasset Bay.” A waterfront village on the bay and Sheets Creek with beach, dock and preserve parks, marinas, and a mix of single-family homes, garden apartments and condos. About 7,000 residents.', 'Port Washington'],
            ['Baxter Estates (village)', 'A small, historic village near downtown, home to the Port Washington Public Library.', 'Port Washington'],
            ['Port Washington North (village)', 'On Manhasset Bay along Shore Road, with Bay Walk Park and the waterfront promenade. A mix of homes, condos and apartments.', 'Port Washington'],
            ['Flower Hill (Port Washington part)', 'The section of Flower Hill zoned for Port Washington. Traditional single-family homes.', 'Port Washington for this section'],
            ['Plandome Manor (eastern part)', 'The eastern edge of the village, zoned for Port Washington. Larger properties near Leeds Pond and the bay.', 'Port Washington for this section'],
            ['Beacon Hill', 'The highest point on the peninsula, with established single-family homes and water views.', 'Port Washington'],
            ['Manhasset Bay Estates', 'A waterfront neighborhood on the bay side of the hamlet.', 'Port Washington'],
            ['Salem', 'An established neighborhood of single-family homes around South Salem Elementary.', 'Port Washington'],
            ['Downtown and unincorporated Port Washington', 'Walkable to Main Street and the train, with the widest variety of homes, including condos, co-ops and starter homes.', 'Port Washington'],
          ] },
        ],
      },
      {
        id: 'schools',
        heading: 'Schools',
        blocks: [
          p('The Port Washington Union Free School District is one of the most respected on Long Island. It serves about 5,000 students across five elementary schools, one middle school and one high school, and it traces its roots to a one-room schoolhouse in 1757.'),
          { type: 'table', columns: ['School', 'Grades', 'Notes'], rows: [
            ['Daly Elementary', 'K–5', 'Zoned by address'],
            ['Guggenheim Elementary', 'K–5', 'On land donated by the Guggenheim Foundation, at the edge of Sands Point'],
            ['Manorhaven Elementary', 'K–5', 'Zoned by address'],
            ['John Philip Sousa Elementary', 'K–5', 'Zoned by address'],
            ['South Salem Elementary', 'K–5', 'Zoned by address'],
            ['Carrie Palmer Weber Middle School', '6–8', 'Every student in the district attends'],
            ['Paul D. Schreiber High School', '9–12', 'Every student in the district attends'],
          ] },
          p('Port Washington has five elementary zones, so two homes a few blocks apart can feed different schools. We confirm the zone for every property our clients consider.', 'Which elementary school?'),
          { type: 'h3', text: 'Schools and child care by age' },
          p('Port Washington has options at every stage, from infant care through high school. Many programs span more than one age group; each is listed under its main one.'),
          { type: 'table', columns: ['Stage', 'Options in Port Washington'], rows: [
            ['Day care (infants and toddlers)', 'Imagine Early Learning Center · Sid Jacobson JCC · Port Washington Children’s Center (toddlers through preschool, plus before- and after-school) · Teach and Tumble'],
            ['Nursery schools', 'Child’s World Nursery School (First United Methodist Church) · Community Synagogue Early Childhood Center · Temple Beth Israel Nursery School · Friends Together Nursery · North Shore Nursery School · Archangel Michael Greek Orthodox Church'],
            ['Preschools', 'Happy Montessori School · Chabad Preschool · Florence Brownstein Preschool · My Spectrum Center'],
            ['Elementary', 'The five public elementary schools (K–5) · Chabad Academy of Science & the Humanities (Jewish, Pre-K–7) · Greek Language Institute (K–8)'],
            ['Middle school', 'Weber Middle School, grades 6–8 (public) · Chabad Academy (through grade 7)'],
            ['High school', 'Schreiber High School, grades 9–12 (public) · Vincent Smith School (independent, grades 1–12)'],
          ] },
          p('Independent and Catholic schools in neighboring towns are also a short drive away.'),
        ],
      },
      {
        id: 'housing',
        heading: 'Housing stock and architecture',
        blocks: [
          p('Port Washington has one of the most varied housing markets on the North Shore, from waterfront condos to historic estates.'),
          bullets([
            ['Colonials, Tudors and Capes', 'fill the established neighborhoods, many built between the 1920s and the 1960s.'],
            ['Estates and large-lot homes', 'define Sands Point, where many homes sit on an acre or more and new subdivisions require two acres.'],
            ['Waterfront and water-view homes', 'line Manhasset Bay, Hempstead Harbor and the Sound, from bayfront cottages to grand estates.'],
            ['Condos, co-ops and townhomes', 'are more plentiful here than in most North Shore towns, especially near downtown, the train and the waterfront in Manorhaven and Port Washington North. A good option for downsizers and first-time buyers.'],
            ['New construction and teardowns', 'are common in the established neighborhoods. Village and town rules on setbacks, height and lot coverage shape what you can build.'],
          ]),
          p('With a background in construction, I walk every showing looking at what’s behind the walls, not just the finishes. On older homes I look for aging cesspools, outdated electrical and plumbing, water in basements and unpermitted work. On waterfront homes I add bulkheads, docks and flood exposure. For any home you’re considering, I can give you a sense of what a renovation or new build would cost.', 'A builder’s eye on older homes.'),
        ],
      },
      {
        id: 'market',
        heading: 'The market and what your budget buys',
        blocks: [
          p('Port Washington is a competitive market: well-priced homes move quickly and often draw multiple offers. Ask us for current numbers on the streets and price range you care about.'),
          bullets([
            ['Entry level:', 'condos and co-ops near downtown and the water, and smaller single-family homes in the hamlet and Manorhaven.'],
            ['The core of the market:', 'Colonials, Tudors and updated Capes in established neighborhoods such as Salem, Beacon Hill and the Port Washington sections of Flower Hill.'],
            ['The top of the market:', 'waterfront homes, new construction, and estates in Sands Point.'],
          ]),
          p('Inventory typically peaks in spring, when competition is also highest. Late fall and winter have fewer listings but fewer competing buyers, and sellers who list then are often motivated.', 'Timing.'),
          p('Port Washington has historically held its value well through market cycles, supported by the water, the schools and the train.', 'Long-term value.'),
        ],
      },
      {
        id: 'taxes',
        heading: 'Taxes and carrying costs',
        blocks: [
          p('Property taxes are the cost buyers most often underestimate, so plan for them from the start.'),
          p('A Port Washington tax bill combines several layers: Nassau County, the Town of North Hempstead, special districts (Port Washington has its own water, sewer, police, fire, parking and library districts), and the school district, which is the largest share. Homes inside an incorporated village also pay a village tax.', 'How your tax bill is built.'),
          p('It may reflect exemptions or a grievance reduction that won’t carry over to you. Homeowners can challenge their assessment each year through Nassau County’s Assessment Review Commission, and many use a grievance firm that works on contingency.', 'Don’t rely on the seller’s tax bill.'),
          p('New homeowners can apply for the New York State STAR credit, which reduces school taxes for households under the income limit. Seniors, veterans and others may qualify for additional exemptions.', 'STAR and exemptions.'),
          p('Other carrying costs to budget for:'),
          bullets([
            'Homeowners insurance, plus flood insurance for waterfront and low-lying homes',
            'Bulkhead and dock maintenance on waterfront properties',
            'Heating fuel: natural gas where lines exist; some older homes still heat with oil',
            'Cesspool maintenance on homes without sewer service. Most of the hamlet is sewered through the Port Washington Water Pollution Control District, but confirm for every property',
            'Parking permits and any club, marina or village fees',
          ]),
        ],
      },
      {
        id: 'commute',
        heading: 'Commute and transportation',
        blocks: [
          p('Port Washington has its own train line into Manhattan, and because it’s the end of the line, the trains start here.'),
          bullets([
            ['LIRR Port Washington Branch.', 'Port Washington is the first stop on the branch, so commuters board an empty train and can almost always find a seat. Trains run directly to both Penn Station and Grand Central Madison with no transfer at Jamaica, and peak express trains stop only at Plandome, Manhasset and Great Neck before running nonstop to the city.', [
              'To Penn Station: around 38 to 44 minutes on direct rush-hour trains.',
              'To Grand Central Madison: around 35 to 42 minutes via direct east-side service.',
              'Peak express and limited trains make select stops at Plandome, Manhasset and Great Neck before running straight toward Queens and Manhattan.',
            ]],
            ['Station parking.', 'The Port Washington Parking District runs the lots at the station, and parking requires a district permit. Many homes in the hamlet, Baxter Estates and Port Washington North are within walking distance of the train, and a local shuttle and the NICE n23 bus also serve the station.'],
            ['Driving.', 'Port Washington Boulevard (Route 101) connects to Northern Boulevard and the Long Island Expressway.', [
              'The route: Port Washington Boulevard (Route 101) south to either Northern Boulevard (Route 25A) or the Long Island Expressway (I-495 West).',
              'Morning rush (7:00 to 9:30 AM): expect 55 to 80 minutes on average. The heaviest traffic builds on the LIE approach to the Queens-Midtown Tunnel or the Queensboro Bridge.',
              'Worst case: on rainy mornings or days with a major accident on the LIE, the drive can stretch well past 1 hour 40 minutes.',
            ]],
            ['Airports.', 'LaGuardia and JFK are both a manageable drive by Long Island standards.'],
          ]),
        ],
      },
      {
        id: 'lifestyle',
        heading: 'Lifestyle',
        blocks: [
          p('Port Washington pairs a walkable downtown with the best of the North Shore waterfront.'),
          bullets([
            ['Downtown.', 'Main Street and the surrounding blocks are lined with restaurants, cafes, shops and services, all within walking distance of the train. These are my favorite picks:', [
              'Louie’s of Port Washington: steakhouse and seafood on the water',
              'La P’tite Framboise: French bistro',
              'Tiga: specialty sushi',
              'Yamaguchi: traditional sushi',
              'Finn McCool’s: modern Irish pub',
              'Amalfi: Italian and takeout, and the best chicken parm in town',
              'Serra Provisions: true brick-oven pizza, very casual',
            ]],
            ['The waterfront.', 'The Town Dock on Manhasset Bay has been the heart of the waterfront since 1908. The Manhasset BayWalk runs about 1.7 miles along the bay from the Town Dock to Manorhaven Beach Park, with Bay Walk Park, a kayak launch, piers and picnic areas along the way.'],
            ['Parks and beaches.', 'Sands Point Preserve, with the Falaise mansion and miles of trails along the Sound; North Hempstead Beach Park on Hempstead Harbor; Manorhaven Beach Park; Sunset Park and its John Philip Sousa Memorial Bandshell; and Harbor Links, a public golf course built on the old sand mines that once supplied New York City’s skyscrapers.'],
            ['Clubs and recreation.', 'Golf, yacht, beach and tennis clubs are spread across the peninsula, along with Harbor Links and the Port Washington Tennis Academy.', [
              'Port Washington Yacht Club',
              'Manhasset Bay Yacht Club',
              'North Hempstead Country Club (golf)',
            ]],
            ['On the water.', 'Manhasset Bay is one of the busiest boating harbors on the North Shore, with marinas, yacht clubs and moorings in Port Washington and Manorhaven.'],
            ['Community.', 'The Port Washington Public Library in Baxter Estates is a hub of town life. Youth sports, summer concerts, waterfront events and an active network of houses of worship make it easy to get involved.'],
            ['Healthcare.', 'St. Francis Hospital, a nationally known heart center, is just south in Flower Hill, and North Shore University Hospital is a short drive away in Manhasset.'],
          ]),
        ],
      },
      {
        id: 'process',
        heading: 'Buying in Port Washington: process and strategy',
        blocks: [
          p('Buying in New York works differently than in most states. Attorneys negotiate the contract, and nothing is binding until both sides sign it. Here’s how it unfolds.'),
          steps([
            ['Get pre-approved.', 'Many Port Washington purchases need a jumbo loan, which comes with stricter requirements for down payment, reserves and documentation. Condo and co-op purchases have their own approval steps, including board review for co-ops.'],
            ['Define your must-haves.', 'Decide early on elementary school zone, distance to the train, water access or views, lot size, and whether you’ll take on renovation.'],
            ['Search, including off-market.', 'Some of the best Port Washington homes never hit the open market. Through Compass Private Exclusives and our local relationships, we can show you homes before other buyers see them.'],
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
          p('Older homes and waterfront homes both come with their own risks. Use this list before you sign a contract.'),
          bullets([
            'Confirm the elementary school zone for the specific property',
            'Sewer or cesspool: confirm the property’s sewer connection, and have any cesspool inspected',
            'Flood zone and elevation, especially near Manhasset Bay, Hempstead Harbor and Sheets Creek',
            'Bulkhead, dock and seawall condition on waterfront homes, and the permits behind them',
            'Open permits and certificates of occupancy with the town or village; unpermitted work can delay a closing',
            'Underground or abandoned oil tanks: test or confirm proper removal',
            'Roof, foundation, drainage, and signs of water in the basement',
            'Age of the electrical and plumbing systems in older homes',
            'Village rules on renovations, additions, docks, tree removal and fences, if you plan changes',
            'For condos and co-ops: building finances, reserves, upcoming assessments and board rules',
            'The current tax bill, and whether it reflects exemptions or reductions that won’t carry over',
          ]),
          p('Once you have an accepted offer, schedule the engineer’s inspection right away and keep every step on schedule. If you move too slowly, the seller can lose faith and move on to a backup offer. Time kills deals.', 'The deal-breaker we see most: moving too slowly.'),
        ],
      },
      {
        id: 'why-us',
        heading: 'Why The Liappas Team',
        blocks: [
          p('We live here, we know this market house by house, and we bring a builder’s eye to every showing.'),
          bullets([
            ['A local.', 'I live in Port Washington. I know which blocks walk to the train, which streets see water in a storm, and which homes have been well cared for.'],
            ['A proven track record.', 'Many successful sales across Port Washington and the North Shore.'],
            ['A builder’s eye.', 'My background in construction means I spot structural, mechanical, waterfront and permit issues during the showing, before you’ve committed.'],
            ['The Compass advantage.', 'Early access to off-market homes through Compass Private Exclusives, real-time market data, and the reach of one of the country’s largest brokerages.'],
          ]),
        ],
      },
      {
        id: 'faq',
        heading: 'Frequently asked questions',
        blocks: [
          { type: 'faq', items: [
            { q: 'How competitive is the Port Washington market?', a: 'Very. Well-priced homes typically sell quickly, often above asking and with multiple offers. Ask us for current numbers.' },
            { q: 'Is every Port Washington address in the Port Washington school district?', a: 'Almost all of them. The district serves the hamlet, all four villages, and the Port Washington sections of Flower Hill and Plandome Manor. The bigger question is which of the five elementary schools a home is zoned for, and we confirm that for every property.' },
            { q: 'Port Washington or Manhasset?', a: 'Both have top schools, a short train ride and the water. Port Washington offers more variety, including condos and co-ops, a larger downtown and more waterfront living. Manhasset is smaller, with the Miracle Mile on its doorstep. We know both towns well and can help you compare specific homes.' },
            { q: 'What should I know about buying on the water?', a: 'Check the flood zone and elevation, the cost of flood insurance, and the condition and permits of any bulkhead or dock. A good inspection and a survey matter even more here.' },
            { q: 'What will my property taxes be?', a: 'It depends on the home’s assessed value, whether it sits in an incorporated village, and any exemptions. Before you make an offer, we’ll pull the current tax bill and walk you through what to expect as the new owner.' },
            { q: 'How long is the commute to Manhattan?', a: 'Port Washington is the first stop on its own LIRR branch, with direct trains to Penn Station and Grand Central Madison and faster express trains at peak hours.' },
            { q: 'When is the best time of year to buy?', a: 'Spring brings the most listings and the most competition. Fall and winter bring fewer buyers and often more motivated sellers.' },
          ] },
        ],
      },
    ],
    cta: {
      heading: 'Ready to find your home in Port Washington?',
      text: 'Let’s start with a conversation. Book a buyer consultation and we’ll review your goals, budget and timeline, and map out the right neighborhoods for you. Or ask for a custom market report on the streets and price range you care about, or a private tour of the neighborhoods and waterfront.',
    },
    sources: [
      'Port Washington, New York – Wikipedia; village pages for Sands Point and Manorhaven',
      'Port Washington Union Free School District – Wikipedia; Carrie Palmer Weber Middle School – Wikipedia',
      'Port Washington station – Wikipedia; MTA: Port Washington Branch express trains',
      'Bay Walk Park – Wikipedia',
      'Child care and private schools: Port Washington Public Library – Schools, Childcare and Enrichment, childcarecenter.us, Private School Review',
    ],
  },
  roslyn: {
    slug: 'roslyn',
    alsoFor: ['east-hills'],
    town: 'Roslyn and East Hills',
    title: 'Roslyn and East Hills Buyer’s Guide | Nicholas Liappas',
    metaDescription: 'Nicholas Liappas’s guide to buying in Roslyn and East Hills, NY: villages and school zoning, housing stock, taxes, the commute and how buying in New York works.',
    heading: 'Roslyn and East Hills Buyer’s Guide',
    subtitle: 'What to know before you buy on the North Shore',
    updated: 'November 2026',
    publishedAt: '2026-11-09',
    modifiedAt: '2026-11-09',
    intro: 'Roslyn and East Hills combine one of Long Island’s most charming historic villages with some of its most sought-after suburban neighborhoods. Roslyn’s 1895 Clock Tower, harbor-front park and 19th-century streets give the area a character few towns can match, while East Hills offers spacious homes, quiet streets and one of the best village parks on the North Shore. Both are served primarily by the highly regarded Roslyn school district.',
    sections: [
      {
        id: 'why-roslyn-east-hills',
        heading: 'Why Roslyn and East Hills',
        blocks: [
          p('What Roslyn and East Hills are known for:'),
          bullets([
            ['Schools.', 'The Roslyn school district is one of the most respected on Long Island.'],
            ['History and charm.', 'A walkable historic village center with the Clock Tower, Gerry Park, the Bryant Library and the Roslyn Grist Mill.'],
            ['Space.', 'East Hills and the surrounding villages offer larger homes and lots on quiet, hilly streets, with some of the highest elevations in Nassau County.'],
            ['Location.', 'Easy access to the Long Island Expressway and Northern State Parkway, with Manhattan, the airports and the rest of Long Island within reach.'],
            ['The Park at East Hills.', 'A village park with a pool, courts, fields and trails that anchors community life.'],
          ]),
          p('Roslyn and East Hills sit firmly in the upper tier of the North Shore market, and well-priced homes draw strong interest. The wider Roslyn area, from village condos to East Hills colonials to Roslyn Harbor estates, offers more ways in than many buyers expect.', 'A note on price.'),
          p('We work across the North Shore every day and know the Roslyn area street by street, including which side of a school-district line a home sits on.', 'Why listen to us:'),
        ],
      },
      {
        id: 'at-a-glance',
        heading: 'Roslyn and East Hills at a glance',
        blocks: [
          p('The Greater Roslyn area sits on Long Island’s North Shore at the head of Hempstead Harbor, about 20 miles east of Midtown, on the Harbor Hill Moraine.'),
          { type: 'facts', rows: [
            ['Location', 'North Shore of Nassau County, mostly in the Town of North Hempstead'],
            ['Population (2020 Census)', 'East Hills 7,284 · Roslyn Heights 6,747 · Village of Roslyn 2,988 · Roslyn Estates 1,318 · Roslyn Harbor 1,067 · Greenvale 1,069'],
            ['Main school district', 'Roslyn Union Free School District (with exceptions; see Schools)'],
            ['ZIP codes', '11576 (Roslyn, East Hills) and 11577 (Roslyn Heights)'],
          ] },
          p('“Roslyn” covers several communities. The Village of Roslyn, East Hills, Roslyn Estates and Roslyn Harbor are incorporated villages, each with its own government, building department and village tax. Roslyn Heights and Greenvale are unincorporated hamlets governed directly by the town. Which one a home is in affects your taxes, permits and services.', 'How it’s governed.'),
          p('Parts of East Hills, Roslyn Heights, Roslyn Harbor and Greenvale are zoned for other districts. Always confirm the school district for the specific property before you make an offer.', 'A Roslyn address doesn’t guarantee Roslyn schools.'),
        ],
      },
      {
        id: 'villages',
        heading: 'Villages and neighborhoods',
        blocks: [
          p('Each part of the Roslyn area has its own feel. Here’s a quick guide; ask us for the street-by-street detail.'),
          { type: 'table', columns: ['Area', 'What it’s like', 'School district'], rows: [
            ['East Hills (village)', 'The largest village in the area: spacious postwar colonials, ranches and newer homes on hilly, quiet streets, built largely after World War II on former estate land, including Clarence Mackay’s Harbor Hill. Home to The Park at East Hills. Most homes are on cesspools. About 7,300 residents.', 'Mostly Roslyn; parts of the southeast are East Williston, and a small corner is Jericho'],
            ['Village of Roslyn', 'The historic heart of the area: the Clock Tower, Gerry Park, the Bryant Library, Old Northern Boulevard and 19th-century homes, plus waterfront condos at Roslyn Landing. Walkable and sewered. About 3,000 residents.', 'Roslyn'],
            ['Roslyn Estates (village)', 'A planned community from 1908, once called “The Eden of Long Island,” with winding streets, ponds and preserves, and a mix of older homes and 1950s ranches and split-levels. About 1,300 residents.', 'Roslyn'],
            ['Roslyn Harbor (village)', 'The “Millionaire’s Village”: former estates on Hempstead Harbor, home to Cedarmere and the Nassau County Museum of Art. Large properties. About 1,100 residents.', 'Roslyn or North Shore, depending on the property'],
            ['Roslyn Heights (hamlet)', '“The Heights”: a mix of homes and price points close to the LIRR station, Roslyn High School and the Expressway. About 6,700 residents.', 'Mostly Roslyn; some areas are East Williston or Herricks'],
            ['Greenvale (hamlet)', 'Small and quiet, along Northern Boulevard near LIU Post, with its own LIRR station. No sewers.', 'Mostly Roslyn; the Oyster Bay side is North Shore'],
            ['Flower Hill and North Hills (Roslyn parts)', 'Sections of these villages are zoned for Roslyn schools.', 'Roslyn for those sections'],
          ] },
        ],
      },
      {
        id: 'schools',
        heading: 'Schools',
        blocks: [
          p('The Roslyn Union Free School District is one of the most respected on Long Island, and for many buyers it’s the reason they look here first. Founded in 1904, it serves about 3,000 students. Students start together at The Heights School, attend one of two elementary schools, then come back together at the middle and high school.'),
          { type: 'table', columns: ['School', 'Grades', 'Location'], rows: [
            ['The Heights School', 'Pre-K–1', 'Roslyn Heights'],
            ['Harbor Hill Elementary', '1–5', 'East Hills'],
            ['East Hills Elementary', '2–5', 'East Hills'],
            ['Roslyn Middle School', '6–8', 'East Hills'],
            ['Roslyn High School', '9–12', 'Roslyn Heights'],
          ] },
          p('The district serves the villages of Roslyn and Roslyn Estates entirely, most of East Hills, and parts of Roslyn Heights, Roslyn Harbor, Greenvale, Flower Hill, North Hills, Albertson and Glenwood Landing.'),
          p('The Roslyn area is split among several districts. Parts of southeastern East Hills go to East Williston, a small Oyster Bay corner of East Hills goes to Jericho, parts of Roslyn Heights go to East Williston or Herricks, and parts of Roslyn Harbor and Greenvale go to North Shore. We verify the school district for every property before our clients make an offer.', 'Watch for zoning traps.'),
          { type: 'h3', text: 'Schools and child care by age' },
          p('The Roslyn area has options at every stage, from infant care through high school. Many programs span more than one age group; each is listed under its main one.'),
          { type: 'table', columns: ['Stage', 'Options in the Roslyn area'], rows: [
            ['Day care (infants and toddlers)', 'Growing Tree Nursery School (infants through Pre-K, before- and after-school, camp) · Trinity Episcopal Church Roslyn Childcare Center · MunchKIDS PlayHouse'],
            ['Nursery schools', 'Roslyn-Trinity Day School (toddlers, Pre-K) · Harbor Child Care (toddlers, Pre-K)'],
            ['Preschools', 'Pierce Country Day School (toddlers through Pre-K, camp) · The Heights School (public Pre-K)'],
            ['Elementary', 'Harbor Hill and East Hills Elementary (public) · Buckley Country Day School (independent, co-ed, pre-nursery through grade 8, on a 28-acre campus in North Hills)'],
            ['Middle school', 'Roslyn Middle School, grades 6–8 (public) · Buckley Country Day School, through grade 8'],
            ['High school', 'Roslyn High School, grades 9–12 (public)'],
          ] },
          p('Independent and Catholic high schools elsewhere on the North Shore are a short drive away.'),
        ],
      },
      {
        id: 'housing',
        heading: 'Housing stock and architecture',
        blocks: [
          p('The Roslyn area spans more than a century of architecture, from 19th-century village homes to brand-new construction.'),
          bullets([
            ['Historic homes', 'line the streets of the Village of Roslyn, many dating to the 1800s, with a character you won’t find elsewhere on Long Island.'],
            ['Postwar colonials, ranches and split-levels', 'fill East Hills and Roslyn Heights, many of them expanded, renovated or rebuilt over the years.'],
            ['Planned-community homes', 'in Roslyn Estates sit on winding streets laid out in the early 1900s, alongside 1950s ranches and split-levels.'],
            ['Estates and large properties', 'define Roslyn Harbor and parts of East Hills.'],
            ['Condos and townhomes', 'offer a lower-maintenance option, including the waterfront Roslyn Landing development in the village.'],
            ['New construction and teardowns', 'are common in East Hills and Roslyn Heights. Village and town rules on setbacks, height and lot coverage shape what you can build.'],
          ]),
          p('With a background in construction, I walk every showing looking at what’s behind the walls, not just the finishes. In the Roslyn area I pay particular attention to cesspools, since much of East Hills and Greenvale has no sewers, as well as steep lots and drainage on the hills, outdated electrical and plumbing, and unpermitted work. For any home you’re considering, I can give you a sense of what a renovation or new build would cost.', 'A builder’s eye on older homes.'),
        ],
      },
      {
        id: 'market',
        heading: 'The market and what your budget buys',
        blocks: [
          p('The Roslyn area is a competitive market: well-priced homes move quickly and often draw multiple offers. Ask us for current numbers on the streets and price range you care about.'),
          bullets([
            ['Entry level:', 'condos and townhomes, and smaller single-family homes in Roslyn Heights and parts of the village.'],
            ['The core of the market:', 'colonials, ranches and split-levels in East Hills, Roslyn Estates and Roslyn Heights, many updated or expanded.'],
            ['The top of the market:', 'new construction and large homes in East Hills, and estates in Roslyn Harbor.'],
          ]),
          p('Inventory typically peaks in spring, when competition is also highest. Late fall and winter have fewer listings but fewer competing buyers, and sellers who list then are often motivated.', 'Timing.'),
          p('Roslyn and East Hills have historically held their value well through market cycles, supported by the schools, the location and limited supply.', 'Long-term value.'),
        ],
      },
      {
        id: 'taxes',
        heading: 'Taxes and carrying costs',
        blocks: [
          p('Property taxes are the cost buyers most often underestimate, so plan for them from the start.'),
          p('A Roslyn-area tax bill combines several layers: Nassau County, the town, special districts (such as water, fire, sewer and library), and the school district, which is the largest share. Homes inside an incorporated village also pay a village tax.', 'How your tax bill is built.'),
          p('It may reflect exemptions or a grievance reduction that won’t carry over to you. Homeowners can challenge their assessment each year through Nassau County’s Assessment Review Commission, and many use a grievance firm that works on contingency.', 'Don’t rely on the seller’s tax bill.'),
          p('New homeowners can apply for the New York State STAR credit, which reduces school taxes for households under the income limit. Seniors, veterans and others may qualify for additional exemptions.', 'STAR and exemptions.'),
          p('Other carrying costs to budget for:'),
          bullets([
            'Homeowners insurance, plus flood insurance for low-lying homes near Hempstead Harbor',
            'Cesspool maintenance and eventual replacement on homes without sewer service, common in East Hills and Greenvale',
            'Heating fuel: natural gas where lines exist; some older homes still heat with oil',
            'Village fees and any club or recreation memberships',
          ]),
        ],
      },
      {
        id: 'commute',
        heading: 'Commute and transportation',
        blocks: [
          p('The Roslyn area’s biggest commuting advantage is its location between two rail lines and two major highways.'),
          bullets([
            ['LIRR Oyster Bay Branch.', 'Roslyn station (in Roslyn Heights) and Greenvale station serve the area. The Town of North Hempstead runs a free commuter lot at Roslyn station with more than 200 spaces. The branch runs diesel service, so most trips include a quick change at Jamaica.', [
              'Travel time from Roslyn station to Manhattan typically averages 50 to 60 minutes; limited direct peak-hour trains cut it to about 45 minutes.',
              'Most trips include a timed transfer to an electric train at Jamaica. You usually just walk across the same platform to the connecting train.',
              'To Penn Station: typically 53 to 60 minutes with the Jamaica transfer. A few direct trains in the morning rush (around 6:28 and 7:47 AM) skip the transfer and arrive in 45 to 48 minutes.',
              'To Grand Central Madison: typically 54 to 63 minutes. Virtually all trips change at Jamaica, then run directly to the East Side terminal.',
              'Trains run about once an hour off-peak, with occasional longer gaps around midday. Check live times in the MTA TrainTime app before heading to the platform.',
              'The Roslyn station lot is free and needs no permit, a rarity on the LIRR. Because anyone can use it, it fills quickly in the morning rush.',
            ]],
            ['Port Washington Branch.', 'Some commuters drive to nearby Port Washington Branch stations for its direct electric trains. Check parking rules first, since many of those lots favor local permit holders.'],
            ['Driving.', 'The Long Island Expressway and Northern State Parkway run right through the area, and Northern Boulevard (Route 25A) connects to the rest of the North Shore. Figure an hour to an hour and a half in rush-hour traffic.'],
            ['Airports.', 'LaGuardia and JFK are both a manageable drive by Long Island standards.'],
            ['Buses.', 'Several NICE bus routes serve the Village of Roslyn and nearby areas.'],
          ]),
        ],
      },
      {
        id: 'lifestyle',
        heading: 'Lifestyle',
        blocks: [
          p('Roslyn and East Hills offer a rare mix: a historic village with real character, and suburban neighborhoods with first-class recreation.'),
          bullets([
            ['The village.', 'The Ellen E. Ward Memorial Clock Tower, built in 1895, anchors a walkable village of restaurants, shops and historic buildings along Old Northern Boulevard. The Roslyn Grist Mill, an 18th-century Dutch-framed watermill, is being restored. Some of my favorite restaurants:', [
              'Kyma: high-end Greek with an after-dinner party vibe',
              'Bryant & Cooper: the best steakhouse in town',
              'Hendrick’s Tavern: another of the best steakhouses around, with incredible ambiance; same owner as Bryant & Cooper, with a more traditional feel',
              'Okaru: elegant, chic sushi',
              'Felice Roslyn: incredible Italian and pasta',
              'Besito Mexican: delicious cocktails and Mexican fare',
              'Delicacies Roslyn: one of the best delis on the North Shore',
            ]],
            ['Parks and the harbor.', 'Gerry Park sits at the center of the village, and a waterfront promenade runs along Hempstead Harbor. Christopher Morley Park, Clark Botanic Garden, and the trails and preserves of Roslyn Estates are all close by.'],
            ['The Park at East Hills.', 'Built on the former Roslyn Air National Guard Station, it has a pool, playground, dog park, theater, nature paths, fitness facilities, a baseball field, and tennis, pickleball and basketball courts.'],
            ['Culture.', 'The Bryant Library, founded in 1878, holds the largest local history archive in Nassau County. Cedarmere, poet William Cullen Bryant’s former home, and the Nassau County Museum of Art are both in Roslyn Harbor.'],
            ['Clubs and recreation.', 'Wheatley Hills Golf Club, The Tennis King in Roslyn Estates, and golf, tennis and swim clubs across the North Shore.'],
            ['Community.', 'Village events, youth sports and an active network of houses of worship make it easy to get involved.'],
            ['Healthcare.', 'St. Francis Hospital, a nationally known heart center, is right next door in Flower Hill, and North Shore University Hospital is a short drive away in Manhasset.'],
          ]),
        ],
      },
      {
        id: 'process',
        heading: 'Buying in Roslyn and East Hills: process and strategy',
        blocks: [
          p('Buying in New York works differently than in most states. Attorneys negotiate the contract, and nothing is binding until both sides sign it. Here’s how it unfolds.'),
          steps([
            ['Get pre-approved.', 'Many Roslyn-area purchases need a jumbo loan, which comes with stricter requirements for down payment, reserves and documentation. Condo purchases have their own approval steps.'],
            ['Define your must-haves.', 'Decide early on school district, commute, lot size, and whether you’ll take on renovation.'],
            ['Search, including off-market.', 'Some of the best homes in the area never hit the open market. Through Compass Private Exclusives and our local relationships, we can show you homes before other buyers see them.'],
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
          p('Use this list before you sign a contract.'),
          bullets([
            'Confirm the school district for the specific property, not just the mailing address',
            'Sewer or cesspool: much of East Hills and all of Greenvale have no sewers. Have the cesspool inspected and know the replacement cost',
            'Drainage, retaining walls and grading on hilly lots',
            'Flood zone and elevation for homes near Hempstead Harbor',
            'Historic preservation rules for older homes in the Village of Roslyn, if you plan changes',
            'Open permits and certificates of occupancy with the town or village; unpermitted work can delay a closing',
            'Underground or abandoned oil tanks: test or confirm proper removal',
            'Roof, foundation, and signs of water in the basement',
            'Age of the electrical and plumbing systems in older homes',
            'For condos: building finances, reserves, upcoming assessments and rules',
            'The current tax bill, and whether it reflects exemptions or reductions that won’t carry over',
          ]),
          p('Once you have an accepted offer, schedule the engineer’s inspection right away and keep every step on schedule. If you move too slowly, the seller can lose faith and move on to a backup offer. Time kills deals.', 'The deal-breaker we see most: moving too slowly.'),
        ],
      },
      {
        id: 'why-us',
        heading: 'Why The Liappas Team',
        blocks: [
          p('We know the North Shore house by house, and we bring a builder’s eye to every showing.'),
          bullets([
            ['Local knowledge.', 'We know the Roslyn area’s villages, school-district lines and streets, and which homes have been well cared for.'],
            ['A proven track record.', 'Many successful sales across the North Shore.'],
            ['A builder’s eye.', 'My background in construction means I spot structural, mechanical, drainage and permit issues during the showing, before you’ve committed.'],
            ['The Compass advantage.', 'Early access to off-market homes through Compass Private Exclusives, real-time market data, and the reach of one of the country’s largest brokerages.'],
          ]),
        ],
      },
      {
        id: 'faq',
        heading: 'Frequently asked questions',
        blocks: [
          { type: 'faq', items: [
            { q: 'How competitive is the Roslyn-area market?', a: 'Very. Well-priced homes typically sell quickly, often above asking and with multiple offers. Ask us for current numbers.' },
            { q: 'Which Roslyn and East Hills addresses aren’t in the Roslyn school district?', a: 'Parts of southeastern East Hills are in East Williston, a small Oyster Bay corner of East Hills is in Jericho, parts of Roslyn Heights are in East Williston or Herricks, and parts of Roslyn Harbor and Greenvale are in North Shore. Always confirm by property.' },
            { q: 'Roslyn or East Hills?', a: 'The Village of Roslyn offers history, walkability and harbor views; East Hills offers larger homes, quiet streets and The Park at East Hills. Both are mostly in the Roslyn school district, and we can help you compare specific homes.' },
            { q: 'What will my property taxes be?', a: 'It depends on the home’s assessed value, whether it sits in an incorporated village, its school district, and any exemptions. Before you make an offer, we’ll pull the current tax bill and walk you through what to expect as the new owner.' },
            { q: 'How long is the commute to Manhattan?', a: 'It depends on the station and the train. Roslyn and Greenvale are on the Oyster Bay Branch, and some commuters drive to the Port Washington Branch for direct electric service. We’ll help you find the best route from any home you’re considering.' },
            { q: 'When is the best time of year to buy?', a: 'Spring brings the most listings and the most competition. Fall and winter bring fewer buyers and often more motivated sellers.' },
          ] },
        ],
      },
    ],
    cta: {
      heading: 'Ready to find your home in Roslyn or East Hills?',
      text: 'Let’s start with a conversation. Book a buyer consultation and we’ll review your goals, budget and timeline, and map out the right neighborhoods for you. Or ask for a custom market report on the streets and price range you care about, or a private tour of the area.',
    },
    sources: [
      'Wikipedia pages for Roslyn, East Hills, Roslyn Heights, Roslyn Estates, Roslyn Harbor and Greenvale',
      'Roslyn Union Free School District – Wikipedia',
      'Roslyn station – Wikipedia; MTA TrainTime',
      'Child care and private schools: childcarecenter.us, Buckley Country Day School – Wikipedia, Private School Review',
    ],
  },
};
