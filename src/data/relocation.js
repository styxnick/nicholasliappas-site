// Landing page for buyers leaving New York City for the North Shore.
// Hugo's NYC-buyer ads point here; the page routes people to the right
// town page and buyer's guide.

export const relocation = {
  path: '/moving-to-long-island',
  title: 'Moving from NYC to Long Island’s North Shore | Nicholas Liappas',
  metaDescription: 'Leaving the city for Long Island? Nicholas Liappas at Compass matches NYC buyers with the right North Shore town: commute, schools, housing and how buying here differs.',
  eyebrow: 'Moving from New York City',
  heading: 'Get more breathing room on Long Island',
  subtitle: 'A North Shore guide for buyers leaving the city',
  intro: 'Twenty-five miles from Midtown, the North Shore of Long Island trades a two-bedroom for a yard, a parking space for a driveway, and a building for a town. The hard part isn’t deciding to leave the city. It’s deciding where to land. Here’s how we help city buyers choose.',
  whatChanges: {
    heading: 'What actually changes when you leave the city',
    items: [
      ['Space.', 'A budget that buys a two-bedroom in Brooklyn or Queens buys a four-bedroom house on a quarter acre in most of our towns. Most homes have a garage, a basement and a yard.'],
      ['Schools.', 'Public school district is the single biggest driver of price out here, and the district lines don’t follow town names. We confirm the district for every property before you make an offer.'],
      ['Taxes instead of maintenance.', 'There is no monthly maintenance or common charge on a house. Instead you pay property tax, which on the North Shore commonly runs from the low teens to $30,000 or more a year. We pull the exact bill for any home you consider.'],
      ['The commute.', 'Most of our towns are 30 to 60 minutes from Penn Station or Grand Central Madison by Long Island Rail Road, with parking at the station and a short drive or walk from home.'],
      ['The car.', 'You’ll own one. Downtowns are walkable, but daily life runs on driving, and the Long Island Expressway and Northern State Parkway connect everything.'],
    ],
  },
  matcher: {
    heading: 'Which town should you look at?',
    intro: 'Every North Shore town has a different answer to the question city buyers ask most: what do I give up, and what do I get? A quick guide to the six we work most.',
    towns: [
      { slug: 'manhasset', from: 'Coming from the Upper East Side or Park Slope', fit: 'You want the shortest commute, a real downtown with Americana Manhasset, and one of the most sought-after school districts on Long Island. Expect to pay for it.', commute: 'About 30 to 35 minutes to Penn Station on the Port Washington Branch, with electric trains that run direct.' },
      { slug: 'port-washington', from: 'Coming from Brooklyn Heights or Astoria', fit: 'You want water, a Main Street with real restaurants, and a range of price points from capes to waterfront estates. The most “town” feel of the group.', commute: 'About 40 to 45 minutes to Penn Station. Port Washington is the end of its branch, so you always get a seat.' },
      { slug: 'roslyn', from: 'Coming from the West Village or Forest Hills', fit: 'You want history and charm: an 1895 clock tower, a harbor-front village, excellent restaurants, and a top school district, with condos and townhomes as well as houses.', commute: 'About 50 to 60 minutes with a quick cross-platform change at Jamaica. Many commuters drive to the Port Washington Branch instead.' },
      { slug: 'east-hills', from: 'Coming from Riverdale or Bayside', fit: 'You want space: larger postwar homes on quiet, hilly streets, a village park with a pool and courts, and the Roslyn school district without the village price in many cases.', commute: 'Drive to Roslyn or Greenvale station on the Oyster Bay Branch, or to a Port Washington Branch station for direct electric service.' },
      { slug: 'glen-head', from: 'Coming from Jackson Heights or Sunnyside', fit: 'You want value on the Gold Coast: a strong community feel, the North Shore school district, and more house for the money than the towns to the west.', commute: 'About an hour on the Oyster Bay Branch, with a change at Jamaica, or drive to a Port Washington Branch station.' },
      { slug: 'glenwood-landing', from: 'Coming from anywhere with a budget to protect', fit: 'You want the most affordable entry to the North Shore: harbor access, renovation opportunities, and Sea Cliff and Glen Cove next door.', commute: 'Glen Head and Sea Cliff stations on the Oyster Bay Branch are minutes away; about an hour to Penn Station.' },
    ],
  },
  differs: {
    heading: 'How buying a house here differs from buying in the city',
    items: [
      ['No board package.', 'Single-family homes have no co-op board, no interview and no building approval. Condos and co-ops in the villages do, but the process is lighter than in Manhattan.'],
      ['Attorneys run the contract.', 'As in the city, offers aren’t binding until both sides sign a contract drafted and negotiated by attorneys. The deposit is typically 10%.'],
      ['The inspection matters more.', 'You’re buying the roof, the boiler, the foundation and often a cesspool, not a share of a building. We walk every showing with a builder’s eye and bring in an engineer before contract.'],
      ['Jumbo loans are routine.', 'Most North Shore purchases exceed the conforming loan limit, so pre-approval requirements for down payment, reserves and documentation are stricter. Get pre-approved before you look.'],
      ['It moves fast.', 'Well-priced homes draw multiple offers within days. Having your financing, attorney and inspector lined up before you find the house is what wins.'],
    ],
  },
  guidesHeading: 'Read the town guides',
  guidesIntro: 'Each guide covers the villages and school lines, housing stock, taxes, the commute and the buying process in detail.',
  cta: {
    heading: 'Tell us where you’re coming from',
    text: 'Book a buyer consultation and we’ll match your budget, commute and school priorities to the right towns, then set up a day of showings. No obligation.',
  },
};
