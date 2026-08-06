import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const STOTRAS = [
  {
    te: 'శ్రీ గణపత్యథర్వశీర్షోపనిషత్',
    en: 'Ganapati Atharvashirsha',
    deity: 'శ్రీ మహా గణపతి',
    to: '/ganapati/ganapati-atharvashirsha',
  },
  {
    te: 'శ్రీ మహాగణపతి చతురావృత్తి తర్పణం',
    en: 'Sri Mahāgaṇapati Caturāvṛtti Tarpaṇam',
    deity: 'శ్రీ మహా గణపతి',
    to: '/ganapati/ganapati-caturavrutti-tarpanam',
  },
  {
    te: 'శ్రీ సూక్తం',
    en: 'Sri Suktam',
    deity: 'శ్రీ మహాలక్ష్మి',
    to: '/sri-mahalakshmi/sri-suktam',
  },
  {
    te: 'శ్రీ కనకధారా స్తోత్రం',
    en: 'Śrī Kanakadhārā Stōtram',
    deity: 'శ్రీ మహాలక్ష్మి',
    to: '/sri-mahalakshmi/kanakadhara-stotram',
  },
  {
    te: 'పురుష సూక్తం',
    en: 'Purusha Suktam',
    deity: 'శ్రీ మహా విష్ణువు',
    to: '/sri-maha-vishnu/purusha-suktam',
  },
  {
    te: 'శ్రీ విష్ణు సహస్రనామ స్తోత్రమ్',
    en: 'Sri Vishnu Sahasranama Stotram',
    deity: 'శ్రీ మహా విష్ణువు',
    to: '/sri-maha-vishnu/vishnu-sahasranama',
  },
  {
    te: 'శ్రీ రుద్రాభిషేకమ్',
    en: 'Śrī Rudrābhiṣekam',
    deity: 'శ్రీ శివ',
    to: '/siva/rudrabhishekam',
  },
  {
    te: 'శ్రీ దక్షిణామూర్తి స్తోత్రం',
    en: 'Śrī Dakṣiṇāmūrti Stōtram',
    deity: 'శ్రీ శివ',
    to: '/siva/dakshinamurthy-stotram',
  },
  {
    te: 'దీపారాధన',
    en: 'Deepa Ārādhana',
    deity: 'నిత్య అనుష్ఠానం',
    to: '/sandhya-vandanam/deepa-aradhana',
  },
  {
    te: 'కలశ పూజ',
    en: 'Kalaśa Pūjā',
    deity: 'నిత్య అనుష్ఠానం',
    to: '/sandhya-vandanam/kalasha-puja',
  },
  {
    te: 'సంకల్పం',
    en: 'Sankalpam',
    deity: 'నిత్య అనుష్ఠానం',
    to: '/sandhya-vandanam/sankalpam',
  },
  {
    te: 'ఋగ్వేద సంధ్యావందనం',
    en: 'Rig Veda Sandhyāvandanam',
    deity: 'నిత్య అనుష్ఠానం',
    to: '/sandhya-vandanam/rig-veda',
  },
  {
    te: 'గాయత్రీ మంత్ర జపానుష్ఠానము',
    en: 'Gayatri Japa Anushtanam',
    deity: 'గాయత్రి',
    to: '/gayatri/gayatri-japa-anushtanam',
  },
  {
    te: 'శ్రీ గాయత్రీ కవచము',
    en: 'Sri Gayatri Kavacham',
    deity: 'గాయత్రి',
    to: '/gayatri/sri-gayatri-kavacham',
  },
  {
    te: 'గాయత్రీ తర్పణము',
    en: 'Gayatri Tarpanam',
    deity: 'గాయత్రి',
    to: '/gayatri/gayatri-tarpanam',
  },
  {
    te: 'శ్రీ వినాయక చవితి వ్రతం',
    en: 'Śrī Vināyaka Chavithi Vratam',
    deity: 'వ్రత అనుష్ఠానం',
    to: '/vratam/vinayaka-chavithi',
  },
  {
    te: 'షోడశోపచార పూజ',
    en: 'Ṣoḍaśopacāra Pūjā',
    deity: 'సర్వ దేవతా పూజ',
    to: '/shodashopachara-puja',
  },
  {
    te: 'శ్రీ సత్యనారాయణ వ్రతం',
    en: 'Śrī Satyanārāyaṇa Vratam',
    deity: 'వ్రత అనుష్ఠానం',
    to: '/vratam/satyanarayana-vratam',
  },
];

export default function DeityCards() {
  const groups = STOTRAS.reduce((acc, s) => {
    (acc[s.deity] ||= []).push(s);
    return acc;
  }, {});

  return (
    <div className={styles.wrap}>
      {Object.entries(groups).map(([deity, items]) => (
        <section key={deity} className={styles.group}>
          <h2 className={styles.groupTitle} lang="te">{deity}</h2>
          <div className={styles.grid}>
            {items.map((s) => (
              <Link key={s.to} to={s.to} className={styles.card}>
                <div className={styles.te} lang="te">{s.te}</div>
                <div className={styles.en}>{s.en}</div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
