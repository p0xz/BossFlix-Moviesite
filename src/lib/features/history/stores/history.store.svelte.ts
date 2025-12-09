// lib/stores/historyStore.svelte.ts
import { browser } from '$app/environment';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';

interface HistoryEntry {
	posterUrl: string;
	title: string;
	titleType: 'movie' | 'tvSeries' | 'tvMiniSeries';
	releaseYear: number;
	rating: number;
	genres: string[];
	totalEpisodes?: number;
	totalSeasons?: number;
	runtime?: number;
}

interface SeriesProgress {
	entries: HistoryEntry;
	seasons: SvelteMap<number, SvelteSet<number>>;
}

interface MovieProgress {
	entries: HistoryEntry;
	seasons: null;
}

type WatchHistory = SeriesProgress | MovieProgress;

interface SerializedHistory {
	entries: HistoryEntry;
	seasons: [number, number[]][] | null;
}

const DEFAULT_LAST_WATCHED: [number, number] = [1, 1];
const STORAGE_KEY = 'bf-watched';

class HistoryStorage {
	#store = new SvelteMap<string, WatchHistory>();

	init(imdbId: string, entry: HistoryEntry): this {
		if (this.#store.has(imdbId)) {
			return this.update(imdbId, entry);
		}

		const isSeries = entry.titleType === 'tvSeries' || entry.titleType === 'tvMiniSeries';

		this.#store.set(imdbId, {
			entries: entry,
			seasons: isSeries ? new SvelteMap() : null,
		});

		return this;
	}

	update(imdbId: string, entry: Partial<HistoryEntry>): this {
		const existing = this.#store.get(imdbId);
		if (!existing) return this;

		existing.entries = { ...existing.entries, ...entry };
		return this;
	}

	// ============= EPISODE TRACKING =============

	markEpisodes(imdbId: string, season: number, episodes: number | number[]): this {
		const history = this.#store.get(imdbId);
		if (!history?.seasons) return this;

		if (!history.seasons.has(season)) {
			history.seasons.set(season, new SvelteSet());
		}

		const episodeSet = history.seasons.get(season)!;
		const episodeArray = Array.isArray(episodes) ? episodes : [episodes];

		episodeArray.forEach((ep) => episodeSet.add(ep));

		this.save();
		return this;
	}

	isEpisodeWatched(imdbId: string, season: number, episode: number): boolean {
		const history = this.#store.get(imdbId);
		return history?.seasons?.get(season)?.has(episode) ?? false;
	}

	getProgress(imdbId: string): { watched: number; total: number; percentage: number } {
		const history = this.#store.get(imdbId);
		if (!history?.seasons) {
			return { watched: 0, total: 0, percentage: 0 };
		}

		const watched = Array.from(history.seasons.values()).reduce((acc, set) => acc + set.size, 0);
		const total = history.entries.totalEpisodes ?? 0;
		const percentage = total > 0 ? Math.round((watched / total) * 100) : 0;

		return { watched, total, percentage };
	}

	lastWatched(imdbId: string): [season: number, episode: number] {
		const history = this.#store.get(imdbId);
		if (!history?.seasons || history.seasons.size === 0) {
			return DEFAULT_LAST_WATCHED;
		}

		const lastSeason = Math.max(...history.seasons.keys());
		const episodeSet = history.seasons.get(lastSeason);

		if (!episodeSet || episodeSet.size === 0) {
			return [lastSeason, 1];
		}

		const lastEpisode = Math.max(...episodeSet.values());
		return [lastSeason, lastEpisode];
	}

	has(imdbId: string): boolean {
		return this.#store.has(imdbId);
	}

	get(imdbId: string): WatchHistory | undefined {
		return this.#store.get(imdbId);
	}

	remove(imdbId: string): this {
		this.#store.delete(imdbId);
		this.save();
		return this;
	}

	reset(): this {
		this.#store.clear();
		this.save();
		return this;
	}

	getAll(): Array<[string, WatchHistory]> {
		return Array.from(this.#store.entries());
	}

	save(): void {
		if (!browser) return;

		try {
			const serialized = this.toJSON();
			localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
		} catch (error) {
			console.error('[HistoryStorage] Failed to save:', error);
		}
	}

	load(): this {
		if (!browser) return this;

		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const data = JSON.parse(stored);
				this.fromJSON(data);
			}
		} catch (error) {
			console.error('[HistoryStorage] Failed to load:', error);
		}

		return this;
	}

	toJSON(): Array<[string, SerializedHistory]> {
		return Array.from(this.#store.entries()).map(([imdbId, history]) => {
			const seasons = history.seasons
				? Array.from(history.seasons.entries()).map(([season, episodes]) => [season, Array.from(episodes)] as [number, number[]])
				: null;

			return [imdbId, { entries: history.entries, seasons }];
		});
	}

	fromJSON(data: unknown): this {
		if (!Array.isArray(data)) {
			console.warn('[HistoryStorage] Invalid data format');
			return this;
		}

		this.#store.clear();

		for (const item of data) {
			if (!Array.isArray(item) || item.length !== 2) continue;

			const [imdbId, payload] = item;
			if (typeof imdbId !== 'string' || !payload?.entries) continue;

			const entries: HistoryEntry = {
				posterUrl: payload.entries.posterUrl ?? '',
				title: payload.entries.title ?? '',
				titleType: payload.entries.titleType ?? 'movie',
				releaseYear: Number(payload.entries.releaseYear) || 0,
				rating: Number(payload.entries.rating) || 0,
				genres: Array.isArray(payload.entries.genres) ? payload.entries.genres : [],
				totalEpisodes: payload.entries.totalEpisodes,
				totalSeasons: payload.entries.totalSeasons,
				runtime: payload.entries.runtime,
			};

			const seasons = this.#deserializeSeasons(payload.seasons);
			this.#store.set(imdbId, { entries, seasons });
		}

		return this;
	}

	#deserializeSeasons(data: unknown): SvelteMap<number, SvelteSet<number>> | null {
		if (!Array.isArray(data)) return null;

		const seasonsMap = new SvelteMap<number, SvelteSet<number>>();

		for (const [season, episodes] of data) {
			const seasonNum = Number(season);
			if (isNaN(seasonNum) || !Array.isArray(episodes)) continue;

			const episodeSet = new SvelteSet(episodes.map(Number).filter((n) => !isNaN(n)));

			if (episodeSet.size > 0) {
				seasonsMap.set(seasonNum, episodeSet);
			}
		}

		return seasonsMap.size > 0 ? seasonsMap : null;
	}

	get state() {
		return this.#store;
	}
}

export const historyStorage = new HistoryStorage();
