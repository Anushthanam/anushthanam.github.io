import React, { useEffect, useMemo, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {
  REGIONS,
  detectRegion,
  computeSankalpam,
  localParts,
} from '@site/src/lib/sankalpam';
import styles from './styles.module.css';

/**
 * <Sankalpam /> — dynamic daily sankalpam.
 * Auto-detects the visitor's region (Nellore for Asia/*, West Drayton for
 * Europe/*), prefills the current local date + time, and lets the user
 * override both. Computes panchang locally with mhah-panchang (no API).
 */
function SankalpamImpl({ includeFamily = false, closingTe, closingIast }) {
  const [MhahPanchang, setMhah] = useState(null);
  const [regionId, setRegionId] = useState(() => detectRegion());
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');

  // Lazy-load mhah-panchang (client only)
  useEffect(() => {
    let cancelled = false;
    import('mhah-panchang').then((mod) => {
      if (!cancelled) setMhah(() => mod.MhahPanchang);
    });
    return () => { cancelled = true; };
  }, []);

  // Prefill local date/time from the detected region's timezone whenever the
  // region changes (or on first load).
  useEffect(() => {
    const region = REGIONS[regionId];
    const now = new Date();
    const lp = localParts(region.tz_name, now);
    setDateStr(`${lp.year}-${String(lp.month).padStart(2,'0')}-${String(lp.day).padStart(2,'0')}`);
    setTimeStr(`${String(lp.hour).padStart(2,'0')}:${String(lp.minute).padStart(2,'0')}`);
  }, [regionId]);

  // Build the target instant. The date/time inputs are interpreted as the
  // *local wall-clock* in the region's timezone. We approximate by using the
  // region's current DST-aware offset (accurate within one DST-transition day).
  const instant = useMemo(() => {
    if (!dateStr || !timeStr) return null;
    const region = REGIONS[regionId];
    const [y,m,d] = dateStr.split('-').map(Number);
    const [hh,mm] = timeStr.split(':').map(Number);
    // Guess the offset by starting from a UTC clock at the same wall time,
    // asking Intl what UTC instant that maps to in the region's timezone, and
    // adjusting.
    const guess = new Date(Date.UTC(y, m - 1, d, hh, mm, 0));
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: region.tz_name, hourCycle: 'h23',
      year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',
    });
    const parts = Object.fromEntries(dtf.formatToParts(guess).map(p => [p.type, p.value]));
    const asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
    const offsetMs = asUTC - guess.getTime();
    return new Date(guess.getTime() - offsetMs);
  }, [dateStr, timeStr, regionId]);

  const result = useMemo(() => {
    if (!MhahPanchang || !instant) return null;
    try {
      return computeSankalpam(new MhahPanchang(), REGIONS[regionId], instant, {
        includeFamily, closingTe, closingIast,
      });
    } catch (e) {
      console.error('[Sankalpam] compute failed', e);
      return null;
    }
  }, [MhahPanchang, regionId, instant, includeFamily, closingTe, closingIast]);

  const useNow = () => {
    const region = REGIONS[regionId];
    const lp = localParts(region.tz_name, new Date());
    setDateStr(`${lp.year}-${String(lp.month).padStart(2,'0')}-${String(lp.day).padStart(2,'0')}`);
    setTimeStr(`${String(lp.hour).padStart(2,'0')}:${String(lp.minute).padStart(2,'0')}`);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <label className={styles.control}>
          <span>Region</span>
          <select value={regionId} onChange={(e) => setRegionId(e.target.value)}>
            {Object.values(REGIONS).map((r) => (
              <option key={r.id} value={r.id}>{r.name_en}</option>
            ))}
          </select>
        </label>
        <label className={styles.control}>
          <span>Date</span>
          <input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} />
        </label>
        <label className={styles.control}>
          <span>Time</span>
          <input type="time" value={timeStr} onChange={(e) => setTimeStr(e.target.value)} />
        </label>
        <button className={styles.nowBtn} onClick={useNow} type="button">Use now</button>
      </div>

      {!MhahPanchang && <div className={styles.loading}>Loading pañcāṅga engine…</div>}
      {MhahPanchang && !result && <div className={styles.loading}>Computing…</div>}

      {result && (
        <>
          <div className={styles.sankalpam} lang="te">
            {result.sankalpam_te}
          </div>
          <div className={styles.sankalpamIast}>
            <em>{result.sankalpam_iast}</em>
          </div>

          <details className={styles.details}>
            <summary>పంచాంగ వివరాలు · Panchang details</summary>
            <div className={styles.meta}>
              <span><strong>{result.region.name_te}</strong> · {result.region.name_en}</span>
              <span>{result.local_time.replace('T', ' ')} ({result.region.tz_name}, UTC{result.region.tz_offset_hours >= 0 ? '+' : ''}{result.region.tz_offset_hours})</span>
              <span>{result.panchang.sandhya.te} సంధ్య · {result.panchang.sandhya.en} sandhyā</span>
            </div>

            <div className={styles.grid}>
              <Item label="సంవత్సర" te={result.panchang.samvatsara_te} en={result.panchang.samvatsara_en} />
              <Item label="అయనం"   te={result.panchang.ayana_te}       en={result.panchang.ayana_iast === 'uttarāyaṇe' ? 'Uttarāyaṇa' : 'Dakṣiṇāyana'} />
              <Item label="ఋతువు"  te={result.panchang.ritu_te}        en={result.panchang.ritu_en} />
              <Item label="మాసం"   te={result.panchang.masa_te}        en={result.panchang.masa_en} />
              <Item label="పక్షం"  te={result.panchang.paksha_te}      en={result.panchang.paksha_en} />
              <Item label="తిథి"   te={result.panchang.tithi_te}       en={result.panchang.tithi_en} />
              <Item label="వాసరం"  te={result.panchang.vara_te}        en={result.panchang.vara_en} />
              <Item label="నక్షత్రం" te={result.panchang.nakshatra_te} en={result.panchang.nakshatra_en} />
              <Item label="యోగం"   te={result.panchang.yoga_te}        en={result.panchang.yoga_en} />
              <Item label="కరణం"   te={result.panchang.karana_te}      en={result.panchang.karana_en} />
            </div>

            <details className={styles.intervals}>
              <summary>Interval timings (UTC)</summary>
              <table>
                <tbody>
                  <tr><th>Tithi</th><td>{fmt(result.panchang.tithi_interval.start)}</td><td>→</td><td>{fmt(result.panchang.tithi_interval.end)}</td></tr>
                  <tr><th>Nakshatra</th><td>{fmt(result.panchang.nakshatra_interval.start)}</td><td>→</td><td>{fmt(result.panchang.nakshatra_interval.end)}</td></tr>
                  <tr><th>Yoga</th><td>{fmt(result.panchang.yoga_interval.start)}</td><td>→</td><td>{fmt(result.panchang.yoga_interval.end)}</td></tr>
                  <tr><th>Karana</th><td>{fmt(result.panchang.karana_interval.start)}</td><td>→</td><td>{fmt(result.panchang.karana_interval.end)}</td></tr>
                </tbody>
              </table>
            </details>
          </details>
        </>
      )}
    </div>
  );
}

function Item({ label, te, en }) {
  return (
    <div className={styles.item}>
      <div className={styles.itemLabel}>{label}</div>
      <div className={styles.itemTe} lang="te">{te}</div>
      <div className={styles.itemEn}>{en}</div>
    </div>
  );
}

// Format a Date (or ISO string) as "YYYY-MM-DD HH:mm UTC".
function fmt(v) {
  if (!v) return '—';
  const d = v instanceof Date ? v : new Date(v);
  if (isNaN(d.getTime())) return String(v);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

export default function Sankalpam(props) {
  return (
    <BrowserOnly fallback={<div>Loading sankalpam…</div>}>
      {() => <SankalpamImpl {...props} />}
    </BrowserOnly>
  );
}
