/*
 * MIT License
 * 
 * Copyright (c) 2017 mistval
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * Modified by @jon-chow
 */

import axiosBuilder from "axios";
import { CheerioAPI, load } from "cheerio";
import { decode } from "html-entities";

const JISHO_API = "https://jisho.org/api/v1/search/words";
const SCRAPE_BASE_URI = "https://jisho.org/search/";
const STROKE_ORDER_DIAGRAM_BASE_URI = "http://classic.jisho.org/static/images/stroke_diagrams/";
const GIF_URI_BASE = "https://raw.githubusercontent.com/jon-chow/simple-jisho/images/gifs/"

const axios = axiosBuilder.create({ timeout: 10000 });


/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */

/**
 * Escapes a string for use in a regex.
 * @param string The string to escape.
 * @returns The escaped string.
 */
function escapeStringRegexp(string: string): string {
	return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
};

/**
 * Removes newlines from a string.
 * @param str The string to remove newlines from.
 * @returns The string with newlines removed.
 */
function removeNewlines(str: string): string {
	return str.replace(/(?:\r|\n)/g, "").trim();
};


/* -------------------------------------------------------------------------- */
/*                        KANJI SEARCH FUNCTIONALITIES                        */
/* -------------------------------------------------------------------------- */
const ONYOMI_LOCATOR_SYMBOL = "On";
const KUNYOMI_LOCATOR_SYMBOL = "Kun";

/**
 * Provides a URI to search for a kanji character.
 * @param kanji The kanji to search for.
 * @returns The URI to search for the kanji.
 */
function uriForKanjiSearch(kanji: string): string {
	return `${SCRAPE_BASE_URI}${encodeURIComponent(kanji)}%23kanji`;
};

/**
 * Provides a URI to the stroke order diagram for a kanji character.
 * @param kanji The kanji to search for.
 * @returns The URI to the stroke order diagram for the kanji.
 */
function getUriForStrokeOrderDiagram(kanji: string): string {
	return `${STROKE_ORDER_DIAGRAM_BASE_URI}${kanji.charCodeAt(0).toString()}_frames.png`;
};

/**
 * Provides a URI to search for a phrase.
 * @param phrase The phrase to search for.
 * @param page The page number to search for.
 * @returns The URI to search for the phrase.
 */
function uriForPhraseSearch(phrase: string, page?: string): string {
	let uri = `${JISHO_API}?keyword=${encodeURIComponent(phrase)}`;
	return (page) ? `${uri}&page=${page}` : uri;
};

/**
 * Checks if a page contains the kanji glyph.
 * @param pageHtml The HTML of the page.
 * @param kanji The kanji to search for.
 * @returns Whether the page contains the kanji glyph.
 */
function containsKanjiGlyph(pageHtml: string, kanji: string): boolean {
	const kanjiGlyphToken = `<h1 class="character" data-area-name="print" lang="ja">${kanji}</h1>`;
	return pageHtml.indexOf(kanjiGlyphToken) !== -1;
};

/**
 * Gets the substring between two indices.
 * @param data The string to search in.
 * @param startIndex The index to start searching from.
 * @param endIndex The index to stop searching at.
 * @returns The string between the start and end indices.
 */
function getStringBetweenIndicies(data: string, startIndex: number, endIndex: number): string {
	const result = data.substring(startIndex, endIndex);
	return removeNewlines(result).trim();
};

/**
 * Gets the substring between two strings.
 * @param data The string to search in.
 * @param startString The string to start searching from.
 * @param endString The string to stop searching at.
 * @returns The string between the start and end strings.
 */
function getStringBetweenStrings(data: string, startString: string, endString: string): string | undefined {
	const regex = new RegExp(`${escapeStringRegexp(startString)}(.*?)${escapeStringRegexp(endString)}`, "s");
	const match = data.match(regex);
	return match ? match[1] : undefined;
};

/**
 * Gets the integer between two strings.
 * @param pageHtml The HTML of the page.
 * @param startString The string to start searching from.
 * @param endString The string to stop searching at.
 * @returns The integer between the start and end strings.
 */
