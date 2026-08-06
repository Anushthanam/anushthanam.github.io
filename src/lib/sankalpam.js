// Pure client-safe module: Telugu name maps + sankalpam sentence builder.
// Consumes the panchang output from `mhah-panchang` and produces the ready
// Telugu sankalpam sentence for a given region + instant.

export const TITHI_TE = [
  'పాడ్యమి', 'విదియ', 'తదియ', 'చవితి', 'పంచమి', 'షష్ఠి', 'సప్తమి', 'అష్టమి',
  'నవమి', 'దశమి', 'ఏకాదశి', 'ద్వాదశి', 'త్రయోదశి', 'చతుర్దశి', 'పూర్ణిమ',
  'పాడ్యమి', 'విదియ', 'తదియ', 'చవితి', 'పంచమి', 'షష్ఠి', 'సప్తమి', 'అష్టమి',
  'నవమి', 'దశమి', 'ఏకాదశి', 'ద్వాదశి', 'త్రయోదశి', 'చతుర్దశి', 'అమావాస్య',
];
export const TITHI_IAST = [
  'prathamā','dvitīyā','tṛtīyā','caturthī','pañcamī','ṣaṣṭhī','saptamī','aṣṭamī',
  'navamī','daśamī','ekādaśī','dvādaśī','trayodaśī','caturdaśī','pūrṇimā',
  'prathamā','dvitīyā','tṛtīyā','caturthī','pañcamī','ṣaṣṭhī','saptamī','aṣṭamī',
  'navamī','daśamī','ekādaśī','dvādaśī','trayodaśī','caturdaśī','amāvāsyā',
];

export const PAKSHA_TE = ['శుక్ల', 'కృష్ణ'];
export const PAKSHA_IAST = ['śukla', 'kṛṣṇa'];

export const NAKSHATRA_TE = [
  'అశ్విని', 'భరణి', 'కృత్తిక', 'రోహిణి', 'మృగశిర', 'ఆర్ద్ర', 'పునర్వసు',
  'పుష్యమి', 'ఆశ్లేష', 'మఖ', 'పూర్వ ఫల్గుణి', 'ఉత్తర ఫల్గుణి', 'హస్త',
  'చిత్త', 'స్వాతి', 'విశాఖ', 'అనూరాధ', 'జ్యేష్ఠ', 'మూల', 'పూర్వాషాఢ',
  'ఉత్తరాషాఢ', 'శ్రవణ', 'ధనిష్ఠ', 'శతభిష', 'పూర్వాభాద్ర', 'ఉత్తరాభాద్ర',
  'రేవతి',
];
export const NAKSHATRA_IAST = [
  'aśvinī','bharaṇī','kṛttikā','rohiṇī','mṛgaśira','ārdrā','punarvasu',
  'puṣyami','āśleṣā','maghā','pūrva-phalgunī','uttara-phalgunī','hasta',
  'citrā','svātī','viśākhā','anūrādhā','jyeṣṭhā','mūla','pūrvāṣāḍhā',
  'uttarāṣāḍhā','śravaṇa','dhaniṣṭhā','śatabhiṣā','pūrvābhādrā','uttarābhādrā',
  'revatī',
];

export const YOGA_TE = [
  'విష్కంభ', 'ప్రీతి', 'ఆయుష్మాన్', 'సౌభాగ్య', 'శోభన', 'అతిగండ', 'సుకర్మ',
  'ధృతి', 'శూల', 'గండ', 'వృద్ధి', 'ధ్రువ', 'వ్యాఘాత', 'హర్షణ', 'వజ్ర',
  'సిద్ధి', 'వ్యతీపాత', 'వరీయాన్', 'పరిఘ', 'శివ', 'సిద్ధ', 'సాధ్య', 'శుభ',
  'శుక్ల', 'బ్రహ్మ', 'ఐంద్ర', 'వైధృతి',
];
export const YOGA_IAST = [
  'viṣkambha','prīti','āyuṣmān','saubhāgya','śobhana','atigaṇḍa','sukarma',
  'dhṛti','śūla','gaṇḍa','vṛddhi','dhruva','vyāghāta','harṣaṇa','vajra',
  'siddhi','vyatīpāta','varīyān','parigha','śiva','siddha','sādhya','śubha',
  'śukla','brahma','aindra','vaidhṛti',
];

