import { createContext, useContext, useState, useCallback, PropsWithChildren } from "react";

import useInterval from "@/hooks/useInterval";
import Notifications from '@/components/Notifications/Notifications';


// Default duration of a notification message.
export const DEFAULT_DURATION = 5000;

// Enumerates the type of a notification message.
export enum MessageType {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success'
};

// Context for notifications.
const NotificationsContext = createContext({
  messages: [] as MessageProps[],
  setMessages: (messages: MessageProps[]) => {},
  addMessage: (message: MessageProps) => {},
  clearMessage: (id?: string | string[]) => {},
});

/**
 * Creates a notification message.
 * 
 * @param type The type of the message.
 * @param title The title of the message.
 * @param message The message.
 * @param duration The duration of the message.
 * @returns The notification message.
 */
export const createMessage = (
  type : MessageType,
  title : string,
  message : string,
  duration? : number
) : MessageProps => {
  return {
    id: Date.now().toString(36) + Math.random().toString(36),
    type: type,
    title: title,
    message: message,
    timestamp: Date.now(),
    duration: duration || DEFAULT_DURATION
  };
};

// Use the notifications context.
export const useNotifications = () => useContext(NotificationsContext);

/**
 * Provides the context for notifications.
 */
const NotificationsContextProvider = ({ children } : PropsWithChildren) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);

  // Add a message to the notifications.
  const addMessage = useCallback((message : MessageProps) => {
    const existing = messages.find((n) => n.id === message.id);
    const nextNotifications = existing ? messages.map((n) =>
      n.id === message.id ? { ...existing, ...message } : n
    ) : messages.concat(message);
    
    setMessages(nextNotifications);
  }, [messages, setMessages]);

  // Clear a message from the notifications.
  const clearMessage = useCallback((id?: string | string[]) => {
    if (!id) {
      setMessages([]);
    } else {
      const ids = Array.isArray(id) ? id : [id];
      const nextNotifications = messages.filter(({ id }) => !ids.includes(id));
      setMessages(nextNotifications);
    }
  }, [messages, setMessages]);

  // Handle expired notifications.
  const handleExpiredNotifications = useCallback((currentTime : any) => {
    if (messages.length) {
      const expiredIds = messages.reduce((exp : string[], msg : MessageProps) => {
        const isExpired = msg.timestamp <= currentTime - (msg.duration || DEFAULT_DURATION);
        return isExpired && msg.duration !== null ? exp.concat(msg.id) : exp;
      }, []);

      if (expiredIds.length)
        clearMessage(expiredIds);
    }
  }, [messages, clearMessage]);

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
