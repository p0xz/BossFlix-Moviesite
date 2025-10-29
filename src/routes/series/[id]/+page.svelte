<script lang="ts">
	import type { PageProps } from './$types';
	import { SvelteMap } from 'svelte/reactivity';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { fixDigits, truncate, type Imdb } from '$lib';
	import { Icon } from '$lib/icons';
	import Switch from '$lib/components/ui/Switch.svelte';
	import ImdbLogo from '$lib/components/ui/ImdbLogo.svelte';
	import type { Attachment } from 'svelte/attachments';

	let { data, params }: PageProps = $props();

	const CHUNK = 30;
	const title = data?.series?.originalTitleText?.text ?? 'Untitled';
	const year = data.series?.releaseDate?.year;
	const searchParams = Object.fromEntries(page.url.searchParams.entries()) as {
		season?: string;
		episode?: string;
	};

	type EdgeList = Imdb.Series['episodes']['episodes']['edges'];
	let nodes = new SvelteMap<number, EdgeList>();

	let entry = $state({
		season: Math.max(Number(searchParams?.season) || 1),
		episode: Math.max(Number(searchParams?.episode) || 1)
	});
	let playerOptions = $state<{ autoPlay: 1 | 0; autoNext: 1 | 0 }>({
		autoPlay: 1,
		autoNext: 1
	});

	let iframeSrc = $state('');
	let isSeasonMenuActive = $state(false);
	let isEpisodeMenuActive = $state(false);
	let episodeChunk = $state(0);

	const seasonEdges = $derived(nodes.get(entry.season) ?? []);
	const totalEpisodes = $derived(seasonEdges.length);
	const chunkCount = $derived(Math.ceil(totalEpisodes / CHUNK));
	const currentEpisodeNode = $derived.by(() => {
		return seasonEdges.find((e) => {
			const epNumber = e.node.series.episodeNumber.episodeNumber;
			return epNumber === entry.episode;
		})?.node;
	});
	const episodePlot = $derived(currentEpisodeNode?.plots?.edges?.[0]?.node?.plotText?.plainText);
	const seasons = $derived(data?.series?.episodes?.seasons ?? []);

	const episodesForUI = $derived.by<EdgeList>(() => {
		const start = episodeChunk * CHUNK;
		const end = start + CHUNK;
		return seasonEdges.slice(start, end);
	});

	const episodeRanges = $derived.by(() =>
		Array.from({ length: chunkCount }, (_, idx) => {
			const start = fixDigits(idx * CHUNK + 1);
			const end = Math.min((idx + 1) * CHUNK, totalEpisodes);
			return `${start}-${end}`;
		})
	);

	const currentRangeLabel = $derived(
		totalEpisodes
			? `${fixDigits(episodeChunk * CHUNK + 1)}-${Math.min((episodeChunk + 1) * CHUNK, totalEpisodes)}`
			: ''
	);

	function buildMediaSource(id: string, season: number, episode: number) {
		return `https://vidsrc-embed.ru/embed/tv?imdb=${id}&season=${season}&episode=${episode}&autonext=${playerOptions.autoNext}&autoplay=${playerOptions.autoPlay}`;
	}

	function updateURL(season: number, episode: number) {
		goto(`/series/${params.id}?season=${season}&episode=${episode}`, {
			replaceState: true,
			noScroll: true
		});
	}

	function updateEpisode(episode: number) {
		if (entry.episode === episode) return;

		if (Number.isInteger(entry.episode / CHUNK)) {
			episodeChunk += 1;
		}

		entry.episode = episode;
		updateURL(entry.season, entry.episode);
	}

	function updateSeason(season: number) {
		if (entry.season === season) {
			isSeasonMenuActive = false;
			return;
		}

		entry.season = season;
		entry.episode = 1;
		episodeChunk = 0;
		isSeasonMenuActive = false;
		updateURL(entry.season, entry.episode);

		if (!nodes.has(season)) {
			fetchSeason(season);
		}
	}

	async function fetchSeason(season: number) {
		const response = await fetch(`/api/series/?id=${params.id}&season=${season}`).then(
			(res) => res.json() as Promise<{ episodes: Imdb.Series['episodes']['episodes'] }>
		);

		nodes.set(season, response.episodes.edges);
	}

	function outsideClick(callback: () => void): Attachment {
		return (element) => {
			function handleClick(event: MouseEvent) {
				if (!element.contains(event.target as Node)) {
					callback();
				}
			}

			document.addEventListener('click', handleClick);

			return () => {
				document.removeEventListener('click', handleClick);
			};
		};
	}

	onMount(() => {
		if (!searchParams.season || !searchParams.episode) {
			updateURL(entry.season, entry.episode);
		}

		const episodeEdges = data.series?.episodes?.episodes?.edges;
		if (episodeEdges) {
			nodes.set(entry.season, episodeEdges);
			episodeChunk = Math.max(0, Math.floor((entry.episode - 1) / CHUNK));
		}

		iframeSrc = buildMediaSource(params.id, entry.season, entry.episode);
	});
