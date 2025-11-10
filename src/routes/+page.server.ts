import type { PageServerLoad } from './$types';
import { queries, type Imdb } from '$lib';

export const load = (async ({ url }) => {
	const query = url.searchParams.get('query') ?? '';

	if (!query.trim()) {
		return { search: null };
	}

	const variables = {
		searchTerm: query,
		first: 10,
		exact: false,
		type: '',
	};

	const response = await fetch('https://caching.graphql.imdb.com/', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'accept-language': 'en-US,en;q=0.9',
			'x-imdb-user-language': 'en-US',
		},
		body: JSON.stringify({ query: queries.searchTitles, variables }),
	}).then((res) => res.json() as Promise<{ data: { mainSearch: Imdb.Search.MainSearch } }>);
	// console.dir(response, { depth: Infinity });
	return { search: response.data.mainSearch };
}) satisfies PageServerLoad;
