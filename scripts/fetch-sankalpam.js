#!/usr/bin/env node
/**
 * Daily Sankalpam generator.
 *
 * Computes the Vedic panchang locally using the `mhah-panchang` npm package
 * (Swiss Ephemeris / Drik Ganita) — no external API, no rate limits, no keys.
 * Writes a JSON snapshot per region under static/data/sankalpam/<region>.json,
 * including the ready-to-recite Telugu sankalpam sentence.
 */
const fs = require('fs');
const path = require('path');
const { MhahPanchang } = require('mhah-panchang');

const REGIONS = [
  {
    id: 'nellore',
    name_te: 'నెల్లూరు, భారత దేశము',
    name_en: 'Nellore, India',
    dvipa: 'జంబూద్వీపే',
    varsha: 'భరత వర్షే',
    khanda: 'భరత ఖండే',
    desha: 'భారత దేశే',
    city: 'నెల్లూరు మహానగరే',
    river: 'పెన్నా నదీ తీరే',
    dig: 'ఇంద్ర దిగ్భాగే',
    latitude: 14.4426,
    longitude: 79.9865,
    tz_name: 'Asia/Kolkata',
  },
  {
    id: 'west-drayton',
    name_te: 'వెస్ట్ డ్రేటన్, లండన్',
    name_en: 'West Drayton, London, UK',
    dvipa: 'కుశద్వీపే',
    varsha: '',
    khanda: '',
    desha: 'బ్రిటానియా దేశే',
    city: 'లండన్ మహానగరే',
    river: 'టేమ్స్ నదీ తీరే',
    dig: 'వరుణ దిగ్భాగే',
    latitude: 51.5074,
    longitude: -0.4632,
    tz_name: 'Europe/London',
  },
];

const OUT_DIR = path.resolve(__dirname, '..', 'static', 'data', 'sankalpam');

// ─── Telugu name maps ──────────────────────────────────────────────────────
// Indexed by mhah-panchang's `ino` (0-based) or noted otherwise.

const TITHI_TE = [
  'పాడ్యమి', 'విదియ', 'తదియ', 'చవితి', 'పంచమి', 'షష్ఠి', 'సప్తమి', 'అష్టమి',
  'నవమి', 'దశమి', 'ఏకాదశి', 'ద్వాదశి', 'త్రయోదశి', 'చతుర్దశి', 'పూర్ణిమ',
  'పాడ్యమి', 'విదియ', 'తదియ', 'చవితి', 'పంచమి', 'షష్ఠి', 'సప్తమి', 'అష్టమి',
  'నవమి', 'దశమి', 'ఏకాదశి', 'ద్వాదశి', 'త్రయోదశి', 'చతుర్దశి', 'అమావాస్య',
];

const PAKSHA_TE = ['శుక్ల', 'కృష్ణ'];

const NAKSHATRA_TE = [
  'అశ్విని', 'భరణి', 'కృత్తిక', 'రోహిణి', 'మృగశిర', 'ఆర్ద్ర', 'పునర్వసు',
  'పుష్యమి', 'ఆశ్లేష', 'మఖ', 'పూర్వ ఫల్గుణి', 'ఉత్తర ఫల్గుణి', 'హస్త',
  'చిత్త', 'స్వాతి', 'విశాఖ', 'అనూరాధ', 'జ్యేష్ఠ', 'మూల', 'పూర్వాషాఢ',
  'ఉత్తరాషాఢ', 'శ్రవణ', 'ధనిష్ఠ', 'శతభిష', 'పూర్వాభాద్ర', 'ఉత్తరాభాద్ర',
  'రేవతి',
];

const YOGA_TE = [
  'విష్కంభ', 'ప్రీతి', 'ఆయుష్మాన్', 'సౌభాగ్య', 'శోభన', 'అతిగండ', 'సుకర్మ',
  'ధృతి', 'శూల', 'గండ', 'వృద్ధి', 'ధ్రువ', 'వ్యాఘాత', 'హర్షణ', 'వజ్ర',
  'సిద్ధి', 'వ్యతీపాత', 'వరీయాన్', 'పరిఘ', 'శివ', 'సిద్ధ', 'సాధ్య', 'శుభ',
  'శుక్ల', 'బ్రహ్మ', 'ఐంద్ర', 'వైధృతి',
];

