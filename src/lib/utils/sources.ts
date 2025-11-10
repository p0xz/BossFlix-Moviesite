interface buildOptions {
	season?: string | number;
	episode?: string | number;
	autoPlay?: boolean;
	autoNext?: boolean;
	autoSubtitles?: boolean;
}

export class SourceBuilder {
	static ORIGINS = {
		vidsrc: 'https://vidsrc-embed.ru/embed/',
		superembed: 'https://multiembed.mov/directstream.php',
		vidstream: 'https://vidsrc.cc/v3/embed/',
		primewire: 'https://www.primewire.tf/embed/',
		moviestream: 'https://moviesapi.to/',
	};

	private constructor() {}

	public static build(source: keyof typeof SourceBuilder.ORIGINS, id: string, options: buildOptions = {}) {
		let url = SourceBuilder.ORIGINS[source];

		const isMovie = !options?.season && !options?.episode;

		switch (source) {
			case 'vidsrc':
				url += isMovie
					? `movie/${id}`
					: `tv?imdb=${id}&season=${options.season}&episode=${options.episode}&autoplay=${options.autoPlay ? 1 : 0}${options.autoNext ? `&autonext=1` : ''}${options.autoSubtitles ? `&ds_lang=en` : ''}`;
				break;
			case 'vidstream':
				url += isMovie ? `movie/${id}` : `tv/${id}/${options.season}/${options.episode}?autoPlay=${options.autoPlay ?? false}`;
				break;
			case 'moviestream':
				url += isMovie ? `movie/${id}` : `tv/${id}-${options.season}-${options.episode}`;
				break;
			case 'primewire':
				url += isMovie ? `movie?imdb=${id}` : `tv?imdb=${id}&season=${options.season}&episode=${options.episode}`;
				break;
			case 'superembed':
				url += `?video_id=${id}${!isMovie && `&s=${options.season}&e=${options.episode}`}`;
				break;
		}

		return url;
	}
}

export type sourceOrigins = keyof typeof SourceBuilder.ORIGINS;
