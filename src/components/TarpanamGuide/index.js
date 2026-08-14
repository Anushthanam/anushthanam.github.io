import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

// Hand-tap gesture guard (Manual mode). Rejects rain/water-drop touches which
// are typically <30ms flickers with pointer position jumping. A real finger
// tap holds contact for ~60–200ms with essentially zero drift.
const TAP_MIN_MS = 60;
const TAP_MAX_MS = 1200;
const TAP_MAX_MOVE_PX = 22;
const TAP_DEBOUNCE_MS = 300;

// Prepend the extra bīja lead-in for full moola-mantra lines only.
function withLeadIn(step) {
  const moola = step.te.includes('గణపతయే');
  return {
    moola,
    te: moola ? `ఓం శ్రీం హ్రీం క్లీం ${step.te}` : step.te,
    en: moola ? `oṁ śrīṁ hrīṁ klīṁ ${step.en}` : step.en,
  };
}

// Manual-mode audio: drop matching MP3s in `/static/audio/tarpanam/` and
// they'll play once when the mantram becomes current. Naming convention:
//   step-01.mp3, step-02.mp3, ..., step-NN.mp3  (1-based index).
// Missing files fail silently — no MP3 = no audio for that step.
const AUDIO_BASE = '/audio/tarpanam';
function audioUrlForStep(idx) {
  const n = String(idx + 1).padStart(2, '0');
  return `${AUDIO_BASE}/step-${n}.mp3`;
}

// Build Manual-mode "bundles": the tarpaṇa is a 12× moola opener followed by
// alternating (bīja × 4, moola × 4) pairs. Rather than showing 22+ screens,
// we bundle each bīja+moola pair into one screen so the reciter sees the
// bīja mantram and the follow-up moola mantram together, both recited × 4.
// One tap → next bundle (i.e. next bīja + its moola).
//
// Returns: [
//   { kind:'solo', reps:12, lines:[moola], stepSpan:[0,0] },
//   { kind:'pair', reps:4,  lines:[bīja1, moola], stepSpan:[1,2] },
//   { kind:'pair', reps:4,  lines:[bīja2, moola], stepSpan:[3,4] },
//   ...
// ]
function buildManualBundles(steps) {
  const bundles = [];
  if (!steps.length) return bundles;
  bundles.push({
    kind: 'solo',
    reps: steps[0].reps,
    lines: [steps[0]],
    stepSpan: [0, 0],
  });
  for (let i = 1; i < steps.length; i += 2) {
    const a = steps[i];
    const b = steps[i + 1];
    if (b) {
      bundles.push({
        kind: 'pair',
        reps: a.reps, // both a and b share the same rep count post-opener
        lines: [a, b],
        stepSpan: [i, i + 1],
      });
    } else {
      bundles.push({
        kind: 'solo',
        reps: a.reps,
        lines: [a],
        stepSpan: [i, i],
      });
    }
  }
  return bundles;
}

// Phases:
//   idle → calibrating → ready → auto (⇄ paused) → done
//   idle → manual → done
// Modes:
//   pacer  = the hands-free auto pacer with tempo calibration
//   manual = one-tap-per-count, with per-mantram TTS voice-over
// LocalStorage key for the manual-mode resume point. Keeps only the mantram
// index, so on the next launch we can offer "Resume from mantram N of M".
const RESUME_KEY = 'anushthanam:tarpanam-manual:v2';
function loadResume() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(RESUME_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (obj && Number.isInteger(obj.step) && obj.step > 0) return obj.step;
    return null;
  } catch { return null; }
}
function saveResume(step) {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(RESUME_KEY, JSON.stringify({ step, t: Date.now() })); } catch {}
}
function clearResume() {
  if (typeof window === 'undefined') return;
  try { window.localStorage.removeItem(RESUME_KEY); } catch {}
}

