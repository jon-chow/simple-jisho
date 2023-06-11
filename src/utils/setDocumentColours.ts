import { RGBColor } from "react-color";

import { ThemesData } from '@src/styles/themes';
import { ThemeOptions } from "@src/contexts/SettingsProvider";
import { getSetting } from "@src/contexts/SettingsProvider";


/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

/**
 * Parses a colour string into an RGBColor object and vice versa.
 * @param colour The colour to parse.
 * @returns The parsed colour.
 */
function parseColour(colour: string): RGBColor;
function parseColour(colour: RGBColor): string;
function parseColour(colour: string | RGBColor): RGBColor | string {
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
  };
};


/**
 * Parses a colour object into a raw colour string. (e.g. 255, 255, 255)
 * @param colour The colour to parse.
 * @returns The raw colour string.
 */
function parseToRaw(colour: RGBColor): string {
  const { r, g, b } = colour;
  return `${r}, ${g}, ${b}`;
};


/**
 * Sets the theme colours of the document.
 * @param theme The theme to set the colours to.
 * @throws If the theme is not found.
 */
function setThemeColours(theme?: string): void {
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
        for (const [key, value] of Object.entries(themeData).filter(([key]) => key !== "title")) {
          const convertedKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
          document.documentElement.style.setProperty(`--theme-${convertedKey}`, value);
        };
      };
    };
  } catch (error) {
    throw new Error("Theme not found!");
  };
};


/**
 * Calculates the new colour based on the current colour and the amount to change. \
 * Constrained between 0 and 255, returns a new RGBColor object.
 * @param colour The colour to change.
 * @param amount The amount to change the colour by.
 * @returns The new colour.
 */
function calculateNewColour(colour: RGBColor, amount: number): RGBColor {
  const { r, g, b, a } = colour;
  const colours = [r, g, b].map((colour) => Math.min(Math.max(colour + amount, 0), 255));
  return { r: colours[0], g: colours[1], b: colours[2], a: a };
};


/**
 * Sets the colours of the document.
 * @param colour The colour to set the document to.
 */
function setDocumentColours(colour: RGBColor): void {
  // Set the theme colours.
  setThemeColours();

  // Set the primary colour.
  document.documentElement.style.setProperty("--primary-colour", parseToRaw(colour));

  // Define the other colours.
  const darker = calculateNewColour(colour, -50);
	const dark = calculateNewColour(colour, -30);
  const light = calculateNewColour(colour, 30);
  const lighter = calculateNewColour(colour, 50);

  const others = {
    darker: darker,
    dark: dark,
    light: light,
    lighter: lighter,
  };

  // Set the other colours.
  for (const [key, value] of Object.entries(others)) {
    document.documentElement.style.setProperty(`--primary-colour-${key}`, parseToRaw(value));
  };
};


export {
  parseColour,
  parseToRaw,
  setThemeColours,
  calculateNewColour,
  setDocumentColours,
};
