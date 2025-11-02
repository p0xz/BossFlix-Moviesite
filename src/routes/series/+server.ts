import type { RequestHandler } from './$types';
import { IMDB_API_URL, queries, type Imdb } from '$lib';

export const POST: RequestHandler = async ({ request }) => {
	const { id } = await request.json();

	const response = await fetch(IMDB_API_URL, {
		headers: {
			'accept-language': 'en-US,en;q=0.9,sk;q=0.8',
			'content-type': 'application/json',
			'x-imdb-user-language': 'en-US',
			'Cache-Control': 'no-cache',
		},
		body: JSON.stringify({ query: queries.totalEpisodes, variables: { id } }),
		method: 'POST',
	}).then(
		(res) =>
			res.json() as Promise<{ data: { title: { episodes: { episodes: { total: number } } } } }>,
	);

	// console.dir(response, { depth: Infinity });

	return new Response(
		JSON.stringify({ totalEpisodes: response.data.title.episodes.episodes.total }),
		{
			headers: { 'Content-Type': 'application/json' },
		},
	);
};
