import { useEffect, useState } from 'react';
import { FaAngleRight } from 'react-icons/fa';

import ModalLayout from '../ModalLayout';

import { VersionData } from '@src/configs/versionHistory';

import styles from './DevLogsModal.module.scss';


/**
 * Creates the version section component.
 * 
 * The version section displays the changes made in a specific version.
 */
const VersionSection = (props: { data : Version, expanded? : boolean }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(props.expanded ?? true);

  const VERSION = props.data.version;

  useEffect(() => {
    setIsExpanded(props.expanded ?? true);
  }, [props.expanded]);

  return (
    <div className={styles.VersionSection}>
      <h3 onClick={() => setIsExpanded(!isExpanded)}>
        <FaAngleRight
          className={styles.Arrow}
          style={{
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease-in-out'
          }}
        />
        Version {VERSION.major}.{VERSION.minor}.{VERSION.patch} ({props.data.date.toLocaleDateString()})
      </h3>
      <hr />
      <ul 
        className={styles.VersionList}
        style={{
          maxHeight: isExpanded ? '100%' : '0px',
          transition: 'max-height 0.2s ease-in-out'
        }}
      >
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
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <ModalLayout title="Developer Logs" width="60vw">
      <div className={styles.DevLogsContainer}>
        <h2
          className={styles.ExpandAll}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse All' : 'Expand All'}
        </h2>

        {VersionData.map((version, index) => {
          return (
            <VersionSection
              key={index}
              data={version}
              expanded={isExpanded}
            />
          );
        })}
      </div>
    </ModalLayout>
  );
};

export default DevLogsModal;
