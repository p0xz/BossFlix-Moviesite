import type { PageServerLoad } from './$types';
import { fetchGraphQL } from '$lib/server/api';
import { ADVANCED_SEARCH_TITLES_QUERY } from '$lib/graphql/media';
import { transformHomeToUI } from '$lib/features/media/logic/transformer';
import { getLastWeekDateISO } from '$lib/core/utils/date';
import { SearchQueryBuilder } from '$lib/server/query/advancedSearchTitles/search.builder';

let cache: {
	data: ReturnType<typeof transformHomeToUI>;
	timestamp: number;
} = {
	data: [],
	timestamp: 0,
};

const CACHE_TTL = 60 * 1000; // 60 Seconds

export const load = (async ({ setHeaders }) => {
	const now = Date.now();

	setHeaders({
		'cache-control': 'public, max-age=60',
	});

	if (cache.data.length && now - cache.timestamp < CACHE_TTL) {
		return {
			advancedSearch: cache.data,
			featuredIndex: Math.floor(Math.random() * cache.data.length),
		};
	}

	const searchQueryBuilder = new SearchQueryBuilder()
		.withRating('6.0')
		.withReleaseYear((new Date().getFullYear() - 5).toString(), getLastWeekDateISO());

	const variables = searchQueryBuilder.build();

	const advancedSearch = await fetchGraphQL(ADVANCED_SEARCH_TITLES_QUERY, variables);
	const transformedAdvancedSearch = transformHomeToUI(advancedSearch.advancedTitleSearch.edges);

	cache = {
		data: transformedAdvancedSearch,
		timestamp: now,
	};

	return {
		advancedSearch: transformedAdvancedSearch,
		featuredIndex: Math.floor(Math.random() * transformedAdvancedSearch.length),
	};
}) satisfies PageServerLoad;
