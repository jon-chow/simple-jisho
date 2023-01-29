import { useState, useEffect, useRef } from 'react';
import { FaAngleDown } from 'react-icons/fa';

import { Options, activeOption, useTheme } from '@/contexts/ThemeProvider';

import ModalLayout from '../ModalLayout/ModalLayout';

import styles from './SettingsModal.module.scss';


/**
 * Creates a dropdown component.
 * 
 * The dropdown component allows the user to select an option from a list.
 * 
 * @param title The title of the dropdown.
 * @param options The list of options to choose from.
 */
const DropDown = (props : {title : string, options : Option[], initOption? : Option, selection : (option : Option) => void}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(props.initOption || props.options[0]);

  const dropDownRef = useRef<HTMLDivElement>(null);

  // Toggle the dropdown when the user clicks the button.
  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  // Select an option when the user clicks it.
  const selectOption = (option : Option) => {
    props.selection(option);
    setSelectedOption(option);
    setIsOpen(false);
  };

  // Close the dropdown when the user clicks outside of it.
  useEffect(() => {
    const closeDropDown = (event : MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropDownRef.current && !dropDownRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', closeDropDown);
    return () => document.removeEventListener('click', closeDropDown);
  }, []);

  return (
    <div className={styles.DropDown} ref={dropDownRef}>
      <div className={styles.Header}>
        <h2>{props.title}</h2>

        <div className={styles.Container}>
          <div
            className={styles.DropDownButton}
            onClick={toggleDropDown}
            style={{ backgroundColor: isOpen ? '#222' : 'rgba(0, 0, 0, 0.2)' }}
          >
            <span>{selectedOption.title}</span>
            <FaAngleDown
              className={styles.Icon}
              style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </div>

          <div className={styles.Body}>
            <div
              className={styles.Content} 
              style={{ maxHeight: isOpen ? '100%' : '0', opacity: isOpen ? '1' : '0' }}
            >
              { props.options.map((option, index) => (
                <span
                  key={index}
                  className={styles.Option}
                  onClick={() => selectOption(option)}
                >
                  {option.title}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Creates the settings modal component.
 * 
 * The settings modal allows the user to change app preferences.
 */
const SettingsModal = () => {
  const themeContext = useTheme();

  const changeTheme = (option : Option) => {
    themeContext.setTheme(option.value);
  };

  return (
    <ModalLayout title="Settings" width="50vw">
      <div className={styles.SettingsContainer}>
        <fieldset>
          <legend>General</legend>
          <div className={styles.Group}>
            <h1>Display Options</h1>
            <DropDown
              title="Appearance"
              initOption={activeOption()}
              options={Options}
              selection={(option) => { changeTheme(option); }}
            />
          </div>
        </fieldset>
      </div>
    </ModalLayout>
  );
};

export default SettingsModal;
