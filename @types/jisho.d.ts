/**
 * Type definition for a meaning scraped from a phrase page.
 */
type PhraseScrapeMeaning = {
	seeAlsoTerms: string[];
	sentences: PhraseScrapeSentence[];
	definition: string;
	supplemental: string[];
	definitionAbstract: string;
	tags: string[];
};

/**
 * Type definition for the result of a phrase scrape.
 */
type PhrasePageScrapeResult = {
	found: boolean;
	query: string;
	uri?: string;
	otherForms?: PhraseScrapeJapaneseWord[];
	meanings?: PhraseScrapeMeaning[];
	tags?: string[];
	audio?: AudioFile[];
	notes?: string[];
};

/**
 * Type definition for the result of a kanji search.
 */
type KanjiResult = {
	found: boolean;
	query: string;
	taughtIn?: string;
	jlptLevel?: string;
	newspaperFrequencyRank?: number;
	strokeCount?: number;
	meaning?: string;
	kunyomi?: string[];
	kunyomiExamples?: YomiExample[];
	onyomi?: string[];
	onyomiExamples?: YomiExample[];
	radical?: Radical;
	parts?: string[];
	strokeOrderDiagramUri?: string;
	strokeOrderSvgUri?: string;
	strokeOrderGifUri?: string;
	uri?: string;
};

/**
 * Type definition for a piece of a sentence scraped from an example page.
 */
type ExampleSentencePiece = {
	unlifted: string;
	lifted: string;
};

/**
 * Type definition for the result of an example search.
 */
type ExampleResultData = {
	kanji: string;
	kana: string;
	english: string;
	pieces: ExampleSentencePiece[];
};

/**
 * Type definition for the result of an example search.
 */
type ExampleResults = {
	query: string;
	found: boolean;
	uri: string;
	results: ExampleResultData[];
};

/**
 * Type definition for the result of a phrase search.
 */
type Radical = {
	symbol: string;
	forms?: string[];
	meaning: string;
};

/**
 * Type definition for a yomi example scraped from a kanji page.
 */
type YomiExample = {
	example: string;
	reading: string;
	meaning: string;
};

/**
 * Type definition for a piece of a word scraped from a phrase page.
 */
type Piece = {
	lifted: string;
	unlifted: string;
};

/**
 * Type definition for a Japanese word scraped from a phrase page.
 */
type Result = {
	english: string;
	kanji: string;
	kana: string;
	pieces: Piece[];
};

/**
 * Type definition for the result of a query.
 */
type QueryResult = {
	query: string;
	found: boolean;
	uri: string;
};

/**
 * Type definition for the result of a phrase search.
 */
type ExampleParseResult = {
	results: Result[];
	phrase: string;
} & QueryResult;

/**
 * Type definition for the result of a kanji search.
 */
type KanjiParseResult = {
	taughtIn: string;
	jlptLevel: string;
	newspaperFrequencyRank: string;
	strokeCount: string;
	meaning: string;
	kunyomi: string[];
	onyomi: string[];
	onyomiExamples: YomiExample[];
	kunyomiExamples: YomiExample[];
	radical: Radical;
	parts: string[];
	strokeOrderDiagramUri: string;
	strokeOrderSvgUri: string;
	strokeOrderGifUri: string;
} & QueryResult;

/**
 * Type definition for a piece of a sentence scraped from an example page.
 */
type PhraseScrapeSentence = {
	english: string;
	japanese: string;
	pieces: Piece[];
};

/**
 * Type definition for a meaning scraped from a phrase page.
 */
type PhaseScrapeMeaning = {
	seeAlsoTerms: string[];
	definition: string;
	supplemental: string[];
	definitionAbstract: string;
	tags: string[];
	sentences: PhraseScrapeSentence[];
};

/**
 * Type definition for a Japanese word scraped from a phrase page.
 */
type PhraseScrapeJapaneseWord = {
	kanji: string;
	kana: string;
};

/**
 * Type definition for an audio file scraped from a phrase page.
 */
type AudioFile = {
	uri: string;
	mimetype: string;
};

/**
 * Type definition for the result of a phrase scrape.
 */
type ScrapeParseResult = {
	tags: string[];
	meanings: PhaseScrapeMeaning[];
	otherForms: PhraseScrapeJapaneseWord[];
	audio: AudioFile[];
	notes: string[];
} & QueryResult;

/**
 * Type definition for a Japanese word scraped from a phrase page.
 */
type JishoJapaneseWord = {
	word: string;
	reading: string;
};

/**
 * Type definition for a link scraped from a phrase page.
 */
type JishoSenseLink = {
	text: string;
	url: string;
};

/**
 * Type definition for a source scraped from a phrase page.
 */
type JishoWordSource = {
	language: string;
	word: string;
};

/**
 * Type definition for a meaning scraped from a phrase page.
 */
type JishoWordSense = {
	english_definitions: string[];
	parts_of_speech: string[];
	links: JishoSenseLink[];
	tags: string[];
	see_also: string[];
	antonyms: string[];
	source: JishoWordSource[];
	info: string[];
	restrictions: string[];
};

/**
 * Type definition for the attribution scraped from a phrase page.
 */
type JishoAttribution = {
	jmdict: boolean;
	jmnedict: boolean;
	dbpedia: boolean;
};

/**
 * Type definition for the result of a phrase search.
 */
type JishoResult = {
	slug: string;
	is_common: boolean;
	tags: string[];
	jlpt: string[];
	japanese: JishoJapaneseWord[];
	senses: JishoWordSense[];
	attribution: JishoAttribution;
};

/**
 * Type definition for the result of a phrase search.
 */
type JishoAPIResult = {
	meta: {
		status: number;
	};

	data: JishoResult[];
};

/**
 * API class for interacting with the Jisho API.
 */
declare class API {
	constructor();

	getUriForExampleSearch(phrase: string): string;
	getUriForKanjiSearch(kanji: string): string;
	getUriForPhraseScrape(searchTerm: string): string;
	getUriForPhraseSearch(phrase: string): string;

	parseExamplePageHtml(pageHtml: string, phrase: string): ExampleParseResult;
	parseKanjiPageHtml(pageHtml: string, kanji: string): KanjiParseResult;
	parsePhraseScrapeHtml(pageHtml: string, query: string): ScrapeParseResult;

	scrapeForPhrase(
		phrase: string
	): Promise<PhrasePageScrapeResult | ScrapeParseResult>;
	searchForExamples(phrase: string): Promise<ExampleParseResult>;
	searchForKanji(kanji: string): Promise<KanjiParseResult>;
	searchForPhrase(phrase: string, page?: string): Promise<JishoAPIResult>;
}
