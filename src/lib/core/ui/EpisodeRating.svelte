<script lang="ts">
	import Rating from './Rating.svelte';
	import type { commonDataTypes } from '$lib/features/media/logic/transformer';
	import { RATING_MAP } from '../utils/styling';

	interface Props {
		rating: commonDataTypes['rating'];
		class?: string;
	}

	let { rating, class: className = '' }: Props = $props();

	function episodeRatingStyle(rating: commonDataTypes['rating']): string {
		if (rating === 'N/A') return 'text-gray-400';

		if (rating >= RATING_MAP.EXCELLENT) {
			return 'text-green-400 border-green-500/20 bg-green-500/10';
		} else if (rating >= RATING_MAP.GOOD) {
			return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10';
		} else if (rating >= RATING_MAP.AVERAGE) {
			return 'text-blue-400 border-blue-500/20 bg-blue-500/10';
		} else {
			return 'text-red-400 border-red-500/20 bg-red-500/10';
		}
	}
</script>

<div class={['inline-flex items-center gap-2 rounded-lg border px-3 py-1.5', episodeRatingStyle(rating), className]}>
	<span class="text-xs font-bold uppercase">Episode Rating</span>
	<Rating {rating} class="text-sm" />
</div>
