<!-- <script lang="ts">
	import type { PageProps } from './$types';
	import type { sourceOrigins } from '$lib/utils/sources';
	import { capitalize } from '$lib/utils/common';
	import { outsideClick } from '$lib/attachments';
	import { SourceBuilder } from '$lib/utils/sources';
	import { historyStorage } from '$lib/stores/historyStore.svelte';
	import { onMount } from 'svelte';
	import { Icon } from '$lib/icons';
	import { Loader, MediaCard } from '$lib/components/ui';

	let { data, params }: PageProps = $props();

	const movie = data?.movie;

	const title = movie?.originalTitleText?.text ?? 'Untitled';
	const year = movie?.releaseDate?.year;
	const genres = movie?.titleGenres?.genres?.map((g) => g?.genre?.text);
	const plotText = movie.plot?.plotText?.plainText ?? 'No plot available';
	const directors = movie?.directors.edges;
	const rating = movie?.ratingsSummary?.aggregateRating;

	let isServersMenuActive = $state(false);
	let defaultSource = $state<sourceOrigins>('vidsrc');

	let iframeSrc = $derived.by(() => {
		return SourceBuilder.build(defaultSource, params.id);
	});

	onMount(() => {
		historyStorage.init(params.id, {
			title,
			posterUrl: movie?.primaryImage?.url ?? '',
			titleType: 'movie' as const,
			releaseYear: year ?? 0,
			rating: rating ?? 0,
			genres: genres ?? [],
			runtime: movie?.runtime?.seconds ?? 0,
		});
	});
</script> -->

<script lang="ts">
	import Rating from '$lib/core/ui/Rating.svelte';
	import { buildSourceUrl } from '$lib/features/player/logic/sources/registry';

	let { data, params } = $props();

	let iframeSrc = $derived(buildSourceUrl('vidsrc', params.id));
</script>

<svelte:head>
	<title>BossFlix • {data.movie.title}</title>
</svelte:head>

<div class="container mx-auto my-6">
	<article class="mb-4">
		<h1 class="text-3xl font-black md:text-4xl">{data.movie.title}</h1>
	</article>
	<div>
		<iframe
			title={`${data.movie.title}${data.movie.releaseDate?.year ? ` (${data.movie.releaseDate.year})` : ''} — player`}
			src={iframeSrc}
			class="mx-auto mb-6 aspect-video rounded-2xl shadow-2xl ring-1 ring-white/10"
			loading="lazy"
			referrerpolicy="no-referrer"
			allow="autoplay; encrypted-media; picture-in-picture; fullscreen;"
			allowfullscreen
		></iframe>
		<section>
			<div class="grid grid-cols-2 gap-4 rounded-xl border border-white/5 bg-surface p-6 text-sm md:grid-cols-4">
				<div>
					<span class="mb-1 block text-xs font-bold text-gray-500 uppercase">Rating</span>
					<Rating rating={data.movie.rating} class="text-lg" />
				</div>
				<div>
					<span class="mb-1 block text-xs font-bold text-gray-500 uppercase">Year</span>
					<span class="text-lg font-bold text-white">
						{data.movie.releaseDate?.year ?? 'Unknown'}
					</span>
				</div>
				<div>
					<span class="mb-1 block text-xs font-bold text-gray-500 uppercase">Type</span>
					<span class="text-lg font-bold text-white capitalize"> Movie </span>
				</div>
				<div>
					<span class="mb-1 block text-xs font-bold text-gray-500 uppercase">Genre</span>
					<span class="text-lg font-bold text-white">
						{data.movie.genres.slice(0, 2).join(' • ')}
					</span>
				</div>
			</div>

			<div class="mt-6 flex flex-col gap-2">
				<span class="text-xs font-bold tracking-wider text-gray-500 uppercase">Directed By</span>
				<div class="flex flex-wrap gap-2">
					{#each data.movie.directors as director (director)}
						<span
							class="cursor-default rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-sm text-gray-200 transition-colors select-none hover:bg-white/10 hover:text-white"
						>
							{director}
						</span>
					{/each}
				</div>
			</div>

			<article class="mt-6">
				<p class="ml-px text-lg leading-relaxed text-gray-400">
					{data.movie.plot}
				</p>
			</article>
		</section>
	</div>
</div>
