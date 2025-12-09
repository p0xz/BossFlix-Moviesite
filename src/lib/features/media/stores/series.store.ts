import type { GetShowTitleOnlyEpisodesResponse, GetShowTitleResponse } from '$lib/graphql/types/responses';
import { browser } from '$app/environment';
import { getSeriesMetadata } from '$lib/features/media/logic/transformer';

interface SeriesCacheEntry {
	metadata: ReturnType<typeof getSeriesMetadata>;
	seasons: Map<number, GetShowTitleResponse['title']['episodes']['seasonEpisodes']['edges']>;
}

class SeriesStore {
	#cache = new Map<string, SeriesCacheEntry>();

	async getSeriesData(seriesId: string, season: number, fetch: typeof window.fetch): Promise<SeriesCacheEntry> {
		if (!browser) {
			return this.#fetchFresh(seriesId, season, fetch);
		}

		const cached = this.#cache.get(seriesId);

		if (cached?.seasons.has(season)) {
			return cached;
		}

		if (cached) {
			await this.#fetchMissingSeason(seriesId, season, cached, fetch);
			return cached;
		}

		const freshEntry = await this.#fetchFresh(seriesId, season, fetch);
		this.#cache.set(seriesId, freshEntry);
		return freshEntry;
	}

	async #fetchFresh(id: string, season: number, fetch: typeof window.fetch): Promise<SeriesCacheEntry> {
		const response = await fetch(`/api/series/${id}?season=${season}`, {
			headers: { 'Content-Type': 'application/json' },
		});
		const data = (await response.json()) as { series: GetShowTitleResponse };

		return {
			metadata: getSeriesMetadata(data.series.title),
			seasons: new Map([[season, data.series.title.episodes.seasonEpisodes.edges]]),
		};
	}

	async #fetchMissingSeason(id: string, season: number, entry: SeriesCacheEntry, fetch: typeof window.fetch): Promise<void> {
		const response = await fetch(`/api/series/${id}?season=${season}&onlyEpisodes=true`, {
			headers: { 'Content-Type': 'application/json' },
		});
		const data = (await response.json()) as { series: GetShowTitleOnlyEpisodesResponse };

		entry.seasons.set(season, data.series.title.episodes.seasonEpisodes.edges);
	}
}

export const seriesStore = new SeriesStore();
