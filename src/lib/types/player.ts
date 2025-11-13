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
					data: PlayerSubtitleDataLiterals | null; // e.g: 'English' | 'off' | ...
			  }
			| PlayerTypeEvent;

		export interface CommandArgumentMap {
			subtitle: -1 | 0 | 1 | 2;
			autonext: 0 | 1; // off / on
		}

		export type ArgumentForCommand<C extends PlayerEventCommand> = C extends keyof CommandArgumentMap ? CommandArgumentMap[C] : unknown;
	}

	// Video Players by sources
	export namespace Vidsrc {}

	export namespace Vidstream {}

	export namespace Primewire {}

	export namespace MovieStream {}
}
