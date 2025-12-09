import { getLastWeekDateISO } from '$lib/core/utils/date';
import type { AdvancedSearchTitlesVariables } from '$lib/graphql/types/variables';

export const SEARCH_QUERY_OPTIONS = {
	first: 30,
	jumpToPosition: 1,
	titleType: ['movie', 'tvSeries'],
	sortBy: 'POPULARITY',
	searchTerm: '',
	sortOrder: 'ASC',
	genreIds: [] as string[],
	minRating: 0.0,
	releaseDateStart: '2000-01-01',
	releaseDateEnd: getLastWeekDateISO(),
} as AdvancedSearchTitlesVariables;
