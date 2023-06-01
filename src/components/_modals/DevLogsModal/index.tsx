import ModalLayout from '../ModalLayout';

import { VersionData } from '@src/configs/versionHistory';

import styles from './DevLogsModal.module.scss';


/**
 * Creates the version section component.
 * 
 * The version section displays the changes made in a specific version.
 */
const VersionSection = (props: { data : Version }) => {
  return (
    <div className={styles.VersionSection}>
      <h3>Version {props.data.version} ({props.data.date.toLocaleDateString()})</h3>
      <hr />
      <ul className={styles.VersionList}>
        { props.data.changes.map((change, index) => {
          return (
            <li key={index}>
              {change}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the dev logs modal component.
 * 
 * The dev logs modal displays the latest updates to the app.
 */
const DevLogsModal = () => {
  return (
    <ModalLayout title="Developer Logs" width="60vw">
      <div className={styles.DevLogsContainer}>
        {VersionData.map((version, index) => {
          return (
            <VersionSection key={index} data={version} />
          );
        })}
      </div>
    </ModalLayout>
  );
};

export default DevLogsModal;