// mhah-panchang Karana numbering (verified):
//   0=Bava, 1=Balava, ..., 6=Vishti, 7=Shakuni, 8=Chatushpada, 9=Naga, 10=Kimstughna
export const KARANA_TE = [
  'బవ', 'బాలవ', 'కౌలవ', 'తైతిల', 'గర', 'వణిజ', 'విష్టి',
  'శకుని', 'చతుష్పాద', 'నాగ', 'కింస్తుఘ్న',
];
export const KARANA_IAST = [
  'bava','bālava','kaulava','taitila','gara','vaṇija','viṣṭi',
  'śakuni','catuṣpāda','nāga','kiṃstughna',
];

export const VARA_TE = ['భాను', 'ఇందు', 'భౌమ', 'సౌమ్య', 'గురు', 'భృగు', 'స్థిర'];
export const VARA_EN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export const VARA_IAST = ['bhānu','indu','bhauma','saumya','guru','bhṛgu','sthira'];

// mhah-panchang Masa numbering starts at Vaishakha (verified):
//   0=Vaishakha, 1=Jyeshtha, ..., 10=Phalguna, 11=Chaitra
export const MASA_TE = [
  'వైశాఖ', 'జ్యేష్ఠ', 'ఆషాఢ', 'శ్రావణ', 'భాద్రపద', 'ఆశ్వయుజ',
  'కార్తీక', 'మార్గశిర', 'పుష్య', 'మాఘ', 'ఫాల్గుణ', 'చైత్ర',
];
export const MASA_EN = [
  'Vaishakha','Jyeshtha','Ashadha','Shravana','Bhadrapada','Ashvayuja',
  'Kartika','Margashira','Pushya','Magha','Phalguna','Chaitra',
];

export const RITU_TE = ['వసంత', 'గ్రీష్మ', 'వర్ష', 'శరత్', 'హేమంత', 'శిశిర'];
export const RITU_EN = ['Vasanta','Grishma','Varsha','Sharat','Hemanta','Shishira'];

export const SAMVATSARA_TE = [
  'ప్రభవ','విభవ','శుక్ల','ప్రమోదూత','ప్రజోత్పత్తి','ఆంగీరస','శ్రీముఖ','భావ',
  'యువ','ధాత','ఈశ్వర','బహుధాన్య','ప్రమాథి','విక్రమ','వృష','చిత్రభాను','స్వభాను',
  'తారణ','పార్థివ','వ్యయ','సర్వజిత్','సర్వధారి','విరోధి','వికృతి','ఖర','నందన',
  'విజయ','జయ','మన్మథ','దుర్ముఖి','హేవిళంబి','విళంబి','వికారి','శార్వరి','ప్లవ',
  'శుభకృత్','శోభకృత్','క్రోధి','విశ్వావసు','పరాభవ','ప్లవంగ','కీలక','సౌమ్య',
  'సాధారణ','విరోధికృత్','పరీధావి','ప్రమాదీచ','ఆనంద','రాక్షస','నల','పింగళ',
  'కాళయుక్తి','సిద్ధార్థి','రౌద్రి','దుర్మతి','దుందుభి','రుధిరోద్గారి','రక్తాక్షి',
  'క్రోధన','అక్షయ',
];
export const SAMVATSARA_EN = [
  'Prabhava','Vibhava','Shukla','Pramodoota','Prajotpatti','Angirasa','Shrimukha','Bhava',
  'Yuva','Dhata','Ishvara','Bahudhanya','Pramathi','Vikrama','Vrisha','Chitrabhanu','Svabhanu',
  'Tarana','Parthiva','Vyaya','Sarvajit','Sarvadhari','Virodhi','Vikriti','Khara','Nandana',
  'Vijaya','Jaya','Manmatha','Durmukhi','Hevilambi','Vilambi','Vikari','Sharvari','Plava',
  'Shubhakrit','Shobhakrit','Krodhi','Vishvavasu','Parabhava','Plavanga','Kilaka','Saumya',
  'Sadharana','Virodhikrit','Paridhavi','Pramadi','Ananda','Rakshasa','Nala','Pingala',
  'Kalayukti','Siddharthi','Raudri','Durmati','Dundubhi','Rudhirodgari','Raktakshi',
  'Krodhana','Akshaya',
];

