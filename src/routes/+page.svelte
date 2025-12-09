<script lang="ts">
	import Rating from '$lib/core/ui/Rating.svelte';
	import { historyStorage } from '$lib/features/history/stores/history.store.svelte';
	import { getResponsiveImage } from '$lib/features/media/logic/image';
	import { getBestHorizontalImage } from '$lib/features/media/logic/image';
	import { Icon } from '$lib/icons';

	import { onMount } from 'svelte';
	import MediaRow from './MediaRow.svelte';

	let { data } = $props();

	const featuredMovie = $derived(data.advancedSearch[data.featuredIndex]);
	const continueWatching = $derived(data.advancedSearch.filter((m) => historyStorage.has(m.id)));
	const trendingMedias = $derived(data.advancedSearch.toSpliced(data.featuredIndex, 1).slice(0, 10));

	const excludedIds = $derived(new Set([featuredMovie?.id, ...trendingMedias.map((t) => t.id)]));

	const recentlyAdded = $derived(data.advancedSearch.filter((m) => !excludedIds.has(m.id)));

	const mediaRows = $derived([
		{ title: 'Trending Now', medias: trendingMedias },
		{ title: 'New Releases', medias: recentlyAdded },
	]);

	const imageSettings = {
		minAspectRatio: 1.6,
		preferredAspectRatio: 1.78,
		minWidth: 1280,
		minHeight: 720,
	};

	const bestBackdrop = $derived(
		getBestHorizontalImage(featuredMovie.images, imageSettings) ||
			getBestHorizontalImage(featuredMovie.images, { ...imageSettings, minAspectRatio: 1.45 }),
	);

	const { src, srcset } = $derived(getResponsiveImage(bestBackdrop?.url, 1280));
</script>

<svelte:head>
	<title>BossFlix • Home</title>
</svelte:head>

<div class="container mx-auto space-y-10 pb-4">
	<section
		class="group relative mt-6 h-[65vh] w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 md:h-[75vh]"
	>
		<img
			{src}
			{srcset}
			alt={featuredMovie.title}
			draggable="false"
			class="absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity duration-700 select-none group-hover:opacity-100"
		/>
		<div class="absolute inset-0 bg-linear-to-t from-body via-body/40 to-transparent"></div>
		<div class="absolute bottom-0 left-0 max-w-3xl p-6 md:p-16">
			<h1 class="mb-3 text-4xl leading-none font-black text-white drop-shadow-lg md:text-7xl">{featuredMovie.title}</h1>
			<div class="mb-6 flex items-center gap-3 text-xs font-medium text-gray-300 md:text-sm">
				<!-- <span class="font-bold text-green-400">{featuredMovie.rating}</span> -->
				<Rating rating={featuredMovie.rating} />
				<span>{featuredMovie.releaseDate?.year}</span>
				{#if featuredMovie.tvRating}
					<span class="rounded border border-white/20 px-1 text-[10px]">{featuredMovie.tvRating}</span>
				{/if}
				<span>{featuredMovie.genres}</span>
			</div>
			<div class="flex gap-3">
				<a
					href={featuredMovie.href}
					class="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
				>
					<Icon.Filled.Play class="size-5 fill-current" />
					Play
				</a>
			</div>
		</div>
	</section>

	{#each mediaRows as mediaRow (mediaRow.title)}
		<MediaRow rowTitle={mediaRow.title} medias={mediaRow.medias} />
	{/each}
</div>
