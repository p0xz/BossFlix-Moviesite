import type { PageLoad } from './$types';
import type { Imdb } from '$lib';

export const load = (async ({ params, fetch }) => {
	const query = /* GraphQL */ `
		query GetTitle($id: ID!) {
			title(id: $id) {
				ratingsSummary {
					aggregateRating
				}
				originalTitleText {
					text
				}
				releaseDate {
					day
					month
					year
				}
				titleGenres {
					genres {
						genre {
							text
						}
					}
				}
				directors: credits(first: 5, filter: { categories: ["director"] }) {
					edges {
						node {
							name {
								nameText {
									text
								}
							}
						}
					}
				}
			}
		}
	`;

	const variables = {
		id: params.id
	};

	const response = await fetch('https://caching.graphql.imdb.com/', {
		headers: {
			'accept-language': 'en-US,en;q=0.9,sk;q=0.8',
			'content-type': 'application/json',
			'x-imdb-user-language': 'en-US'
		},
		body: JSON.stringify({ query, variables }),
		method: 'POST'
	}).then((res) => res.json() as Promise<{ data: { title: Imdb.Movie } }>);

	return {
		movie: response.data.title
	};
}) satisfies PageLoad;
