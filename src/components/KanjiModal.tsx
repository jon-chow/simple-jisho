import { useContext, useEffect } from 'react';
import { BsX } from 'react-icons/bs';

import { KanjiContext } from '../configs/config';

import styles from '../styles/KanjiModal.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the kanji info modal component.
 * 
 * The kanji info modal displays detailed information on a set of kanji.
 */
const KanjiModal = () => {
  const kanjiContext = useContext(KanjiContext);

  // Toggle the kanji info modal.
  const toggleKanjiModal = () => {
    kanjiContext.setModalToggle(!kanjiContext.modalToggle);
  };

  // Close the kanji info modal when the user clicks outside of it.
  useEffect(() => {
    const modal = document.querySelector(`.${styles.ModalContainer}`) as HTMLDivElement;

    const handleClickOutside = (e : MouseEvent) => {
      if (modal && !modal.contains(e.target as Node)) {
        toggleKanjiModal();
      };
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.KanjiModal}>
      <div className={styles.ModalContainer}>
        <div className={styles.ModalHeader}>
          <button
            className={styles.ModalCloseButton}
            onClick={toggleKanjiModal}
          >
            <BsX />
          </button>

          <h1 className={styles.ModalTitle}>Kanji Information</h1>
        </div>

        <div className={styles.KanjiItems}>
          
        </div>
      </div>
    </div>
  );
};

export default KanjiModal;
