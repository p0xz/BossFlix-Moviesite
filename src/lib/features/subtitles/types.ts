export interface OpenSubtitles {
	MatchedBy: string;
	IDSubMovieFile: string;
	MovieHash: string;
	MovieByteSize: string;
	MovieTimeMS: string;
	IDSubtitleFile: string;
	SubFileName: string;
	SubActualCD: string;
	SubSize: string;
	SubHash: string;
	SubLastTS: string;
	SubTSGroup: string;
	InfoReleaseGroup: string;
	InfoFormat: string;
	InfoOther: string;
	IDSubtitle: string;
	UserID: string;
	SubLanguageID: string;
	SubFormat: string;
	SubSumCD: string;
	SubAuthorComment: string;
	SubAddDate: string;
	SubBad: string;
	SubRating: string;
	SubSumVotes: string;
	SubDownloadsCnt: string;
	MovieReleaseName: string;
	MovieFPS: string;
	IDMovie: string;
	IDMovieImdb: string;
	MovieName: string;
	MovieNameEng: any;
	MovieYear: string;
	MovieImdbRating: string;
	SubFeatured: string;
	UserNickName: string;
	SubTranslator: string;
	ISO639: string;
	LanguageName: string;
	SubComments: string;
	SubHearingImpaired: string;
	UserRank: string;
	SeriesSeason: string;
	SeriesEpisode: string;
	MovieKind: string;
	SubHD: string;
	SeriesIMDBParent: string;
	SubEncoding: string;
	SubAutoTranslation: string;
	SubForeignPartsOnly: string;
	SubFromTrusted: string;
	QueryCached: number;
	SubTSGroupHash: string;
	SubDownloadLink: string;
	ZipDownloadLink: string;
	SubtitlesLink: string;
	QueryNumber: string;
	QueryParameters: QueryParameters;
	Score: number;
}

export interface QueryParameters {
	episode: number;
	season: number;
	imdbid: string;
	sublanguageid: string;
}

// ============================================
// Subtitle Player Types
// ============================================

import type { SubtitleLanguage } from './subtitles';

export interface SubtitleSource {
	/** OpenSubtitles ID */
	id: string;
	/** Display name (e.g., release name) */
	name: string;
	/** Original download URL from OpenSubtitles */
	downloadUrl: string;
	/** VTT blob URL after download and conversion */
	vttUrl?: string;
	/** Raw VTT text content for custom rendering */
	vttContent?: string;
	/** Timing offset in milliseconds */
	offsetMs: number;
	/** Download count from OpenSubtitles */
	downloads: number;
	/** Rating from OpenSubtitles */
	rating: string;
	/** Is this source currently loading? */
	isLoading?: boolean;
}

export interface SubtitleLanguageData {
	/** Display label (e.g., "English") */
	label: string;
	/** Index of active source in sources array, null if none active */
	activeSourceIndex: number | null;
	/** Available subtitle sources for this language */
	sources: SubtitleSource[];
	/** Are sources currently being fetched? */
	isLoading: boolean;
	/** Has this language been fetched already? */
	hasFetched: boolean;
}

export type SubtitlesState = Record<SubtitleLanguage, SubtitleLanguageData>;

