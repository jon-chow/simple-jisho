import { useEffect, useRef, useContext } from 'react';
import {
  BsXOctagonFill as ErrorIcon,
  BsExclamationTriangleFill as WarningIcon,
  BsInfoCircleFill as InfoIcon,
  BsCheckCircleFill as SuccessIcon
} from 'react-icons/bs';

import { MessageType, NotificationsContext } from '../configs/config';

import styles from '../styles/Notifications.module.scss';


/**
 * Creates a message.
 */
const Message = (props: { message : MessageProps }) => {
  const { type, title, message } = props.message;
  const duration = props.message.duration || 5000;

  const notificationsContext = useContext(NotificationsContext);

  const messageRef = useRef<HTMLDivElement>(null);

  // Map the message type to an icon.
  const mapTypeIcon = () => {
    switch (type) {
      case MessageType.ERROR:   return <ErrorIcon />;
      case MessageType.WARNING: return <WarningIcon />;
      case MessageType.INFO:    return <InfoIcon />;
      case MessageType.SUCCESS: return <SuccessIcon />;
      default:                  return '';
    }
  };

  // Closes the message.
  const closeMessage = () => {
    messageRef.current?.classList.add(styles.ClosedMessage);

    setTimeout(() => {
      messageRef.current?.remove();
    }, 400);
  };

  // Open the message, then close it after a set amount of time.
  useEffect(() => {
    setTimeout(() => {
      messageRef.current?.classList.add(styles.MessageActive);
    }, 1);

    setTimeout(() => {
      closeMessage();
    }, duration);
  }, []);

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

      <div
        className={styles.ProgressBar}
        style={{ animation: `${styles.Progress} ${duration}ms linear forwards` }}
      />
    </div>
  );
};


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the notifications component.
 * 
 * The notifications component contains notification messages.
 */
const Notifications = () => {
  const { messages } = useContext(NotificationsContext);

  return (
    <div className={styles.Notifications}>
      { messages.map((message, index) => (
        <Message
          key={index}
          message={message}
        />
      )) }
    </div>
  );
};

export default Notifications;
