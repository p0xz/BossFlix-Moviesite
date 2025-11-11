import type { PageServerLoad } from './$types';
import { gq, IMDB_API_URL } from '$lib';
import { type Imdb } from '$lib/types';

export const load = (async ({ params }) => {
	const variables = {
		id: params.id,
	};

	const response = await fetch(IMDB_API_URL, {
		headers: {
			'accept-language': 'en-US,en;q=0.9,sk;q=0.8',
			'content-type': 'application/json',
			'x-imdb-user-language': 'en-US',
		},
		body: JSON.stringify({ query: gq.title, variables }),
		method: 'POST',
	}).then((res) => res.json() as Promise<{ data: { title: Imdb.Movie } }>);

	return {
		movie: response.data.title,
	};
}) satisfies PageServerLoad;
