import type { PageServerLoad } from './$types';
import type { Imdb } from '$lib';

export const load = (async ({ params, request }) => {
	const { season } = Object.fromEntries(new URL(request.url).searchParams.entries()) as {
		season?: string;
		episode?: string;
	};

	const query = /* GraphQL */ `
		query GetSeasonEpisodes(
			$id: ID!
			$season: String!
			$after: ID
			$first: Int = 50
			$full: Boolean! = false
		) {
			title(id: $id) {
				# only fetch these when you want the "full" payload
				primaryImage @include(if: $full) {
					url
				}
				ratingsSummary @include(if: $full) {
					aggregateRating
				}
				originalTitleText @include(if: $full) {
					text
				}
				releaseDate @include(if: $full) {
					day
					month
					year
				}
				titleGenres @include(if: $full) {
					genres {
						genre {
							text
						}
					}
				}
				directors: credits(first: 5, filter: { categories: ["director"] }) @include(if: $full) {
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

				episodes {
					seasons @include(if: $full) {
						number
					}
					episodes(first: $first, after: $after, filter: { includeSeasons: [$season] }) {
						pageInfo {
							hasNextPage
							endCursor
						}
						edges {
							node {
								...EpisodeFields
							}
						}
					}
				}
			}
		}

		fragment EpisodeFields on Title {
			id
			titleText {
				text
			}
			series {
				episodeNumber {
					seasonNumber
					episodeNumber
				}
			}
			plots(first: 1) {
				edges {
					node {
						plotText {
							plainText
						}
					}
				}
			}
			# releaseDate { year month day }
			# primaryImage { url }
		}
	`;

	const variables = {
		id: params.id,
		season: season || '1',
		after: null,
		first: 50,
		full: true
	};

	const response = await fetch('https://caching.graphql.imdb.com/', {
		headers: {
			'accept-language': 'en-US,en;q=0.9,sk;q=0.8',
			'content-type': 'application/json',
			'x-imdb-user-language': 'en-US',
			'Cache-Control': 'no-cache'
		},
		body: JSON.stringify({ query, variables }),
		method: 'POST'
	}).then((res) => res.json() as Promise<{ data: { title: Imdb.Series } }>);

	// console.dir(response, { depth: Infinity });

	return {
		series: response.data.title
	};
}) satisfies PageServerLoad;

export const prerender = 'auto';
