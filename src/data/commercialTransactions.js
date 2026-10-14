// Selected commercial transactions — The Liappas Team at Compass
// Images live in /public/commercial/transactions/<slug>.webp (+ .jpg fallback).
// Render rule: show `dealType` and `role` only when non-empty; show `town` only when non-empty. NEVER show a price.

export const commercialTransactions = [
  { slug: 'plandome-rd-manhasset',         address: '135-139 Plandome Rd',     town: 'Manhasset',        type: 'Medical / Office',                     dealType: 'Sale',          role: 'Represented Seller' },
  { slug: 'park-blvd-massapequa-park',     address: '1001-1007 Park Blvd',     town: 'Massapequa Park',  type: 'Mixed-Use Retail',                     dealType: 'Sale',          role: 'Represented Buyer' },
  { slug: 'tulip-ave-floral-park',         address: '141-143 Tulip Ave',       town: 'Floral Park',      type: 'Retail / Mixed-Use',                   dealType: 'Lease',         role: 'Represented Landlord' },
  { slug: 'e-2nd-st-mineola',              address: '70 E 2nd St',             town: 'Mineola',          type: 'Office',                               dealType: 'Sale & Lease',  role: 'Represented Buyer · Leasing' },
  { slug: 'walnut-st-long-beach',          address: '5 E Walnut St',           town: 'Long Beach',       type: 'Medical Office',                       dealType: 'Sale',          role: 'Represented Seller' },
  { slug: 'crescent-st-long-island-city',  address: '40-12 Crescent St',       town: 'Long Island City', type: 'Development Site',                     dealType: 'Sale',          role: 'Represented Seller' },
  { slug: 'william-floyd-pkwy-shirley',    address: '545 William Floyd Pkwy',  town: 'Shirley',          type: 'Net-Lease Retail',                     dealType: 'Sale · 1031 Exchange', role: 'Represented Buyer' },
  { slug: 'union-tpke-fresh-meadows',      address: '179-11 Union Tpke',       town: 'Fresh Meadows',    type: 'Retail Storefront',                    dealType: 'Lease',         role: 'Represented Landlord' },
  { slug: 'hempstead-ave-lynbrook',        address: '178 Hempstead Ave',       town: 'Lynbrook',         type: 'Retail Storefront',                    dealType: 'Sale',          role: 'Represented Seller & Buyer' },
  { slug: 'stillwell-ave-bronx',           address: '1580 Stillwell Ave',      town: 'Bronx',            type: 'Industrial / Specialty Manufacturing', dealType: 'Lease',         role: 'Represented Tenant' },
  { slug: 'glen-cove-ave',                 address: '456 Glen Cove Ave',       town: '',                 type: 'Professional Office',                  dealType: 'Sale',          role: 'Represented Seller' },
];
