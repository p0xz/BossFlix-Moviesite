import type { PageServerLoad } from './$types';
import type { AdvancedSearchTitlesVariables } from '$lib/graphql/types/variables';
import { ADVANCED_SEARCH_TITLES_QUERY } from '$lib/graphql/media';
import { fetchGraphQL } from '$lib/server/api';
import { SearchQueryBuilder } from '$lib/server/query/advancedSearchTitles/search.builder';
import { DEFAULT_PAGE_SIZE } from '$lib/core/config/pagination.config';

export const load = (async ({ url }) => {
	const searchParams = url.searchParams;

	const searchQueryBuilder = new SearchQueryBuilder()
		.withGenres(searchParams.get('genres'))
		.withTitles(searchParams.get('titles'))
		.withReleaseYear(searchParams.get('releaseYearFrom'), searchParams.get('releaseYearTo'))
		.withRating(searchParams.get('rating'))
		.withSorting(
			searchParams.get('sortBy') as AdvancedSearchTitlesVariables['sortBy'] | null,
			searchParams.get('sortOrder') as AdvancedSearchTitlesVariables['sortOrder'] | null,
		)
		.withPagination({
			page: Number(searchParams.get('page') || '1'),
			pageSize: DEFAULT_PAGE_SIZE,
		});

	const variables = searchQueryBuilder.build();

	const advancedSearchPromise = fetchGraphQL(ADVANCED_SEARCH_TITLES_QUERY, variables);

	return {
		advancedSearch: advancedSearchPromise,
	};
}) satisfies PageServerLoad;
