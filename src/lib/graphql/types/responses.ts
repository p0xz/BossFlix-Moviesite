/**
 * 1. PRIMITIVES & GENERICS
 */

export interface ImdbText {
	text: string;
}

export interface ImdbPlainText {
	plainText: string;
}

export interface ImdbImage {
	url: string;
	width?: number;
	height?: number;
	type?: string;
}

export interface ImdbDate {
	day: number;
	month: number;
	year: number;
}

export interface ImdbRating {
	aggregateRating: number;
}

export interface ImdbRuntime {
	seconds: number;
}

export interface ImdbConnection<T> {
	edges: Array<{ node: T }>;
	pageInfo?: {
		hasNextPage: boolean;
		hasPreviousPage?: boolean;
		endCursor: string;
		startCursor?: string;
	};
	total?: number;
}

/**
 * 2. SHARED FRAGMENTS
 */

export interface GenreFragment {
	genre: ImdbText;
}

export interface DirectorFragment {
	name: { nameText: ImdbText };
}

export interface PlotFragment {
	plotText: ImdbPlainText;
}

export interface TitleTypeFragment {
	id: string;
	text: string;
}

/**
 * 3. CORE ENTITIES
 */

interface TitleBase {
	id: string;
	originalTitleText: ImdbText;
	titleText?: ImdbText;
	primaryImage?: ImdbImage;
	ratingsSummary?: ImdbRating;
	releaseDate?: ImdbDate;
	runtime?: ImdbRuntime;
	titleGenres?: { genres: GenreFragment[] };
	titleType?: TitleTypeFragment;
	certificate?: { rating: string } | null;
}

export interface EpisodeNode extends TitleBase {
	series?: {
		episodeNumber: {
			seasonNumber: number;
			episodeNumber: number;
		};
	};
	plots?: ImdbConnection<PlotFragment>;
}

/**
 * 4. OPERATION RESPONSES
 */

export interface GetShowTitleResponse {
	title: TitleBase & {
		releaseYear?: { endYear: number };
		directors?: ImdbConnection<DirectorFragment>;
		episodes: {
			seasons?: Array<{ number: number }>;
			seasonEpisodes: ImdbConnection<EpisodeNode>;
			allEpisodesTotal?: { total: number };
		};
	};
}

export interface GetShowTitleOnlyEpisodesResponse {
	title: {
		episodes: {
			seasonEpisodes: ImdbConnection<EpisodeNode>;
		};
	};
}

export interface GetTitleResponse {
	title: TitleBase & {
		plot?: PlotFragment;
		directors?: ImdbConnection<DirectorFragment>;
	};
}

export interface GetTotalShowsEpisodesResponse {
	title: {
		episodes: {
			episodes: { total: number };
		};
	};
}

export interface AdvancedSearchTitlesResponse {
	advancedTitleSearch: ImdbConnection<{
		title: TitleBase & {
			images: ImdbConnection<ImdbImage>;
		};
	}> & {
		total: number;
	};
}

export interface GetSeasonEpisodesResponse {
	title: {
		episodes: {
			seasonEpisodes: ImdbConnection<EpisodeNode>;
		};
	};
}
