import { gq, IMDB_API_URL } from '$lib';
import type { Imdb } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
	const variables = {
		first: 25,
		titleType: ['movie'],
		sortBy: 'POPULARITY',
		sortOrder: 'ASC',
	};

	const response = fetch(IMDB_API_URL, {
		headers: {
			'accept-language': 'en-US,en;q=0.9,sk;q=0.8',
			'content-type': 'application/json',
			'x-imdb-user-language': 'en-US',
		},
		body: JSON.stringify({ query: gq.advancedSearchTitles, variables }),
		method: 'POST',
	}).then((res) => res.json() as Promise<{ data: { advancedTitleSearch: Imdb.Search.AdvancedTitleSearch } }>);

	// console.dir(response, { depth: Infinity });

	return {
		movies: response,
	};
}) satisfies PageServerLoad;
