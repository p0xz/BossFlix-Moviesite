import { getLastWeekDateISO } from '$lib/core/utils/date';
import { transformHomeToUI } from '$lib/features/media/logic/transformer';
import { ADVANCED_SEARCH_TITLES_QUERY } from '$lib/graphql/media';
import { fetchGraphQL } from '$lib/server/api';
import { SearchQueryBuilder } from '$lib/server/query/advancedSearchTitles/search.builder';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	const query = url.searchParams.get('q')?.trim();

	if (!query) {
		return { search: [] };
	}

	const searchQueryBuilder = new SearchQueryBuilder()
		.withRating('0.0')
		.withSearchTerm(query)
		.withReleaseYear('1900', getLastWeekDateISO());

	const variables = searchQueryBuilder.build();

	const advancedSearch = await fetchGraphQL(ADVANCED_SEARCH_TITLES_QUERY, variables);
	const transformedAdvancedSearch = transformHomeToUI(advancedSearch.advancedTitleSearch.edges);

	return {
		search: transformedAdvancedSearch,
	};
}) satisfies PageServerLoad;
