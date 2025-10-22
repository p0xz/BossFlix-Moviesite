import type { Imdb } from '$lib';
import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const { media } = Object.fromEntries((await request.formData()).entries()) as Record<
			string,
			string
		>;

		if (!media || media.trim().length === 0) {
			return { search: undefined };
		}

		const query = /* GraphQL */ `
			query SearchTitles(
				$searchTerm: String!
				$first: Int = 5
				$after: String
				$exact: Boolean = false
			) {
				mainSearch(
					first: $first
					after: $after
					options: { searchTerm: $searchTerm, isExactMatch: $exact, type: TITLE }
				) {
					pageInfo {
						hasNextPage
						endCursor
					}
					edges {
						node {
							entity {
								... on Title {
									id
									titleText {
										text
									}
									releaseYear {
										year
									}
									titleType {
										id
										text
									}
									primaryImage {
										url
									}
								}
							}
						}
					}
				}
			}
		`;

		const variables = {
			searchTerm: media,
			first: 10,
			exact: false,
			type: ''
		};

		const response = await fetch('https://caching.graphql.imdb.com/', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'accept-language': 'en-US,en;q=0.9',
				'x-imdb-user-language': 'en-US'
			},
			body: JSON.stringify({ query, variables })
		}).then((res) => res.json() as Promise<{ data: { mainSearch: Imdb.Search.MainSearch } }>);
		console.dir(response, { depth: Infinity });

		// response.d = response.d.filter((item) => {
		// 	return (
		// 		item.l.toLowerCase().includes(media.toLowerCase()) &&
		// 		(item.qid === 'movie' || item.qid === 'tvSeries')
		// 	);
		// });

		// const search =
		// 	(response.d.map((item) => {
		// 		return {
		// 			id: item.id,
		// 			title: item.l,
		// 			rank: item.rank,
		// 			imageUrl: item?.i?.imageUrl,
		// 			type: item.qid === 'movie' ? 'movie' : item.qid === 'tvSeries' ? 'series' : 'unknown',
		// 			release: item.y
		// 		};
		// 	}) as {
		// 		id: string;
		// 		title: string;
		// 		rank: number;
		// 		imageUrl?: string;
		// 		type: 'movie' | 'series' | 'unknown';
		// 		release?: number;
		// 	}[]) || [];
		// console.log(`[BossFlix] Searched for "${media}" and found ${search.length} results.`);

		return { search: response.data.mainSearch };
	}
} satisfies Actions;
