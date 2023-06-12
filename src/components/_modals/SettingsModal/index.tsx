import { FaEye, FaSearch } from 'react-icons/fa';

import { useSettings, getSetting, getDefaultSetting, ThemeOptions } from '@src/contexts/SettingsProvider';
import { useModal, resetModalContext } from '@src/contexts/ModalProvider';
import { setDocumentColours, setThemeColours } from '@src/utils/setDocumentColours';

import ModalLayout from '../ModalLayout';
import {
  DropDown,
  CheckBox,
  TextInputBox,
  InputBox,
  ColourPicker,
} from './Inputs';

import styles from './SettingsModal.module.scss';


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */

/**
 * Creates the settings modal component.  \
 * The settings modal allows the user to change app preferences.
 * @returns The settings modal component.
 */
const SettingsModal = (): JSX.Element => {
  const settingsContext = useSettings();
  const settingsModalContext = useModal();

  /**
   * Changes a specified setting.
   * @param setting The setting to change.
   * @param value The new value of the setting.
   */
  const changeSetting = (setting: string, value: any): void => {
    settingsContext.setSetting(setting, value);
  };

  /**
   * Resets all settings to their default values.
   */
  const resetSettings = (): void => {
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

          <DropDown
            title="Theme"
            initValue={getSetting("theme", ThemeOptions)}
            options={ThemeOptions}
            selection={(option) => {
              changeSetting("theme", option.value);
              setThemeColours(option.value);
            }}
          />

          <CheckBox
            title="Enable Background Image"
            initValue={getSetting("backgroundImage")}
            selection={(value) => { changeSetting("backgroundImage", value); }}
          />

          <TextInputBox
            title="Image URL"
            initValue={getSetting("backgroundUrl")}
            placeholder={getDefaultSetting("backgroundUrl") as string}
            entered={(value) => {
              if (value === "")
                changeSetting("backgroundUrl", getDefaultSetting("backgroundUrl"));
              else
                changeSetting("backgroundUrl", value);
            }}
          />

          <InputBox
            title="Background Blur (in pixels)"
            initValue={getSetting("backgroundBlur")}
            placeholder={getDefaultSetting("backgroundBlur") as string}
            min={0}
            max={100}
            entered={(value) => { changeSetting("backgroundBlur", value); }}
          />

          <ColourPicker
            title="Accent Colour"
            defaultValue={getDefaultSetting("accentColour") as string}
            initValue={getSetting("accentColour")}
            selection={(value) => {
              setDocumentColours(value);
              changeSetting("accentColour", value);
            }}
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
