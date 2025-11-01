const queries = {
	seasonEpisodes: /* GraphQL */ `
		query GetSeasonEpisodes(
			$id: ID!
			$season: String!
			$after: ID
			$first: Int = 50
			$full: Boolean! = false
			$includeEpisodes: Boolean! = true
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
					episodes(first: $first, after: $after, filter: { includeSeasons: [$season] })
						@include(if: $includeEpisodes) {
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
	`,
	title: /* GraphQL */ `
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
	`,
	history: /* GraphQL */ `
		query history($ids: [ID!]!) {
			titles(ids: $ids) {
				...TitleFields
			}
		}

		fragment TitleFields on Title {
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
		}
	`,
	searchTitles: /* GraphQL */ `
		query SearchTitles(
			$searchTerm: String!
			$first: Int = 5
			$after: String
			$exact: Boolean = false
			$titleTypes: [MainSearchTitleType!] = [TV, MOVIE]
		) {
			mainSearch(
				first: $first
				after: $after
				options: {
					searchTerm: $searchTerm
					isExactMatch: $exact
					type: TITLE
					titleSearchOptions: { type: $titleTypes }
				}
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
	`,
};

export { queries };
