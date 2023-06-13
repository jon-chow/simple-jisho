import { useRef, useCallback } from 'react';
import {
  BsXOctagonFill as ErrorIcon,
  BsExclamationTriangleFill as WarningIcon,
  BsInfoCircleFill as InfoIcon,
  BsCheckCircleFill as SuccessIcon
} from 'react-icons/bs';

import useInterval from '@src/hooks/useInterval';
import { useNotifications, MessageType, DEFAULT_DURATION } from '@src/contexts/NotificationsProvider';

import styles from './Notifications.module.scss';


/* -------------------------------------------------------------------------- */
/*                                 COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Creates a message.
 * @param props The properties of the message.
 * @param props.message The message to display.
 * @returns The message component.
 */
const Message = (props: { message: MessageProps }): JSX.Element => {
  const { type, title, message } = props.message;
  const duration = props.message.duration;

  const { clearMessage } = useNotifications();

  const messageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  /**
   * Maps the message type to an icon.
   * @returns The icon for the message type.
   */
  const mapTypeIcon = (): JSX.Element | string => {
    switch (type) {
      case MessageType.ERROR:   return <ErrorIcon />;
      case MessageType.WARNING: return <WarningIcon />;
      case MessageType.INFO:    return <InfoIcon />;
      case MessageType.SUCCESS: return <SuccessIcon />;
      default:                  return '';
    }
  };

  /**
   * Handles closing of the message.
   */
  const closeMessage = (): void => {
    clearMessage(props.message.id);
  };

  /**
   * Updates the progress bar.
   */
  const updateProgressBar = useCallback((): void => {
    if (progressRef.current) {
      const progress = (Date.now() - props.message.timestamp) / (duration || DEFAULT_DURATION);
      progressRef.current.style.width = `${
        progress >= 1 ? 0 : 100 - (progress * 100)
      }%`;
    }
  }, [duration, props.message.timestamp]);

  useInterval(updateProgressBar, 10);

  return (
    <div
      className={`${styles.Message} ${
        type === MessageType.ERROR   ? styles.Error   :
        type === MessageType.WARNING ? styles.Warning :
        type === MessageType.INFO    ? styles.Info    :
        type === MessageType.SUCCESS ? styles.Success :
        ''
      }`}
      ref={messageRef}
      onClick={closeMessage}
    >
      <div className={styles.Header}>
        { mapTypeIcon() }
        <h1>{title}</h1>
      </div>
      
      <hr />

      { message }

      <div className={styles.ProgressBar} ref={progressRef} />
    </div>
  );
};


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */

/**
 * Creates the notifications component. \
 * The notifications component contains notification messages.
 * @returns The notifications component.
 */
const Notifications = (): JSX.Element => {
  const { messages } = useNotifications();

  return (
    <div className={styles.Notifications}>
      { messages.map((message, index) => (
        <Message key={index} message={message} />
      )) }
    </div>
  );
};

export default Notifications;
