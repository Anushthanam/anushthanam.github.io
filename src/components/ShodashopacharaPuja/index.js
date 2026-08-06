import React, {useState} from 'react';
import {DEITIES, DEITY_LIST, STEPS} from '@site/src/data/shodashopachara';
import {Verse, LinePair} from '@site/src/components/Verse';
import styles from './styles.module.css';

export default function ShodashopacharaPuja({defaultDeity = 'ganapati'}) {
  const [deityId, setDeityId] = useState(defaultDeity);
  const deity = DEITIES[deityId] || DEITIES.ganapati;

  return (
    <div className={styles.wrap}>
      <div className={styles.selectorBar}>
        <label className={styles.selectorLabel} htmlFor="deity-select">
          <span lang="te">దేవత</span>
          <span className={styles.selectorLabelIast}> · Deity</span>
        </label>
        <select
          id="deity-select"
          className={styles.select}
          value={deityId}
          onChange={(e) => setDeityId(e.target.value)}>
          {DEITY_LIST.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name_te}  ·  {d.name_iast}
            </option>
          ))}
        </select>
        <div className={styles.selectedDeity}>
          <div className={styles.selectedTe} lang="te">{deity.name_te}</div>
          <div className={styles.selectedIast}>{deity.name_iast}</div>
        </div>
      </div>

      {STEPS.map((step) => {
        const lines = step.render(deity);
        return (
          <section key={step.key} className={styles.step} id={step.key}>
            <header className={styles.stepHead}>
              <span className={styles.stepNum}>{step.number}</span>
              <div className={styles.stepTitles}>
                <h2 className={styles.stepTitleTe} lang="te">
                  {step.title_te}
                  <span className={styles.stepTitleIast}> · {step.title_iast}</span>
                </h2>
                {step.subtitle_te ? (
                  <div className={styles.stepSubtitle}>
                    <span lang="te">{step.subtitle_te}</span>
                    {step.subtitle_iast ? (
                      <span className={styles.stepSubtitleIast}> · {step.subtitle_iast}</span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </header>
            <Verse>
              {lines.map((l, i) => (
                <LinePair key={i} te={l.te} en={l.iast} />
              ))}
            </Verse>
          </section>
        );
      })}
    </div>
  );
}