// mhah-panchang Karana numbering (verified):
//   0=Bava, 1=Balava, 2=Kaulava, 3=Taitila, 4=Gara, 5=Vanija, 6=Vishti,
//   7=Shakuni, 8=Chatushpada, 9=Naga, 10=Kimstughna.
const KARANA_TE = [
  'బవ', 'బాలవ', 'కౌలవ', 'తైతిల', 'గర', 'వణిజ', 'విష్టి',
  'శకుని', 'చతుష్పాద', 'నాగ', 'కింస్తుఘ్న',
];

const VARA_TE = [
  'భాను', 'ఇందు', 'భౌమ', 'సౌమ్య', 'గురు', 'భృగు', 'స్థిర',
];
const VARA_EN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// mhah-panchang Masa numbering starts at Vaishakha (verified empirically):
//   0=Vaishakha, 1=Jyeshtha, 2=Ashadha, 3=Shravana, 4=Bhadrapada, 5=Ashwina,
//   6=Kartika, 7=Margashira, 8=Pushya, 9=Magha, 10=Phalguna, 11=Chaitra.
const MASA_TE = [
  'వైశాఖ', 'జ్యేష్ఠ', 'ఆషాఢ', 'శ్రావణ', 'భాద్రపద', 'ఆశ్వయుజ',
  'కార్తీక', 'మార్గశిర', 'పుష్య', 'మాఘ', 'ఫాల్గుణ', 'చైత్ర',
];
const MASA_EN = [
  'Vaishakha','Jyeshtha','Ashadha','Shravana','Bhadrapada','Ashvayuja',
  'Kartika','Margashira','Pushya','Magha','Phalguna','Chaitra',
];

const RITU_TE = ['వసంత', 'గ్రీష్మ', 'వర్ష', 'శరత్', 'హేమంత', 'శిశిర'];

// Sixty samvatsara names starting with Prabhava.
const SAMVATSARA_TE = [
  'ప్రభవ','విభవ','శుక్ల','ప్రమోదూత','ప్రజోత్పత్తి','ఆంగీరస','శ్రీముఖ','భావ',
  'యువ','ధాత','ఈశ్వర','బహుధాన్య','ప్రమాథి','విక్రమ','వృష','చిత్రభాను','స్వభాను',
  'తారణ','పార్థివ','వ్యయ','సర్వజిత్','సర్వధారి','విరోధి','వికృతి','ఖర','నందన',
  'విజయ','జయ','మన్మథ','దుర్ముఖి','హేవిళంబి','విళంబి','వికారి','శార్వరి','ప్లవ',
  'శుభకృత్','శోభకృత్','క్రోధి','విశ్వావసు','పరాభవ','ప్లవంగ','కీలక','సౌమ్య',
  'సాధారణ','విరోధికృత్','పరీధావి','ప్రమాదీచ','ఆనంద','రాక్షస','నల','పింగళ',
  'కాళయుక్తి','సిద్ధార్థి','రౌద్రి','దుర్మతి','దుందుభి','రుధిరోద్గారి','రక్తాక్షి',
  'క్రోధన','అక్షయ',
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function pad(n) { return String(n).padStart(2, '0'); }

/**
 * Get IANA timezone offset in hours at a given instant (DST-aware).
 * Rounded to nearest quarter-hour to eliminate float drift.
 */
function offsetForTz(tz, date) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts = Object.fromEntries(dtf.formatToParts(date).map(p => [p.type, p.value]));
  const asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day,
                         +parts.hour, +parts.minute, +parts.second);
  return Math.round((asUTC - date.getTime()) / 3_600_000 * 4) / 4;
}

/**
 * Local wall-clock components in a given IANA timezone.
 */
function localParts(tz, date) {
  const dtf = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    weekday: 'short',
  });
  const parts = Object.fromEntries(dtf.formatToParts(date).map(p => [p.type, p.value]));
  return {
    year: +parts.year,
    month: +parts.month,
    day: +parts.day,
    hour: +parts.hour,
    minute: +parts.minute,
    second: +parts.second,
    weekday: parts.weekday,
    iso: `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`,
  };
}

