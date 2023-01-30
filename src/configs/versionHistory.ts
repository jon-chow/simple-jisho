export const VersionData : Version[] = [
  // {
  //   version: "",
  //   date: new Date(""),
  //   changes: [
  //     "",
  //   ],
  // },
  {
    version: "1.4.2",
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
    version: "1.3.0",
    date: new Date("Jan. 19, 2023"),
    changes: [
      "Added a modal for displaying developer logs.",
      "Created a new page for displaying kana.",
      "Added a modal for displaying kana stroke order.",
      "Improved routing for the app.",
    ],
  },
  {
    version: "1.2.2",
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
    version: "1.1.0",
    date: new Date("Jan. 13, 2023"),
    changes: [
      "Inplemented search history functionality.",
      "Added a modal for displaying search history.",
      "Implemented pagination.",
    ],
  },
  {
    version: "1.0.0",
    date: new Date("Dec. 9, 2022"),
    changes: [
      "Initial release.",
      "Included search and clear functionality.",
    ],
  }
];
