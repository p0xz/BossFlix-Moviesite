import type { PageServerLoad } from './$types';
import { fetchGraphQL } from '$lib/server/api';
import { GET_TITLE_QUERY } from '$lib/graphql/media';
import { getMovieMetadata } from '$lib/features/media/logic/transformer';

export const load = (async ({ params }) => {
	const variables = {
		id: params.id,
	};

	const response = await fetchGraphQL(GET_TITLE_QUERY, variables);

	return {
		movie: getMovieMetadata(response.title),
	};
}) satisfies PageServerLoad;
