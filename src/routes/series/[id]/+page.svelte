<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { SvelteMap } from 'svelte/reactivity';
	import type { PageProps } from './$types';
	import { type Imdb } from '$lib';

	let { data, params }: PageProps = $props();

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

	const seasonEdges = $derived(nodes.get(entry.season) ?? []);
	const currentEpisodeNode = $derived(
		seasonEdges.find((e) => e.node.series.episodeNumber.episodeNumber === entry.episode)?.node
	);
	const episodePlot = $derived(
		currentEpisodeNode?.plots?.edges?.[0]?.node?.plotText?.plainText ?? ''
	);

	let open = $state(false);

	function streamingUrl(id: string) {
		return `https://vidsrc-embed.ru/embed/tv?imdb=${id}&season=${entry.season}&episode=${entry.episode}`;
	}

	function updateURL(season: number, episode: number) {
		goto(`/series/${params.id}?season=${season}&episode=${episode}`, {
			replaceState: true,
			noScroll: true
		});
	}

	function updateEpisode(episode: number) {
		if (entry.episode === episode) return;
		entry.episode = episode;
		updateURL(entry.season, entry.episode);
	}

	function updateSeason(season: number) {
		if (entry.season === season) {
			open = false;
			return;
		}

		entry.season = season;
		entry.episode = 1;
		updateURL(entry.season, entry.episode);
		open = false;

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

	onMount(() => {
		if (!searchParams.season || !searchParams.episode) {
			updateURL(entry.season, entry.episode);
		}

		nodes.set(entry.season, data.series.episodes.episodes.edges);
	});
</script>

<svelte:head>
	<title>BossFlix • {title}</title>
</svelte:head>

<div class="mx-auto my-4 flex min-h-screen w-[90%] flex-col justify-center md:w-3/4 2xl:w-1/2">
	<header class="self-center">
		<a href="/">
			<h1 class="mb-4 justify-self-start font-Chewy text-5xl font-bold tracking-wider">BossFlix</h1>
		</a>
	</header>
	<div class="aspect-video w-full overflow-hidden rounded-lg bg-secondary">
		<iframe
			title={`${title}${year ? ` (${year})` : ''} — player`}
			src={streamingUrl(params.id)}
			class="h-full w-full"
			loading="lazy"
			referrerpolicy="no-referrer"
			allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
			allowfullscreen
		></iframe>
	</div>

	<div class="mt-4 ml-0.5 grid grid-cols-[auto_1fr_auto] gap-x-6">
		<img src={data.series.primaryImage.url} alt={title} class="w-48 object-cover" />
		<div>
			<h2 class="text-[clamp(1.25rem,3vw+1rem,2rem)] font-medium">{title}</h2>
			<div class="flex text-center">
				<svg
					id="imdb-logo"
					class="ipc-logo"
					xmlns="http://www.w3.org/2000/svg"
					width="64"
					height="32"
					viewBox="0 0 64 32"
					version="1.1"
				>
					<!-- yellow background -->
					<g fill="#F5C518">
						<path
							d="
				M0,4
				A4,4 0 0 1 4,0
				H64
				V32
				H4
				A4,4 0 0 1 0,28
				Z
			"
						/>
					</g>

					<!-- black IMDb text -->
					<g fill="#000000" fill-rule="nonzero" transform="translate(8,7)">
						<polygon points="0 18 5 18 5 0 0 0"></polygon>
						<path
							d="M15.6725178,0 L14.5534833,8.40846934 L13.8582008,3.83502426 C13.65661,2.37009263 13.4632474,1.09175121 13.278113,0 L7,0 L7,18 L11.2416347,18 L11.2580911,6.11380679 L13.0436094,18 L16.0633571,18 L17.7583653,5.8517865 L17.7707076,18 L22,18 L22,0 L15.6725178,0 Z"
						></path>
						<path
							d="M24,18 L24,0 L31.8045586,0 C33.5693522,0 35,1.41994415 35,3.17660424 L35,14.8233958 C35,16.5777858 33.5716617,18 31.8045586,18 L24,18 Z M29.8322479,3.2395236 C29.6339219,3.13233348 29.2545158,3.08072342 28.7026524,3.08072342 L28.7026524,14.8914865 C29.4312846,14.8914865 29.8796736,14.7604764 30.0478195,14.4865461 C30.2159654,14.2165858 30.3021941,13.486105 30.3021941,12.2871637 L30.3021941,5.3078959 C30.3021941,4.49404499 30.272014,3.97397442 30.2159654,3.74371416 C30.1599168,3.5134539 30.0348852,3.34671372 29.8322479,3.2395236 Z"
						></path>
						<path
							d="M44.4299079,4.50685823 L44.749518,4.50685823 C46.5447098,4.50685823 48,5.91267586 48,7.64486762 L48,14.8619906 C48,16.5950653 46.5451816,18 44.749518,18 L44.4299079,18 C43.3314617,18 42.3602746,17.4736618 41.7718697,16.6682739 L41.4838962,17.7687785 L37,17.7687785 L37,0 L41.7843263,0 L41.7843263,5.78053556 C42.4024982,5.01015739 43.3551514,4.50685823 44.4299079,4.50685823 Z M43.4055679,13.2842155 L43.4055679,9.01907814 C43.4055679,8.31433946 43.3603268,7.85185468 43.2660746,7.63896485 C43.1718224,7.42607505 42.7955881,7.2893916 42.5316822,7.2893916 C42.267776,7.2893916 41.8607934,7.40047379 41.7816216,7.58767002 L41.7816216,9.01907814 L41.7816216,13.4207851 L41.7816216,14.8074788 C41.8721037,15.0130276 42.2602358,15.1274059 42.5316822,15.1274059 C42.8031285,15.1274059 43.1982131,15.0166981 43.281155,14.8074788 C43.3640968,14.5982595 43.4055679,14.0880581 43.4055679,13.2842155 Z"
						></path>
					</g>
				</svg>

				<span class="inline-block w-16 rounded-r-sm bg-secondary py-0.5 text-lg font-semibold">
					{data.series.ratingsSummary.aggregateRating}
				</span>
			</div>
			<p class="mt-2 ml-0.5">
				{#if episodePlot?.length}
					{episodePlot}
				{:else}
					<span class="loader mt-2 ml-12"></span>
				{/if}
			</p>
		</div>
		<div class="flex flex-col gap-4">
			{#if data?.series.episodes.seasons}
				<div class="relative ml-0.5 w-64">
					<button
						onclick={() => (open = !open)}
						class="w-full cursor-pointer rounded-md bg-secondary p-2 text-lg font-medium"
					>
						Season {entry.season}
					</button>

					{#if open}
						<ul
							class="absolute z-10 mt-1 max-h-36 w-full overflow-y-auto rounded-md bg-secondary shadow-lg"
							id="season_list"
						>
							{#each data.series.episodes.seasons as season (season.number)}
								<li>
									<button
										onclick={() => {
											updateSeason(season.number);
											open = false;
										}}
										type="button"
										class="w-full cursor-pointer p-3 hover:bg-zinc-800"
									>
										Season {season.number}
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			{:else}
				<p class="text-lg">No seasons available.</p>
			{/if}
		</div>

		<div class="col-span-3 mt-4">
			<h3>Episodes:</h3>
			<div class="mt-1 ml-0.5 flex flex-wrap gap-2">
				{#each seasonEdges as episodeNode (episodeNode.node.id)}
					{@const episode = episodeNode.node}
					{@const episodeNumber = episode.series.episodeNumber.episodeNumber}
					<button
						type="button"
						onclick={() => {
							updateEpisode(episodeNumber);
						}}
						class={`size-10 cursor-pointer rounded ${episodeNumber === entry.episode ? 'bg-accent' : 'bg-secondary hover:bg-white/20'} text-center align-middle leading-10 font-semibold`}
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

<style>
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
