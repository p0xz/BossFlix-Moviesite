export namespace Imdb {
	interface ratingsSummary {
		aggregateRating: number;
	}

	interface primaryImage {
		url: string;
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
	export interface Seasons {
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

	export interface EpisodeNode {
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
		primaryImage: primaryImage;
		episodes: {
			seasons?: Seasons[];
			episodes: {
				pageInfo?: pageInfo;
				edges: EpisodeNode[];
			};
		};
	}

	export namespace Search {
		export interface MainSearch {
			pageInfo: pageInfo;
			edges: Edge[];
		}

		export interface Edge {
			node: {
				entity: Entity;
			};
		}

		interface Entity {
			id: string;
			titleText: originalTitleText;
			releaseYear: ReleaseYear;
			titleType: TitleType;
			primaryImage: primaryImage;
		}

		interface ReleaseYear {
			year: number;
		}

		interface TitleType {
			id: 'tvSeries' | 'tvMiniSeries' | 'tvMovie' | 'movie';
			text: string;
		}
		export interface AdvancedTitleSearch {
			edges: AdvancedTitleSearchEdge[];
		}

		export interface AdvancedTitleSearchEdge {
			node: AdvancedTitleSearchNode;
		}

		export interface AdvancedTitleSearchNode {
			title: {
				id: string;
				originalTitleText: originalTitleText;
				releaseYear: ReleaseYear;
				titleType: TitleType;
				primaryImage: primaryImage;
			};
		}
	}
}
