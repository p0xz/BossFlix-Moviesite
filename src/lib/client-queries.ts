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
	`
};

export { queries };
