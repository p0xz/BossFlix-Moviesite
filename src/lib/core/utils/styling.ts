import type { commonDataTypes } from '$lib/features/media/logic/transformer';

export const RATING_MAP = {
	EXCELLENT: 8.0,
	GOOD: 7.0,
	AVERAGE: 5.0,
} as const;

export function ratingStyle(rating: commonDataTypes['rating']): string {
	if (rating === 'N/A') return 'text-gray-400';

	if (rating >= RATING_MAP.EXCELLENT) {
		return 'text-green-400';
	} else if (rating >= RATING_MAP.GOOD) {
		return 'text-yellow-400';
	} else if (rating >= RATING_MAP.AVERAGE) {
		return 'text-blue-400';
	} else {
		return 'text-red-400';
	}
}
