import { GET_SHOW_TITLE_QUERY } from '$lib/graphql/media';
import { fetchGraphQL } from '$lib/server/api';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url, setHeaders }) => {
	const { id } = params;

	if (!id) {
		return json({ data: null, error: 'Missing series ID parameter' }, { status: 400 });
	}

	const seasonParam = Number(url.searchParams.get('season'));

	if (seasonParam && (isNaN(seasonParam) || seasonParam < 1)) {
		return json(
			{
				data: null,
				error: `Invalid season parameter: '${seasonParam}'. Must be a positive number`,
			},
			{ status: 400 },
		);
	}

	const isOnlyEpisodes = url.searchParams.get('onlyEpisodes') === 'true';

	const variables = {
		id,
		season: `${seasonParam}`,
		full: !isOnlyEpisodes,
	};

	try {
		const response = await fetchGraphQL(GET_SHOW_TITLE_QUERY, variables);

		setHeaders({
			'cache-control': 'public, max-age=60, stale-while-revalidate=30',
		});

		return json({
			series: response,
		});
	} catch (error) {
		console.error(`[API] Series Fetch Failed for ID: ${id}`, error);

		return json(
			{
				series: null,
				error: 'Failed to fetch series data upstream',
			},
			{ status: 502 },
		);
	}
};