function getIntBetweenStrings(pageHtml: string, startString: string, endString: string): number | undefined {
	const stringBetweenStrings = getStringBetweenStrings(pageHtml, startString, endString);
	return (stringBetweenStrings) ? parseInt(stringBetweenStrings, 10) : undefined;
};

/**
 * Gets all the matches of a regex in a string.
 * @param str The string to search in.
 * @param regex The regex pattern.
 * @returns All the matches of the regex in the string.
 */
function getAllGlobalGroupMatches(str: string, regex: RegExp): string[] {
	let regexResult = regex.exec(str);

	const results = [];
	while (regexResult) {
		results.push(regexResult[1]);
		regexResult = regex.exec(str);
	};

	return results;
};

/**
 * A parsed list of anchors.
 * @param str The string to parse.
 * @returns The anchors in the string as an array.
 */
function parseAnchorsToArray(str: string): string[] {
	const regex = /<a href=".*?">(.*?)<\/a>/g;
	return getAllGlobalGroupMatches(str, regex);
};

/**
 * Gets the yomi on a page.
 * @param pageHtml The HTML of the page.
 * @param yomiLocatorSymbol The symbol to search for.
 * @returns The yomi of the page.
 */
function getYomi(pageHtml: string, yomiLocatorSymbol: string): string[] {
	const yomiSection = getStringBetweenStrings(pageHtml, `<dt>${yomiLocatorSymbol}:</dt>`, "</dl>");
	return parseAnchorsToArray(yomiSection || "");
};

/**
 * Gets the kunyomi on a page.
 * @param pageHtml The HTML of the page.
 * @returns The kunyomi of the page.
 */
function getKunyomi(pageHtml: string): string[] {
	return getYomi(pageHtml, KUNYOMI_LOCATOR_SYMBOL);
};

/**
 * Gets the onyomi on a page.
 * @param pageHtml The HTML of the page.
 * @returns The onyomi of the page.
 */
function getOnyomi(pageHtml: string): string[] {
	return getYomi(pageHtml, ONYOMI_LOCATOR_SYMBOL);
};

/**
 * Gets a list of yomi examples.
 * @param pageHtml The HTML of the page.
 * @param yomiLocatorSymbol The symbol to search for.
 * @returns A list of yomi examples.
 */
function getYomiExamples(pageHtml: string, yomiLocatorSymbol: string): YomiExample[] {
	const locatorString = `<h2>${yomiLocatorSymbol} reading compounds</h2>`;
	const exampleSection = getStringBetweenStrings(pageHtml, locatorString, "</ul>");
	
	if (!exampleSection)
		return [];

	const regex = /<li>(.*?)<\/li>/gs;
	const regexResults = getAllGlobalGroupMatches(exampleSection, regex).map((s) => s.trim());

	const examples = regexResults.map((regexResult) => {
		const examplesLines = regexResult.split("\n").map((s) => s.trim());
		return {
			example: examplesLines[0],
			reading: examplesLines[1].replace("【", "").replace("】", ""),
			meaning: decode(examplesLines[2]),
		};
	});

	return examples;
};

/**
 * Gets a list of onyomi examples.
 * @param pageHtml The HTML of the page.
 * @returns A list of onyomi examples.
 */
function getOnyomiExamples(pageHtml: string): YomiExample[] {
	return getYomiExamples(pageHtml, ONYOMI_LOCATOR_SYMBOL);
};

/**
 * Gets a list of kunyomi examples.
 * @param pageHtml The HTML of the page.
 * @returns A list of kunyomi examples.
 */
function getKunyomiExamples(pageHtml: string): YomiExample[] {
	return getYomiExamples(pageHtml, KUNYOMI_LOCATOR_SYMBOL);
};

/**
 * Gets the radical on a page.
 * @param pageHtml The HTML of the page.
 * @returns The radical if it exists.
 */