function TarpanamGuideImpl() {
  const steps = TARPANAM_STEPS;

  const [phase, setPhase] = useState('idle');
  const [mode, setMode] = useState('pacer'); // 'pacer' | 'manual'
  const [fullscreen, setFullscreen] = useState(false);
  const [pos, setPos] = useState({ step: 0, beat: 0 }); // beat = counts completed in step
  const [intervalMs, setIntervalMs] = useState(DEFAULT_MS);
  const [sound, setSound] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [calTaps, setCalTaps] = useState(0);
  const [resumeStep, setResumeStep] = useState(0); // 0 = no saved progress
  // Manual mode advances by *bundle*, not by raw step. Bundle index also
  // drives the resume point.
  const [bundleIdx, setBundleIdx] = useState(0);
  const bundles = useMemo(() => buildManualBundles(TARPANAM_STEPS), []);

  // On mount, check for a saved manual-mode resume point (bundle index).
  useEffect(() => {
    const s = loadResume();
    if (s && s < bundles.length) setResumeStep(s);
  }, [bundles.length]);

  const tapTimesRef = useRef([]);
  const audioRef = useRef(null);
  // Manual-tap gesture recognizer state
  const gestureRef = useRef({ down: 0, x: 0, y: 0, lastAdvance: 0 });
  // Track which step we've already spoken so we don't repeat on re-render
  const spokenStepRef = useRef(-1);

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

  // --- Manual mode: one tap jumps to the NEXT bundle. A "bundle" is the
  // opener (moola × 12) followed by pairs of (bīja × 4, moola × 4) shown
  // together on one screen. This collapses the 22+ raw steps into ~11
  // meaningful screens for the reciter.
  const stepJumpMantram = useCallback(() => {
    setBundleIdx((prev) => {
      const next = prev + 1;
      if (next >= bundles.length) {
        setPhase('done');
        return prev;
      }
      beep(true);
      // Keep pos.step aligned to the FIRST step of the new bundle so the
      // resume + audio effects still work off pos.step.
      const nextFirst = bundles[next].stepSpan[0];
      setPos({ step: nextFirst, beat: 0 });
      return next;
    });
  }, [bundles, beep]);

  // --- automatic pacer (the real run) --------------------------------------
  useEffect(() => {
    if (phase !== 'auto') return undefined;
    const id = setInterval(stepAdvance, currentInterval);
    return () => clearInterval(id);
  }, [phase, currentInterval, stepAdvance]);

  // --- Manual mode: play a matching MP3 (step-NN.mp3) once when the mantram
  // becomes current. Silently no-ops if the file doesn't exist.
  const audioElRef = useRef(null);
  useEffect(() => {
    if (phase !== 'manual' || !audioOn) return undefined;
    if (spokenStepRef.current === pos.step) return undefined;
    spokenStepRef.current = pos.step;

    // Stop any prior clip before starting the next one.
    if (audioElRef.current) {
      try { audioElRef.current.pause(); } catch (_) {}
      audioElRef.current = null;
    }
    const el = new Audio(audioUrlForStep(pos.step));
    audioElRef.current = el;
    // Fail silently on 404 / decode errors — no MP3 for this step is fine.
    el.addEventListener('error', () => { audioElRef.current = null; });
    el.play().catch(() => { /* autoplay blocked or file missing */ });
    return () => { try { el.pause(); } catch (_) {} };
  }, [phase, pos.step, audioOn]);

  // Stop audio when leaving manual mode or unmounting.
  useEffect(() => {
    if (phase === 'manual') return undefined;
    if (audioElRef.current) {
      try { audioElRef.current.pause(); } catch (_) {}
      audioElRef.current = null;
    }
    return undefined;
  }, [phase]);
  useEffect(() => () => {
    if (audioElRef.current) {
      try { audioElRef.current.pause(); } catch (_) {}
      audioElRef.current = null;
    }
  }, []);

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

  // --- Manual-mode hand-tap recognizer: pointerdown records the time+xy,
  // pointerup checks (duration, movement, debounce) before advancing. Water
  // drops fail the min-duration or min-move filter and are ignored.
  const onTapDown = useCallback((e) => {
    if (phase !== 'manual') return;
    gestureRef.current.down = performance.now();
    gestureRef.current.x = e.clientX ?? 0;
    gestureRef.current.y = e.clientY ?? 0;
  }, [phase]);
  const onTapUp = useCallback((e) => {
    if (phase !== 'manual') return;
    const g = gestureRef.current;
    if (!g.down) return;
    const dt = performance.now() - g.down;
    const dx = (e.clientX ?? 0) - g.x;
    const dy = (e.clientY ?? 0) - g.y;
    const move = Math.sqrt(dx * dx + dy * dy);
    g.down = 0;
    if (dt < TAP_MIN_MS || dt > TAP_MAX_MS) return; // rain drop / long-press
    if (move > TAP_MAX_MOVE_PX) return;              // scroll / swipe
    const now = performance.now();
    if (now - g.lastAdvance < TAP_DEBOUNCE_MS) return; // debounce double-fire
    g.lastAdvance = now;
    stepJumpMantram();
  }, [phase, stepJumpMantram]);

  const beginCalibration = useCallback(() => {
    tapTimesRef.current = [];
    setCalTaps(0);
    setPos({ step: 0, beat: 0 });
    setMode('pacer');
    setPhase('calibrating');
    setFullscreen(true);
  }, []);

  // Save resume point (bundle index) whenever it changes in manual mode.
  useEffect(() => {
    if (phase !== 'manual') return;
    if (bundleIdx > 0) {
      saveResume(bundleIdx);
      setResumeStep(bundleIdx);
    }
  }, [phase, bundleIdx]);
  useEffect(() => {
    if (phase === 'done' && mode === 'manual') {
      clearResume();
      setResumeStep(0);
    }
  }, [phase, mode]);

  const startManual = useCallback((resumeFromBundle = 0) => {
    const safe = Math.max(0, Math.min(resumeFromBundle, bundles.length - 1));
    const firstStep = bundles[safe] ? bundles[safe].stepSpan[0] : 0;
    setBundleIdx(safe);
    setPos({ step: firstStep, beat: 0 });
    spokenStepRef.current = -1;
    gestureRef.current.lastAdvance = 0;
    setMode('manual');
    setPhase('manual');
    setFullscreen(true);
    if (safe === 0) {
      clearResume();
      setResumeStep(0);
    }
  }, [bundles]);

  const startRun = useCallback(() => {
    setPos({ step: 0, beat: 0 });
    setPhase('auto'); // fully hands-free from count 1
  }, []);

  const handlePlayPause = useCallback(() => {
    setPhase((p) => (p === 'auto' ? 'paused' : p === 'paused' ? 'auto' : p));
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreen(false);
    // Pause pacer + any playing audio so the user can adjust in peace.
    setPhase((p) => (p === 'auto' ? 'paused' : p));
    if (audioElRef.current) {
      try { audioElRef.current.pause(); } catch (_) {}
      audioElRef.current = null;
    }
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

  // Escape closes fullscreen
  useEffect(() => {
    if (!fullscreen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') closeFullscreen(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen, closeFullscreen]);

  const running = phase === 'auto';
  const secs = (intervalMs / 1000).toFixed(2);
  const bijaSecs = (currentInterval / 1000).toFixed(2);
  const showRun = phase === 'auto' || phase === 'paused' || phase === 'done';
  const paceKnown = phase === 'ready' || showRun;
  const showManual = phase === 'manual';

  const content = (
    <div className={styles.guide}>
      <div className={styles.header}>
        <div className={styles.title}>
          మార్గదర్శక తర్పణం · Guided Tarpaṇa Pacer
        </div>
        <div className={styles.sub}>
          {phase === 'idle' && '“Set Pace” — నొక్కుడు లయ నేర్చుకొని స్వయంచాలకంగా 444 సార్లు నడుస్తుంది · learns your tempo and auto-runs hands-free. “Manual” — ఒక్కసారి తట్టితే ఒక లెక్క, ప్రతి కొత్త మంత్రం స్వరపెట్టబడుతుంది · one tap per count, each new (bīja) mantram is voiced.'}
          {phase === 'calibrating' && `లయ అభ్యాసం — మీ మూలమంత్ర వేగంలో ${LEARN_TAPS} సార్లు నొక్కండి · Tap ${LEARN_TAPS} times at your moola-mantra pace  (${calTaps}/${LEARN_TAPS})`}
          {phase === 'ready' && `✅ లయ సిద్ధం · Pace set — moola ${secs}s, bīja ${(intervalMs / 2000).toFixed(2)}s per count. టాబ్లెట్‌ను సరిచేసి Play నొక్కండి · Position the tablet and press Play — it runs to 444 without touching the screen.`}
          {phase === 'auto' && `స్వయంచాలకం · Auto-pacing — ${current.moola ? `moola ${secs}s` : `bīja ${bijaSecs}s`} / count`}
          {phase === 'paused' && '⏸ నిలిపివేయబడింది — Play నొక్కితే అదే చోటు నుండి కొనసాగుతుంది · Paused — resumes from the same count'}
          {phase === 'manual' && '👆 స్క్రీన్‌పై చేతితో ఒక్కసారి తట్టండి = ఒక లెక్క · Tap the screen once with your hand = one count. (నీటి బిందువులు తిరస్కరించబడతాయి · water drops are rejected.)'}
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

      {/* Manual mode — bundle view: bīja + moola stacked, hero text, tap anywhere */}
      {showManual && bundles[bundleIdx] && (
        <div
          className={styles.tapSurface}
          onPointerDown={onTapDown}
          onPointerUp={onTapUp}
          onPointerCancel={() => { gestureRef.current.down = 0; }}
          role="button"
          aria-label="Tap to advance to the next mantram bundle"
          tabIndex={0}
          onKeyDown={(e) => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); stepJumpMantram(); } }}
        >
          <div style={{ width: '100%' }}>
            {bundles[bundleIdx].lines.map((line, i) => {
              const w = withLeadIn(line);
              return (
                <div key={i} className={`${styles.mantram} ${styles.heroMantram}`}>
                  <div className={styles.mte} lang="te">{w.te}</div>
                  <div className={styles.men}>{w.en}</div>
                </div>
              );
            })}

            <div className={styles.progress}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${((bundleIdx + 1) / bundles.length) * 100}%` }}
                />
              </div>
              <div className={styles.progressText}>
                {bundleIdx + 1} / {bundles.length}
              </div>
            </div>

            <div className={styles.tapHintBig}>👆 తట్టండి · TAP for next</div>

            <div className={styles.voiceRow}>
              <button
                type="button"
                className={`${styles.btn} ${audioOn ? styles.on : ''}`}
                onClick={(e) => { e.stopPropagation(); setAudioOn((v) => !v); }}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
              >
                {audioOn ? '🔊 ఆడియో · Audio ON' : '🔇 ఆడియో · Audio OFF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* The real hands-free pacer run */}
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
          <>
            <button className={`${styles.btn} ${styles.primary}`} onClick={beginCalibration}>
              🎚️ Set Pace
            </button>
            <button className={styles.btn} onClick={() => startManual(0)}>
              👆 Manual
            </button>
            {resumeStep > 0 && (
              <button
                className={`${styles.btn} ${styles.primary}`}
                onClick={() => startManual(resumeStep)}
                title="Continue from where you stopped"
              >
                ⏵ Resume · మంత్రం {resumeStep + 1}/{steps.length}
              </button>
            )}
          </>
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

        {phase === 'manual' && (
          <>
            <button
              className={styles.btn}
              onClick={(e) => { e.stopPropagation(); setBundleIdx((i) => Math.max(0, i - 1)); }}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              disabled={bundleIdx === 0}
            >⬅ Back</button>
            <button
              className={styles.btn}
              onClick={(e) => { e.stopPropagation(); startManual(0); }}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
            >↺ Restart from 1</button>
          </>
        )}

        {phase === 'done' && (
          <>
            <button className={`${styles.btn} ${styles.primary}`} onClick={mode === 'manual' ? () => startManual(0) : startRun}>▶ Play Again</button>
            <button className={styles.btn} onClick={beginCalibration}>🎚️ Re-set Pace</button>
            <button className={styles.btn} onClick={() => startManual(0)}>👆 Manual</button>
          </>
        )}

        {phase !== 'manual' && (
          <button
            className={`${styles.btn} ${sound ? styles.on : ''}`}
            onClick={() => setSound((s) => !s)}
            title="Toggle beat sound"
          >
            {sound ? '🔊' : '🔇'} Sound
          </button>
        )}
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

  if (fullscreen) {
    return (
      <div className={styles.fsOverlay} role="dialog" aria-modal="true">
        <button
          type="button"
          className={styles.fsClose}
          onClick={(e) => { e.stopPropagation(); closeFullscreen(); }}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          aria-label="Close full screen"
          title="Close full screen (Esc)"
        >
          ✕
        </button>
        {content}
      </div>
    );
  }
  return content;
}

export default function TarpanamGuide() {
  return (
    <BrowserOnly fallback={<div className={styles.guide} />}>
      {() => <TarpanamGuideImpl />}
    </BrowserOnly>
  );
}
