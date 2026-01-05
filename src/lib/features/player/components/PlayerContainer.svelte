<script lang="ts">
	import { Icon } from '$lib/icons';
	import VideoPlayer from './VideoPlayer.svelte';
	import { buildSourceUrl } from '$lib/features/player/logic/sources/registry';
	import { clickOutsideOfNode } from '$lib/core/actions/clickOutside';
	import type { PlayerMessageEmitter } from '$lib/types/player';
	import { untrack } from 'svelte';
	import { isPlayerEvent, sendPlayerCommand } from '$lib/features/player/logic/bridge';
	import type { SourceOrigin } from '$lib/features/player/config/source.config';

	interface Props {
		url: string; // Native URL
		imdbId: string;
		season: number;
		episode: number;
		mediaTitle: string;
		selectedServer?: 'native' | SourceOrigin;
		autoPlay?: boolean;
		autoNext?: boolean;
		autoSubtitles?: boolean;
		onEnded?: () => void;
		updateURL: (season: number, episode: number) => Promise<void>;
		class?: string;
	}

	let {
		url,
		imdbId,
		season,
		episode,
		mediaTitle,
		selectedServer = $bindable('vidsrc'),
		autoPlay = $bindable(true),
		autoNext = $bindable(true),
		autoSubtitles = $bindable(true),
		updateURL,
		onEnded,
		class: className,
	}: Props = $props();

	let iframeRef: HTMLIFrameElement | null = $state(null);

	let currentSourceUrl = $derived.by(() => {
		if (selectedServer === 'vidsrc' && autoNext) {
			return buildSourceUrl(selectedServer as SourceOrigin, imdbId, {
				season: untrack(() => season),
				episode: untrack(() => episode),
				autoNext: true,
				autoPlay,
				autoSubtitles,
			});
		}

		try {
			return buildSourceUrl(selectedServer as SourceOrigin, imdbId, {
				season,
				episode,
				autoNext,
				autoPlay,
				autoSubtitles,
			});
		} catch (e) {
			console.error(e);
			return '';
		}
	});

	let messages = $state<any[]>([]);

	async function handleMessage(
		event: MessageEvent<any> & {
			currentTarget: EventTarget & Window;
		},
	) {
		// if (selectedServer !== 'vidsrc') return;

		const incomingMessage = <PlayerMessageEmitter.PlayerJS.PlayerEventData>event.data;

		const isEventSubtitle =
			!isPlayerEvent(incomingMessage) &&
			(incomingMessage.event === 'subtitle' || incomingMessage.event === 'subtitles');
		const arePlayerSubtitlesOn = typeof incomingMessage.data === 'string' && incomingMessage.data !== 'off';

		if (isEventSubtitle && arePlayerSubtitlesOn && !autoSubtitles) {
			sendPlayerCommand(iframeRef?.contentWindow, 'subtitle', -1);
		}

		if (isPlayerEvent(incomingMessage) && autoNext) {
			// messages.push(incomingMessage);
			// if (messages.length > 20) {
			// 	messages.shift();
			// }

			const newEpisode = incomingMessage.data?.episode;
			const newSeason = incomingMessage.data?.season;

			const hasEpisodeChanged = newEpisode && newEpisode !== episode;
			const hasSeasonChanged = newSeason && newSeason !== season;

			if (hasEpisodeChanged || hasSeasonChanged) {
				const seasonToNavigate = newSeason ?? season;
				const episodeToNavigate = newEpisode ?? 1;

				const currentUrl = new URL(window.location.href);
				currentUrl.searchParams.set('season', seasonToNavigate.toString());
				currentUrl.searchParams.set('episode', episodeToNavigate.toString());
				history.replaceState(history.state, '', currentUrl.toString());

				onEnded?.();

				// await updateURL(seasonToNavigate, episodeToNavigate);

				// if (!nodes.has(seasonToNavigate)) {
				// 	await invalidate('app:episodes');
				// }

				// isPlayerNavigating = false;
			}
		}
	}
</script>

<svelte:window onmessage={handleMessage} />

<div class={['group relative w-full overflow-hidden bg-black', className]}>
	{#if selectedServer === 'native'}
		<VideoPlayer {url} {mediaTitle} {imdbId} {season} {episode} {autoPlay} {onEnded} class="h-full w-full" />
	{:else}
		<iframe
			bind:this={iframeRef}
			title="{mediaTitle} - player"
			src={currentSourceUrl}
			class="h-full w-full border-0"
			allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
			allowfullscreen
		></iframe>
	{/if}
</div>
