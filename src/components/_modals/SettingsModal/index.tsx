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
            description="The theme of the app."
            initValue={getSetting("theme", ThemeOptions)}
            options={ThemeOptions}
            selection={(option) => {
              changeSetting("theme", option.value);
              setThemeColours(option.value);
            }}
          />

          <CheckBox
            title="Enable Background Image"
            description="Toggle the background image on or off."
            initValue={getSetting("backgroundImage")}
            selection={(value) => { changeSetting("backgroundImage", value); }}
          />

          <TextInputBox
            title="Image URL"
            description="The URL of the image to use as the background."
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
            description="The amount of blur to apply to the background."
            initValue={getSetting("backgroundBlur")}
            placeholder={getDefaultSetting("backgroundBlur") as string}
            min={0}
            max={100}
            entered={(value) => { changeSetting("backgroundBlur", value); }}
          />

          <ColourPicker
            title="Accent Colour"
            description="The colour of the accent elements."
            defaultValue={getDefaultSetting("accentColour") as string}
            initValue={getSetting("accentColour")}
            selection={(value) => {
              setDocumentColours(value);
              changeSetting("accentColour", value);
            }}
          />

          {/* <CheckBox
            title="High Contrast"
            description="Toggle high contrast mode on or off."
            initValue={getSetting("highContrast")}
            selection={(value) => { changeSetting("highContrast", value); }}
          /> */}

          {/* <DropDown
            title="Font Size"
            description="The size of the font."
            initValue={getSetting("fontSize", FontSizeOptions)}
            options={FontSizeOptions}
            selection={(option) => { changeSetting("fontSize", option.value); }}
          /> */}
        </div>

        <div className={styles.Group}>
          <h1><FaSearch /> Search Options</h1>
          <InputBox
            title="Maximum Results (20 max.)"
            description="The max number of results to return from a search."
            initValue={getSetting("maxNumResults")}
            placeholder={getDefaultSetting("maxNumResults") as string}
            max={20}
            entered={(value) => { changeSetting("maxNumResults", value); }}
          />

          <InputBox
            title="Maximum Sentences (10 max.)"
            description="The max number of sentences to retrieve for each word."
            initValue={getSetting("maxNumSentences")}
            placeholder={getDefaultSetting("maxNumSentences") as string}
            max={10}
            entered={(value) => { changeSetting("maxNumSentences", value); }}
          />

          <InputBox
            title="Results Per Page (10 max.)"
            description="The number of results to display per page."
            initValue={getSetting("maxResultsToDisplay")}
            placeholder={getDefaultSetting("maxResultsToDisplay") as string}
            max={10}
            entered={(value) => { changeSetting("maxResultsToDisplay", value); }}
          />

          <InputBox
            title="Saved Searches (20 max.)"
            description="The number of searches you can save at a time."
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
