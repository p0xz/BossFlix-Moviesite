export const GET_SHOW_TITLE_QUERY = /* GraphQL */ `
	query GetSeasonEpisodes(
		$id: ID!
		$season: String!
		$after: ID
		$first: Int = 50
		$full: Boolean! = false
		$includeEpisodes: Boolean! = true
	) {
		title(id: $id) {
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

			releaseYear @include(if: $full) {
				endYear
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
				seasonEpisodes: episodes(first: $first, after: $after, filter: { includeSeasons: [$season] }) @include(if: $includeEpisodes) {
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

				allEpisodesTotal: episodes(first: 0) @include(if: $full) {
					total
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
		ratingsSummary {
			aggregateRating
		}
		primaryImage {
			url
		}
		runtime {
			seconds
		}
		releaseDate {
			day
			month
			year
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
	}
`;

export const GET_SEASON_EPISODES_QUERY = /* GraphQL */ `
	query GetSeasonEpisodes($id: ID!, $season: String!, $after: ID, $first: Int = 50) {
		title(id: $id) {
			episodes {
				seasonEpisodes: episodes(first: $first, after: $after, filter: { includeSeasons: [$season] }) {
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
		ratingsSummary {
			aggregateRating
		}
		primaryImage {
			url
		}
		runtime {
			seconds
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
	}
`;

export const GET_TITLE_QUERY = /* GraphQL */ `
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
			primaryImage {
				url
			}
			runtime {
				seconds
			}
			plot {
				plotText {
					plainText
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

export const GET_TOTAL_SHOWS_EPISODES_QUERY = /* GraphQL */ `
	query GetTotalShowsEpisodes($id: ID!) {
		title(id: $id) {
			episodes {
				episodes(first: 0) {
					total
				}
			}
		}
	}
`;

export const ADVANCED_SEARCH_TITLES_QUERY = /* GraphQL */ `
	query advancedSearchTitles(
		$first: Int = 30
		$searchTerm: String
		$jumpToPosition: Int
		$titleType: [String!] = ["movie", "tvSeries"]
		$sortBy: AdvancedTitleSearchSortBy! = POPULARITY
		$sortOrder: SortOrder! = ASC
		$genreIds: [String!] = []
		$minRating: Float = 0.0
		$releaseDateStart: Date = "2000-01-01"
		$releaseDateEnd: Date
	) {
		advancedTitleSearch(
			first: $first
			jumpToPosition: $jumpToPosition
			constraints: {
				titleTypeConstraint: { anyTitleTypeIds: $titleType }
				titleTextConstraint: { searchTerm: $searchTerm }
				userRatingsConstraint: { aggregateRatingRange: { min: $minRating } }
				genreConstraint: { allGenreIds: $genreIds }
				releaseDateConstraint: { releaseDateRange: { start: $releaseDateStart, end: $releaseDateEnd } }
			}
			sort: { sortBy: $sortBy, sortOrder: $sortOrder }
		) {
			total
			pageInfo {
				hasPreviousPage
				hasNextPage
			}
			edges {
				node {
					title {
						id
						originalTitleText {
							text
						}
						primaryImage {
							url
						}
						images(first: 10) {
							edges {
								node {
									url
									width
									height
									type
								}
							}
						}
						ratingsSummary {
							aggregateRating
						}
						certificate {
							rating
						}
						runtime {
							seconds
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
						titleType {
							id
							text
						}
					}
				}
			}
		}
	}
`;
