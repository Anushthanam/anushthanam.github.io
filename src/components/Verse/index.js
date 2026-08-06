import React from 'react';
import styles from './styles.module.css';

// One line pair: Telugu on top, transliteration directly below.
export function LinePair({te, en}) {
  return (
    <div className={styles.linepair}>
      <div className={styles.te} lang="te">{te}</div>
      {en ? <div className={styles.en}>{en}</div> : null}
    </div>
  );
}

// Wraps a group of line pairs as a "verse card".
export function Verse({children}) {
  return <div className={styles.verse}>{children}</div>;
}

// Optional meaning / bhaavam block.
export function Meaning({children}) {
  return (
    <div className={styles.meaning}>
      <span className={styles.meaningLabel}>భావం · Meaning</span>
      {children}
    </div>
  );
}

export default LinePair;
