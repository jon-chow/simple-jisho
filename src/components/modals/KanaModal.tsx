import { useContext } from 'react';
import Image from 'next/image';

import { ModalContext } from '../../configs/config';

import ModalLayout from './ModalLayout';

import styles from '../../styles/KanaModal.module.scss';


// Returns the image URL for a given character.
const getImage = (character : string) => {
  return `https://raw.githubusercontent.com/mistval/kanji_images/master/gifs/${
    character.charCodeAt(0).toString(16).toLowerCase() // Convert the character to its unicode representation.
  }.gif`;
};

// Returns the audio URL for a given character.
const getAudio =(character : string) => {
  return `https://raw.githubusercontent.com/jon-chow/kana_audio/master/${
    character.charCodeAt(0).toString(16).toLowerCase() // Convert the character to its unicode representation.
  }.mp3`;
};

/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the kana info modal component.
 * 
 * The kana info modal displays detailed information on a kana.
 */
const KanaModal = () => {
  const kanaContext = useContext(ModalContext);

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
