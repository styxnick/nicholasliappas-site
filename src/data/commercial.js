// Copy for /commercial (src/pages/Commercial.jsx). Edited from the
// 2026-10-14 brief; keep prose here so the page component stays layout-only.

// Property Types grid. `image` is a transaction photo slug under
// public/commercial/transactions/ (see brief §13); the page renders a gradient
// if the file is missing.
export const propertyTypes = [
  { title: 'Land & Development Sites', tags: ['Sales'], image: 'crescent-st-long-island-city',
    text: 'Buildable lots, teardown and assemblage opportunities, subdivisions, and North Fork acreage. I look at zoning, yield and feasibility before price, so sellers capture what a developer would actually pay and buyers know what they can build.' },
  { title: 'Retail', tags: ['Sales', 'Leasing'], image: 'union-tpke-fresh-meadows',
    text: 'Main Street storefronts, strip and neighborhood centers, and restaurant space. I handle landlord and tenant representation, covering co-tenancy, use clauses, frontage, parking and the infrastructure food tenants need.' },
  { title: 'Office', tags: ['Sales', 'Leasing'], image: 'e-2nd-st-mineola',
    text: 'Professional office suites, small office buildings and owner-user buildings. I compare space by real usable area, layout efficiency and fit-out cost, not just by asking rent.' },
  { title: 'Medical Office', tags: ['Sales', 'Leasing'], image: 'walnut-st-long-beach',
    text: 'Space for physician practices, dental, physical therapy and specialty care. Medical build-outs have specific needs (plumbing in every exam room, ADA access, electrical load, parking ratios), and I check for them before you sign.' },
  { title: 'Mixed-Use', tags: ['Sales'], image: 'park-blvd-massapequa-park',
    text: 'Retail or office downstairs and apartments upstairs, which is the classic Main Street building. I underwrite both income streams and account for the code and maintenance realities of older buildings.' },
  { title: 'Industrial & Flex', tags: ['Sales', 'Leasing'], image: 'stillwell-ave-bronx',
    text: 'Warehouse, contractor, auto and flex space. I look at ceiling heights, loading, power and environmental history, which are the things that decide whether a building works for the business.' },
  { title: 'Investment Sales & 1031 Exchanges', tags: ['Sales'], image: 'william-floyd-pkwy-shirley',
    text: 'Multifamily, net-leased and multi-tenant properties for investors. I cover cap rate and rent-roll analysis, and coordinate with your CPA and attorney on 1031 timelines and cost segregation.' },
  { title: 'Owner-Users', tags: ['Sales'], image: 'tulip-ave-floral-park',
    text: 'Businesses ready to stop paying rent and own their building. I compare buying against leasing honestly, and I\'ll tell you when your landlord\'s number doesn\'t hold up.' },
];

export const whoIRepresent = [
  { title: 'Owners & Sellers', text: 'pricing, positioning and a marketing plan built for commercial buyers' },
  { title: 'Buyers & Investors', text: 'sourcing, underwriting and due-diligence management' },
  { title: 'Landlords', text: 'tenant placement, lease structure and vacancy strategy' },
  { title: 'Tenants', text: 'space search, build-out estimates and lease negotiation (often at no cost to the tenant)' },
  { title: 'Developers', text: 'site sourcing, assemblage and owner outreach' },
  { title: 'Owner-Users', text: 'practices, gyms, contractors and service businesses buying their own space' },
];

export const walkthroughChecks = [
  'Roof age and rooftop HVAC units (condition, tonnage, replacement cost)',
  'Electrical service (amperage, three-phase power, room for a new tenant\'s load)',
  'Fire suppression, sprinklers and egress',
  'ADA accessibility (entrances, restrooms, parking)',
  'Plumbing capacity and restroom count, which matter for medical and food use',
  'Ceiling heights, loading and column spacing',
  'Certificate of occupancy and permitted use versus the intended use',
  'Environmental red flags: former auto, dry-cleaning or fuel uses and oil tanks (when to order a Phase I)',
  'Realistic build-out and tenant-improvement cost',
  'Deferred maintenance that should come off the price',
];

