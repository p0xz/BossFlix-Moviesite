import { GRAPHQL_ENDPOINT } from '$env/static/private';
import { ImdbError } from '$lib/core/exceptions/imdb.excp';

import {
	GET_SHOW_TITLE_QUERY,
	GET_TITLE_QUERY,
	GET_TOTAL_SHOWS_EPISODES_QUERY,
	ADVANCED_SEARCH_TITLES_QUERY,
	GET_SEASON_EPISODES_QUERY,
} from '$lib/graphql/media';

import type {
	GetShowTitleVariables,
	GetTitleVariables,
	GetTotalShowsEpisodesVariables,
	AdvancedSearchTitlesVariables,
	GetSeasonEpisodesVariables,
} from '$lib/graphql/types/variables';

import type {
	GetShowTitleResponse,
	GetTitleResponse,
	GetTotalShowsEpisodesResponse,
	AdvancedSearchTitlesResponse,
	GetSeasonEpisodesResponse,
} from '$lib/graphql/types/responses';

interface QueryMap {
	[GET_SHOW_TITLE_QUERY]: {
		variables: GetShowTitleVariables;
		response: GetShowTitleResponse;
	};
	[GET_TITLE_QUERY]: {
		variables: GetTitleVariables;
		response: GetTitleResponse;
	};
	[GET_TOTAL_SHOWS_EPISODES_QUERY]: {
		variables: GetTotalShowsEpisodesVariables;
		response: GetTotalShowsEpisodesResponse;
	};
	[ADVANCED_SEARCH_TITLES_QUERY]: {
		variables: AdvancedSearchTitlesVariables;
		response: AdvancedSearchTitlesResponse;
	};
	[GET_SEASON_EPISODES_QUERY]: {
		variables: GetSeasonEpisodesVariables;
		response: GetSeasonEpisodesResponse;
	};
}

interface GraphQLResponse<T> {
	data?: T;
	errors?: Array<{
		message: string;
		locations?: Array<{ line: number; column: number }>;
		extensions?: { code: string };
	}>;
}

export async function fetchGraphQL<Q extends keyof QueryMap>(
	query: Q,
	variables: QueryMap[Q]['variables'],
): Promise<QueryMap[Q]['response']> {
	const response = await fetch(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query, variables }),
	});

	const result = (await response.json()) as GraphQLResponse<QueryMap[Q]['response']>;

	if (result.errors) {
		throw new ImdbError(result.errors[0].message);
	}

	if (!result.data) {
		throw new ImdbError('No data returned from GraphQL');
	}

	return result.data;
}