export const REGIONS = {
  nellore: {
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
    dvipa_iast: 'jambūdvīpe',
    varsha_iast: 'bharatavarṣe',
    khanda_iast: 'bharatakhaṇḍe',
    desha_iast: 'bhāratadeśe',
    city_iast: 'nellūru mahānagare',
    river_iast: 'pennā nadī tīre',
    dig_iast: 'indra digbhāge',
    latitude: 14.4426,
    longitude: 79.9865,
    tz_name: 'Asia/Kolkata',
  },
  'west-drayton': {
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
    dvipa_iast: 'kuśadvīpe',
    varsha_iast: '',
    khanda_iast: '',
    desha_iast: 'briṭāniyā deśe',
    city_iast: 'lanḍan mahānagare',
    river_iast: 'ṭems nadī tīre',
    dig_iast: 'varuṇa digbhāge',
    latitude: 51.5074,
    longitude: -0.4632,
    tz_name: 'Europe/London',
  },
};

export function offsetForTz(tz, date) {
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

export function localParts(tz, date) {
  const dtf = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts = Object.fromEntries(dtf.formatToParts(date).map(p => [p.type, p.value]));
  return {
    year: +parts.year, month: +parts.month, day: +parts.day,
    hour: +parts.hour, minute: +parts.minute, second: +parts.second,
    iso: `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`,
  };
}

/**
 * Auto-detect the best region for the visitor's IANA timezone.
 * Asia/* → Nellore; Europe/* → West Drayton; else offset heuristic; fallback Nellore.
 */
export function detectRegion() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.startsWith('Europe/')) return 'west-drayton';
    if (tz.startsWith('Asia/')) return 'nellore';
    const off = -new Date().getTimezoneOffset() / 60;
    if (off >= -1 && off <= 2) return 'west-drayton';
    return 'nellore';
  } catch (e) {
    return 'nellore';
  }
}

function samvatsaraIndex(gregYear, masaIno) {
  const y = (masaIno === 10) ? gregYear - 1 : gregYear;
  return ((y - 1987) % 60 + 60) % 60;
}

function ayana(month, day) {
  const md = month * 100 + day;
  return (md >= 114 && md <= 716)
    ? { te: 'ఉత్తరాయణే', iast: 'uttarāyaṇe' }
    : { te: 'దక్షిణాయణే', iast: 'dakṣiṇāyane' };
}

/**
 * Sandhya period based on local hour: prātaḥ / mādhyāhnika / sāyaṃ.
 * Rough windows: 04:00–10:00 → prātaḥ, 10:00–15:00 → mādhyāhnika, else sāyaṃ.
 */
export function sandhyaPeriod(hour) {
  if (hour >= 4 && hour < 10) return { key: 'pratah',      te: 'ప్రాతః',      en: 'Prātaḥ',      iast: 'prātaḥ' };
  if (hour >= 10 && hour < 15) return { key: 'madhyahnika', te: 'మాధ్యాహ్నిక', en: 'Mādhyāhnika', iast: 'mādhyāhnika' };
  return { key: 'sayam', te: 'సాయం', en: 'Sāyaṃ', iast: 'sāyaṃ' };
}

import { FAMILY_TE, FAMILY_IAST } from './sankalpam-family';

