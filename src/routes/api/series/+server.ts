import type { RequestHandler } from './$types';
import { type Imdb, toBoolean } from '$lib';

export const GET: RequestHandler = async ({ url }) => {
	let { id, season, context } = Object.fromEntries(url.searchParams.entries()) as {
		id: string;
		season: string;
		episode: string;
		context: string;
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
			# optionally:
			# releaseDate { year month day }
			# primaryImage { url }
		}
	`;

	const variables = {
		id, // series ttid, e.g. "tt0944947"
		season: season || 1,
		after: null, // or a saved cursor
		first: 50,
		full: (context ?? '') === 'full'
	};

	const response = await fetch('https://caching.graphql.imdb.com/', {
		headers: {
			'accept-language': 'en-US,en;q=0.9,sk;q=0.8',
			'content-type': 'application/json',
			'x-imdb-user-language': 'en-US'
		},
		body: JSON.stringify({ query, variables }),
		method: 'POST'
	}).then(
		(res) => res.json() as Promise<{ data: { title: { episodes: Imdb.Series['episodes'] } } }>
	);

	// console.dir(response.data.title, { depth: Infinity });

	return new Response(JSON.stringify({ episodes: response.data.title.episodes.episodes }));
};