function getRadical(pageHtml: string): Radical | undefined {
	const radicalMeaningStartString = '<span class="radical_meaning">';
	const radicalMeaningEndString = "</span>";

	const radicalMeaning = getStringBetweenStrings(pageHtml, radicalMeaningStartString, radicalMeaningEndString)?.trim();

	if (radicalMeaning) {
		const radicalMeaningStartIndex = pageHtml.indexOf(radicalMeaningStartString);
		const radicalMeaningEndIndex = pageHtml.indexOf(radicalMeaningEndString, radicalMeaningStartIndex);

		const radicalSymbolStartIndex = radicalMeaningEndIndex + radicalMeaningEndString.length;
		const radicalSymbolEndString = "</span>";
		const radicalSymbolEndIndex = pageHtml.indexOf(radicalSymbolEndString, radicalSymbolStartIndex);
		const radicalSymbolsString = getStringBetweenIndicies(pageHtml, radicalSymbolStartIndex, radicalSymbolEndIndex);

		if (radicalSymbolsString.length > 1) {
			const radicalForms = radicalSymbolsString.substring(1).replace("(", "").replace(")", "").trim().split(", ");
			return { symbol: radicalSymbolsString[0], forms: radicalForms, meaning: radicalMeaning };
		};

		return { symbol: radicalSymbolsString, meaning: radicalMeaning };
	};

	return undefined;
};

/**
 * Gets the parts on a page.
 * @param pageHtml The HTML of the page.
 * @returns The parts of the page.
 */
function getParts(pageHtml: string): string[] {
	const partsSectionStartString = "<dt>Parts:</dt>";
	const partsSectionEndString = "</dl>";

	const partsSection = getStringBetweenStrings(pageHtml, partsSectionStartString, partsSectionEndString);

	return parseAnchorsToArray(partsSection as string).sort();
};

/**
 * Gets the SVG URI on a page.
 * @param pageHtml The HTML of the page.
 * @returns The SVG URI of the kanji if it exists.
 */
function getSvgUri(pageHtml: string): string | undefined {
	const svgRegex = /\/\/.*?.cloudfront.net\/.*?.svg/;
	const regexResult = svgRegex.exec(pageHtml);
	return regexResult ? `https:${regexResult[0]}` : undefined;
}

/**
 * Gets the GIF URI on a page.
 * @param kanji The kanji to search for.
 * @returns The GIF URI of the kanji.
 */
function getGifUri(kanji: any): string {
	const fileName = `${kanji.codePointAt(0).toString(16)}.gif`;
	return `${GIF_URI_BASE}${fileName}`;
};

/**
 * Gets the newspaper frequency rank on a page.
 * @param pageHtml The HTML of the page.
 * @returns The newspaper frequency rank of the kanji.
 */
function getNewspaperFrequencyRank(pageHtml: string): string | undefined {
	const frequencySection = getStringBetweenStrings(pageHtml, '<div class="frequency">', "</div>");
	return frequencySection
		? getStringBetweenStrings(frequencySection, "<strong>", "</strong>")
		: undefined;
}

/**
 * Parses the data from a kanji page.
 * @param pageHtml The HTML of the page.
 * @param kanji The kanji to search for.
 * @returns The parsed data from the page.
 */
function parseKanjiPageData(pageHtml: string, kanji: string): KanjiParseResult {
	const result = {} as KanjiParseResult;
	result.query = kanji;
	result.found = containsKanjiGlyph(pageHtml, kanji);

	if (!result.found)
		return result;

	result.taughtIn = getStringBetweenStrings(pageHtml, "taught in <strong>", "</strong>") as string;
	result.jlptLevel = getStringBetweenStrings(pageHtml, "JLPT level <strong>", "</strong>") as string;
	result.newspaperFrequencyRank = getNewspaperFrequencyRank(pageHtml) as string;
	result.strokeCount = getIntBetweenStrings(pageHtml, "<strong>", "</strong> strokes") as unknown as string;
	result.meaning = decode(
		removeNewlines(
			getStringBetweenStrings(pageHtml, '<div class="kanji-details__main-meanings">', "</div>") as string
		).trim()
	);
	result.kunyomi = getKunyomi(pageHtml);
	result.onyomi = getOnyomi(pageHtml);
	result.onyomiExamples = getOnyomiExamples(pageHtml);
	result.kunyomiExamples = getKunyomiExamples(pageHtml);
	result.radical = getRadical(pageHtml) as Radical;
	result.parts = getParts(pageHtml);
	result.strokeOrderDiagramUri = getUriForStrokeOrderDiagram(kanji);
	result.strokeOrderSvgUri = getSvgUri(pageHtml) as string;
	result.strokeOrderGifUri = getGifUri(kanji);
	result.uri = uriForKanjiSearch(kanji);
	return result;
};