export const howItWorks = {
  sales: {
    label: 'Selling an Investment or Commercial Property',
    steps: [
      ['Valuation', '$/sf comps, cap rate and income analysis, plus what the building needs'],
      ['Positioning', 'who the buyer is (investor, owner-user or developer) and how to reach them'],
      ['Marketing', 'Compass platform, commercial listing networks and direct outreach to buyers and developers'],
      ['Negotiation & Due Diligence', 'LOI, contract, inspections and environmental review, kept on schedule'],
      ['Closing', 'coordinating attorneys, lenders, title and your CPA through to the finish'],
    ],
  },
  leasing: {
    label: 'Leasing Space (Landlord or Tenant)',
    steps: [
      ['Needs', 'size, use, budget, location and timing'],
      ['Search or Market', 'touring and comparing options, or marketing your vacancy'],
      ['Space Analysis', 'layout fit and build-out estimate before anyone commits'],
      ['LOI & Lease', 'rent, term, escalations, NNN vs. gross, CAM, tenant-improvement allowance, free rent, personal guarantee, renewal options'],
      ['Move-In', 'build-out coordination and keys'],
    ],
  },
};

export const markets = [
  { name: 'North Shore', text: 'Northern Boulevard (Manhasset, Roslyn, Great Neck), Plandome Road, Port Washington\'s Main Street and the Sintsink Drive commercial area, Glen Head and Glen Cove, and the Lake Success office and medical market near the Northwell campus' },
  { name: 'Queens', text: 'Astoria, Bayside (Bell Boulevard), Flushing and Northern Boulevard' },
  { name: 'North Fork', text: 'Greenport, Southold, Mattituck, Cutchogue and Riverhead, including Main Road retail, hospitality, and land and farm parcels (with development-rights status checked up front)' },
];

export const greekLine = 'I work in Greek as well as English, which matters to many property owners in Astoria and across Long Island.';

export const roles = ['Owner / Seller', 'Buyer / Investor', 'Landlord', 'Tenant looking for space', 'Developer', 'Business owner looking to buy'];
export const formPropertyTypes = ['Land', 'Retail', 'Office', 'Medical', 'Mixed-Use', 'Industrial / Flex', 'Multifamily / Investment', 'Other'];
export const timelines = ['Now', '3–6 months', '6–12 months', 'Exploring'];

export const faqs = [
  { q: 'How is commercial property valued?',
    a: 'Usually by income (net operating income divided by a market cap rate) and checked against recent sales on a price-per-square-foot basis. Owner-user buildings lean more on comparable sales, and development sites are valued on what can legally be built.' },
  { q: 'What\'s the difference between a NNN lease and a gross lease?',
    a: 'In a gross lease the tenant pays one rent and the landlord covers taxes, insurance and maintenance. In a triple-net (NNN) lease the tenant pays base rent plus its share of those costs. Many leases fall somewhere in between, so the structure matters as much as the rent.' },
  { q: 'What is a tenant-improvement (TI) allowance?',
    a: 'Money the landlord contributes toward building out the space for a tenant. How much you can negotiate depends on the term, the condition of the space and the market. Knowing the real build-out cost before you negotiate is where my construction background pays off.' },
  { q: 'Do tenants pay for a broker?',
    a: 'In most commercial leases the landlord pays the brokerage commission, including the tenant\'s broker. I\'ll confirm how it works on your specific deal up front.' },
  { q: 'How long does a commercial lease or sale take?',
    a: 'A straightforward lease can take 30 to 90 days from tour to signing. Sales typically run 60 to 120 days or more depending on due diligence, financing and approvals.' },
  { q: 'Can you help with a 1031 exchange?',
    a: 'Yes. I help identify replacement properties within the 45-day window and coordinate timing with your qualified intermediary, CPA and attorney. (I don\'t give tax or legal advice; your advisors make those calls.)' },
];

export const seo = {
  title: 'Commercial Real Estate Broker | North Shore, Queens & North Fork | Nicholas Liappas, Compass',
  description: 'Commercial sales and leasing for land, retail, office, medical, mixed-use and industrial property across Long Island\'s North Shore, Queens and the North Fork. Nicholas Liappas, Licensed Associate Real Estate Broker at Compass.',
};

export const complianceLine = 'Nicholas Liappas, Licensed Associate Real Estate Broker · The Liappas Team at Compass · Compass is a licensed real estate broker. Information is deemed reliable but not guaranteed.';
