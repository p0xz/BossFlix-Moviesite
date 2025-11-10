export namespace Imdb {
	interface ratingsSummary {
		aggregateRating: number;
	}

	export interface primaryImage {
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

	interface runtime {
		seconds: number;
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

	interface displayableSeasons {
		total: number;
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
	export interface Movie extends _MediaInfo {
		primaryImage: primaryImage;
		runtime: runtime;
	}

	export interface Series extends _MediaInfo {
		primaryImage: primaryImage;
		episodes: {
			seasons?: Seasons[];
			seasonEpisodes: {
				pageInfo?: pageInfo;
				edges: EpisodeNode[];
			};
			allEpisodesTotal: { total: number };
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
			releaseDate: ReleaseDate;
			titleType: TitleType;
			primaryImage: primaryImage;
			titleGenres: titleGenres;
			runtime: runtime;
			episodes: { displayableSeasons: displayableSeasons };
			ratingsSummary: ratingsSummary;
		}

		interface ReleaseYear {
			year: number;
		}

		interface ReleaseDate {
			year: number;
			month: number;
			day: number;
		}

		export interface TitleType {
			id: 'tvSeries' | 'tvMiniSeries' | 'tvMovie' | 'movie';
			canHaveEpisodes: boolean;
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

export type Binary = 1 | 0;

export namespace PlayerMessageEmitter {
	// Media players
	export namespace PlayerJS {
		export type PlayerTypes = 'PLAYER_EVENT';
		export type PlayerEventCommand =
			| 'play'
			| 'pause'
			| 'toggle'
			| 'file'
			| 'preload'
			| 'stop'
			| 'mute'
			| 'unmute'
			| 'seek'
			| 'fullscreen'
			| 'exitfullscreen'
			| 'isfullscreen'
			| 'playing'
			| 'started'
			| 'time'
			| 'duration'
			| 'buffered'
			| 'muted'
			| 'volume'
			| 'quality'
			| 'qualities'
			| 'audiotrack'
			| 'audiotracks'
			| 'speed'
			| 'id'
			| 'log'
			| 'screenshot'
			| 'subtitles'
			| 'subtitle'
			| '+subtitle'
			| 'subtitle:size'
			| 'togglesubs'
			| 'poster'
			| 'share'
			| 'title'
			| 'playlist'
			| 'playlist_id'
			| 'playlist_title'
			| 'playlist_folders'
			| 'playlist_length'
			| 'push'
			| 'invert'
			| 'autonext'
			| 'playlistloop'
			| 'next'
			| 'prev'
			| 'loop'
			| 'find'
			| 'cuid'
			| 'showplaylist'
			| 'moveplaylist'
			| 'scale'
			| 'ratio'
			| 'native'
			| 'points'
			| 'thumbnails'
			| 'visibility'
			| 'hlserror'
			| 'dasherror'
			| 'hls'
			| 'dash'
			| 'fix'
			| 'unfix'
			| 'adblock'
			| 'live'
			| 'size'
			| 'stretch'
			| 'flip'
			| 'geo'
			| 'pip'
			| 'cut'
			| 'toolbar'
			| 'destroy'
			| 'color1'
			| 'color2'
			| 'color3'
			| 'menu'
			| 'act';

		export type PlayerDataInnerEvent = 'timeupdate' | 'pause' | 'seeked' | (string & {});
		export type PlayerKind = 'tv' | 'movie';
		export type PlayerSubtitleDataLiterals = 'off' | (string & {});
		export interface PlayerDataObject {
			imdbId: string;
			tmdbId: number;
			type: PlayerKind;
			season?: number;
			episode?: number;
			currentTime: number;
			duration: number;
			event?: PlayerDataInnerEvent;
		}

		export interface PlayerTypeEvent {
			type: PlayerTypes;
			data: PlayerDataObject;
		}

		export type PlayerEventData =
			| {
					event: 'subtitle' | 'subtitles';
					data: PlayerSubtitleDataLiterals; // e.g: 'English' | 'off' | ...
			  }
			| PlayerTypeEvent;

		export interface CommandArgumentMap {
			subtitle: -1 | 0 | 1 | 2;
			autonext: 0 | 1; // off / on
		}

		export type ArgumentForCommand<C extends PlayerEventCommand> =
			C extends keyof CommandArgumentMap ? CommandArgumentMap[C] : unknown;
	}

	// Video Players by sources
	export namespace Vidsrc {}

	export namespace Vidstream {}

	export namespace Primewire {}

	export namespace MovieStream {}
}
