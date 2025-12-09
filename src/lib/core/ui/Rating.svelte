<script lang="ts">
	import type { commonDataTypes } from '$lib/features/media/logic/transformer';
	import { Icon } from '$lib/icons';
	import { ratingStyle } from '../utils/styling';

	interface Props {
		rating: commonDataTypes['rating'];
		class?: string;
	}

	let { rating, class: className = '' }: Props = $props();
</script>

<span class={['flex items-center gap-x-1 font-bold', ratingStyle(rating), className]}>
	{rating}
	<Icon.Filled.Star class="inline-block size-4 fill-current" />
</span>
