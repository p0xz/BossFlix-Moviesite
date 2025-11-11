import { SvelteMap, SvelteSet } from 'svelte/reactivity';

interface WatchedStoreEntries {
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

type WatchedStoreValue = [WatchedStoreEntries, SvelteMap<number, SvelteSet<number>> | null];
type WatchedStoreType = SvelteMap<string, WatchedStoreValue>;
class WatchedStore {
	#store: WatchedStoreType;

	constructor() {
		this.#store = new SvelteMap();
	}

	markEpisode(imdbId: string, season: number, episode: number | number[]): void {
		const mediaStore = (this.#store.get(imdbId) as WatchedStoreValue)[1];
		if (Array.isArray(episode)) {
			episode.forEach((ep) => mediaStore?.get(season)?.add(ep));
			return;
		}

		mediaStore?.get(season)?.add(episode);
	}

	isEpisodeMarked(imdbId: string, season: number, episode: number): boolean {
		if (!this.#store.has(imdbId)) return false;

		const mediaStore = (this.#store.get(imdbId) as WatchedStoreValue)[1];

		return !!mediaStore?.get(season)?.has(episode);
	}

	setEntries(imdbId: string, entry: WatchedStoreEntries) {
		const mediaStore = this.#store.get(imdbId) as WatchedStoreValue;
		mediaStore[0] = entry;
		return this;
	}

	areEntriesEmpty(imdbId: string): boolean {
		if (!this.#store.has(imdbId)) return true;

		const mediaStore = (this.#store.get(imdbId) as WatchedStoreValue)[0];

		return (
			!mediaStore.posterUrl &&
			!mediaStore.title &&
			!mediaStore.titleType &&
			!mediaStore.releaseYear &&
			!mediaStore.rating &&
			mediaStore.genres.length === 0
		);
	}

	totalEpisodes(imdbId: string) {
		const mediaStore = this.#store.get(imdbId) as WatchedStoreValue;

		return mediaStore[0].totalEpisodes;
	}

	init(imdbId: string, season: number, isMovie: boolean = false) {
		if (!this.#store.has(imdbId)) {
			this.#store.set(imdbId, [
				{
					posterUrl: '',
					title: '',
					titleType: '',
					releaseYear: 0,
					rating: 0,
					genres: [],
					totalEpisodes: 0,
					totalSeasons: 0,
				},
				isMovie ? null : new SvelteMap<number, SvelteSet<number>>(),
			]);
		}

		if (isMovie) return this;

		const mediaStore = (this.#store.get(imdbId) as WatchedStoreValue)[1];
		if (mediaStore && !mediaStore.has(season)) mediaStore.set(season, new SvelteSet());

		return this;
	}

	lastWatched(imdbId: string): [number, number] {
		if (!this.#store.has(imdbId)) return [1, 1];

		const mediaStore = this.#store.get(imdbId) as WatchedStoreValue;

		if (!mediaStore || !mediaStore[1] || mediaStore[1].size === 0) return [1, 1];

		const latestWatchedSeason = Math.max(...mediaStore[1].keys(), 1);
		const latestWatchedEpisode = Math.max(
			...(mediaStore[1].get(latestWatchedSeason) as SvelteSet<number>).values(),
			1,
		);

		return [latestWatchedSeason, latestWatchedEpisode];
	}

	reset(): void {
		this.#store.clear();
	}

	toJSON() {
		return Array.from(this.#store, ([imdbId, [entries, seasonsMap]]) => {
			const seasons =
				seasonsMap instanceof SvelteMap
					? Array.from(seasonsMap, ([season, epSet]) => [season, Array.from(epSet)])
					: null;

			return [imdbId, { entries, seasons }];
		});
	}

	fromJSON(data: any): void {
		for (const [imdbId, payload] of data ?? []) {
			const entries: WatchedStoreEntries = {
				posterUrl: payload?.entries?.posterUrl ?? '',
				title: payload?.entries?.title ?? '',
				titleType: payload?.entries?.titleType ?? '',
				releaseYear: Number(payload?.entries?.releaseYear ?? 0),
				rating: Number(payload?.entries?.rating ?? 0),
				genres: payload?.entries?.genres ?? [],
				totalEpisodes: Number(payload?.entries?.totalEpisodes ?? 0),
				totalSeasons: Number(payload?.entries?.totalSeasons ?? 0),
				runtime: Number(payload?.entries?.runtime ?? 0),
			};

			const isSeries = Array.isArray(payload?.seasons);
			const seasonsMap = isSeries ? new SvelteMap<number, SvelteSet<number>>() : null;

			if (seasonsMap) {
				for (const [season, eps] of payload?.seasons ?? []) {
					const s = Number(season);
					const episodes = Array.isArray(eps) ? eps.map(Number) : [];
					seasonsMap.set(s, new SvelteSet<number>(episodes));
				}
			}

			this.#store.set(imdbId, [entries, seasonsMap]);
		}
	}

	get state() {
		return this.#store;
	}
}

export const watchedStore = new WatchedStore();
