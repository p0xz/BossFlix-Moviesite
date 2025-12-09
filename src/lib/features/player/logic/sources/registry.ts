import { SOURCE_ORIGINS, type SourceOrigin } from '$lib/features/player/config/source.config';
import type { BuildOptions } from './types';

type SourceBuilder = (id: string, options: BuildOptions) => string;

const builders: Record<SourceOrigin, SourceBuilder> = {
	vidsrc: (id, options) => {
		const isMovie = !options?.season && !options?.episode;
		return isMovie
			? `${SOURCE_ORIGINS.vidsrc}movie/${id}`
			: `${SOURCE_ORIGINS.vidsrc}tv?imdb=${id}&season=${options.season}&episode=${options.episode}&autoplay=${options.autoPlay ? 1 : 0}${options.autoNext ? `&autonext=1` : ''}${options.autoSubtitles ? `&ds_lang=en` : ''}`;
	},

	vidstream: (id, options) => {
		const isMovie = !options?.season && !options?.episode;
		return isMovie
			? `${SOURCE_ORIGINS.vidstream}movie/${id}`
			: `${SOURCE_ORIGINS.vidstream}tv/${id}/${options.season}/${options.episode}?autoPlay=${options.autoPlay ?? false}`;
	},

	moviestream: (id, options) => {
		const isMovie = !options?.season && !options?.episode;
		return isMovie
			? `${SOURCE_ORIGINS.moviestream}movie/${id}`
			: `${SOURCE_ORIGINS.moviestream}tv/${id}-${options.season}-${options.episode}`;
	},

	primewire: (id, options) => {
		const isMovie = !options?.season && !options?.episode;
		return isMovie
			? `${SOURCE_ORIGINS.primewire}movie?imdb=${id}`
			: `${SOURCE_ORIGINS.primewire}tv?imdb=${id}&season=${options.season}&episode=${options.episode}`;
	},

	superembed: (id, options) => {
		const isMovie = !options?.season && !options?.episode;
		return `${SOURCE_ORIGINS.superembed}?video_id=${id}${!isMovie && `&s=${options.season}&e=${options.episode}`}`;
	},
};

export function buildSourceUrl(source: SourceOrigin, id: string, options: BuildOptions = {}): string {
	const builder = builders[source];

	if (!builder) {
		throw new Error(`Unknown source: ${source}`);
	}

	return builder(id, options);
}
