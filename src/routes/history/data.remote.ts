import { query } from '$app/server';
import { IMDB_API_URL, queries, type Imdb } from '$lib';
import { type } from 'arktype';

export const getTitles = query(type('string[]'), async (ids: string[]) => {
	const variables = { ids };
	const response = await fetch(IMDB_API_URL, {
		headers: {
			'accept-language': 'en-US,en;q=0.9,sk;q=0.8',
			'content-type': 'application/json',
			'x-imdb-user-language': 'en-US',
			'Cache-Control': 'no-cache',
		},
		body: JSON.stringify({ query: queries.history, variables }),
		method: 'POST',
	}).then(
		(res) =>
			res.json() as Promise<{
				data: { titles: (Omit<Imdb.Movie, 'directors'> & { primaryImage: Imdb.primaryImage })[] };
			}>,
	);

	return {
		history: response.data.titles,
	};
});