/* -------------------------------------------------------------------------- */
/*                       EXAMPLE SEARCH FUNCTIONALITIES                       */
/* -------------------------------------------------------------------------- */
const kanjiRegex = /[\u4e00-\u9faf\u3400-\u4dbf々]/g;

/**
 * Provides a URI to search for examples.
 * @param phrase The phrase to search for.
 * @returns The URI to search for the examples of a phrase.
 */
function uriForExampleSearch(phrase: string): string {
	return `${SCRAPE_BASE_URI}${encodeURIComponent(phrase)}%23sentences`;
};

/**
 * Gets the kanji and kana of a div.
 * @param div The div to parse.
 * @returns The kanji and kana of the div.
 */
function getKanjiAndKana(div: any): { kanji: string; kana: string } {
	const ul = div.find("ul").eq(0);
	const contents = ul.contents();

	let kanji = "";
	let kana = "";
	for (let i = 0; i < contents.length; i += 1) {
		const content = contents.eq(i);
		if (content[0].name === "li") {
			const li = content;
			const furigana = li.find(".furigana").text();
			const unlifted = li.find(".unlinked").text();

			if (furigana) {
				kanji += unlifted;
				kana += furigana;

				const kanaEnding = [];
				for (let j = unlifted.length - 1; j > 0; j -= 1) {
					if (!unlifted[j].match(kanjiRegex))
						kanaEnding.push(unlifted[j]);
					else
						break;
				};

				kana += kanaEnding.reverse().join("");
			} else {
				kanji += unlifted;
				kana += unlifted;
			};
		} else {
			const text = content.text().trim();
			if (text) {
				kanji += text;
				kana += text;
			};
		};
	};

	return { kanji, kana };
};

/**
 * Normalizes a sentence element.
 * @param sentenceElement The sentence element to normalize.
 * @returns The normalized sentence element.
 */
function normalizeSentenceElement(sentenceElement: any): CheerioAPI {
	const sentenceHtml = sentenceElement.html();
	const normalizedSentenceHtml = sentenceHtml.replace(
		/(?<=<\/li>)\s*([^\s<>]+)\s*(?=<li)/g,
		(m: any, g1: string) => `<li class="clearfix"><span class="unlinked">${g1}</span></li>`
	);
	const result = load(normalizedSentenceHtml);
	return result;
}

/**
 * Gets the pieces of a sentence.
 * @param sentenceElement The sentence element to parse.
 * @returns The pieces of the sentence.
 */
function getPieces(sentenceElement: any): ExampleSentencePiece[] {
	const pieceElements = normalizeSentenceElement(sentenceElement)("li.clearfix");
	const pieces = [];
	for (let pieceIndex = 0; pieceIndex < pieceElements.length; pieceIndex += 1) {
		const pieceElement = pieceElements.eq(pieceIndex);

		pieces.push({
			lifted: pieceElement.children(".furigana").text(),
			unlifted: pieceElement.children(".unlinked").text(),
		});
	};

	return pieces;
};

/**
 * Parses an example div.
 * @param div 
 * @returns The parsed example div.
 */
function parseExampleDiv(div: any): ExampleResultData {
	const english = div.find(".english").text();
	const { kanji, kana } = getKanjiAndKana(div);
	return { english, kanji, kana, pieces: getPieces(div) };
};

/**
 * Parses the data from an example page.
 * @param pageHtml The HTML of the page.
 * @param phrase The phrase to search for.
 * @returns The parsed data from the page.
 */
function parseExamplePageData(pageHtml: string, phrase: string): ExampleResults & { phrase: string } {
	const $ = load(pageHtml);
	const divs = $(".sentence_content");

	const results = [];
	for (let i = 0; i < divs.length; i += 1) {
		const div = divs.eq(i);
		results.push(parseExampleDiv(div));
	};

	return { query: phrase, found: results.length > 0, results, uri: uriForExampleSearch(phrase), phrase };
}


/* -------------------------------------------------------------------------- */
/*                        PHRASE SCRAPE FUNCTIONALITIES                       */
/* -------------------------------------------------------------------------- */

/**
 * Gets the tags from a page.
 * @param $ CheerioAPI object.
 * @returns The list of tags.
 */
