import { createContext, useContext, PropsWithChildren } from "react";


// The default settings.
const DEFAULT_SETTINGS = {
  theme: "system",
  background: false,
  highContrast: false
};

// The options for the theme.
export const ThemeOptions = [
  { title: "Light Mode", value: "light" },
  { title: "Dark Mode", value: "dark" },
  { title: "System", value: "system" }
];

// Get the active theme.
export const activeOption = () => {
  const theme = localStorage.getItem("theme");
  if (theme) return ThemeOptions.find((option) => option.value === theme);
  return ThemeOptions[0];
};

// Context for settings.
export const SettingsContext = createContext({
  theme: DEFAULT_SETTINGS.theme,
  background: DEFAULT_SETTINGS.background,
  highContrast: DEFAULT_SETTINGS.highContrast,
  setSetting: (key: string, value: any) => {}
});

// Use the settings context.
export const useSettings = () => useContext(SettingsContext);

// Getters for the settings.
export const getSetting = (key : string) => {
  try {
    const settings = localStorage.getItem("settings");
    if (settings) return JSON.parse(settings)[key];
  } catch (e) {}
  return DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
};

/**
 * Provides the context for themes.
 */
const SettingsContextProvider = ({ children } : PropsWithChildren) => {
  const setSetting = (key : string, value : any) => {
    const settings = localStorage.getItem("settings");
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      parsedSettings[key] = value;
      localStorage.setItem("settings", JSON.stringify(parsedSettings));
    } else {
      localStorage.setItem("settings", JSON.stringify({
        ...DEFAULT_SETTINGS,
        [key]: value
      }));
    };
    document.documentElement.setAttribute(`data-${key}`, value);
  };

  return (
    <SettingsContext.Provider value={{
      theme: getSetting("theme"),
      background: getSetting("background"),
      highContrast: getSetting("highContrast"),
      setSetting
    }}>
      { children }
    </SettingsContext.Provider>
  );
};

export default SettingsContextProvider;
