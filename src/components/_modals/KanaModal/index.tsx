import Image from 'next/image';

import { useModal } from '@src/contexts/ModalProvider';

import ModalLayout from '../ModalLayout';

import styles from './KanaModal.module.scss';


/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Returns the image URL for a given character.
 * @param character The character to get the image URL for.
 * @returns The image URL for the given character.
 */
function getImage(character: string): string {
  return `https://raw.githubusercontent.com/jon-chow/simple-jisho/images/gifs/${
    character.charCodeAt(0).toString(16).toLowerCase()
  }.gif`;
};

/**
 * Returns the audio URL for a given character.
 * @param character The character to get the audio URL for.
 * @returns The audio URL for the given character.
 */
function getAudio(character: string): string {
  return `https://raw.githubusercontent.com/jon-chow/simple-jisho/images/audio/${
    character.charCodeAt(0).toString(16).toLowerCase()
  }.mp3`;
};

/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the kana info modal component. \
 * The kana info modal displays detailed information on a kana.
 * @returns The kana info modal component.
 */
const KanaModal = (): JSX.Element => {
  const kanaContext = useModal();

  return (
    <ModalLayout title={`Hiragana: ${kanaContext.data.hiragana} / Katakana: ${kanaContext.data.katakana} / Romaji: ${kanaContext.data.romaji}`} width="60%">
      <div className={styles.KanaContainer}>
        <h1>Hiragana Stroke Order</h1>
        <div className={styles.KanaItem}>
          { (kanaContext.data.hiragana.length === 1) &&
            <Image
              src={getImage(kanaContext.data.hiragana)}
              alt=""
              width={1080}
              height={1080}
            />
          }
        </div>

        <h1>Katakana Stroke Order</h1>
        <div className={styles.KanaItem}>
          { (kanaContext.data.katakana.length === 1) &&
            <Image
              src={getImage(kanaContext.data.katakana)}
              alt=""
              width={1080}
              height={1080}
            />
          }
        </div>

        {/* <div className={styles.KanaItem}>
          <audio controls>
            <source src={getAudio(kanaContext.data.hiragana)} type="audio/mpeg" />
          </audio>
        </div> */}
      </div>
    </ModalLayout>
  );
};

export default KanaModal;