</script>

<svelte:window
	onmessage={(event) => {
		interface PlayerData {
			type: 'PLAYER_EVENT';
			data?: {
				imdbId: string;
				tmdbId: number;
				type: string;
				season: number;
				episode: number;
				currentTime: number;
				duration: number;
				// There are more events, but just added these for now since I don't see a point to add more
				event: 'ended' | 'end' | 'finished' | 'pause' | 'paused' | 'fileend';
			};
		}

		const playerData = <PlayerData>event.data;

		if (playerData?.type !== 'PLAYER_EVENT' || !playerData?.data) return;

		if (playerData.data?.episode !== entry.episode && playerOptions.autoNext) {
			if (playerData.data?.season !== entry.season) updateSeason(playerData.data.season);
			updateEpisode(playerData.data?.episode);
		}
	}}
/>

<svelte:head>
	<title>BossFlix • {title}</title>
</svelte:head>

<div class="mx-auto flex min-h-screen w-[90%] max-w-5xl flex-col justify-center py-4">
	<header class="self-center">
		<a href="/">
			<h1 class="mb-4 justify-self-start font-Chewy text-5xl font-bold tracking-wider">BossFlix</h1>
		</a>
	</header>
	<div class="aspect-video w-full overflow-hidden rounded-lg bg-surface">
		<iframe
			title={`${title}${year ? ` (${year})` : ''} — player`}
			src={iframeSrc}
			class="h-full w-full"
			loading="lazy"
			referrerpolicy="origin"
			allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
			allowfullscreen
		></iframe>
	</div>
	<div class="grid grid-cols-[auto_1fr_auto] gap-x-4 sm:grid-cols-[auto_1fr_15rem]">
		<div
			class="col-span-full my-4 grid grid-cols-subgrid items-center gap-2 max-sm:grid-rows-2 sm:flex-row sm:justify-between"
		>
			<div class="text-center max-sm:col-span-full sm:text-end 2md:col-start-2">
				<Switch
					condition={playerOptions.autoNext === 1}
					event={() => {
						if (playerOptions.autoNext === 1) playerOptions.autoNext = 0;
						else playerOptions.autoNext = 1;

						iframeSrc = buildMediaSource(params.id, entry.season, entry.episode);
					}}
				>
					Auto Next
				</Switch>
			</div>

			{#if seasons}
				<div class="relative max-sm:col-span-full max-sm:row-start-2 max-sm:w-full sm:col-start-3">
					<button
						onclick={() => {
							isSeasonMenuActive = !isSeasonMenuActive;
						}}
						{@attach outsideClick(() => {
							isSeasonMenuActive = false;
						})}
						type="button"
						class="w-full cursor-pointer rounded-md bg-brand-primary-150/15 p-2 text-lg"
					>
						Season {entry.season}
					</button>

					{#if isSeasonMenuActive}
						<div
							class="absolute z-20 mt-2 max-h-44 w-full overflow-y-auto rounded-md bg-surface shadow-md"
							id="season_list"
							transition:slide
						>
							<ul class="bg-brand-primary-150/15">
								{#each seasons as season (season.number)}
									<li>
										<button
											onclick={() => {
												updateSeason(season.number);
												iframeSrc = buildMediaSource(params.id, entry.season, entry.episode);
											}}
											type="button"
											class="w-full cursor-pointer p-3 hover:bg-brand-primary-150/30"
										>
											Season {season.number}
										</button>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			{:else}
				<p class="text-lg">No seasons available.</p>
			{/if}
		</div>

		<div
			class="grid grid-cols-subgrid gap-y-4 max-sm:col-span-3 max-sm:row-start-3 max-sm:mt-4 max-xs:grid-rows-[auto_auto] max-xs:gap-y-4 2md:col-span-2"
		>
			<img
				src={data.series.primaryImage?.url}
				draggable="false"
				alt={title}
				class="w-58 object-cover max-2md:order-2 max-2md:mt-4 max-sm:col-start-1 max-sm:mt-0 max-xs:row-start-2"
			/>
			<div class="max-xs:col-span-full">
				<h2 class="text-[clamp(1.25rem,3vw+1rem,2rem)] font-medium">{title}</h2>
				<div class="flex text-center">
					<ImdbLogo class="h-8 w-16" />
					<span
						class="inline-block w-16 rounded-r-sm bg-brand-primary-150/15 py-0.5 text-lg font-semibold"
					>
						{data.series.ratingsSummary.aggregateRating}
					</span>
				</div>
				<p class="mt-2 ml-0.5">
					{#if episodePlot?.length}
						{truncate(episodePlot, 450)}
					{:else}
						<span class="loader mt-2 ml-12"></span>
					{/if}
				</p>
			</div>
		</div>

		<div class="col-start-1 max-sm:col-span-3 sm:col-start-3">
			<div class="relative mx-1">
				<h3 class="text-primary">List of episodes:</h3>
				{#if totalEpisodes > CHUNK}
					<div>
						<button
							type="button"
							onclick={() => (isEpisodeMenuActive = !isEpisodeMenuActive)}
							{@attach outsideClick(() => {
								isEpisodeMenuActive = false;
							})}
							aria-label="episodes"
							aria-expanded={isEpisodeMenuActive}
							class="flex cursor-pointer items-center gap-x-1 text-sm font-light text-primary"
						>
							EPS: {currentRangeLabel}

							<Icon.Linear.ArrowUp
								class={`size-4 fill-neutral-300 transition-transform ${isEpisodeMenuActive && 'rotate-180'}`}
							/>
						</button>

						{#if isEpisodeMenuActive}
							<div
								class="absolute -left-0.5 z-10 max-h-44 w-full overflow-y-auto rounded-md bg-surface shadow-md"
								id="season_list"
								transition:slide
							>
								<ul class="bg-brand-primary-150/15">
									{#each episodeRanges as range, index}
										<li>
											<button
												onclick={() => {
													isEpisodeMenuActive = false;
													episodeChunk = index;
												}}
												type="button"
												class="w-full cursor-pointer p-3 hover:bg-brand-primary-150/30"
											>
												EPS: {range}
											</button>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<div class="mt-1 ml-0.5 flex flex-wrap gap-2">
				{#each episodesForUI as episodeNode (episodeNode.node.id)}
					{@const episode = episodeNode.node}
					{@const episodeNumber = episode.series.episodeNumber.episodeNumber}
					{@const isEntryCurrentEpisode = episodeNumber === entry.episode}

					<button
						type="button"
						onclick={() => {
							updateEpisode(episodeNumber);
							iframeSrc = buildMediaSource(params.id, entry.season, entry.episode);
						}}
						class={`size-10 cursor-pointer rounded border-neutral-600 text-primary/40 ring-[1.5px] ring-transparent ring-offset-[1.5px] ring-offset-neutral-850
						${isEntryCurrentEpisode ? 'bg-brand-primary-200 text-white' : 'bg-brand-primary-150/15 hover:ring-neutral-500'}
						text-center align-middle leading-10 font-semibold`}
					>
						{episodeNumber}
					</button>
				{:else}
					<span class="loader mt-2 ml-4"></span>
				{/each}
			</div>
		</div>
	</div>
</div>

<style global>
	#season_list::-webkit-scrollbar {
		width: 8px;
	}

	#season_list::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 4px;
	}

	#season_list::-webkit-scrollbar-thumb:hover {
		background-color: rgba(255, 255, 255, 0.3);
	}

	.loader {
		width: 2rem;
		height: 2rem;
		display: inline-block;
		border-radius: 50%;
		position: relative;
		animation: rotate 1s linear infinite;
	}
	.loader::before {
		content: '';
		position: absolute;
		inset: 0px;
		border-radius: 50%;
		border: 5px solid #fff;
		animation: prixClipFix 2s linear infinite;
	}

	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes prixClipFix {
		0% {
			clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
		}
		25% {
			clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
		}
		50% {
			clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
		}
		75% {
			clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
		}
		100% {
			clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
		}
	}
</style>