function getTags($: CheerioAPI): string[] {
	const tags = [];

	const tagElements = $(".concept_light-tag");
	for (let i = 0; i < tagElements.length; i += 1) {
		const tagText = tagElements.eq(i).text();
		tags.push(tagText);
	}

	return tags;
};

/**
 * Gets the meanings, other forms, and notes from a page.
 * @param $ CheerioAPI object.
 * @returns The meanings, other forms, and notes.
 */
function getMeaningsOtherFormsAndNotes($: CheerioAPI):
	{ otherForms: { kanji: string; kana: string }[]; notes: string[], meanings: PhraseScrapeMeaning[] } {
	const returnValues = { otherForms: [], notes: [], meanings: [] } as {
		otherForms: { kanji: string; kana: string }[];
		notes: string[];
		meanings: PhraseScrapeMeaning[];
	};

	const meaningsWrapper = $("#page_container > div > div > article > div > div.concept_light-meanings.medium-9.columns > div");
	const meaningsChildren = meaningsWrapper.children();
	const meanings = [];

	let mostRecentWordTypes = [] as string[];
	for (let mi = 0; mi < meaningsChildren.length; mi += 1) {
		const child = meaningsChildren.eq(mi);
		if (child.hasClass("meaning-tags")) {
			mostRecentWordTypes = child.text().split(",").map((s: string) => s.trim().toLowerCase());
		} else if (mostRecentWordTypes[0] === "other forms") {
			returnValues.otherForms = child.text().split("、").map((s: string) => s.replace("【", "").replace("】", "").split(" "))
																	.map((a: string[]) => ({ kanji: a[0], kana: a[1] }));
		} else if (mostRecentWordTypes[0] === "notes") {
			returnValues.notes = child.text().split("\n");
		} else {
			const meaning = child.find(".meaning-meaning").text();
			const meaningAbstract = child.find(".meaning-abstract").find("a").remove().end().text();

			const supplemental = child.find(".supplemental_info").text().split(",").map((s: string) => s.trim()).filter((s: string) => s);

			const seeAlsoTerms = [];
			for (let i = supplemental.length - 1; i >= 0; i -= 1) {
				const supplementalEntry = supplemental[i];
				if (supplementalEntry.startsWith("See also")) {
					seeAlsoTerms.push(supplementalEntry.replace("See also ", ""));
					supplemental.splice(i, 1);
				};
			};

			const sentences = [];
			const sentenceElements = child.find(".sentences").children(".sentence");

			for (let si = 0; si < sentenceElements.length; si += 1) {
				const sentenceElement = sentenceElements.eq(si);

				const english = sentenceElement.find(".english").text();
				const pieces = getPieces(sentenceElement);
				const japanese = sentenceElement.find(".english").remove().end().find(".furigana").remove().end().text();
				sentences.push({ english, japanese, pieces });
			}

			meanings.push({
				seeAlsoTerms,
				sentences,
				definition: meaning,
				supplemental,
				definitionAbstract: meaningAbstract,
				tags: mostRecentWordTypes,
			});
		};
	};

	returnValues.meanings = meanings;

	return returnValues;
};

/**
 * Gets the audio files from a page.
 * @param $ CheerioAPI object.
 * @returns The audio files.
 */
function getAudio($: CheerioAPI): AudioFile[] {
	const audio: AudioFile[] = [];

	$(".concept_light-status").find("audio > source").each((_: any, element: any) => {
		const file = { uri: `https:${element.attribs.src}`, mimetype: element.attribs.type } as AudioFile;
		audio.push(file);
	});

	return audio;
};

/**
 * Provides a URI to search for a phrase.
 * @param searchTerm The term to search for.
 * @returns The URI to search for the term.
 */
function uriForPhraseScrape(searchTerm: string): string {
	return `https://jisho.org/word/${encodeURIComponent(searchTerm)}`;
};

/**
 * Parses the data from a phrase page.
 * @param pageHtml The HTML of the page.
 * @param query The query to search for.
 * @returns The parsed data from the page.
 */
