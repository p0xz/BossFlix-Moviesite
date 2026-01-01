<script lang="ts">
	import { Icon } from '$lib/icons';
	import VideoPlayer from './VideoPlayer.svelte';
	import { buildSourceUrl } from '$lib/features/player/logic/sources/registry';
	import { clickOutsideOfNode } from '$lib/core/actions/clickOutside';
	import type { SourceOrigin } from '$lib/features/player/config/source.config';

	interface Props {
		url: string; // Native URL
		imdbId: string;
		season?: number;
		episode?: number;
		mediaTitle: string;
		selectedServer?: 'native' | SourceOrigin;
		autoPlay?: boolean;
		onEnded?: () => void;
		class?: string;
	}

	let {
		url,
		imdbId,
		season,
		episode,
		mediaTitle,
		selectedServer = $bindable('native'),
		autoPlay = $bindable(false),
		onEnded,
		class: className,
	}: Props = $props();

	let currentSourceUrl = $derived.by(() => {
		if (selectedServer === 'native') return url;
		try {
			// Type assertion since we know it's a SourceOrigin if not 'native'
			return buildSourceUrl(selectedServer as SourceOrigin, imdbId, { season, episode });
		} catch (e) {
			console.error(e);
			return '';
		}
	});
</script>

<div class={['group relative w-full overflow-hidden bg-black', className]}>
	{#if selectedServer === 'native'}
		<VideoPlayer
			{url}
			{mediaTitle}
			{imdbId}
			{season}
			{episode}
			{autoPlay}
			{onEnded}
			class="h-full w-full"
		/>
	{:else}
		<iframe
			title="{mediaTitle} - player"
			src={currentSourceUrl}
			class="h-full w-full border-0"
			allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
			allowfullscreen
		></iframe>
	{/if}
</div>
