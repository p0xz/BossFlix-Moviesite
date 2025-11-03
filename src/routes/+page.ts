import type { Imdb } from '$lib';
import type { PageLoad } from './$types';

export const load = (async ({ url, fetch }) => {
	const query = url.searchParams.get('query') ?? '';

	if (!query.trim()) {
		return { search: null };
	}

	const response = await fetch(`/api/search${url.search}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((res) => res.json() as Promise<{ search: Imdb.Search.MainSearch }>);

	return { search: response.search };
}) satisfies PageLoad;
