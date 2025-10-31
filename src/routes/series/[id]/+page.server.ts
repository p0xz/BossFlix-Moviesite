import type { PageServerLoad } from './$types';
import { IMDB_API_URL, queries, type Imdb } from '$lib';

export const load = (async ({ params, url, fetch, parent, depends, untrack }) => {
	await parent();

	const season = untrack(() => url.searchParams.get('season') ?? '1');

	const variables = {
		id: params.id,
		season,
		after: null,
		first: 50,
		full: false
	};

	const response = await fetch(IMDB_API_URL, {
		headers: {
			'accept-language': 'en-US,en;q=0.9,sk;q=0.8',
			'content-type': 'application/json',
			'x-imdb-user-language': 'en-US',
			'Cache-Control': 'no-cache'
		},
		body: JSON.stringify({ query: queries.seasonEpisodes, variables }),
		method: 'POST'
	}).then(
		(res) =>
			res.json() as Promise<{ data: { title: Omit<Pick<Imdb.Series, 'episodes'>, 'seasons'> } }>
	);

	depends('app:episodes');

	return {
		seriesEpisodes: response.data.title?.episodes
	};
}) satisfies PageServerLoad;
