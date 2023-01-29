import { createContext, useContext, useEffect, PropsWithChildren } from "react";


// The default settings.
const DEFAULT_SETTINGS = {
  theme: "system",
  backgroundImage: false,
  highContrast: false,
  maxResultsToDisplay: 5,
  maxSearchHistory: 10,
};

// The options for the theme.
export const ThemeOptions : Option[] = [
  { title: "Light Mode", value: "light" },
  { title: "Dark Mode", value: "dark" },
  { title: "System", value: "system" }
];

// Context for settings.
export const SettingsContext = createContext({
  ...DEFAULT_SETTINGS,
  setSetting: (key: string, value: any) => {}
});

// Use the settings context.
export const useSettings = () => useContext(SettingsContext);

// Getters for the settings.
export const getSetting = (key : string) => {
  try {
    const settings = localStorage.getItem("settings");

    if (key === "theme") {
      const theme = settings ? JSON.parse(settings).theme : null;
      if (theme) return ThemeOptions.find((option) => option.value === theme);
      return ThemeOptions[0];
    };

    if (settings) return JSON.parse(settings)[key]; 
  } catch (e) {};

  return DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
};

// Get the default setting.
export const getDefaultSetting = (key : string) => {
  return DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
};

// Check if the settings have all the keys.
const hasAllKeys = (settings : string) => {
  const parsedSettings = JSON.parse(settings);
  return Object.keys(DEFAULT_SETTINGS).every((key) => key in parsedSettings);
};

// Get all the settings.
const getAllSettings = () => {
  let settings = { ...DEFAULT_SETTINGS as any };
  Object.keys(DEFAULT_SETTINGS).forEach((key) => { settings[key] = getSetting(key); });
  return settings;
};

/**
 * Provides the context for themes.
 */
const SettingsContextProvider = ({ children } : PropsWithChildren) => {
  // Set a single setting value.
  const setSetting = (key : string, value : any) => {
    const settings = localStorage.getItem("settings");
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      parsedSettings[key] = value;
      localStorage.setItem("settings", JSON.stringify(parsedSettings));
    } else {
      localStorage.setItem("settings", JSON.stringify({
        ...DEFAULT_SETTINGS, [key]: value
      }));
    };
    document.documentElement.setAttribute(`data-${key}`, value);
  };

  // Set the initial settings on load.
  useEffect(() => {
    const settings = localStorage?.getItem("settings");
    
    if (settings && hasAllKeys(settings)) { // If the settings have all the keys.
      const parsedSettings = JSON.parse(settings);
      Object.keys(parsedSettings).forEach((key) => {
        document.documentElement.setAttribute(`data-${key}`, parsedSettings[key]);
      });
    } else if (settings) { // If the settings have missing keys.
      const parsedSettings = JSON.parse(settings);
      Object.keys(DEFAULT_SETTINGS).forEach((key) => {
        if (!(key in parsedSettings))
          parsedSettings[key] = DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
      });
      localStorage.setItem("settings", JSON.stringify(parsedSettings));
    } else { // If the settings are missing.
      localStorage.setItem("settings", JSON.stringify(DEFAULT_SETTINGS));
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
    localStorage.setItem("settings", JSON.stringify(parsedSettings));
  }, []);

  return (
    <SettingsContext.Provider value={{ ...getAllSettings(), setSetting }}>
      { children }
    </SettingsContext.Provider>
  );
};

export default SettingsContextProvider;
