<div align="center">

# 🕉️ అనుష్ఠానం · Anushthanam

**A daily reading companion for Sanātana Dharma — stotras and suktas presented
in Telugu with line-by-line IAST transliteration, hosted as a fast, offline-friendly
static site.**

[![Live site](https://img.shields.io/badge/live-anushthanam.github.io-8a1c1c?style=for-the-badge&logo=readthedocs&logoColor=white)](https://anushthanam.github.io)
[![Deploy Pages](https://github.com/Anushthanam/Anushthanam.github.io/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Anushthanam/Anushthanam.github.io/actions/workflows/deploy-pages.yml)
[![Daily Sankalpam](https://github.com/Anushthanam/Anushthanam.github.io/actions/workflows/daily-sankalpam.yml/badge.svg)](https://github.com/Anushthanam/Anushthanam.github.io/actions/workflows/daily-sankalpam.yml)
[![Built with Docusaurus](https://img.shields.io/badge/built%20with-Docusaurus-3ecc5f?logo=docusaurus&logoColor=white)](https://docusaurus.io)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#-license)

> _"అల్పం నిత్యం — నిత్యం అల్పం."_
> _Little, but daily — daily, but little._

</div>

---

## ✨ Why this exists

Most stotra sites give you either **Telugu script** _or_ **English transliteration** —
never side-by-side. For a devotee whose native tongue is Telugu but who reads
English fluently, that split forces a constant mental translation while chanting.

**అనుష్ఠానం** solves that with a single, opinionated rule for every stotra on the site:

> Every chantable line is rendered as a **pair** — Telugu on top (bold, larger),
> IAST transliteration directly beneath (italic, muted) — so the eye tracks both
> layers as a single unit while the voice reads.

The site is also:

- 📱 **iPad / phone friendly** — designed to be held in one hand during nitya sandhya
- 🌐 **Offline-capable** — pure static HTML/CSS, no client-side dependencies to chant
- ⚡ **Fast** — no ads, no trackers, no popups, ever
- 🔓 **Open** — every text sourced from openly-available authoritative editions (see [Sources](#-sources))

---

## 📚 What's inside

<table>
<tr><td width="60"><h2>🌸</h2></td><td>

### శ్రీ మహాలక్ష్మి · Sri Mahalakshmi

- **శ్రీ సూక్తం** · [Sri Suktam](docs/sri-mahalakshmi/sri-suktam.mdx) — the classical Vedic hymn to Lakṣmī

</td></tr>
<tr><td><h2>🐚</h2></td><td>

### శ్రీ మహా విష్ణువు · Sri Maha Vishnu

- **పురుష సూక్తం** · [Purusha Suktam](docs/sri-maha-vishnu/purusha-suktam.mdx) — Ṛgvedic hymn to the Cosmic Puruṣa
- **శ్రీ విష్ణు సహస్రనామ స్తోత్రమ్** · [Vishnu Sahasranama](docs/sri-maha-vishnu/vishnu-sahasranama.mdx) — the thousand names of Viṣṇu, with pūrvapīṭhikā, nyāsa, dhyānam and phalaśruti in collapsible sections

</td></tr>
<tr><td><h2>🐘</h2></td><td>

### శ్రీ మహా గణపతి · Sri Maha Ganapati

- **శ్రీ గణపత్యథర్వశీర్షోపనిషత్** · [Ganapati Atharvashirsha](docs/ganapati/ganapati-atharvashirsha.mdx) — the Upaniṣat, with opening & closing śānti mantras in collapsibles

</td></tr>
<tr><td><h2>🌞</h2></td><td>

### గాయత్రి · Gayatri

- **గాయత్రీ మంత్ర జపానుష్ఠానము** · [Gayatri Japa Anushtanam](docs/gayatri/gayatri-japa-anushtanam.mdx) — the full daily procedure with āvāhana, upasthānam, śāpa-vimocanas, 24 mudrās (with diagrams), viniyoga and japāvasāna
- **శ్రీ గాయత్రీ కవచము** · [Sri Gayatri Kavacham](docs/gayatri/sri-gayatri-kavacham.mdx) — 14-verse protective armour
- **గాయత్రీ తర్పణము** · [Gayatri Tarpanam](docs/gayatri/gayatri-tarpanam.mdx) — the tarpaṇa vidhi

</td></tr>
</table>

**Roadmap** — more coming (in order): Śrī Rudram · Camakam · Nārāyaṇa Sūktam · Mantra Puṣpam · Śrī Lalitā Sahasranāma · daily Sandhyā Vandanam.

---

## 🌅 Daily Sankalpam automation

The site includes a **GitHub Actions workflow that runs 4×/day** and computes
the full pañcāṅga (tithi, nakṣatra, yoga, karaṇa, vāra, māsa, ṛtu, ayana,
samvatsara) for two regions — **locally in the workflow** using
[`mhah-panchang`](https://www.npmjs.com/package/mhah-panchang) (Drik Ganita /
Swiss Ephemeris). No external API, no key, no rate limit.

| Region | Sankalpam markers |
|---|---|
| **Nellore, India** | జంబూద్వీపే · భరత వర్షే · భరత ఖండే · భారత దేశే · నెల్లూరు మహానగరే · పెన్నా నదీ తీరే |
| **West Drayton, London, UK** | కుశద్వీపే · బ్రిటానియా దేశే · లండన్ మహానగరే · టేమ్స్ నదీ తీరే · వరుణ దిగ్భాగే |

Snapshots are committed to [`static/data/sankalpam/`](static/data/sankalpam/) —
the Sankalpam page reads them client-side, so no rebuild is required for fresh data.
Each snapshot includes a ready-to-recite Telugu sankalpam sentence plus interval
timings for tithi / nakṣatra / yoga / karaṇa.

See [`.github/workflows/daily-sankalpam.yml`](.github/workflows/daily-sankalpam.yml)
and [`scripts/fetch-sankalpam.js`](scripts/fetch-sankalpam.js).

---

## 🏗️ Architecture

```
Anushthanam.github.io
├── docs/                           # MDX content, one file per stotra
│   ├── gayatri/                    # collapsible sidebar category
│   ├── sri-maha-vishnu/
│   ├── sri-mahalakshmi/
│   └── ganapati/
├── src/
│   ├── components/Verse/           # <Verse> card + <LinePair te="" en="" />
│   ├── pages/index.js              # homepage — deity-emoji card grid
│   └── css/custom.css              # Devanagari-safe typography
├── static/
│   ├── img/mudras/                 # 24 mudrā diagrams for Gayatri Japam
│   └── data/sankalpam/             # daily panchang JSON, refreshed 4×/day
├── scripts/fetch-sankalpam.js      # Node 20 panchang fetcher
├── .github/workflows/
│   ├── deploy-pages.yml            # build & deploy on push to main
│   └── daily-sankalpam.yml         # cron: 00:30 / 05:30 / 11:30 / 17:30 UTC
└── docusaurus.config.js
```

**Content model.** Every line of every stotra is authored as:

```jsx
<Verse>
  <LinePair te="ఓం భూర్భువస్సువః" en="oṁ bhūrbhuvassuvaḥ" />
  <LinePair te="తత్సవితుర్వరేణ్యం" en="tatsaviturvareṇyaṁ" />
  {/* ... */}
</Verse>
```

That single component enforces the site-wide reading convention. Migrating to
plain Markdown later is straightforward — the source is already essentially
that.

---

## 🚀 Run it locally

```bash
git clone https://github.com/Anushthanam/Anushthanam.github.io.git
cd Anushthanam.github.io
npm ci
npm run start        # dev server on http://localhost:3000
```

Other commands:

```bash
npm run build        # produces production static site in ./build
npm run serve        # serve the production build
npm run typecheck    # docusaurus type check
```

To test the sankalpam fetcher locally:

```bash
npm install mhah-panchang    # one-time
node scripts/fetch-sankalpam.js
```

---

## 🚢 Deployment

Deploys automatically via GitHub Actions on every push to `main`
(see [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)).

**One-time setup** on a fresh repo:

1. **Settings → Pages → Build and deployment → Source: `GitHub Actions`**
2. Push to `main` — the site publishes to **https://anushthanam.github.io**.

No secrets or API keys required — the sankalpam workflow computes everything
locally with `mhah-panchang`.

---

## 🙏 Sources

All Sanskrit / Telugu text is sourced from openly-available authoritative
editions and cross-checked before onboarding:

- **[stotranidhi.com](https://stotranidhi.com)** — primary source for Telugu script and IAST transliteration
- **Śrī Gāyatrī Mantra Japānuṣṭhānam** — traditional print (11-page PDF), scanned pages included for the mudrā diagrams
- **Śrī Viṣṇu Sahasranāma Stotram** — from the Anuśāsana Parva of the Mahābhārata, in the Vyāsa recension as printed by Stotra Nidhi
- **Śrī Gaṇapatyatharvaśīrṣopaniṣat** — Atharva Veda tradition, śānti mantras from the Kṛṣṇayajurveda

If you spot an error in text, accents, or pāṭha, please
[open an issue](https://github.com/Anushthanam/Anushthanam.github.io/issues/new)
— accuracy in mantra is everything.

---

## 👤 About the author

Hi, I'm **Sanath Kumar Gandikota** ([@skgandikota](https://github.com/skgandikota)) —
a software engineer by day, and a devotee working my way slowly through the
stotra corpus by morning and evening sandhyā.

I built **అనుష్ఠానం** as the site I wished existed when I started my own daily
practice: something that respects the discipline of chanting Sanskrit while
gently supporting a reader who is still building fluency. It is also my small
offering (`sevā`) — every stotra onboarded here is one more that someone,
somewhere, can read tomorrow morning at 5 AM without hunting through PDFs.

**Reach me:**
- 🐙 GitHub: [@skgandikota](https://github.com/skgandikota)
- 💼 LinkedIn: [Sanath Kumar Gandikota](https://www.linkedin.com/in/skgandikota/)
- 📬 Issues & PRs: [contribute a stotra](https://github.com/Anushthanam/Anushthanam.github.io/issues)

---

## 🤝 Contributing

New stotras are very welcome. The onboarding pattern is repeatable:

1. Source Telugu + IAST from a trusted printed or online edition
2. Create `docs/<deity>/<stotra-slug>.mdx` with frontmatter (`id`, `title`, `slug`)
3. Wrap every chantable line in `<LinePair te="..." en="..." />` inside a `<Verse>`
4. Add a card to `STOTRAS` in [`src/pages/index.js`](src/pages/index.js)
5. Run `npm run build` — the strict link checker will catch typos
6. Open a PR — include the source you transcribed from

---

## 📜 License

The **code** in this repository is released under the [MIT License](LICENSE).

The **Sanskrit / Telugu texts** are traditional, out-of-copyright material.
Editorial choices (line breaks, section splits, transliteration standard) are
released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) —
attribution appreciated, not required.

---

<div align="center">

**🕉️ शुभम् अस्तु ।**
_May this be auspicious._

Made with 💙 in London, for chants echoing from Nellore to Nālandā.

</div>
