/* MiniBox+ Toolkit — Find Practices Nearby.
   Free, official, no API key: the CMS NPI Registry (NPPES). Every licensed provider
   in the country, tagged by specialty, with the practice street address and phone.

   GET /api/nearby?what=Internal%20Medicine&city=Rockville%20Centre&state=NY
   GET /api/nearby?what=Rheumatology&postal=11570

   Providers are GROUPED BY PRACTICE ADDRESS, because a rep calls on an office, not
   on 14 separate NPI numbers. One result = one front door.

   -> { ok:true, places:[{ key,name,addr,city,state,zip,phone,specialty,providers:[...],count }] }

   Coordinates are NOT resolved here (that would make the search slow). The app asks
   /api/geocode for each place as it draws the pins, and those answers are cached
   forever, so the second rep in that town gets instant pins. */

const SPECIALTIES = {
  'internal medicine': 'Internal Medicine',
  'internal med': 'Internal Medicine',
  'im': 'Internal Medicine',
  'family': 'Family Medicine',
  'family medicine': 'Family Medicine',
  'family practice': 'Family Medicine',
  'primary care': 'Family Medicine',
  'pulmonology': 'Pulmonary Disease',
  'pulmonary': 'Pulmonary Disease',
  'pulm': 'Pulmonary Disease',
  'rheumatology': 'Rheumatology',
  'rheum': 'Rheumatology',
  'allergy': 'Allergy & Immunology',
  'allergy immunology': 'Allergy & Immunology',
  'allergy & immunology': 'Allergy & Immunology',
  'immunology': 'Allergy & Immunology',
  'cardiology': 'Cardiovascular Disease',
  'cardiovascular': 'Cardiovascular Disease',
  'cardio': 'Cardiovascular Disease',
  'sleep': 'Sleep Medicine',
  'occupational': 'Occupational Medicine',
  'occupational medicine': 'Occupational Medicine',
  'pediatrics': 'Pediatrics',
  'peds': 'Pediatrics',
  'ent': 'Otolaryngology',
  'otolaryngology': 'Otolaryngology',
  'geriatrics': 'Geriatric Medicine',
  'nurse practitioner': 'Nurse Practitioner',
  'clinic': 'Clinic/Center'
};

function taxonomyFor(what) {
  const k = String(what || '').trim().toLowerCase();
  if (!k) return 'Internal Medicine';
  if (SPECIALTIES[k]) return SPECIALTIES[k];
  /* Fall through with whatever they typed — NPPES matches its own taxonomy names. */
  return String(what).trim().slice(0, 60);
}

function titleCase(s) {
  return String(s || '').toLowerCase().replace(/\b([a-z])/g, function (m, c) { return c.toUpperCase(); })
    .replace(/\b(Ii|Iii|Iv|Md|Do|Pc|Llc|Llp|Pa|Ny|Nj|Ct)\b/g, function (m) { return m.toUpperCase(); });
}

function zip5(z) { return String(z || '').replace(/[^0-9]/g, '').slice(0, 5); }

function phone(p) {
  const d = String(p || '').replace(/[^0-9]/g, '');
  if (d.length === 10) return d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6);
  return String(p || '');
}

function locationOf(rec) {
  const list = (rec && rec.addresses) || [];
  for (let i = 0; i < list.length; i++) if (list[i].address_purpose === 'LOCATION') return list[i];
  return list[0] || null;
}

function providerName(rec) {
  const b = (rec && rec.basic) || {};
  if (rec.enumeration_type === 'NPI-2') return titleCase(b.organization_name || b.name || 'Practice');
  const n = [b.first_name, b.last_name].filter(Boolean).join(' ');
  return titleCase(n) + (b.credential ? ', ' + String(b.credential).replace(/\.$/, '') : '');
}

function primaryTaxonomy(rec) {
  const t = (rec && rec.taxonomies) || [];
  for (let i = 0; i < t.length; i++) if (t[i].primary) return t[i].desc;
  return t.length ? t[0].desc : '';
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  try {
    const q = req.query || {};
    const tax = taxonomyFor(q.what);
    const city = String(q.city || '').trim().slice(0, 60);
    const state = String(q.state || '').trim().toUpperCase().slice(0, 2);
    const postal = zip5(q.postal);

    if (!city && !postal) {
      return res.status(400).json({ ok: false, error: 'Tell me a town or a ZIP code to search.' });
    }

    const url = new URL('https://npiregistry.cms.hhs.gov/api/');
    url.searchParams.set('version', '2.1');
    url.searchParams.set('taxonomy_description', tax);
    url.searchParams.set('limit', '200');
    if (postal) url.searchParams.set('postal_code', postal + '*');
    if (city) url.searchParams.set('city', city);
    if (state) url.searchParams.set('state', state);

    const r = await fetch(url.toString(), { headers: { 'Accept': 'application/json' } });
    if (!r.ok) throw new Error('npi-' + r.status);
    const data = await r.json();
    const rows = (data && data.results) || [];

    /* Group by street address — one office, however many doctors sit in it. */
    const byPlace = new Map();
    rows.forEach(function (rec) {
      const b = (rec && rec.basic) || {};
      if (b.status && b.status !== 'A') return;               // deactivated NPIs
      const loc = locationOf(rec);
      if (!loc || !loc.address_1) return;
      if (String(loc.country_code || 'US') !== 'US') return;

      const street = titleCase(loc.address_1) + (loc.address_2 ? ' ' + titleCase(loc.address_2) : '');
      const key = (street + '|' + (loc.city || '') + '|' + (loc.state || '')).toUpperCase().replace(/\s+/g, ' ');

      let place = byPlace.get(key);
      if (!place) {
        place = {
          key: key,
          name: '',
          addr: street,
          city: titleCase(loc.city),
          state: String(loc.state || '').toUpperCase(),
          zip: zip5(loc.postal_code),
          phone: phone(loc.telephone_number),
          specialty: tax,
          providers: [],
          orgName: ''
        };
        byPlace.set(key, place);
      }
      const nm = providerName(rec);
      if (rec.enumeration_type === 'NPI-2' && !place.orgName) place.orgName = nm;
      place.providers.push({ name: nm, npi: rec.number, taxonomy: primaryTaxonomy(rec) });
      if (!place.phone) place.phone = phone(loc.telephone_number);
    });

    const places = Array.from(byPlace.values()).map(function (p) {
      /* Name the pin the way a rep would say it out loud. */
      p.name = p.orgName
        || (p.providers.length === 1 ? p.providers[0].name : p.providers[0].name + ' +' + (p.providers.length - 1) + ' more');
      p.count = p.providers.length;
      p.providers = p.providers.slice(0, 25);
      delete p.orgName;
      return p;
    });

    /* Busiest offices first — those are the ones worth a stop. */
    places.sort(function (a, b) { return b.count - a.count || a.name.localeCompare(b.name); });

    return res.status(200).json({
      ok: true,
      what: tax,
      where: postal ? postal : [city, state].filter(Boolean).join(', '),
      places: places.slice(0, 120),
      providerCount: rows.length,
      capped: rows.length >= 200
    });
  } catch (err) {
    return res.status(200).json({
      ok: false,
      places: [],
      error: 'The provider directory did not answer just now. Try again in a moment.'
    });
  }
};
