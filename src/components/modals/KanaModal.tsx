import { useContext } from 'react';
import Image from 'next/image';

import { ModalContext } from '../../configs/config';

import ModalLayout from './ModalLayout';

import styles from '../../styles/KanaModal.module.scss';


// Returns the base image URL for a given character.
const baseImageUrl = (character : string) => {
  return `https://raw.githubusercontent.com/mistval/kanji_images/master/gifs/${
    character.charCodeAt(0).toString(16).toLowerCase() // Convert the character to its unicode representation.
  }.gif`;
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
    <ModalLayout title="Kana Information">
      <div className={styles.KanaContainer}>
        <div className={styles.KanaItem}>
          { (kanaContext.data.hiragana.length === 1) &&
            <Image
              src={baseImageUrl(kanaContext.data.hiragana)}
              alt=""
              width={100}
              height={100}
            />
          }
        </div>

        <div>
          { (kanaContext.data.katakana.length === 1) &&
            <Image
              src={baseImageUrl(kanaContext.data.katakana)}
              alt=""
              width={100}
              height={100}
            />
          }
        </div>
      </div>
    </ModalLayout>
  );
};

export default KanaModal;
