import type { RequestHandler } from './$types';
import { fetchGraphQL } from '$lib/server/api';
import { json } from '@sveltejs/kit';
import { ADVANCED_SEARCH_TITLES_QUERY } from '$lib/graphql/media';

export const GET: RequestHandler = async () => {
	return new Response();
};
