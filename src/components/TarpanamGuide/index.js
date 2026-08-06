import React, { useCallback, useEffect, useRef, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { TARPANAM_STEPS, TARPANAM_TOTAL } from '@site/src/data/ganapatiTarpanam';
import styles from './styles.module.css';

// During calibration we collect this many taps, ignore the first gap (1→2,
// which carries warm-up/reaction lag) and measure 2→3, 3→4, 4→5, then use the
// SLOWEST of those + a breath as the moola pace.
const LEARN_TAPS = 5;
const MIN_MS = 300;
const MAX_MS = 10000;
const DEFAULT_MS = 1500;
// Extra breathing room added to the detected pace.
const BREATH_MS = 2000;

// Prepend the extra bīja lead-in for full moola-mantra lines only.
function withLeadIn(step) {
  const moola = step.te.includes('గణపతయే');
  return {
    moola,
    te: moola ? `ఓం శ్రీం హ్రీం క్లీం ${step.te}` : step.te,
    en: moola ? `oṁ śrīṁ hrīṁ klīṁ ${step.en}` : step.en,
  };
}

// Phases:
//   idle → calibrating → ready → auto (⇄ paused) → done
// Calibration taps only set the tempo; they never advance the real 444 counts,
// so once you press Start the whole tarpaṇam runs hands-free.
function TarpanamGuideImpl() {
  const steps = TARPANAM_STEPS;

  const [phase, setPhase] = useState('idle');
  const [pos, setPos] = useState({ step: 0, beat: 0 }); // beat = counts completed in step
  const [intervalMs, setIntervalMs] = useState(DEFAULT_MS);
  const [sound, setSound] = useState(true);
  const [calTaps, setCalTaps] = useState(0);

  const tapTimesRef = useRef([]);
  const audioRef = useRef(null);

  const current = withLeadIn(steps[pos.step] || steps[0]);
  const moolaRef = withLeadIn(steps[0]);
  const doneBefore = pos.step > 0 ? steps[pos.step - 1].cumulative : 0;
  const overall = doneBefore + pos.beat;
  // Bīja-akṣara lines pace at half the moola interval.
  const currentInterval = current.moola
    ? intervalMs
    : Math.max(MIN_MS, Math.round(intervalMs / 2));

  // --- tiny WebAudio "tick" so the reciter can keep pace hands-free ------
  const beep = useCallback((accent) => {
    if (!sound) return;
    try {
      let ctx = audioRef.current;
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        audioRef.current = ctx;
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = accent ? 880 : 560;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(accent ? 0.22 : 0.12, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (_) { /* ignore audio errors */ }
  }, [sound]);

  // --- advance exactly one count, rolling into the next step when full ----
  const stepAdvance = useCallback(() => {
    setPos((prev) => {
      const step = steps[prev.step];
      const nextBeat = prev.beat + 1;
      if (nextBeat >= step.reps) {
        const nextStep = prev.step + 1;
        if (nextStep >= steps.length) {
          setPhase('done');
          return { step: prev.step, beat: step.reps };
        }
        beep(true); // accent when a mantram completes → flows to the next one
        return { step: nextStep, beat: 0 };
      }
      beep(false);
      return { step: prev.step, beat: nextBeat };
    });
  }, [steps, beep]);

  // --- automatic pacer (the real run) --------------------------------------
  useEffect(() => {
    if (phase !== 'auto') return undefined;
    const id = setInterval(stepAdvance, currentInterval);
    return () => clearInterval(id);
  }, [phase, currentInterval, stepAdvance]);

  // --- calibration tap: sets the tempo, does NOT touch the 444 counts ------
  const handleCalibrateTap = useCallback(() => {
    if (phase !== 'calibrating') return;
    tapTimesRef.current.push(performance.now());
    setCalTaps(tapTimesRef.current.length);
    beep(false);

    const taps = tapTimesRef.current;
    if (taps.length >= LEARN_TAPS) {
      // Ignore the first gap (1→2) as warm-up, then take the SLOWEST of the
      // remaining gaps (2→3, 3→4, 4→5) and add a breath.
      let maxGap = 0;
      for (let i = 2; i < taps.length; i += 1) {
        const g = taps[i] - taps[i - 1];
        if (g > maxGap) maxGap = g;
      }
      const clamped = Math.min(MAX_MS, Math.max(MIN_MS, Math.round(maxGap) + BREATH_MS));
      setIntervalMs(clamped);
      setPhase('ready'); // pace locked — position the tablet, then Start
    }
  }, [phase, beep]);

  const beginCalibration = useCallback(() => {
    tapTimesRef.current = [];
    setCalTaps(0);
    setPos({ step: 0, beat: 0 });
    setPhase('calibrating');
  }, []);

  const startRun = useCallback(() => {
    setPos({ step: 0, beat: 0 });
    setPhase('auto'); // fully hands-free from count 1
  }, []);

  const handlePlayPause = useCallback(() => {
    setPhase((p) => (p === 'auto' ? 'paused' : p === 'paused' ? 'auto' : p));
  }, []);

  // Spacebar taps during calibration
  useEffect(() => {
    if (phase !== 'calibrating') return undefined;
    const onKey = (e) => {
      if (e.code === 'Space') { e.preventDefault(); handleCalibrateTap(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, handleCalibrateTap]);

  const running = phase === 'auto';
  const secs = (intervalMs / 1000).toFixed(2);
  const bijaSecs = (currentInterval / 1000).toFixed(2);
  const showRun = phase === 'auto' || phase === 'paused' || phase === 'done';
  const paceKnown = phase === 'ready' || showRun;

  return (
    <div className={styles.guide}>
      <div className={styles.header}>
        <div className={styles.title}>
          మార్గదర్శక తర్పణం · Guided Tarpaṇa Pacer
        </div>
        <div className={styles.sub}>
          {phase === 'idle' && 'ముందుగా “Set Pace” నొక్కి లయను అభ్యాసంగా నొక్కండి — అది తర్పణంలో లెక్కించబడదు. తర్వాత టాబ్లెట్‌ను సరిచేసి Start నొక్కితే అంతా తనంతట తానే నడుస్తుంది. · First tap a practice cycle to set your pace (it does NOT count), then position the tablet and press Start — it runs hands-free.'}
          {phase === 'calibrating' && `లయ అభ్యాసం — మీ మూలమంత్ర వేగంలో ${LEARN_TAPS} సార్లు నొక్కండి · Tap ${LEARN_TAPS} times at your moola-mantra pace  (${calTaps}/${LEARN_TAPS})`}
          {phase === 'ready' && `✅ లయ సిద్ధం · Pace set — moola ${secs}s, bīja ${(intervalMs / 2000).toFixed(2)}s per count. టాబ్లెట్‌ను సరిచేసి Play నొక్కండి · Position the tablet and press Play — it runs to 444 without touching the screen.`}
          {phase === 'auto' && `స్వయంచాలకం · Auto-pacing — ${current.moola ? `moola ${secs}s` : `bīja ${bijaSecs}s`} / count`}
          {phase === 'paused' && '⏸ నిలిపివేయబడింది — Play నొక్కితే అదే చోటు నుండి కొనసాగుతుంది · Paused — resumes from the same count'}
          {phase === 'done' && '🙏 పూర్తయింది · Completed all 444 counts'}
        </div>
      </div>

      {/* Calibration cycle — practice taps only */}
      {phase === 'calibrating' && (
        <>
          <div className={styles.mantram}>
            <div className={styles.mte} lang="te">{moolaRef.te}</div>
            <div className={styles.men}>{moolaRef.en}</div>
            <div className={styles.tapHint}>👆 లయ కోసం పెట్టెలను నొక్కండి · tap the boxes to set the beat</div>
          </div>
          <div className={styles.boxes}>
            {Array.from({ length: LEARN_TAPS }).map((_, i) => {
              const state = i < calTaps ? 'done' : i === calTaps ? 'active' : '';
              return (
                <button
                  key={i}
                  type="button"
                  onClick={handleCalibrateTap}
                  className={`${styles.box} ${state ? styles[state] : ''} ${styles.tappable}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* The real hands-free run */}
      {showRun && (
        <>
          <div className={styles.mantram}>
            <div className={styles.mte} lang="te">{current.te}</div>
            <div className={styles.men}>{current.en}</div>
          </div>

          <div className={styles.boxes}>
            {Array.from({ length: steps[pos.step].reps }).map((_, i) => {
              const state = i < pos.beat ? 'done' : i === pos.beat && running ? 'active' : '';
              return (
                <div key={i} className={`${styles.box} ${state ? styles[state] : ''}`}>
                  {i + 1}
                </div>
              );
            })}
          </div>

          <div className={styles.progress}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${(overall / TARPANAM_TOTAL) * 100}%` }}
              />
            </div>
            <div className={styles.progressText}>
              {overall} / {TARPANAM_TOTAL} · మంత్రం {pos.step + 1}/{steps.length}
            </div>
          </div>
        </>
      )}

      <div className={styles.controls}>
        {phase === 'idle' && (
          <button className={`${styles.btn} ${styles.primary}`} onClick={beginCalibration}>
            🎚️ Set Pace
          </button>
        )}

        {phase === 'calibrating' && (
          <button className={styles.btn} onClick={beginCalibration}>↺ Restart taps</button>
        )}

        {phase === 'ready' && (
          <>
            <button className={`${styles.btn} ${styles.primary}`} onClick={startRun}>▶ Play</button>
            <button className={styles.btn} onClick={beginCalibration}>🎚️ Re-set Pace</button>
          </>
        )}

        {(phase === 'auto' || phase === 'paused') && (
          <button className={`${styles.btn} ${styles.primary}`} onClick={handlePlayPause}>
            {phase === 'auto' ? '⏸ Pause' : '▶ Play'}
          </button>
        )}

        {phase === 'done' && (
          <>
            <button className={`${styles.btn} ${styles.primary}`} onClick={startRun}>▶ Play Again</button>
            <button className={styles.btn} onClick={beginCalibration}>🎚️ Re-set Pace</button>
          </>
        )}

        <button
          className={`${styles.btn} ${sound ? styles.on : ''}`}
          onClick={() => setSound((s) => !s)}
          title="Toggle beat sound"
        >
          {sound ? '🔊' : '🔇'} Sound
        </button>
      </div>

      {paceKnown && (
        <div className={styles.speedRow}>
          <label className={styles.speedLabel}>
            వేగం · Speed <strong>{secs}s / count</strong> <span className={styles.speedHint}>(bīja {(intervalMs / 2000).toFixed(2)}s)</span>
          </label>
          <input
            className={styles.slider}
            type="range"
            min={MIN_MS}
            max={MAX_MS}
            step={50}
            // Slider counts UP = faster, so invert the raw value.
            value={MIN_MS + MAX_MS - intervalMs}
            onChange={(e) => setIntervalMs(MIN_MS + MAX_MS - Number(e.target.value))}
          />
          <span className={styles.speedHint}>← నెమ్మది slow · fast వేగం →</span>
        </div>
      )}
    </div>
  );
}

export default function TarpanamGuide() {
  return (
    <BrowserOnly fallback={<div className={styles.guide} />}>
      {() => <TarpanamGuideImpl />}
    </BrowserOnly>
  );
}
