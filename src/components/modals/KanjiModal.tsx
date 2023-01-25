import Image from 'next/image';

import { useModal } from '@/contexts/ModalProvider';

import ModalLayout from './ModalLayout';

import styles from '@/styles/KanjiModal.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the kanji info modal component.
 * 
 * The kanji info modal displays detailed information on a set of kanji.
 */
const KanjiModal = () => {
  const kanjiContext = useModal();

  return (
    <ModalLayout title="Kanji Information">
      <div className={styles.KanjiContainer}>
        { kanjiContext.data.map((kanji : any, index : number) => (
          <div className={styles.KanjiItem} key={index}>
            <div className={styles.KanjiContent}>
              <div className={styles.KanjiHeader}>
                <p className={styles.KanjiTitle}>{kanji.query}</p>
                <p className={styles.KanjiMeaning}>{kanji.meaning}</p>
              </div>
              
              <hr />

              <div className={styles.KanjiInfo}>
                <p>Onyomi: { kanji.onyomi.map((onyomi : string, index : number) => (
                  <span key={index}>
                    {onyomi}
                    {index !== kanji.onyomi.length - 1 && '、'}
                  </span>))}
                </p>
                <p>Kunyomi: { kanji.kunyomi.map((kunyomi : string, index : number) => (
                  <span key={index}>
                    {kunyomi}
                    {index !== kanji.kunyomi.length - 1 && '、'}
                  </span>))}
                </p>
                <p>Radical: {kanji.radical.symbol} ({kanji.radical.meaning})</p>
                <p>JLPT Level: {kanji.jlptLevel}</p>
                <p>Grade: {kanji.taughtIn?.replace('grade ', '')}</p>
              </div>
            </div>

            <div className={styles.KanjiStrokes}>
              <h1>Stroke Order ({`${kanji.strokeCount} Stroke${kanji.strokeCount !== 1 ? 's' : '' }`})</h1>
              <hr />
              <div className={styles.KanjiImages}>
                <Image src={kanji.strokeOrderGifUri} alt="" width={0} height={0} />
                <Image src={kanji.strokeOrderDiagramUri} alt="" width={1080} height={1080} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </ModalLayout>
  );
};

export default KanjiModal;
