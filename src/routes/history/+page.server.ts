import type { PageServerLoad } from './$types';
import { watchedStore, IMDB_API_URL, queries, type Imdb } from '$lib';

export const load = (async () => {
	const variables = {
		ids: ['tt3107288'],
	};

	const response = await fetch(IMDB_API_URL, {
		headers: {
			'accept-language': 'en-US,en;q=0.9,sk;q=0.8',
			'content-type': 'application/json',
			'x-imdb-user-language': 'en-US',
			'Cache-Control': 'no-cache',
		},
		body: JSON.stringify({ query: queries.history, variables }),
		method: 'POST',
	}).then((res) => res.json() as Promise<{ data: { title: Imdb.Movie } }>);

	console.dir(response, { depth: Infinity });

	return {};
}) satisfies PageServerLoad;
