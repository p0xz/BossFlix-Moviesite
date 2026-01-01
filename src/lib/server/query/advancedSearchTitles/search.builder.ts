import { SEARCH_QUERY_OPTIONS } from './config/search.config';
import type { AdvancedSearchTitlesVariables } from '$lib/graphql/types/variables';
import { getPaginationConfig } from '$lib/core/config/pagination.config';
import { GENRES_MAP, type GenreKey } from '$lib/core/constants/media.filters';
import { getLastWeekDateISO } from '$lib/core/utils/date';

export class SearchQueryBuilder {
	#state = structuredClone(SEARCH_QUERY_OPTIONS);

	// Helpers methods
	#convertToValidArray(input: string | null): string[] | undefined {
		if (!input) return undefined;

		const splitInput = input.split(' ').filter(Boolean);
		return splitInput.length > 0 ? splitInput : undefined;
	}

	#isISODateString(dateStr: string): boolean {
		const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
		return isoDateRegex.test(dateStr);
	}

	#normalizeDateInput(input: string | null): string | null {
		if (!input) return null;
		if (this.#isISODateString(input)) return input;

		const year = parseInt(input);
		return Number.isInteger(year) ? year.toString() : null;
	}

	public withPagination({ page, pageSize }: { page: number; pageSize: number }) {
		const PAGINATION_CONFIG = getPaginationConfig(pageSize);
		const safePage = Math.min(Math.max(page, 1), PAGINATION_CONFIG.MAX_PAGES);

		const maxJumpToPosition = PAGINATION_CONFIG.MAX_WINDOW - pageSize + 1;
		const nextJumpPosition = 1 + (safePage - 1) * pageSize;
		const safeNextJumpPosition = Math.min(nextJumpPosition, maxJumpToPosition);

		this.#state.first = pageSize;
		this.#state.jumpToPosition = safeNextJumpPosition;
		return this;
	}

	public withSearchTerm(searchTerm: string | null) {
		if (searchTerm && searchTerm.trim().length > 0) {
			this.#state.searchTerm = searchTerm.trim();
		}
		return this;
	}

	public withSorting(
		sortBy: AdvancedSearchTitlesVariables['sortBy'] | null,
		sortOrder: AdvancedSearchTitlesVariables['sortOrder'] | null,
	) {
		if (!sortBy) sortBy = 'POPULARITY';
		if (!sortOrder) sortOrder = 'ASC';

		this.#state.sortBy = sortBy;
		this.#state.sortOrder = sortOrder;
		return this;
	}

	public withGenres(genresStr: string | null) {
		if (!genresStr) return this;

		const splitGenres = this.#convertToValidArray(genresStr);
		const transformedGenres = splitGenres?.map((genre) => GENRES_MAP[genre as GenreKey]);

		this.#state.genreIds = transformedGenres;

		return this;
	}

	public withTitles(titlesStr: string | null) {
		if (!titlesStr) return this;

		const splitTitles = this.#convertToValidArray(titlesStr);

		this.#state.titleType = splitTitles;

		return this;
	}

	public withRating(minRating: string | null) {
		const rating = parseFloat(minRating ?? '');

		if (!isNaN(rating)) {
			this.#state.minRating = rating;
		}

		return this;
	}

	public withReleaseYear(from: string | null, to: string | null) {
		const defaultFrom = '2000-01-01';
		const defaultTo = getLastWeekDateISO();

		const validFrom = this.#normalizeDateInput(from);
		const validTo = this.#normalizeDateInput(to);

		this.#state.releaseDateStart = validFrom
			? this.#isISODateString(validFrom)
				? validFrom
				: `${validFrom}-01-01`
			: defaultFrom;

		this.#state.releaseDateEnd = validTo ? (this.#isISODateString(validTo) ? validTo : `${validTo}-12-31`) : defaultTo;

		return this;
	}

	public build(): AdvancedSearchTitlesVariables {
		return this.#state;
	}
}