/**
 * Samvatsara index (0..59, 0 = Prabhava).
 * Ugadi 1987 (Chaitra Shukla Pratipada) = Prabhava. New samvatsara starts at
 * Chaitra Shukla 1. Since Phalguna (mhah ino=10) is the last month BEFORE
 * Chaitra, if we're in Phalguna we're still in the previous samvatsara.
 * All other months belong to the current Gregorian year's samvatsara.
 */
function samvatsaraIndex(gregYear, masaIno) {
  const y = (masaIno === 10) ? gregYear - 1 : gregYear;
  return ((y - 1987) % 60 + 60) % 60;
}

/**
 * Ayana: Uttarāyaṇa = Sun in Makara→Mithuna (Capricorn..Gemini), i.e. Sun's
 * nirayana longitude in [270°, 360°) ∪ [0°, 90°). We approximate by the
 * Gregorian date window Jan 14 – Jul 16 (Makara sankramana to Karkataka
 * sankramana). Accurate enough for sankalpam.
 */
function ayana(month, day) {
  const md = month * 100 + day;
  return (md >= 114 && md <= 716) ? 'ఉత్తరాయణే' : 'దక్షిణాయణే';
}

/**
 * Build the Telugu sankalpam sentence from a region + panchang facts.
 */
function buildSankalpam(region, facts) {
  const parts = [
    'అద్య బ్రహ్మణః ద్వితీయా పరార్థే',
    'శ్వేత వరాహ కల్పే',
    'వైవస్వత మన్వంతరే',
    'కలియుగే ప్రథమపాదే',
    region.dvipa,
  ];
  if (region.varsha) parts.push(region.varsha);
  if (region.khanda) parts.push(region.khanda);
  parts.push(
    region.dig,
    region.desha,
    region.city,
    region.river,
    'అస్మిన్ వర్తమానే వ్యవహారికే చాంద్రమానేన ' + facts.samvatsara_te + ' నామ సంవత్సరే',
    facts.ayana_te,
    facts.ritu_te + 'ఋతౌ',
    facts.masa_te + ' మాసే',
    facts.paksha_te + ' పక్షే',
    facts.tithi_te + ' తిథౌ',
    facts.vara_te + ' వాసరే',
    facts.nakshatra_te + ' నక్షత్ర యుక్తాయామ్',
    facts.yoga_te + ' యోగ',
    facts.karana_te + ' కరణ',
    'ఏవం గుణ విశేషణ విశిష్టాయాం అస్యాం శ్రీ శుభతిథౌ',
    'మమ ఉపాత్త సమస్త దురితక్షయ ద్వారా శ్రీ పరమేశ్వర ప్రీత్యర్థం ప్రాతః సంధ్యాముపాశిష్యే||',
  );
  return parts.join(', ').replace(/, ఏవం/, ' ఏవం');
}

/**
 * Compute panchang for one region at the current UTC instant.
 */
