import { SvelteMap, SvelteSet } from 'svelte/reactivity';

class WatchedStore {
	#store: SvelteMap<string, SvelteMap<number, SvelteSet<number>>>;

	constructor() {
		this.#store = new SvelteMap();
	}

	markEpisode(imdbId: string, season: number, episode: number): void {
		const mediaStore = this.#store.get(imdbId) as SvelteMap<number, SvelteSet<number>>;

		mediaStore?.get(season)?.add(episode);
	}

	isEpisodeMarked(imdbId: string, season: number, episode: number): boolean {
		const mediaStore = this.#store.get(imdbId) as SvelteMap<number, SvelteSet<number>>;

		return !!mediaStore?.get(season)?.has(episode);
	}

	init(imdbId: string, season: number): void {
		if (!this.#store.has(imdbId)) this.#store.set(imdbId, new SvelteMap());

		const mediaStore = this.#store.get(imdbId) as SvelteMap<number, SvelteSet<number>>;
		if (!mediaStore.has(season)) mediaStore.set(season, new SvelteSet());
	}

	lastWatched(imdbId: string): [number, number] {
		const mediaStore = this.#store.get(imdbId) as SvelteMap<number, SvelteSet<number>>;
		if (!mediaStore) return [1, 1];

		const latestWatchedSeason = Math.max(...mediaStore.keys(), 1);
		const latestWatchedEpisode = Math.max(
			...(mediaStore.get(latestWatchedSeason) as SvelteSet<number>).values(),
			1,
		);

		return [latestWatchedSeason, latestWatchedEpisode];
	}

	reset(): void {
		this.#store.clear();
	}

	toJSON() {
		return Array.from(this.#store, ([imdbId, seasons]) => [
			imdbId,
			Array.from(seasons, ([season, episodes]) => [season, Array.from(episodes)]),
		]);
	}

	fromJSON(data: any): void {
		for (const [imdbId, seasons] of data) {
			const seasonsMap = new SvelteMap<number, SvelteSet<number>>();

			for (const [season, episodes] of seasons) {
				seasonsMap.set(season, new SvelteSet<number>(episodes));
			}

			this.#store.set(imdbId, seasonsMap);
		}
	}

	get state() {
		return this.#store;
	}
}

export const watchedStore = new WatchedStore();
