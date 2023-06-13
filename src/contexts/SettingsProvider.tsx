import { createContext, useContext, useEffect, PropsWithChildren } from "react";

import { setLocalStorage } from "@src/utils/setLocalStorage";
import { setDocumentColours } from "@src/utils/setDocumentColours";


/**
 * The default settings for the app.
 */
const DEFAULT_SETTINGS = {
  theme: "system",
  accentColour: {
    "r": 254,
    "g": 184,
    "b": 225,
    "a": 1
  },
  backgroundImage: false,
  backgroundUrl: "/static/background.png",
  backgroundBlur: 3,
  highContrast: false,
  maxNumResults: 20,
  maxNumSentences: 5,
  maxResultsToDisplay: 5,
  maxSearchHistory: 10,
  fontSize: "medium"
};

/**
 * The settings context.
 */
export const SettingsContext = createContext({
  ...DEFAULT_SETTINGS,
  setSetting: (key: string, value: any) => {},
  resetSettings: () => {}
});

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Uses the settings context.
 * @returns The settings context.
 */
export const useSettings = () => useContext(SettingsContext);

/**
 * Getter for settings.
 * @param key The key of the setting.
 * @param selections The selections for the setting.
 * @returns The setting value.
 */
export function getSetting(key : string, selections?: Option[]): any {
  try {
    const settings = localStorage.getItem("settings");

    // For things that require a selection.
    if (selections) {
      if (key === "theme" || key === "fontSize") {
        const val = settings ? JSON.parse(settings)[key] : null;
        if (val) return selections.find((option) => option.value === val);
        return selections[0];
      };
    };

    if (settings) return JSON.parse(settings)[key]; 
  } catch (e) {};

  return DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
};

/**
 * Getter for default settings.
 * @param key The key of the setting.
 * @returns The default setting value.
 */
export function getDefaultSetting(key : string): any {
  return DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
};

/**
 * Checks if the settings isn't missing any keys.
 * @param settings The settings to check.
 * @returns Whether the settings have all the keys.
 */
function hasAllKeys(settings : string): boolean {
  const parsedSettings = JSON.parse(settings);
  return Object.keys(DEFAULT_SETTINGS).every((key) => key in parsedSettings);
};

/**
 * Gets all the settings.
 * @returns All the settings.
 */
function getAllSettings(): any {
  let settings = { ...DEFAULT_SETTINGS as any };
  Object.keys(DEFAULT_SETTINGS).forEach((key) => { settings[key] = getSetting(key); });
  return settings;
};

/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */

/**
 * Provides the context for themes.
 * @param children The children of the component.
 * @returns The settings context provider.
 */
const SettingsContextProvider = ({ children } : PropsWithChildren): JSX.Element => {
  /**
   * Sets a single setting value.
   * @param key The key of the setting.
   * @param value The value to set.
   */
  const setSetting = (key : string, value : any): void => {
    const settings = localStorage.getItem("settings");
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      parsedSettings[key] = value;
      setLocalStorage("settings", JSON.stringify(parsedSettings));
    } else {
      setLocalStorage("settings", JSON.stringify({
        ...DEFAULT_SETTINGS, [key]: value
      }));
    };
    document.documentElement.setAttribute(`data-${key}`, value);
  };

  /**
   * Resets the settings to the default settings.
   */
  const resetSettings = (): void => {
    setLocalStorage("settings", JSON.stringify(DEFAULT_SETTINGS));
    Object.keys(DEFAULT_SETTINGS).forEach((key) => {
      document.documentElement.setAttribute(`data-${key}`,
        DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS].toString());
    });
  };

  // Set the initial settings on load.
  useEffect(() => {
    const settings = localStorage?.getItem("settings");

    if (settings && hasAllKeys(settings)) {
      // If the settings have all the keys.
      const parsedSettings = JSON.parse(settings);
      Object.keys(parsedSettings).forEach((key) => {
        document.documentElement.setAttribute(`data-${key}`, parsedSettings[key]);
      });
    } else if (settings) {
      // If the settings have missing keys.
      const parsedSettings = JSON.parse(settings);
      Object.keys(DEFAULT_SETTINGS).forEach((key) => {
        if (!(key in parsedSettings))
          parsedSettings[key] = DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
        document.documentElement.setAttribute(`data-${key}`, parsedSettings[key]);
      });
      setLocalStorage("settings", JSON.stringify(parsedSettings));
    } else {
      // If the settings are missing.
      setLocalStorage("settings", JSON.stringify(DEFAULT_SETTINGS));
      Object.keys(DEFAULT_SETTINGS).forEach((key) => {
        document.documentElement.setAttribute(`data-${key}`,
          DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS].toString());
      });
    };

    // Remove keys that dont exist in the default settings.
    const parsedSettings = JSON.parse(localStorage.getItem("settings") as string);
    Object.keys(parsedSettings).forEach((key) => {
      if (!(key in DEFAULT_SETTINGS))
        delete parsedSettings[key];
    });

    // Set document accent colour.
    const parsedColour = parsedSettings.accentColour;
    setDocumentColours(parsedColour);

    setLocalStorage("settings", JSON.stringify(parsedSettings));
  }, []);

  return (
    <SettingsContext.Provider value={{ ...getAllSettings(), setSetting, resetSettings }}>
      { children }
    </SettingsContext.Provider>
  );
};

export default SettingsContextProvider;


/* -------------------------------------------------------------------------- */
/*                            OPTIONS FOR SETTINGS                            */
/* -------------------------------------------------------------------------- */

/**
 * The options for the theme.
 */
export const ThemeOptions: Option[] = [
  { title: "Light Mode", value: "light" },
  { title: "Dark Mode", value: "dark" },
  { title: "System", value: "system" }
];

/**
 * The options for the font size.
 */
export const FontSizeOptions: Option[] = [
  { title: "Extra Small", value: "extra-small"},
  { title: "Small", value: "small" },
  { title: "Medium", value: "medium" },
  { title: "Large", value: "large" },
  { title: "Extra Large", value: "extra-large" }
];
