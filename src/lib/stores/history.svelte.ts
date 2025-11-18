import { SvelteMap, SvelteSet } from 'svelte/reactivity';

interface historyStorageEntries {
	posterUrl: string;
	title: string;
	titleType: string;
	releaseYear: number;
	rating: number;
	genres: string[];
	totalEpisodes?: number;
	totalSeasons?: number;
	runtime?: number;
}

interface historyStorageValue {
	entries: historyStorageEntries;
	seasons: SvelteMap<number, SvelteSet<number>> | null;
}

type historyStorageType = SvelteMap<string, historyStorageValue>;

class HistoryStorage {
	#store: historyStorageType;

	constructor() {
		this.#store = new SvelteMap();
	}

	#getSeasonMap(imdbId: string): SvelteMap<number, SvelteSet<number>> | null | undefined {
		return this.#store.get(imdbId)?.seasons;
	}

	markEpisode(imdbId: string, season: number, episode: number | number[]): void {
		const seasonMap = this.#getSeasonMap(imdbId);

		if (!seasonMap) return;

		if (!seasonMap.has(season)) {
			seasonMap.set(season, new SvelteSet<number>());
		}

		const episodeSet = seasonMap.get(season)!;

		if (Array.isArray(episode)) {
			episode.forEach((ep) => episodeSet.add(ep));
		} else {
			episodeSet.add(episode);
		}
	}

	isEpisodeMarked(imdbId: string, season: number, episode: number): boolean {
		const seasonMap = this.#getSeasonMap(imdbId);

		return !!seasonMap?.get(season)?.has(episode);
	}

	setEntries(imdbId: string, entry: historyStorageEntries): this {
		const storeEntry = this.#store.get(imdbId);

		if (storeEntry) {
			storeEntry.entries = entry;
		}

		return this;
	}
	areEntriesEmpty(imdbId: string): boolean {
		const entries = this.#store.get(imdbId)?.entries;

		if (!entries) return true;

		return (
			!entries.posterUrl &&
			!entries.title &&
			!entries.titleType &&
			!entries.releaseYear &&
			!entries.rating &&
			!entries.genres.length &&
			!entries.totalEpisodes &&
			!entries.totalSeasons &&
			!entries.runtime
		);
	}

	totalEpisodes(imdbId: string): number {
		return this.#store.get(imdbId)?.entries.totalEpisodes ?? 0;
	}

	init(imdbId: string, isMovie: boolean = false): this {
		if (this.#store.has(imdbId)) return this;

		this.#store.set(imdbId, {
			entries: {
				posterUrl: '',
				title: '',
				titleType: '',
				releaseYear: 0,
				rating: 0,
				genres: [],
				totalEpisodes: 0,
				totalSeasons: 0,
				runtime: 0,
			},
			seasons: isMovie ? null : new SvelteMap<number, SvelteSet<number>>(),
		});

		return this;
	}

	lastWatched(imdbId: string): [number, number] {
		const seasonMap = this.#getSeasonMap(imdbId);

		if (!seasonMap || seasonMap.size === 0) return [1, 1];

		const latestWatchedSeason = Math.max(...seasonMap.keys(), 1);
		const episodeSet = seasonMap.get(latestWatchedSeason);

		if (!episodeSet || episodeSet.size === 0) {
			return [latestWatchedSeason, 1];
		}

		const latestWatchedEpisode = Math.max(...episodeSet.values(), 1);

		return [latestWatchedSeason, latestWatchedEpisode];
	}

	reset(): void {
		this.#store.clear();
	}

	toJSON() {
		return Array.from(this.#store, ([imdbId, storeValue]) => {
			const seasons =
				storeValue.seasons instanceof SvelteMap ? Array.from(storeValue.seasons, ([season, epSet]) => [season, Array.from(epSet)]) : null;

			return [imdbId, { entries: storeValue.entries, seasons }];
		});
	}

	fromJSON(data: any): void {
		if (!Array.isArray(data)) return;

		for (const [imdbId, payload] of data ?? []) {
			const entries: historyStorageEntries = {
				posterUrl: payload?.entries?.posterUrl ?? '',
				title: payload?.entries?.title ?? '',
				titleType: payload?.entries?.titleType ?? '',
				releaseYear: Number(payload?.entries?.releaseYear ?? 0),
				rating: Number(payload?.entries?.rating ?? 0),
				genres: Array.isArray(payload?.entries?.genres) ? payload.entries.genres : [],
				totalEpisodes: Number(payload?.entries?.totalEpisodes ?? 0),
				totalSeasons: Number(payload?.entries?.totalSeasons ?? 0),
				runtime: Number(payload?.entries?.runtime ?? 0),
			};

			const isSeries = Array.isArray(payload?.seasons);
			const seasonsMap = isSeries ? new SvelteMap<number, SvelteSet<number>>() : null;

			if (seasonsMap) {
				for (const [season, eps] of payload?.seasons ?? []) {
					const s = Number(season);

					if (isNaN(s)) continue;

					const episodes = Array.isArray(eps) ? eps.map(Number).filter((n) => !isNaN(n)) : [];

					seasonsMap.set(s, new SvelteSet<number>(episodes));
				}
			}

			this.#store.set(imdbId, { entries, seasons: seasonsMap });
		}
	}

	get state() {
		return this.#store;
	}
}

export const historyStorage = new HistoryStorage();
