import { createContext, useContext, PropsWithChildren } from "react";


// The default theme.
const DEFAULT_THEME = "system";

// The options for the theme.
export const Options = [
  { title: "Light Mode", value: "light" },
  { title: "Dark Mode", value: "dark" },
  { title: "System", value: "system" }
];

// Get the active theme.
export const activeOption = () => {
  const theme = localStorage.getItem("theme");
  if (theme) return Options.find((option) => option.value === theme);
  return Options[0];
};

// Context for the theme.
export const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  setTheme: (theme: string) => {},
});

// Use the theme context.
export const useTheme = () => useContext(ThemeContext);


/**
 * Provides the context for themes.
 */
const ThemeContextProvider = ({ children } : PropsWithChildren) => {
  const setTheme = (theme: string) => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  };
  
  const theme = () => {
    try {
      const theme = localStorage.getItem("theme");
      if (theme) return theme;
    } catch (e) {
    }
    return DEFAULT_THEME;
  };

  return (
    <ThemeContext.Provider value={{
      theme: theme(), setTheme,
    }}>
      { children }
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
