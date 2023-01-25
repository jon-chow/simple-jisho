import { PropsWithChildren, useEffect } from 'react';
import { BsX } from 'react-icons/bs';

import { useModal, resetModalContext } from '@/contexts/ModalProvider';

import styles from './ModalLayout.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */

// The props for the modal layout.
type ModalProps = {
  title: string;
  width?: string;
  height?: string;
};

/**
 * Creates the template layout for a modal.
 */
const ModalLayout = (props: PropsWithChildren<ModalProps>) => {
  const modalContext = useModal();

  // Closes the modal.
  const closeModal = () => {
    resetModalContext(modalContext);
  };

  // Close the modal when the user clicks outside of it.
  useEffect(() => {
    const handleClickOutside = (e : MouseEvent) => {
      const modal = document.querySelector(`.${styles.ModalContainer}`) as HTMLDivElement;
      !modal?.contains(e.target as Node) && closeModal();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.ModalLayout}>
      <div
        className={styles.ModalContainer}
        style={{
          maxWidth: props.width || '80%',
          maxHeight: props.height || '90%',
        }}
      >
        <div className={styles.ModalHeader}>
          <button
            className={styles.ModalCloseButton}
            onClick={closeModal}
          >
            <BsX />
          </button>

          <h1 className={styles.ModalTitle}>{props.title}</h1>
        </div>

        { props.children }
      </div>
    </div>
  );
};

export default ModalLayout;
