export interface GetShowTitleVariables {
	id: string;
	season: string;
	after?: string;
	first?: number;
	full?: boolean;
	includeEpisodes?: boolean;
}

export interface GetTitleVariables {
	id: string;
}

export interface GetTotalShowsEpisodesVariables {
	id: string;
}

export interface AdvancedSearchTitlesVariables {
	first?: number;
	jumpToPosition?: number;
	titleType?: string[];
	searchTerm?: string;
	sortBy?:
		| 'POPULARITY'
		| 'TITLE_REGIONAL'
		| 'USER_RATING'
		| 'USER_RATING_COUNT'
		| 'BOX_OFFICE_GROSS_DOMESTIC'
		| 'RUNTIME'
		| 'YEAR'
		| 'RELEASE_DATE';
	genreIds?: string[];
	sortOrder?: 'ASC' | 'DESC';
	minRating?: number;
	releaseDateStart?: string;
	releaseDateEnd?: string;
}

export interface GetSeasonEpisodesVariables {
	id: string;
	season: string;
	after?: string;
	first?: number;
}
