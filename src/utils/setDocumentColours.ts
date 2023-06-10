import { RGBColor } from "react-color";

import { ThemesData } from "@src/configs/config";
import { ThemeOptions } from "@src/contexts/SettingsProvider";
import { getSetting } from "@src/contexts/SettingsProvider";


/**
 * Parses a colour string into an RGBColor object and vice versa.
 */
export const parseColour = (colour: string | RGBColor): RGBColor | string => {
  if (typeof colour === "string") {
    const parsedColour = colour.replace("rgba(", "").replace(")", "").split(",");
    return {
      r: parseInt(parsedColour[0]),
      g: parseInt(parsedColour[1]),
      b: parseInt(parsedColour[2]),
      a: parseFloat(parsedColour[3]),
    };
  } else {
    return `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`;
  }
};


/**
 * Sets the theme colours of the document.
 */
export const setThemeColours = (theme: string | void) => {
  try {
    // Get the theme if not provided.
    if (!theme)
      theme = getSetting("theme").toLowerCase();
    
    // Replace system with value.
    if (theme === "system")
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    
    // Check if the theme is an option.
    const themeOptions = Object.values(ThemeOptions).find(
			(option) => option.value === theme
		);

    // Set the theme colours.
    if (themeOptions) {
      const themeData = ThemesData.find((themeData) => themeData.title === themeOptions.value);

      if (themeData) {
        document.documentElement.style.setProperty("--theme-background", themeData.background);
        document.documentElement.style.setProperty("--theme-background-raw", themeData.backgroundRaw);
        document.documentElement.style.setProperty("--theme-foreground", themeData.foreground);
        document.documentElement.style.setProperty("--theme-foreground-raw", themeData.foregroundRaw);
      };
    };
  } catch (error) {
    throw new Error("Theme not found!");
  };
};


/**
 * Sets the colours of the document.
 */
export const setDocumentColours = (colour: RGBColor) => {
  const parsedColour = colour;

  // Set the theme colours.
  setThemeColours();

  // Set the primary colour.
  const raw = `${parsedColour.r}, ${parsedColour.g}, ${parsedColour.b}`;
  const rgb = `rgba(${raw}, ${parsedColour.a})`;
  document.documentElement.style.setProperty("--primary-colour", rgb);
  document.documentElement.style.setProperty("--primary-colour-raw", raw);

  // Set the primary colour dark.
  const rawDark = `${parsedColour.r - 30}, ${parsedColour.g - 30}, ${parsedColour.b - 30}`;
  const rgbDark = `rgba(${rawDark}, ${parsedColour.a})`;
  document.documentElement.style.setProperty("--primary-colour-dark", rgbDark);
  document.documentElement.style.setProperty("--primary-colour-dark-raw", rawDark);

  // Set the primary colour light.
  const rawLight = `${parsedColour.r + 30}, ${parsedColour.g + 30}, ${parsedColour.b + 30}`;
  const rgbLight = `rgba(${rawLight}, ${parsedColour.a})`;
  document.documentElement.style.setProperty("--primary-colour-light", rgbLight);
  document.documentElement.style.setProperty("--primary-colour-light-raw", rawLight);
};
