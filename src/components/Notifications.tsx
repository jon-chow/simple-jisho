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
const Message = (props: { type? : MessageType, title : string, message : string, duration? : number }) => {
  const duration = props.duration || 5000;

  const messageRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Map the message type to an icon.
  const mapTypeIcon = () => {
    switch (props.type) {
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

  // Progress bar animation.
  useEffect(() => {
    setTimeout(() => {
      messageRef.current?.classList.add(styles.MessageActive);
      progressBarRef.current?.classList.add(styles.ProgressBarActive);
    }, 1);
  }, []);

  // Close the message after a set amount of time.
  useEffect(() => {
    setTimeout(() => {
      closeMessage();
    }, duration);
  }, []);

  return (
    <div
      className={`${styles.Message} ${
        props.type === MessageType.ERROR   ? styles.Error   :
        props.type === MessageType.WARNING ? styles.Warning :
        props.type === MessageType.INFO    ? styles.Info    :
        props.type === MessageType.SUCCESS ? styles.Success :
        ''
      }`}
      ref={messageRef}
      onClick={closeMessage}
    >
      <div className={styles.Header}>
        { mapTypeIcon() }
        <h1>{props.title}</h1>
      </div>
      
      <hr />

      { props.message }

      <div
        className={styles.ProgressBar}
        ref={progressBarRef}
        style={{ transition: `width ${duration}ms linear` }}
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
          type={message.type}
          title={message.title}
          message={message.message}
          duration={message.duration}
        />
      )) }
    </div>
  );
};

export default Notifications;
