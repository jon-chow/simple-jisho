import { createContext, useContext, useState, PropsWithChildren } from "react";

import DevLogsModal from '@src/components/_modals/DevLogsModal';
import SearchHistoryModal from '@src/components/_modals/SearchHistoryModal';
import SettingsModal from '@src/components/_modals/SettingsModal';
import KanjiModal from '@src/components/_modals/KanjiModal';
import KanaModal from '@src/components/_modals/KanaModal';


/**
 * Enum for modal types.
 */
export enum ModalType {
  NONE = "none",
  DEVLOGS = "devlogs",
  SEARCH_HISTORY = "searchHistory",
  SETTINGS = "settings",
  KANJI = "kanji",
  KANA = "kana",
};

/**
 * The base modal context.
 */
const Modal = {
  modalType: ModalType.NONE,
  setModalType: (modalType: ModalType) => {},
  modalToggle: false,
  setModalToggle: (modalToggle: boolean) => {},
  data: {} as any,
  setData: (data: any) => {},
};

/**
 * The modal context.
 */
export const ModalContext = createContext(Modal);

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Returns the modal component to be displayed.
 * @param modalType the type of modal to display.
 * @param modalToggle whether or not to display the modal.
 * @returns the modal to display.
 */
export function getModal(modalType: ModalType, modalToggle: boolean): JSX.Element | null {
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

/**
 * Resets the modal context.
 * @param context The modal context.
 */
export function resetModalContext(context : typeof Modal): void {
  context.setModalType(ModalType.NONE);
  context.setModalToggle(false);
  context.setData({});
};

// Toggle the modal given the modal type.
/**
 * Toggles the modal given the modal type.
 * @param context The modal context.
 * @param modalType The modal type.
 */
export function toggleModal(context: typeof Modal, modalType: ModalType) {
  context.setModalType(context.modalType === modalType ? ModalType.NONE : modalType);
  context.setModalToggle(context.modalType === modalType ? false : true);
};

/**
 * Uses the modal context.
 * @returns The modal context.
 */
export const useModal = () => useContext(ModalContext);

/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */

/**
 * Provides the context for modal.
 * @param children The children of the component.
 * @returns The modal context provider.
 */
const ModalContextProvider = ({ children }: PropsWithChildren): JSX.Element => {
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
