import type { PageServerLoad } from './$types';
import { IMDB_API_URL, gq } from '$lib';
import { type Imdb } from '$lib/types';

export const load = (async ({ params, url, fetch, parent, depends, untrack }) => {
	const parentDataPromise = parent();

	const season = untrack(() => url.searchParams.get('season') ?? '1');

	const variables = {
		id: params.id,
		season,
		after: null,
		first: 50,
		full: false,
	};

	const episodeDataPromise = fetch(IMDB_API_URL, {
		headers: {
			'accept-language': 'en-US,en;q=0.9,sk;q=0.8',
			'content-type': 'application/json',
			'x-imdb-user-language': 'en-US',
		},
		body: JSON.stringify({ query: gq.seasonEpisodes, variables }),
		method: 'POST',
	}).then((res) => res.json() as Promise<{ data: { title: Omit<Pick<Imdb.Series, 'episodes'>, 'seasons'> } }>);

	// Wait for the parent i.e layout load and also the 'child' to wait in parallel
	const [, episodeResponse] = await Promise.all([parentDataPromise, episodeDataPromise]);

	depends('app:episodes');

	return {
		seriesEpisodes: episodeResponse.data.title?.episodes,
	};
}) satisfies PageServerLoad;
