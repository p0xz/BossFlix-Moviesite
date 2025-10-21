export namespace Imdb {
	interface ratingsSummary {
		aggregateRating: number;
	}

	interface originalTitleText {
		text: string;
	}

	interface releaseDate {
		day: number;
		month: number;
		year: number;
	}

	interface titleGenres {
		genres: {
			genre: {
				text: string;
			};
		}[];
	}

	interface directorNode {
		edges: {
			node: {
				name: {
					nameText: {
						text: string;
					};
				};
			};
		}[];
	}

	// tv series specific
	interface Seasons {
		number: number;
	}

	interface pageInfo {
		hasNextPage: boolean;
		endCursor: string;
	}

	interface Plots {
		edges: {
			node: {
				plotText: {
					plainText: string;
				};
			};
		}[];
	}

	interface EpisodeNode {
		node: {
			id: string;
			titleText: {
				text: string;
			};
			series: {
				episodeNumber: {
					seasonNumber: number;
					episodeNumber: number;
				};
			};
			plots: Plots;
		};
	}

	interface _MediaInfo {
		ratingsSummary: ratingsSummary;
		originalTitleText: originalTitleText;
		releaseDate: releaseDate;
		titleGenres: titleGenres;
		directors: directorNode;
	}
	export interface Movie extends _MediaInfo {}

	export interface Series extends _MediaInfo {
		primaryImage: {
			url: string;
		};
		episodes: {
			seasons?: Seasons[];
			episodes: {
				pageInfo: pageInfo;
				edges: EpisodeNode[];
			};
		};
	}
}
