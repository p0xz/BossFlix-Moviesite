import type { PageServerLoad } from './$types';
import type { Imdb } from '$lib/types';
import { gq, IMDB_API_URL } from '$lib';
import { MAX_API_PAGE, MAX_RESULT_WINDOW, PAGE_SIZE } from '$lib/utils/imdb';

export const load = (async ({ fetch, url }) => {
	const searchParams = url.searchParams;

	const genres = searchParams.get('genres')?.split(' ').filter(Boolean);

	const releaseYearFrom = parseInt(searchParams.get('releaseYearFrom') ?? '') || undefined;
	const releaseYearTo = parseInt(searchParams.get('releaseYearTo') ?? '') || undefined;
	const rating = parseFloat(searchParams.get('rating') ?? '') || 0;

	const page = Number(searchParams.get('page') || '1') || 1;
	const safePage = Math.min(Math.max(page, 1), MAX_API_PAGE);

	const maxJumpToPosition = MAX_RESULT_WINDOW - PAGE_SIZE + 1;
	const jumpToPosition = 1 + (safePage - 1) * PAGE_SIZE;
	const safeJumpToPosition = Math.min(jumpToPosition, maxJumpToPosition);

	const variables = {
		first: PAGE_SIZE,
		titleType: ['movie'],
		sortBy: 'POPULARITY',
		sortOrder: 'ASC',
		genreIds: genres,
		minRating: rating,
		jumpToPosition: safeJumpToPosition,
		releaseDateStart: releaseYearFrom ? `${releaseYearFrom}-01-01` : '1900-01-01',
		releaseDateEnd: releaseYearTo ? `${releaseYearTo}-12-31` : `${new Date().getFullYear()}-12-31`,
	};

	const response = fetch(IMDB_API_URL, {
		headers: {
			'accept-language': 'en-US,en;q=0.9,sk;q=0.8',
			'content-type': 'application/json',
			'x-imdb-user-language': 'en-US',
		},
		body: JSON.stringify({ query: gq.advancedSearchTitles, variables }),
		method: 'POST',
	}).then((res) => res.json() as Promise<{ data: { advancedTitleSearch: Imdb.Search.AdvancedTitleSearch } }>);

	// console.dir(await response, { depth: Infinity });

	return {
		advancedSearch: response,
	};
}) satisfies PageServerLoad;
