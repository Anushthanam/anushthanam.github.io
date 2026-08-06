/**
 * Kāśyapa-gotra Gaṇḍikōṭa kula family bloc for the Sankalpam.
 *
 * These lines are injected into the sankalpa AFTER the standard
 * `evaṃ guṇa viśeṣaṇa viśiṣṭāyāṃ asyāṃ śubhatithau` and BEFORE the
 * standard `asmākaṃ sakuṭumbānāṃ ...` line, replacing the generic family
 * clause with a specific one that names every member of the household and
 * declares the specific intentions (peace, happiness, health, and a home
 * in Bengaluru).
 *
 * Family layout (as of Aug 2026):
 *   - Grandmother:  Mīnākṣī
 *   - Father–Mother: Gaṇḍikōṭa Rāmagōpāla Śarma & Rādhā (dampatī)
 *   - Elder brother's household: Gaṇḍikōṭa Guru Kārtīk & Uṣā (dampatī),
 *     daughters Gahya Snigdhā and Amōgyā
 *   - Own household:  Gaṇḍikōṭa Saikauśika & Nāga Jyōti (dampatī),
 *     son Jaśvik Sāi Śrēyaṇ
 *
 * Wrap in a single `<Sankalpam includeFamily />` invocation.
 */

export const FAMILY_TE = [
  'అస్మిన్ కుటుంబే — కాశ్యప గోత్రజ, ఆశ్వలాయన సూత్రజ, ఋక్ శాఖాధ్యాయీ',
  'పితామహీ మీనాక్షి సహిత',
  'జనక గండికోట రామగోపాల శర్మణః, జననీ రాధాయాః దంపత్యోః',
  'జ్యేష్ఠ భ్రాతృ గండికోట గురు కార్తీక, తత్‌పత్నీ ఉషా దంపత్యోః సహ',
  'తయోః దుహితరౌ గహ్య స్నిగ్ధా, అమోగ్యా సహిత',
  'మమ గండికోట సాయికౌశిక శర్మణః, మమ సహధర్మిణీ నాగ జ్యోతి సహిత',
  'మమ పుత్రస్య జశ్విక్ సాయి శ్రేయణ సహిత',
  'అస్మాకం సర్వేషాం సకుటుంబానాం, క్షేమ స్థైర్య వీర్య విజయ ఆయుర్ ఆరోగ్య ఐశ్వర్య అభివృద్ధ్యర్థం',
  'సర్వేషాం శాంతి సుఖ సంతోష సౌభాగ్య అభివృద్ధ్యర్థం',
  'మమ శ్రీమద్ భారతదేశే బెంగళూరు మహానగరే స్వగృహ ప్రాప్త్యర్థం',
  'ధర్మార్థ కామమోక్ష చతుర్విధ ఫల పురుషార్థ సిద్ధ్యర్థం',
];

export const FAMILY_IAST = [
  'asmin kuṭumbe — kāśyapa gōtraja, āśvalāyana sūtraja, ṛk-śākhādhyāyī',
  'pitāmahī mīnākṣi sahita',
  'janaka gaṇḍikōṭa rāmagōpāla śarmaṇaḥ, jananī rādhāyāḥ dampatyōḥ',
  'jyēṣṭha bhrātṛ gaṇḍikōṭa guru kārtīk, tatpatnī uṣā dampatyōḥ saha',
  'tayōḥ duhitarau gahya snigdhā, amōgyā sahita',
  'mama gaṇḍikōṭa saikauśika śarmaṇaḥ, mama sahadharmiṇī nāga jyōti sahita',
  'mama putrasya jaśvik sāi śrēyaṇa sahita',
  'asmākaṃ sarveṣāṃ sakuṭumbānāṃ, kṣema sthairya vīrya vijaya āyur ārōgya aiśvarya abhivṛddhyarthaṃ',
  'sarveṣāṃ śānti sukha santōṣa saubhāgya abhivṛddhyarthaṃ',
  'mama śrīmad bhārata-dēśe beṅgaḷūru mahānagare svagṛha-prāpty-arthaṃ',
  'dharmārtha kāmamokṣa caturvidha phala puruṣārtha siddhyarthaṃ',
];
