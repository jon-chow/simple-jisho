import { useState, useEffect, useRef } from 'react';
import { FaEye, FaSearch, FaAngleDown, FaCheck } from 'react-icons/fa';

import { 
  useSettings, getSetting, getDefaultSetting,
  // ThemeOptions, FontSizeOptions,
} from '@src/contexts/SettingsProvider';
import { useNotifications, MessageType, createMessage } from '@src/contexts/NotificationsProvider';
import { useModal, resetModalContext } from '@src/contexts/ModalProvider';

import ModalLayout from '../ModalLayout';

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
 * Creates a text input box component.
 * 
 * The text input box component allows the user to enter text.
 * 
 * @param title The title of the input box.
 * @param placeholder The placeholder text of the input box.
 */
const TextInputBox = (props : {
  title : string,
  initValue? : any,
  placeholder : string,
  minLength?: number,
  maxLength?: number,
  entered : (value : string) => void
}) => {
  const [value, setValue] = useState<string>(props.placeholder);

  const notificationsContext = useNotifications();

  const min = props.minLength || 0;
  const max = props.maxLength || 200;

  // Validate the input is between the min and max length.
  const validateInput = (val : string) => {
    if (val.length < min || val.length > max) {
      const message = createMessage(
        MessageType.ERROR,
        "Invalid Input",
        `The input must be between [${min}-${max}] characters long.`,
        3000
      );
      notificationsContext.addMessage(message);
      return false;
    };

    const message = createMessage(
      MessageType.SUCCESS,
      "Change Successful",
      "The setting has been changed successfully.",
      3000
    );
    notificationsContext.addMessage(message);
    return true;
  };

  // Submit the input box when the user presses enter.
  const submitBox = () => {
    if (!validateInput(value)) return;
    props.entered(value);
  };

  return (
    <div className={styles.TextInputBox} title="Press Enter to Apply">
      <h2>{props.title}</h2>
      <input
        type="text"
        minLength={min}
        maxLength={max}
        placeholder={props.placeholder}
        defaultValue={props.initValue}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => event.key === 'Enter' ? submitBox() : null}
      />
    </div>
  );
};


/**
 * Creates an input box component.
 * 
 * The input box component allows the user to enter a number.
 * 
 * @param title The title of the input box.
 * @param placeholder The placeholder text of the input box.
 */
const InputBox = (props : {
  title : string,
  initValue? : any,
  placeholder : string,
  min?: number,
  max?: number,
  entered : (value : number) => void
}) => {
  const [value, setValue] = useState<number>(parseInt(props.placeholder));

  const notificationsContext = useNotifications();

  const minVal = props.min || 0;
  const maxVal = props.max || 10;

  // Validate the input is a positive integer.
  const validateInput = (val : number) => {
    if (val < minVal || val > maxVal || isNaN(val)) {
      const message = createMessage(
        MessageType.ERROR,
        "Invalid Input",
        `The input must be a positive integer between [${minVal}-${maxVal}].`,
        3000
      );
      notificationsContext.addMessage(message);
      return false;
    };

    const message = createMessage(
      MessageType.SUCCESS,
      "Change Successful",
      "The setting has been changed successfully.",
      3000
    );
    notificationsContext.addMessage(message);
    return true;
  };

  // Submit the input box when the user presses enter.
  const submitBox = () => {
    if (!validateInput(value)) return;
    props.entered(value);
  };

  return (
    <div className={styles.InputBox} title="Press Enter to Apply">
      <h2>{props.title}</h2>
      <input
        type="number"
        min={minVal}
        max={maxVal}
        placeholder={props.placeholder}
        defaultValue={props.initValue}
        onChange={(event) => setValue(parseInt(event.target.value))}
        onKeyDown={(event) => event.key === 'Enter' ? submitBox() : null}
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
  const settingsModalContext = useModal();

  // Change a specified setting.
  const changeSetting = (setting : string, value : any) => {
    settingsContext.setSetting(setting, value);
  };

  // Reset all settings to their default values.
  const resetSettings = () => {
    if (window.confirm("Are you sure you want to reset to default settings?")) {
      settingsContext.resetSettings();
      resetModalContext(settingsModalContext);
    };
  };

  return (
    <ModalLayout title="Settings" width="50vw">
      <div className={styles.SettingsContainer}>
        <div className={styles.Group}>
          <h1><FaEye /> Display Options</h1>

          {/* <DropDown
            title="Theme"
            initValue={getSetting("theme", ThemeOptions)}
            options={ThemeOptions}
            selection={(option) => { changeSetting("theme", option.value); }}
          /> */}

          <CheckBox
            title="Enable Background Image"
            initValue={getSetting("backgroundImage")}
            selection={(value) => { changeSetting("backgroundImage", value); }}
          />

          <TextInputBox
            title="Image URL"
            initValue={getSetting("backgroundUrl")}
            placeholder={getDefaultSetting("backgroundUrl") as string}
            entered={(value) => { changeSetting("backgroundUrl", value); }}
          />

          <InputBox
            title="Background Blur (in pixels)"
            initValue={getSetting("backgroundBlur")}
            placeholder={getDefaultSetting("backgroundBlur") as string}
            min={0}
            max={100}
            entered={(value) => { changeSetting("backgroundBlur", value); }}
          />

          {/* <CheckBox
            title="High Contrast"
            initValue={getSetting("highContrast")}
            selection={(value) => { changeSetting("highContrast", value); }}
          /> */}

          {/* <DropDown
            title="Font Size"
            initValue={getSetting("fontSize", FontSizeOptions)}
            options={FontSizeOptions}
            selection={(option) => { changeSetting("fontSize", option.value); }}
          /> */}
        </div>

        <div className={styles.Group}>
          <h1><FaSearch /> Search Options</h1>
          <InputBox
            title="Results To Display (10 max.)"
            initValue={getSetting("maxResultsToDisplay")}
            placeholder={getDefaultSetting("maxResultsToDisplay") as string}
            max={10}
            entered={(value) => { changeSetting("maxResultsToDisplay", value); }}
          />

          <InputBox
            title="Saved Searches (20 max.)"
            initValue={getSetting("maxSearchHistory")}
            placeholder={getDefaultSetting("maxSearchHistory") as string}
            max={20}
            entered={(value) => { changeSetting("maxSearchHistory", value); }}
          />
        </div>
      </div>
      
      <button
        className={styles.ResetButton}
        onClick={resetSettings}
      >
        Reset To Default
      </button>
    </ModalLayout>
  );
};

export default SettingsModal;