/**
 * Compute the full sankalpam.
 * @param {object} mp        - a new MhahPanchang() instance
 * @param {object} region    - one of the REGIONS values
 * @param {Date}   instant
 * @param {object} [opts]
 * @param {boolean} [opts.includeFamily] - if true, inject the personalized
 *                    Gaṇḍikōṭa family bloc (see sankalpam-family.js) instead
 *                    of the two generic `asmākaṃ sakuṭumbānāṃ …` +
 *                    `dharmārtha …` lines.
 * @param {string}  [opts.closingTe]   - override the final `sandhyām upāśiṣye`
 *                    line with a karma-specific closing (Telugu).
 * @param {string}  [opts.closingIast] - same, IAST.
 */
export function computeSankalpam(mp, region, instant, opts = {}) {
  const tzOffset = offsetForTz(region.tz_name, instant);
  const local = localParts(region.tz_name, instant);
  const cal = mp.calendar(instant, region.latitude, region.longitude);
  const calc = mp.calculate(instant);
  // mhah-panchang returns the Amanta masa (month ends at Amavasya).
  // Traditional Telugu / North-Indian sankalpa uses Purnimanta naming
  // (month ends at Purnima). The two differ only during Shukla paksha,
  // where the Purnimanta name is one month behind Amanta.
  const pakshaIno = cal.Paksha.ino;                    // 0=Shukla, 1=Krishna
  const masaIno = pakshaIno === 0
    ? (cal.Masa.ino - 1 + 12) % 12
    : cal.Masa.ino;
  const samvIdx = samvatsaraIndex(local.year, masaIno);
  const sandhya = sandhyaPeriod(local.hour);
  const ayanaObj = ayana(local.month, local.day);

  const facts = {
    samvatsara_te: SAMVATSARA_TE[samvIdx], samvatsara_en: SAMVATSARA_EN[samvIdx],
    ayana_te: ayanaObj.te, ayana_iast: ayanaObj.iast,
    ritu_te: RITU_TE[cal.Ritu.ino] || '', ritu_en: RITU_EN[cal.Ritu.ino] || '',
    masa_te: MASA_TE[masaIno] || '', masa_en: MASA_EN[masaIno] || '',
    paksha_te: PAKSHA_TE[cal.Paksha.ino] || '', paksha_en: cal.Paksha.name_en_IN || '',
    paksha_iast: PAKSHA_IAST[cal.Paksha.ino] || '',
    tithi_te: TITHI_TE[cal.Tithi.ino] || '', tithi_en: cal.Tithi.name_en_IN || '',
    tithi_iast: TITHI_IAST[cal.Tithi.ino] || '',
    vara_te: VARA_TE[calc.Day.ino] || '',    vara_en: VARA_EN[calc.Day.ino] || '',
    vara_iast: VARA_IAST[calc.Day.ino] || '',
    nakshatra_te: NAKSHATRA_TE[cal.Nakshatra.ino] || '', nakshatra_en: cal.Nakshatra.name_en_IN || '',
    nakshatra_iast: NAKSHATRA_IAST[cal.Nakshatra.ino] || '',
    yoga_te: YOGA_TE[cal.Yoga.ino] || '',    yoga_en: cal.Yoga.name_en_IN || '',
    yoga_iast: YOGA_IAST[cal.Yoga.ino] || '',
    karana_te: KARANA_TE[cal.Karna.ino] || '', karana_en: cal.Karna.name_en_IN || '',
    karana_iast: KARANA_IAST[cal.Karna.ino] || '',
    tithi_interval:     { start: calc.Tithi.start,     end: calc.Tithi.end },
    nakshatra_interval: { start: calc.Nakshatra.start, end: calc.Nakshatra.end },
    yoga_interval:      { start: calc.Yoga.start,      end: calc.Yoga.end },
    karana_interval:    { start: calc.Karna.start,     end: calc.Karna.end },
    sandhya,
  };

  const parts = [
    'మమ ఉపాత్త సమస్త దురిత క్షయ ద్వారా',
    'శ్రీ పరమేశ్వర ప్రీత్యర్థం',
    'శుభే శోభనే ముహూర్తే',
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
    facts.ritu_te + ' ఋతౌ',
    facts.masa_te + ' మాసే',
    facts.paksha_te + ' పక్షే',
    facts.tithi_te + ' తిథౌ',
    facts.vara_te + ' వాసరే',
    facts.nakshatra_te + ' నక్షత్ర యుక్తాయామ్',
    facts.yoga_te + ' యోగే',
    facts.karana_te + ' కరణ',
    'ఏవం గుణ విశేషణ విశిష్టాయాం అస్యాం శుభతిథౌ',
    'అస్మాకం సకుటుంబానాం క్షేమ స్థైర్య వీర్య విజయ ఆయుర్ ఆరోగ్య ఐశ్వర్యాభివృద్ధ్యర్థం',
    'ధర్మార్థ కామమోక్ష చతుర్విధ ఫల పురుషార్థ సిద్ధ్యర్థం',
    sandhya.te + ' సంధ్యామ్ ఉపాశిష్యే ||',
  );

  if (opts.includeFamily) {
    // Replace the last 3 lines (asmākaṃ, dharmārtha, sandhyām …) with the
    // full family bloc, and re-append the closing line.
    parts.splice(-3, 2, ...FAMILY_TE);
  }
  if (opts.closingTe) {
    parts[parts.length - 1] = opts.closingTe;
  }

  const partsIast = [
    'mama upātta samasta durita kṣaya dvārā',
    'śrī parameśvara prītyarthaṃ',
    'śubhe śobhane muhūrte',
    'adya brahmaṇaḥ dvitīyā parārthe',
    'śveta varāha kalpe',
    'vaivasvata manvantare',
    'kaliyuge prathamapāde',
    region.dvipa_iast,
  ];
  if (region.varsha_iast) partsIast.push(region.varsha_iast);
  if (region.khanda_iast) partsIast.push(region.khanda_iast);
  partsIast.push(
    region.dig_iast,
    region.desha_iast,
    region.city_iast,
    region.river_iast,
    'asmin vartamāne vyavahārike cāndramānena ' + facts.samvatsara_en + ' nāma saṃvatsare',
    facts.ayana_iast,
    facts.ritu_en + ' ṛtau',
    facts.masa_en + ' māse',
    facts.paksha_iast + ' pakṣe',
    facts.tithi_iast + ' tithau',
    facts.vara_iast + ' vāsare',
    facts.nakshatra_iast + ' nakṣatra yuktāyām',
    facts.yoga_iast + ' yoge',
    facts.karana_iast + ' karaṇa',
    'evaṃ guṇa viśeṣaṇa viśiṣṭāyāṃ asyāṃ śubhatithau',
    'asmākaṃ sakuṭumbānāṃ kṣema sthairya vīrya vijaya āyur ārogya aiśvaryābhivṛddhyarthaṃ',
    'dharmārtha kāmamokṣa caturvidha phala puruṣārtha siddhyarthaṃ',
    sandhya.iast + ' sandhyām upāśiṣye ||',
  );

  if (opts.includeFamily) {
    partsIast.splice(-3, 2, ...FAMILY_IAST);
  }
  if (opts.closingIast) {
    partsIast[partsIast.length - 1] = opts.closingIast;
  }

  return {
    region: {
      id: region.id, name_te: region.name_te, name_en: region.name_en,
      latitude: region.latitude, longitude: region.longitude,
      tz_name: region.tz_name, tz_offset_hours: tzOffset,
    },
    generated_at: instant.toISOString(),
    local_time: local.iso,
    panchang: facts,
    sankalpam_te:   parts.join(', ').replace(/, ఏవం/, ' ఏవం'),
    sankalpam_iast: partsIast.join(', ').replace(/, evaṃ/, ' evaṃ'),
  };
}
