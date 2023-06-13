import { useState, useEffect, useRef } from 'react';
import { RGBColor, SketchPicker } from 'react-color';
import { FaAngleDown, FaCheck, FaUndoAlt } from 'react-icons/fa';

import { useNotifications, MessageType, createMessage } from '@src/contexts/NotificationsProvider';

import styles from './SettingsModal.module.scss';
import { parseColour } from '@src/utils/setDocumentColours';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENTS                            */
/* -------------------------------------------------------------------------- */

/**
 * Creates a dropdown component. \
 * The dropdown component allows the user to select an option from a list.
 * @param title The title of the dropdown.
 * @param description The description of the dropdown.
 * @param options The list of options to choose from.
 * @param initValue The initial value of the dropdown.
 * @param selection The function to call when the dropdown is changed.
 * @returns The dropdown component.
 */
const DropDown = (props: {
  title: string,
  description: string,
  options: Option[],
  initValue?: Option,
  selection: (option: Option) => void
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(props.initValue || props.options[0]);

  const dropDownRef = useRef<HTMLDivElement>(null);

  /**
   * Toggles the dropdown.
   */
  const toggleDropDown = (): void => {
    setIsOpen(!isOpen);
  };

  /**
   * Selects an option when the user clicks it.
   * @param option The option to select.
   */
  const selectOption = (option: Option): void => {
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
      <div className={styles.Description}>
        <h2>{props.title}</h2>
        <h3>{props.description}</h3>
      </div>

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
 * Creates a text input box component. \
 * The text input box component allows the user to enter text.
 * @param title The title of the input box.
 * @param description The description of the input box.
 * @param initValue The initial value of the input box.
 * @param placeholder The placeholder text of the input box.
 * @param minLength The minimum length of the input box.
 * @param maxLength The maximum length of the input box.
 * @param entered The function to call when the input box is submitted.
 * @returns The text input box component.
 */
const TextInputBox = (props : {
  title: string,
  description: string,
  initValue?: any,
  placeholder: string,
  minLength?: number,
  maxLength?: number,
  entered: (value: string) => void
}): JSX.Element => {
  const [value, setValue] = useState<string>(props.placeholder);

  const notificationsContext = useNotifications();

  const min = props.minLength || 0;
  const max = props.maxLength || 200;

  /**
   * Validates the input is between the min and max length.
   * @param val The value to validate.
   * @returns True if the input is valid, false otherwise.
   */
  const validateInput = (val : string): boolean => {
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

  /**
   * Submits the input box when the user presses enter.
   */
  const submitBox = (): void => {
    if (!validateInput(value)) return;
    props.entered(value);
  };

  return (
    <div className={styles.TextInputBox} title="Press Enter to Apply">
      <div className={styles.Description}>
        <h2>{props.title}</h2>
        <h3>{props.description}</h3>
      </div>

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
 * Creates an input box component. \
 * The input box component allows the user to enter a number.
 * @param title The title of the input box.
 * @param description The description of the input box.
 * @param initValue The initial value of the input box.
 * @param placeholder The placeholder text of the input box.
 * @param min The minimum value of the input box.
 * @param max The maximum value of the input box.
 * @param entered The function to call when the input box is submitted.
 * @returns The input box component.
 */
const InputBox = (props : {
  title: string,
  description: string,
  initValue?: any,
  placeholder: string,
  min?: number,
  max?: number,
  entered: (value: number) => void
}): JSX.Element => {
  const [value, setValue] = useState<number>(parseInt(props.placeholder));

  const notificationsContext = useNotifications();

  const minVal = props.min || 0;
  const maxVal = props.max || 10;

  /**
   * Validates the input is a positive integer.
   * @param val The value to validate.
   * @returns True if the input is valid, false otherwise.
   */
  const validateInput = (val : number): boolean => {
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

  /**
   * Submits the input box when the user presses enter.
   */
  const submitBox = (): void => {
    if (!validateInput(value)) return;
    props.entered(value);
  };

  return (
    <div className={styles.InputBox}>
      <div className={styles.Description}>
        <h2>{props.title}</h2>
        <h3>{props.description}</h3>
      </div>

      <input
        name="input"
        title="Press Enter to Apply"
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
 * Creates a checkbox component. \
 * The checkbox component allows the user to toggle a setting.
 * @param title The title of the checkbox.
 * @param description The description of the checkbox.
 * @param initValue The initial value of the checkbox.
 * @param selection The function to call when the checkbox is toggled.
 * @returns The checkbox component.
 */
const CheckBox = (props: {
  title: string,
  description: string,
  initValue: boolean,
  selection: (value: boolean) => void
}): JSX.Element => {
  const [value, setValue] = useState(props.initValue);

  /**
   * Toggles the value when the user clicks the checkbox.
   */
  const toggleValue = (): void => {
    props.selection(!value);
    setValue(!value);
  };

  return (
    <div className={styles.CheckBox}>
      <div className={styles.Description}>
        <h2>{props.title}</h2>
        <h3>{props.description}</h3>
      </div>

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
 * Creates a colour picker component. \
 * The colour picker component allows the user to select a colour.
 * @param title The title of the colour picker.
 * @param description The description of the colour picker.
 * @param initValue The initial value of the colour picker.
 * @param selection The function to call when the colour picker is changed.
 * @returns The colour picker component.
 */
const ColourPicker = (props: {
  title: string,
  description: string,
  defaultValue: string,
  initValue: string,
  selection: (value: RGBColor) => void
}): JSX.Element => {
  const [value, setValue] = useState<string>(props.initValue);

  /**
   * Changes the value when the user selects a colour.
   * @param val The value to change to.
   */
  const changeValue = (val: RGBColor): void => {
    const rgbaVal = parseColour(val);
    props.selection(val);
    setValue(rgbaVal);
  };

  /**
   * Resets the value when the user clicks the reset button.
   */
  const resetValue = (): void => {
    props.selection(props.defaultValue as unknown as RGBColor);
    setValue(props.defaultValue);
  };

  return (
    <div className={styles.ColourPicker}>
      <div className={styles.Description}>
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
            title="Reset to Default"
          >
            <FaUndoAlt size={"1.5rem"} />
          </span>
        </h2>
        <h3>{props.description}</h3>
      </div>

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
            "#feb8e1", "#b4ddfd", "#adf59e", "#f8f6b1",
            "#f4a1a1", "#d6b3fb", "#aaeff3", "#fdcb7e",
          ]}
          color={value}
          onChange={(color) => changeValue(color.rgb)}
          styles={{
            default: {
              picker: {
                background: 'rgba(var(--theme-background), 0.4)',
                boxShadow: '0 0 1rem rgba(var(--theme-shade7), 0.8)',
                width: '50%',
                transition: 'all 0.2s ease-in-out',
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