function computeForRegion(region, now) {
  const tzOffset = offsetForTz(region.tz_name, now);
  const local = localParts(region.tz_name, now);

  const mp = new MhahPanchang();
  // `calendar(date, lat, lng)` uses geographic-adjusted sunrise-based day.
  // `calculate(date)` uses the exact instant. We use calendar() for tithi/masa
  // (which are day-boundary sensitive) and calculate() for start/end intervals.
  const cal = mp.calendar(now, region.latitude, region.longitude);
  const calc = mp.calculate(now);

  const tithi = cal.Tithi;
  const paksha = cal.Paksha;
  const nakshatra = cal.Nakshatra;
  const yoga = cal.Yoga;
  const karana = cal.Karna;
  const masa = cal.Masa;
  const ritu = cal.Ritu;
  const raasi = cal.Raasi;
  const dayOfWeek = calc.Day.ino; // 0=Sunday

  const samvIdx = samvatsaraIndex(local.year, masa.ino);

  const facts = {
    // Telugu names (for the sankalpam sentence)
    samvatsara_te: SAMVATSARA_TE[samvIdx],
    ayana_te: ayana(local.month, local.day),
    ritu_te: RITU_TE[ritu.ino] || '',
    masa_te: MASA_TE[masa.ino] || '',
    paksha_te: PAKSHA_TE[paksha.ino] || '',
    tithi_te: TITHI_TE[tithi.ino] || '',
    vara_te: VARA_TE[dayOfWeek] || '',
    nakshatra_te: NAKSHATRA_TE[nakshatra.ino] || '',
    yoga_te: YOGA_TE[yoga.ino] || '',
    karana_te: KARANA_TE[karana.ino] || '',

    // English transliterations (for display / debugging)
    samvatsara_en: ['Prabhava','Vibhava','Shukla','Pramodoota','Prajotpatti','Angirasa','Shrimukha','Bhava','Yuva','Dhata','Ishvara','Bahudhanya','Pramathi','Vikrama','Vrisha','Chitrabhanu','Svabhanu','Tarana','Parthiva','Vyaya','Sarvajit','Sarvadhari','Virodhi','Vikriti','Khara','Nandana','Vijaya','Jaya','Manmatha','Durmukhi','Hevilambi','Vilambi','Vikari','Sharvari','Plava','Shubhakrit','Shobhakrit','Krodhi','Vishvavasu','Parabhava','Plavanga','Kilaka','Saumya','Sadharana','Virodhikrit','Paridhavi','Pramadi','Ananda','Rakshasa','Nala','Pingala','Kalayukti','Siddharthi','Raudri','Durmati','Dundubhi','Rudhirodgari','Raktakshi','Krodhana','Akshaya'][samvIdx],
    ritu_en: ['Vasanta','Grishma','Varsha','Sharat','Hemanta','Shishira'][ritu.ino] || '',
    masa_en: MASA_EN[masa.ino] || '',
    paksha_en: paksha.name_en_IN || '',
    tithi_en: tithi.name_en_IN || '',
    vara_en: VARA_EN[dayOfWeek] || '',
    nakshatra_en: nakshatra.name_en_IN || '',
    yoga_en: yoga.name_en_IN || '',
    karana_en: karana.name_en_IN || '',

    // Interval start/end (ISO UTC) — useful for showing "tithi ends at HH:MM"
    tithi_interval: { start: calc.Tithi.start, end: calc.Tithi.end },
    nakshatra_interval: { start: calc.Nakshatra.start, end: calc.Nakshatra.end },
    yoga_interval: { start: calc.Yoga.start, end: calc.Yoga.end },
    karana_interval: { start: calc.Karna.start, end: calc.Karna.end },

    raasi_en: raasi.name_en_UK || '',
    ayanamsa: calc.Ayanamsa && calc.Ayanamsa.name || '',
  };

  return {
    region: {
      id: region.id,
      name_te: region.name_te,
      name_en: region.name_en,
      latitude: region.latitude,
      longitude: region.longitude,
      tz_name: region.tz_name,
      tz_offset_hours: tzOffset,
    },
    generated_at: now.toISOString(),
    local_time: local.iso,
    panchang: facts,
    sankalpam_te: buildSankalpam(region, facts),
    source: 'mhah-panchang@1.2.0 (Drik Ganita / Swiss Ephemeris)',
  };
}

// ─── Main ──────────────────────────────────────────────────────────────────

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const now = new Date();
  const summary = [];

  for (const region of REGIONS) {
    const out = computeForRegion(region, now);
    const file = path.join(OUT_DIR, `${region.id}.json`);
    fs.writeFileSync(file, JSON.stringify(out, null, 2) + '\n', 'utf-8');
    console.log(`→ ${region.id}: ${out.local_time} tz=${region.tz_name} (offset ${out.region.tz_offset_hours})`);
    console.log(`   ${out.panchang.samvatsara_en} · ${out.panchang.masa_en} ${out.panchang.paksha_en} ${out.panchang.tithi_en} · ${out.panchang.vara_en} · ${out.panchang.nakshatra_en}`);
    console.log(`   wrote ${path.relative(process.cwd(), file)}`);
    summary.push({ region: region.id, ok: true });
  }

  // Write an index file with pointers.
  fs.writeFileSync(
    path.join(OUT_DIR, 'index.json'),
    JSON.stringify({
      updated_at: now.toISOString(),
      regions: REGIONS.map(r => ({ id: r.id, name_te: r.name_te, name_en: r.name_en })),
    }, null, 2) + '\n',
    'utf-8',
  );

  console.log('\nAll regions computed successfully.');
}

if (require.main === module) main();
