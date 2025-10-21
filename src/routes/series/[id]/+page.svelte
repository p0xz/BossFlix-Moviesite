<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { PageProps } from './$types';

	let { data, params }: PageProps = $props();

	const title = data?.series?.originalTitleText?.text ?? 'Untitled';
	const searchParams = Object.fromEntries(page.url.searchParams.entries());

	let nodes = $state(new Map<string, any>());

	let entry = $state({
		season: Number(searchParams?.season) || 1,
		episode: Number(searchParams?.episode) || 1
	});

	let open = $state(false);

	function updateURL(season: number, episode: number, state: boolean = false) {
		goto(`/series/${params.id}/?season=${season}&episode=${episode}`, {
			replaceState: state
		});
	}

	function updateEpisode(episode: number) {
		entry.episode = episode;
		updateURL(entry.season, entry.episode);
	}

	function updateSeason(season: number) {
		entry.season = season;
		entry.episode = 1;
		updateURL(entry.season, entry.episode);
	}

	onMount(() => {
		if (!searchParams.season || !searchParams.episode) {
			updateURL(entry.season, entry.episode, true);
		}
	});
</script>

<svelte:head>
	<title>BossFlix • {title}</title>
</svelte:head>

<div class="mx-auto flex min-h-screen w-[90%] flex-col justify-center md:w-3/4 2xl:w-1/2">
	<header class="self-center">
		<a href="/">
			<h1 class="mb-4 justify-self-start font-Chewy text-5xl font-bold tracking-wider">BossFlix</h1>
		</a>
	</header>
	<div class="aspect-video w-full overflow-hidden rounded-lg bg-white/5"></div>

	<div class="ml-0.5">
		<h2 class="my-4 text-[clamp(1.25rem,3vw+1rem,2rem)] font-medium">{title}</h2>
		<div class="flex flex-col gap-4">
			{#if data?.series.episodes.seasons}
				<div class="relative ml-0.5 w-64">
					<button
						onclick={() => (open = !open)}
						class="w-full cursor-pointer rounded-md bg-zinc-900 p-2 text-lg font-medium"
					>
						Season {entry.season}
					</button>

					{#if open}
						<ul
							class="absolute z-10 mt-1 max-h-36 w-full overflow-y-auto rounded-md bg-zinc-900 shadow-lg"
							id="season_list"
						>
							{#each data.series.episodes.seasons as season}
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
		<div class="mt-4">
			<h3>Episodes:</h3>
			<div class="mt-1 ml-0.5 flex gap-2">
				{#each data.series.episodes.episodes.edges as episodeNode}
					{@const episode = episodeNode.node}
					<button
						type="button"
						onclick={() => {
							updateEpisode(episode.series.episodeNumber.episodeNumber);
						}}
						class="size-10 cursor-pointer rounded bg-white/5 text-center align-middle leading-10 font-semibold hover:bg-white/10"
					>
						{episode.series.episodeNumber.episodeNumber}
					</button>
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
</style>
