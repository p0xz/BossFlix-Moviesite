import type { PageServerLoad } from './$types';
import { queries, IMDB_API_URL, type Imdb } from '$lib';

export const load = (async ({ params }) => {
	const variables = {
		id: params.id
	};

	const response = await fetch(IMDB_API_URL, {
		headers: {
			'accept-language': 'en-US,en;q=0.9,sk;q=0.8',
			'content-type': 'application/json',
			'x-imdb-user-language': 'en-US'
		},
		body: JSON.stringify({ query: queries.title, variables }),
		method: 'POST'
	}).then((res) => res.json() as Promise<{ data: { title: Imdb.Movie } }>);

	return {
		movie: response.data.title
	};
}) satisfies PageServerLoad;
