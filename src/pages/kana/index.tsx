import { useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';

import { useModal, toggleModal, ModalType } from '@src/contexts/ModalProvider';
import { BASIC_KANA, DAKUON_HANDAKUON_KANA, YOUON_KANA } from './kanaLists';

import styles from './KanaChartPage.module.scss';


/* -------------------------------------------------------------------------- */
/*                                 COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Creates a kana card component. \
 * The kana card displays the kana character, its romaji, and its katakana
 * depending on the settings.
 * @param props The properties of the kana card component.
 * @param props.kana The kana character to display.
 * @returns The kana card component.
 */
const KanaCard = (props : {kana : Kana}) => {
  const KanaContext = useModal();

  /**
   * Toggles the kana info modal.
   */
  const toggleKanaModal = (): void => {
    toggleModal(KanaContext, ModalType.KANA);
    KanaContext.setData(props.kana);
  };

  return (
    (props.kana.romaji.length > 0) ?
      <div
        className={styles.KanaCard}
        title={
          `Romaji: ${props.kana.romaji}\nHiragana: ${props.kana.hiragana}\nKatakana: ${props.kana.katakana}`}
        onClick={
          () => {
            (props.kana.hiragana.length === 1) && toggleKanaModal();
          }
        }
      >
        <div className={styles.Romaji}>
          {props.kana.romaji}
        </div>

        <div className={styles.Hiragana}>
          {props.kana.hiragana}
        </div>

        <div className={styles.Katakana}>
          {props.kana.katakana}
        </div>
      </div> :
      <div className={styles.KanaCardFiller}>
        <hr />
      </div>
  );
};


/**
 * Creates a kana group component. \
 * The kana group displays a grid of kana characters.
 * @param props The properties of the kana group component.
 * @param props.english The English title of the kana group.
 * @param props.japanese The Japanese title of the kana group.
 * @param props.kanaGroup The kana group to display.
 * @returns The kana group component.
 */
const KanaGroup = (props : {english: string, japanese: string, kanaGroup : Kana[][]}): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className={styles.KanaGrouping}>
      <div
        className={styles.KanaGroupHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <FaAngleDown
          className={styles.DropDownButton}
          style={{
            transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
          }}
        />
        <h1>{props.english}</h1>
        <h2>{props.japanese}</h2>
      </div>

      <div
        className={styles.KanaGrid}
        style={{
          display: isExpanded ? 'flex' : 'none'
        }}
      >
        { props.kanaGroup.map((kanaGroup : Kana[], index : number) => (
          <div key={index} className={styles.KanaRow}>
            { kanaGroup.map((kana : Kana, index : number) => (
              <KanaCard key={index} kana={kana} />
            ))}
          </div>
        )) }
      </div>
    </div>
  );
};


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */

/**
 * Exports the kana chart page. \
 * The kana chart displays all the kana characters in a grid.
 * Allows the user to click on a kana character to see its details.
 * Kana includes hiragana and katakana.
 * @returns The kana chart page.
 */
const KanaChartPage = (): JSX.Element => {
  return (
    <div className={styles.KanaChartPage}>
      <KanaGroup
        english="Basic Hiragana & Katakana"
        japanese="ひらがな・カタカナ"
        kanaGroup={BASIC_KANA}
      />

      <KanaGroup
        english="Daku-on & Handaku-on"
        japanese="濁音・半濁音"
        kanaGroup={DAKUON_HANDAKUON_KANA}
      />

      <KanaGroup
        english="You-on"
        japanese="拗音"
        kanaGroup={YOUON_KANA}
      />
    </div>
  );
};

export default KanaChartPage;
