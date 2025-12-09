import { getLastWeekDateISO } from '$lib/core/utils/date';
import type { GenreKey, TitleKey } from '$lib/core/constants/media.filters';
import { GENRES_MAP } from '$lib/core/constants/media.filters';

export interface FilterState {
	genres: Record<GenreKey, boolean>;
	titleTypes: Record<TitleKey, boolean>;
}

export function createDefaultFilterState(): FilterState {
	const defaultGenres = Object.fromEntries(Object.keys(GENRES_MAP).map((key) => [key, false])) as Record<GenreKey, boolean>;
	const defaultTitleTypes = {
		movie: true,
		tvSeries: true,
	};

	return {
		genres: defaultGenres,
		titleTypes: defaultTitleTypes,
	};
}

export const DEFAULT_DATE_RANGES = {
	from: {
		year: '2000',
		iso: '2000-01-01',
	},
	to: {
		year: new Date().getFullYear().toString(),
		iso: getLastWeekDateISO(),
	},
} as const;
