import { RGBColor } from "react-color";


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
 * Sets the colours of the document.
 */
export const setDocumentColours = (colour: RGBColor) => {
  const parsedColour = colour;

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
