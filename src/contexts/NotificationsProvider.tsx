import { createContext, useContext, useState, useCallback, PropsWithChildren } from "react";

import useInterval from "@src/hooks/useInterval";
import Notifications from '@src/components/Notifications';


// Default duration of a notification message.
export const DEFAULT_DURATION = 5000;


/**
 * Enum for message notification types.
 */
export enum MessageType {
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
  SUCCESS = "success",
};

/**
 * The notification context.
 */
const NotificationsContext = createContext({
  messages: [] as MessageProps[],
  setMessages: (messages: MessageProps[]) => {},
  addMessage: (message: MessageProps) => {},
  clearMessage: (id?: string | string[]) => {},
});

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Creates a notification message.
 * @param type The type of the message.
 * @param title The title of the message.
 * @param message The message.
 * @param duration The duration of the message.
 * @returns The notification message.
 */
export function createMessage(type: MessageType, title: string, message: string, duration?: number): MessageProps {
  return {
    id: Date.now().toString(36) + Math.random().toString(36),
    type: type,
    title: title,
    message: message,
    timestamp: Date.now(),
    duration: duration || DEFAULT_DURATION
  };
};

/**
 * Uses the notifications context.
 * @returns The notifications context.
 */
export const useNotifications = () => useContext(NotificationsContext);

/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */

/**
 * Provides the context for notifications.
 * @param children The children of the component.
 * @returns The notifications context provider.
 */
const NotificationsContextProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [messages, setMessages] = useState<MessageProps[]>([]);

  /**
   * Adds a message to the notifications.
   * @param message The message to add.
   */
  const addMessage = useCallback((message: MessageProps): void => {
    const existing = messages.find((n) => n.id === message.id);
    const nextNotifications = existing ? messages.map((n) =>
      n.id === message.id ? { ...existing, ...message } : n
    ) : messages.concat(message);
    
    setMessages(nextNotifications);
  }, [messages, setMessages]);

  /**
   * Clears a message from the notifications.
   * @param id The id or ids of the message to clear.
   */
  const clearMessage = useCallback((id?: string | string[]): void => {
    if (!id) {
      setMessages([]);
    } else {
      const ids = Array.isArray(id) ? id : [id];
      const nextNotifications = messages.filter(({ id }) => !ids.includes(id));
      setMessages(nextNotifications);
    };
  }, [messages, setMessages]);

  /**
   * Handles expired notifications.
   * @param currentTime The current time.
   */
  const handleExpiredNotifications = useCallback((currentTime: any): void => {
    if (messages.length) {
      const expiredIds = messages.reduce((exp: string[], msg: MessageProps) => {
        const isExpired = msg.timestamp <= currentTime - (msg.duration || DEFAULT_DURATION);
        return isExpired && msg.duration !== null ? exp.concat(msg.id) : exp;
      }, []);

      if (expiredIds.length)
        clearMessage(expiredIds);
    }
  }, [messages, clearMessage]);

  // Handle expired notifications every 100ms.
  useInterval(handleExpiredNotifications, 100);

  return (
    <NotificationsContext.Provider value={{
      messages: messages, setMessages,
      addMessage, clearMessage
    }}>
      { children }
      <Notifications />
    </NotificationsContext.Provider>
  );
};

export default NotificationsContextProvider;
