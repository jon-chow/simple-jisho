import { useState, useEffect, useRef } from 'react';
import { FaRegEye, FaSearch, FaAngleDown, FaCheck, FaEye } from 'react-icons/fa';

import { ThemeOptions, useSettings, getSetting, getDefaultSetting } from '@/contexts/SettingsProvider';

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
const DropDown = (props : {title : string, options : Option[], initValue? : Option, selection : (option : Option) => void}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(props.initValue || props.options[0]);

  const dropDownRef = useRef<HTMLDivElement>(null);

  // Toggle the dropdown when the user clicks the button.
  const toggleDropDown = () => setIsOpen(!isOpen);

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
      <h2>{props.title}</h2>

      <div className={styles.Container}>
        <div
          className={styles.DropDownButton}
          onClick={toggleDropDown}
          style={{ backgroundColor: isOpen ? 'rgb(34,34,34)' : 'rgba(34,34,34,0.8)' }}
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
            style={{ maxHeight: isOpen ? '100%' : '0', opacity: isOpen ? '1' : '0', visibility: isOpen ? 'visible' : 'hidden' }}
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
  );
};

/**
 * Creates an input box component.
 * 
 * The input box component allows the user to enter text.
 * 
 * @param title The title of the input box.
 * @param placeholder The placeholder text of the input box.
 */
const InputBox = (props : {title : string, initValue? : any, placeholder : string}) => {
  return (
    <div className={styles.InputBox}>
      <h2>{props.title}</h2>
      <input
        type="text"
        placeholder={props.placeholder}
        defaultValue={props.initValue}
      />
    </div>
  );
};

/**
 * Creates a checkbox component.
 * 
 * The checkbox component allows the user to toggle a setting.
 * 
 * @param title The title of the checkbox.
 * @param initValue The initial value of the checkbox.
 * @param selection The function to call when the checkbox is toggled.
 */
const CheckBox = (props : {title : string, initValue : boolean, selection : (value : boolean) => void}) => {
  const [value, setValue] = useState(props.initValue);

  const toggleValue = () => {
    props.selection(!value);
    setValue(!value);
  };

  return (
    <div className={styles.CheckBox}>
      <h2>{props.title}</h2>
      <div
        className={styles.Container}
        onClick={toggleValue}
      >
        { value ? <FaCheck /> : null }
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
  const settingsContext = useSettings();

  // Change a specified setting.
  const changeSetting = (setting : string, value : any) => {
    settingsContext.setSetting(setting, value);
  };

  return (
    <ModalLayout title="Settings" width="50vw">
      <div className={styles.SettingsContainer}>
        <div className={styles.Group}>
          <h1><FaEye /> Display Options</h1>

          <DropDown
            title="Theme"
            initValue={getSetting("theme")}
            options={ThemeOptions}
            selection={(option) => { changeSetting("theme", option.value); }}
          />

          <CheckBox
            title="Background Image"
            initValue={getSetting("backgroundImage")}
            selection={(value) => { changeSetting("backgroundImage", value); }}
          />

          <CheckBox
            title="High Contrast"
            initValue={getSetting("highContrast")}
            selection={(value) => { changeSetting("highContrast", value); }}
          />

          {/* <DropDown
            title="Font Size"
            options={Options}
            selection={(option) => { changeTheme(option); }}
          /> */}
        </div>

        <div className={styles.Group}>
          <h1><FaSearch /> Search Options</h1>
          <InputBox
            title="Max Results To Display"
            initValue={getDefaultSetting("maxResultsToDisplay")}
            placeholder={getSetting("maxResultsToDisplay")}
          />

          <InputBox
            title="Max Search History"
            initValue={getDefaultSetting("maxSearchHistory")}
            placeholder={getSetting("maxSearchHistory")}
          />
        </div>
      </div>
      <span>*reload the page to apply changes.</span>
    </ModalLayout>
  );
};

export default SettingsModal;
