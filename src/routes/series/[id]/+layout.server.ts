import type { LayoutServerLoad } from './$types';
import { queries, type Imdb } from '$lib';

export const load = (async ({ params, url, fetch, untrack }) => {
	const season = untrack(() => url.searchParams.get('season') ?? '1');

	const variables = {
		id: params.id,
		season,
		after: null,
		first: 50,
		full: true,
		includeEpisodes: false,
	};

	type extractedSeasons = Omit<Imdb.Series['episodes'], 'episodes'>;
	type seriesMeta = Omit<Imdb.Series, 'episodes'> & { episodes: extractedSeasons };

	const response = await fetch('https://caching.graphql.imdb.com/', {
		headers: {
			'accept-language': 'en-US,en;q=0.9,sk;q=0.8',
			'content-type': 'application/json',
			'x-imdb-user-language': 'en-US',
			'Cache-Control': 'no-cache',
		},
		body: JSON.stringify({ query: queries.seasonEpisodes, variables }),
		method: 'POST',
	}).then(
		(res) =>
			res.json() as Promise<{
				data: {
					title: seriesMeta;
				};
			}>,
	);
	// console.log(response.data.title);

	return {
		seriesMeta: response.data.title,
	};
}) satisfies LayoutServerLoad;
