import { createContext, useContext, useState, PropsWithChildren } from "react";

import Notifications from '../components/Notifications';


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
  pushMessage: (message: MessageProps) => {},
  hashMessage: () : string => { return ""; },
});

// Use the notifications context.
export const useNotifications = () => useContext(NotificationsContext);

/**
 * Provides the context for notifications.
 */
const NotificationsContextProvider = ({ children } : PropsWithChildren) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);

  const pushMessage = (message: MessageProps) => {
    setMessages([...messages, message]);
  };

  const hashMessage = () => {
    const hash = Date.now().toString(36) + Math.random().toString(36);
    return hash;
  };

  return (
    <NotificationsContext.Provider value={{
      messages: messages, setMessages,
      pushMessage, hashMessage
    }}>
      { children }

      <Notifications />
    </NotificationsContext.Provider>
  );
};

export default NotificationsContextProvider;
