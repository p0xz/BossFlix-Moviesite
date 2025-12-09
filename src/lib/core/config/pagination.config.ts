export const GLOBAL_PAGINATION_CONSTANTS = {
	MAX_RESULT_WINDOW: 10_000,
} as const;

export function getPaginationConfig(size: number) {
	const MAX_WINDOW = GLOBAL_PAGINATION_CONSTANTS.MAX_RESULT_WINDOW;

	const safeSize = Math.max(1, size);

	const MAX_PAGES = Math.floor(MAX_WINDOW / safeSize);

	return { MAX_WINDOW, MAX_PAGES };
}

export const DEFAULT_CUT_OFF = 16 as const;
export const DEFAULT_PAGE_SIZE = 25 as const;
