/* One-off generator: content.js -> deity-grouped MDX docs. Run: node generate-docs.js */
const fs = require("fs");
const path = require("path");

const A = require("./legacy/content.js");

// Map each stotram id -> its deity category.
const DEITY = {
  "sri-suktam":     { slug: "sri-mahalakshmi", label: "శ్రీ మహాలక్ష్మి · Sri Mahalakshmi", position: 1, emoji: "🌸", desc: "Stotras and suktas devoted to Goddess Lakshmi." },
  "purusha-suktam": { slug: "sri-maha-vishnu", label: "శ్రీ మహా విష్ణువు · Sri Maha Vishnu", position: 2, emoji: "🐚", desc: "Stotras and suktas devoted to Lord Vishnu / the Cosmic Purusha." },
  "gayatri":        { slug: "gayatri",         label: "గాయత్రి · Gayatri",                 position: 3, emoji: "🌞", desc: "Sandhyavandanam and Gayatri upasana." },
};
const OTHER = { slug: "itara", label: "ఇతర · Other", position: 99, emoji: "🕉️", desc: "Other stotras." };

const items = A.categories.flatMap((c) => c.items);
const docsDir = path.join(__dirname, "docs");

// group parallel te/en lines into verses; a verse ends when a te line contains "||"
function toVerses(te, en) {
  const verses = [];
  let cur = [];
  for (let i = 0; i < te.length; i++) {
    cur.push({ te: te[i], en: en[i] || "" });
    if (te[i].includes("||")) { verses.push(cur); cur = []; }
  }
  if (cur.length) verses.push(cur);
  return verses;
}

function esc(s) {
  // safe inside JSX double-quoted attribute; content uses curly quotes, so straight " is absent
  return String(s == null ? "" : s).replace(/"/g, "\u201d");
}

let position = {};
items.forEach((it) => {
  const d = DEITY[it.id] || OTHER;
  const dir = path.join(docsDir, d.slug);
  fs.mkdirSync(dir, { recursive: true });

  // category metadata
  const catFile = path.join(dir, "_category_.json");
  if (!fs.existsSync(catFile)) {
    fs.writeFileSync(catFile, JSON.stringify({
      label: `${d.emoji} ${d.label}`,
      position: d.position,
      collapsible: true,
      collapsed: false,
      link: { type: "generated-index", title: d.label, description: d.desc },
    }, null, 2) + "\n");
  }

  position[d.slug] = (position[d.slug] || 0) + 1;

  const verses = toVerses(it.telugu || [], it.english || []);
  let body = "";
  verses.forEach((v) => {
    body += "<Verse>\n";
    v.forEach((ln) => {
      body += `  <LinePair te="${esc(ln.te)}" en="${esc(ln.en)}" />\n`;
    });
    body += "</Verse>\n\n";
  });

  const meaning = it.meaning ? `<Meaning>\n${it.meaning}\n</Meaning>\n` : "";
  const note = it.note ? `\n:::note\n${it.note}\n:::\n` : "";

  const mdx =
`---
sidebar_label: "${it.title}"
sidebar_position: ${position[d.slug]}
title: "${it.title} · ${it.titleEn}"
description: "${it.titleEn}"
slug: /${d.slug}/${it.id}
---
import {LinePair, Verse, Meaning} from '@site/src/components/Verse';
${note}
${body}${meaning}`;

  const file = path.join(dir, `${it.id}.mdx`);
  fs.writeFileSync(file, mdx);
  console.log("wrote", path.relative(__dirname, file), `(${verses.length} verses)`);
});

console.log("done.");
