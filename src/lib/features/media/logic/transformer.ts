import { formatRuntime } from '$lib/core/utils/date';
import { isReleased } from '$lib/features/media/utils/release';
import { historyStorage } from '$lib/features/history/stores/history.store.svelte';
import type { AdvancedSearchTitlesResponse, GetTitleResponse } from '$lib/graphql/types/responses';
import type { GetShowTitleResponse } from '$lib/graphql/types/responses';

export type AdvancedSearchTitlesResponseEdges = AdvancedSearchTitlesResponse['advancedTitleSearch']['edges'];
type AdvancedSearchTitlesResponseEdge = AdvancedSearchTitlesResponseEdges[number];

/**
 * FILTERS
 * ----------------------------------------------------------------------------
 * Centralized filtering logic.
 */

export function advancedSearchDataFilter(edges: AdvancedSearchTitlesResponseEdges, upcoming: boolean = false) {
	if (!edges) return [];

	return edges.filter((edge) => {
		const title = edge.node.title;

		if (!title?.primaryImage?.url) return false;

		if (!isReleased(title?.releaseDate ?? {}) && !upcoming) return false;

		return true;
	});
}

/**
 * HELPERS
 * ----------------------------------------------------------------------------
 * Shared logic used by multiple transformers.
 */

function getMediaHref(id: string, titleType: string): string {
	const isSeries = titleType === 'tvSeries' || titleType === 'tvMiniSeries';
	const base = `/${isSeries ? 'series' : 'movie'}/${id}`;

	if (isSeries) {
		const [season, episode] = historyStorage.lastWatched(id);
		return `${base}?season=${season}&episode=${episode}`;
	}

	return base;
}

function formatGenres(genres: any[] | undefined, limit: number = 3): string {
	return (
		genres
			?.map((g) => g.genre.text)
			.slice(0, limit)
			.join(' • ') || ''
	);
}

/**
 * MAPPERS (Pure Functions)
 * ----------------------------------------------------------------------------
 * These transform a single raw node into a UI object.
 * Reusable across different pages/components.
 */

function mapEdgeToCommonData(edge: AdvancedSearchTitlesResponseEdge) {
	const title = edge.node.title;
	const titleType = title.titleType?.id;
	const isSeries = titleType === 'tvSeries' || titleType === 'tvMiniSeries';

	return {
		// ID & Types
		id: title.id,
		titleType,
		isSeries,

		// Display Data
		title: title.originalTitleText.text,
		posterUrl: title.primaryImage?.url || '',
		genres: formatGenres(title.titleGenres?.genres),

		// Metrics
		rating: title.ratingsSummary?.aggregateRating || ('N/A' as const),
		runtime: title.runtime?.seconds || 0,
		releaseDate: title.releaseDate,

		// Navigation
		href: titleType ? getMediaHref(title.id, titleType) : '/',

		// Extras
		images: title.images,
	};
}

export type commonDataTypes = ReturnType<typeof mapEdgeToCommonData>;

export function getSeriesMetadata(series: GetShowTitleResponse['title']) {
	return {
		title: series.originalTitleText?.text || 'Unknown Title',
		image: series.primaryImage?.url || null,
		seasonsCount: series.episodes.seasons?.length || 1,
		directors: series.directors?.edges.map((edge) => edge.node.name.nameText.text) || [],
		releaseDate: { ...series.releaseDate, ...series.releaseYear },
		rating: series.ratingsSummary?.aggregateRating ?? ('N/A' as const),
		genres: series.titleGenres?.genres.map((g) => g.genre.text) || [],
	};
}

export function getMovieMetadata(movie: GetTitleResponse['title']) {
	return {
		title: movie.originalTitleText?.text || 'Unknown Title',
		image: movie.primaryImage?.url || null,
		directors: movie.directors?.edges.map((edge) => edge.node.name.nameText.text) || [],
		releaseDate: movie.releaseDate,
		rating: movie.ratingsSummary?.aggregateRating ?? ('N/A' as const),
		genres: movie.titleGenres?.genres.map((g) => g.genre.text) || [],
		plot: movie.plot?.plotText.plainText || 'No plot available, yet.',
	};
}

/**
 * COMPOSERS
 */

export function transformAdvancedSearchToUI(edges: AdvancedSearchTitlesResponseEdges) {
	if (!edges) return [];

	const filtered = advancedSearchDataFilter(edges, true);

	return filtered.map((edge) => {
		const data = mapEdgeToCommonData(edge);

		const labels = [
			data.isSeries ? 'Show' : formatRuntime(data.runtime),
			isReleased(data.releaseDate || {}) ? data.releaseDate!.year : 'upcoming',
		];

		return {
			...data,
			labels,
			rating: data.rating,
		};
	});
}

export function transformHomeToUI(edges: AdvancedSearchTitlesResponseEdges) {
	if (!edges) return [];

	const filtered = advancedSearchDataFilter(edges);

	return filtered.map((edge) => {
		const data = mapEdgeToCommonData(edge);

		const labels = [data.isSeries ? 'Show' : formatRuntime(data.runtime), data.releaseDate?.year ?? 'Coming Soon'];

		return {
			...data,
			labels,
			tvRating: edge.node.title.certificate?.rating,
			rating: data.rating,
		};
	});
}
