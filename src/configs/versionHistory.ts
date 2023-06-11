/**
 * Version history for the app.
 */
const VersionHistory: Version[] = [
	// {
	//   version: "",
	//   date: new Date(""),
	//   changes: [
	//     "",
	//   ],
	// },
	{
		version: { major: 1, minor: 3, patch: 11 },
		date: new Date("June 11, 2023"),
		changes: [
			"Added sorting options for bookmarks page.",
			"Updated display and dropdowns for developer logs.",
			"Included links to Wikipedia definitions.",
			"Added dropdowns for search entries.",
			"Revisions to version history to reflect proper changes.",
			"Added accent colour to settings.",
			"Added dropdowns for kana page.",
		],
	},
	{
		version: { major: 1, minor: 3, patch: 4 },
		date: new Date("May 31, 2023"),
		changes: [
			"Added more background customization options",
			"Fixed some warnings and errors.",
			"Fixed routing history when navigating between pages.",
			"Minor changes to the UI.",
		],
	},
	{
		version: { major: 1, minor: 3, patch: 0 },
		date: new Date("Jan. 29, 2023"),
		changes: [
			"Added notifications feature.",
			"Implemented saving functionality for terms.",
			"Created a page for displaying saved terms.",
			"Created a 404 page.",
			"Added animation to favourite (save) button.",
			"Added a settings modal.",
			"Fixed a bug where searching a new word would not refresh the page number.",
			"Fixed non-deterministic notification behaviour.",
		],
	},
	{
		version: { major: 1, minor: 2, patch: 0 },
		date: new Date("Jan. 19, 2023"),
		changes: [
			"Added a modal for displaying developer logs.",
			"Created a new page for displaying kana.",
			"Added a modal for displaying kana stroke order.",
			"Improved routing for the app.",
		],
	},
	{
		version: { major: 1, minor: 1, patch: 2 },
		date: new Date("Jan. 15, 2023"),
		changes: [
			"Added copying functionality for search results.",
			"Added a modal for displaying kanji information.",
			"Kanji information displays the kanji, its meaning, its on and kun readings, and stroke order.",
			"Included example sentences to search results.",
			"Improved the UI for displaying search results.",
			"Fixed a bug where the browser history would not update.",
			"Fixed a bug in pagination where changing pages would not scroll to the top of the page.",
		],
	},
	{
		version: { major: 1, minor: 0, patch: 3 },
		date: new Date("Jan. 13, 2023"),
		changes: [
			"Inplemented search history functionality.",
			"Added a modal for displaying search history.",
			"Implemented pagination.",
		],
	},
	{
		version: { major: 1, minor: 0, patch: 0 },
		date: new Date("Dec. 9, 2022"),
		changes: ["Initial release.", "Included search and clear functionality."],
	},
];

/**
 * Version history for the app. \
 * Sorted by date in descending order.
 */
export const VersionData = VersionHistory.sort(
	(a, b) => b.date.getTime() - a.date.getTime()
);
