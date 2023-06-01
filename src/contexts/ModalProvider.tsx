import { createContext, useContext, useState, PropsWithChildren } from "react";

import DevLogsModal from '@src/components/_modals/DevLogsModal';
import SearchHistoryModal from '@src/components/_modals/SearchHistoryModal';
import SettingsModal from '@src/components/_modals/SettingsModal';
import KanjiModal from '@src/components/_modals/KanjiModal';
import KanaModal from '@src/components/_modals/KanaModal';


// Enumerates the different types of modals.
export enum ModalType {
  NONE,
  DEVLOGS,
  SEARCH_HISTORY,
  SETTINGS,
  KANJI,
  KANA,
};

/**
 * Returns the modal component to be displayed.
 * 
 * @param modalType the type of modal to display.
 * @param modalToggle whether or not to display the modal.
 * @returns the modal to display.
 */
export const getModal = (modalType: ModalType, modalToggle: boolean) => {
  if (!modalToggle) return null;

  switch (modalType) {
    case ModalType.DEVLOGS:        return <DevLogsModal />;
    case ModalType.SEARCH_HISTORY: return <SearchHistoryModal />;
    case ModalType.SETTINGS:       return <SettingsModal />;
    case ModalType.KANJI:          return <KanjiModal />;
    case ModalType.KANA:           return <KanaModal />;
    default:                       return null;
  }
};

// Base context for a modal.
const Modal = {
  modalType: ModalType.NONE,
  setModalType: (modalType: ModalType) => {},
  modalToggle: false,
  setModalToggle: (modalToggle: boolean) => {},
  data: {} as any,
  setData: (data: any) => {},
};

// Context for modal.
export const ModalContext = createContext(Modal);

// Resets the modal context.
export const resetModalContext = (context : typeof Modal) => {
  context.setModalType(ModalType.NONE);
  context.setModalToggle(false);
  context.setData({});
};

// Toggle the modal given the modal type.
export const toggleModal = (context : typeof Modal, modalType : ModalType) => {
  context.setModalType(context.modalType === modalType ? ModalType.NONE : modalType);
  context.setModalToggle(context.modalType === modalType ? false : true);
};

// Use the modal context.
export const useModal = () => useContext(ModalContext);

/**
 * Provides the context for modal.
 */
const ModalContextProvider = ({ children } : PropsWithChildren) => {
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [modalToggle, setModalToggle] = useState<boolean>(false);
  const [data, setData] = useState<any>({});

  return (
    <ModalContext.Provider value={{
      modalType, setModalType,
      modalToggle, setModalToggle,
      data, setData
    }}>
      { getModal(modalType, modalToggle) }
      
      { children }
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
