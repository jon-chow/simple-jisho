/**
 * Data containing raw RGB information for themes. \
 * Each theme has a title, a background color, a foreground color, and 9 shades. \
 * I might add more themes in the future.
 * @themes light, dark
 */
const ThemesData: Theme[] = [
	{
		title: "light",

		// Main
		background: "240, 240, 240",
		foreground: "40, 40, 40",

		// Other shades
		shade1: "0, 0, 0",
		shade2: "30, 30, 30",
		shade3: "60, 60, 60",
		shade4: "90, 90, 90",
		shade5: "120, 120, 120",
		shade6: "150, 150, 150",
		shade7: "180, 180, 180",
		shade8: "210, 210, 210",
		shade9: "240, 240, 240",
	},
	{
		title: "dark",

		// Main
		background: "0, 0, 0",
		foreground: "240, 240, 240",

		// Other shades
		shade1: "240, 240, 240",
		shade2: "210, 210, 210",
		shade3: "180, 180, 180",
		shade4: "150, 150, 150",
		shade5: "120, 120, 120",
		shade6: "90, 90, 90",
		shade7: "60, 60, 60",
		shade8: "30, 30, 30",
		shade9: "0, 0, 0",
	},
];

export {
  ThemesData
};
