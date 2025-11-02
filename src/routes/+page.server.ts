import { queries, type Imdb } from '$lib';
import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const media = <string>formData.get('media');

		if (!media || media.trim().length === 0 || typeof media !== 'string') {
			return { search: undefined };
		}

		const variables = {
			searchTerm: media,
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
	},
} satisfies Actions;