function parsePhrasePageData(pageHtml: string, query: string): ScrapeParseResult {
	const $ = load(pageHtml);
	const { meanings, otherForms, notes } = getMeaningsOtherFormsAndNotes($);
	const audio = getAudio($);

	const result = {
		found: true,
		query,
		uri: uriForPhraseScrape(query),
		tags: getTags($),
		meanings,
		otherForms,
		audio,
		notes,
	};

	return result;
};


/* -------------------------------------------------------------------------- */
/*                              CLASS CONSTRUCTOR                             */
/* -------------------------------------------------------------------------- */
/**
 * A wrapper around the Jisho search functions.
 * @class
 * @implements {API}
 */
class JishoAPI implements API {
	getUriForKanjiSearch = uriForKanjiSearch;
	getUriForExampleSearch = uriForExampleSearch;
	getUriForPhraseSearch = uriForPhraseSearch;
	getUriForPhraseScrape = uriForPhraseScrape;

	parseExamplePageHtml = parseExamplePageData;
	parseKanjiPageHtml = parseKanjiPageData;
	parsePhraseScrapeHtml = parsePhrasePageData;

	/**
	 * Query the official Jisho API for a word or phrase.
	 * @param phrase The search term to search for.
	 * @param page The page number to search in. If not provided, all pages will be searched.
	 * @returns The response data from the official Jisho.org API.
	 * @async
	 */
	searchForPhrase(phrase: string, page?: string): Promise<JishoAPIResult> {
		let uri;
		uri = page ? uriForPhraseSearch(phrase, page) : uriForPhraseSearch(phrase);

		// Search for all pages if page is not provided.
		// TODO: Fix this to prevent DDoS.
		// if (!page) {
		// 	const promises = [];
			
		// 	// Search for all pages.
		// 	// TODO: Find a better way to do this.
		// 	for (let i = 1; i <= 2; i += 1) {
		// 		try {
		// 			promises.push(
		// 				axios
		// 					.get(uriForPhraseSearch(phrase, i.toString()))
		// 					.then((response) => response.data)
		// 			);
		// 		} catch (err: any) {
		// 			break;
		// 		};
		// 	};

		// 	// Get all promises and merge results into one.
		// 	return Promise.all(promises).then((results) => {
		// 		const mergedResult = {
		// 			data: [] as JishoResult[],
		// 			meta: { status: 200 },
		// 		} as JishoAPIResult;

		// 		for (let i = 0; i < results.length; i += 1) {
		// 			const result = results[i];
		// 			mergedResult.data = mergedResult.data.concat(result.data);
		// 		};

		// 		return mergedResult;
		// 	});
		// };

		return axios.get(uri).then((response) => response.data);
	};

	/**
	 * Scrape the word page for a word/phrase. This allows you to
	 * get some information that isn't provided by the official API, such as
	 * part-of-speech and JLPT level. However, the official API should be preferred
	 * if it has the information you need. This function scrapes https://jisho.org/word/XXX.
	 * In general, you'll want to include kanji in your search term, for example 掛かる
	 * instead of かかる (no results).
	 * @param phrase The search term to search for.
	 * @returns Information about the searched query.
	 * @async
	 */
	async scrapeForPhrase(phrase: string): Promise<PhrasePageScrapeResult | ScrapeParseResult> {
		const uri = uriForPhraseScrape(phrase);
		try {
			const response = await axios.get(uri);
			return parsePhrasePageData(response.data, phrase);
		} catch (err: any) {
			if (err.response && err.response.status === 404)
				return { query: phrase, found: false };

			throw err;
		};
	};

	/**
	 * Scrape Jisho.org for information about a kanji character.
	 * @param kanji The kanji to search for.
	 * @returns Information about the searched kanji.
	 * @async
	 */
	searchForKanji(kanji: string): Promise<KanjiParseResult> {
		const uri = uriForKanjiSearch(kanji);
		return axios.get(uri).then((response) => parseKanjiPageData(response.data, kanji));
	};

	/**
	 * Scrape Jisho.org for examples.
	 * @param phrase The word or phrase to search for.
	 * @returns Information about the searched phrase.
	 * @async
	 */
	searchForExamples(phrase: string): Promise<ExampleParseResult> {
		const uri = uriForExampleSearch(phrase);
		return axios.get(uri).then((response) => parseExamplePageData(response.data, phrase));
	};
};

export default JishoAPI;
