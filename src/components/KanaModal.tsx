import { useContext, useEffect } from 'react';
import { BsX } from 'react-icons/bs';
// import Image from 'next/image';

import { ModalContext, ModalType } from '../configs/config';

import styles from '../styles/KanaModal.module.scss';


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

  // Toggle the kana info modal.
  const toggleKanaModal = () => {
    kanaContext.setModalType(ModalType.NONE);
    kanaContext.setModalToggle(!kanaContext.modalToggle);
    kanaContext.setData({});
  };

  // Close the kana info modal when the user clicks outside of it.
  useEffect(() => {
    const modal = document.querySelector(`.${styles.ModalContainer}`) as HTMLDivElement;

    const handleClickOutside = (e : MouseEvent) => {
      if (modal && !modal.contains(e.target as Node)) {
        toggleKanaModal();
      };
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.KanaModal}>
      <div className={styles.ModalContainer}>
        <div className={styles.ModalHeader}>
          <button
            className={styles.ModalCloseButton}
            onClick={toggleKanaModal}
          >
            <BsX />
          </button>

          <h1 className={styles.ModalTitle}>Kana Information</h1>
        </div>

        <div className={styles.KanaItems}>
          <div className={styles.KanaItem}>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanaModal;
