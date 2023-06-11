import { useState, useEffect, useRef } from 'react';
import { RGBColor, SketchPicker } from 'react-color';
import { FaAngleDown, FaCheck, FaUndoAlt } from 'react-icons/fa';

import { useNotifications, MessageType, createMessage } from '@src/contexts/NotificationsProvider';

import styles from './SettingsModal.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENTS                            */
/* -------------------------------------------------------------------------- */
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
        name="input"
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
        name="input"
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

  // Toggle the value when the user clicks the checkbox.
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

/**
 * Creates a colour picker component.
 * 
 * The colour picker component allows the user to select a colour.
 * 
 * @param title The title of the colour picker.
 * @param initValue The initial value of the colour picker.
 * @param selection The function to call when the colour picker is changed.
 */
const ColourPicker = (props:
  {title : string, defaultValue: string, initValue : string, selection : (value: RGBColor) => void}) => {
  const [value, setValue] = useState<string>(props.initValue);

  // Change the value when the user selects a colour.
  const changeValue = (val: RGBColor) => {
    const rgbaVal = `rgba(${val.r}, ${val.g}, ${val.b}, ${(val.a !== undefined) ? val.a : 1})`;
    props.selection(val);
    setValue(rgbaVal);
  };

  // Reset the value when the user clicks the reset button.
  const resetValue = () => {
    props.selection(props.defaultValue as unknown as RGBColor);
    setValue(props.defaultValue);
  };

  return (
    <div className={styles.ColourPicker}>
      <h2
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
        }}
      >
        <span>{props.title}</span>
        <span
          className={styles.Reset}
          onClick={resetValue}
          style={{ cursor: 'pointer' }}
          title="Reset to Default"
        >
          <FaUndoAlt size={"1.5rem"} />
        </span>
      </h2>
      <div
        className={styles.Container}
        style={{ 
          display: 'flex',
          justifyContent: 'center',
          background: `rgb(var(--primary-colour))`,
          padding: '1rem 0',
          borderRadius: '0.5rem',
        }}
      >
        <SketchPicker
          disableAlpha={true}
          presetColors={[
            "#feb8e1",
            "#b4ddfd",
            "#adf59e",
            "#f8f6b1",
            "#f4a1a1",
            "#d6b3fb",
            "#aaeff3",
            "#fdcb7e",
          ]}
          color={value}
          onChange={(color) => changeValue(color.rgb)}
          styles={{
            default: {
              picker: {
                background: 'rgba(0,0,0,0.4)',
                width: '50%',
              },
              sliders: {
                cursor: 'pointer',
              }
            },
          }}
        />
      </div>
    </div>
  );
};


export {
  DropDown,
  TextInputBox,
  InputBox,
  CheckBox,
  ColourPicker
};
