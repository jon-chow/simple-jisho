import ModalLayout from '../ModalLayout/ModalLayout';

import styles from './SettingsModal.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the settings modal component.
 * 
 * The settings modal allows the user to change app preferences.
 */
const SettingsModal = () => {
  return (
    <ModalLayout title="Settings" width="60vw">
      <div className={styles.SettingsContainer}>
        
      </div>
    </ModalLayout>
  );
};

export default SettingsModal;
