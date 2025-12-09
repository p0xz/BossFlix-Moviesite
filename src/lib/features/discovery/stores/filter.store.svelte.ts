import { createDefaultFilterState } from '$lib/features/discovery/config/filter.config';
import { DEFAULT_CUT_OFF } from '$lib/core/config/pagination.config';
import { GENRES_MAP, type GenreKey } from '$lib/core/constants/media.filters';

class FilterStore {
	#state = $state(createDefaultFilterState());
	#rating = $state(0);
	#showAllGenres = $state(false);

	get filters() {
		return this.#state;
	}
	get genres() {
		return this.#state.genres;
	}
	get titleTypes() {
		return this.#state.titleTypes;
	}
	get rating() {
		return this.#rating;
	}
	set rating(value: number) {
		this.#rating = value;
	}
	get showAllGenres() {
		return this.#showAllGenres;
	}

	set showAllGenres(value: boolean) {
		this.#showAllGenres = value;
	}

	#getActiveKeysString(map: Record<string, boolean>): string {
		return Object.entries(map)
			.filter(([_, isChecked]) => isChecked)
			.map(([key]) => key)
			.join(' ');
	}

	// --- Actions ---

	updateFromURL(searchParams: URLSearchParams): void {
		this.reset();

		const activeKeys = searchParams.get('genres')?.split(' ').filter(Boolean) || [];

		for (const key of Object.keys(this.#state.genres)) {
			this.#state.genres[key as GenreKey] = activeKeys.includes(key);
		}

		const ratingVal = parseFloat(searchParams.get('rating') || '0');
		this.#rating = isNaN(ratingVal) ? 0 : ratingVal;
	}

	reset(): void {
		this.#state = createDefaultFilterState();

		this.#rating = 0;
		this.#showAllGenres = false;
	}

	get activeGenresString(): string {
		return this.#getActiveKeysString(this.#state.genres);
	}

	get activeTitlesString(): string {
		// New getter added, using private method
		return this.#getActiveKeysString(this.#state.titleTypes);
	}

	get genresUIList() {
		const allGenres = Object.entries(GENRES_MAP).map(([key, label]) => ({
			key: key as GenreKey,
			label,
			checked: this.#state.genres[key as GenreKey],
		}));

		if (this.#showAllGenres) {
			return allGenres;
		}

		return allGenres.slice(0, DEFAULT_CUT_OFF);
	}

	// setGenresFromKeys(keys: string[]): void {
	// 	const keySet = new Set(keys);
	// 	for (const key in this.#state.genres) {
	// 		this.#state.genres[key as GenreValue] = keySet.has(key);
	// 	}
	// }
}

export const filterStore = new FilterStore();
