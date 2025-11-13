<script lang="ts">
	import type { PageProps } from './$types';
	import type { sourceOrigins } from '$lib/utils/sources';
	import { capitalize, outsideClick, SourceBuilder, watchedStore } from '$lib';
	import { onMount } from 'svelte';
	import { Icon } from '$lib/icons';
	import { Loader, MediaCard } from '$lib/components/ui';

	let { data, params }: PageProps = $props();

	function streamingUrl(id: string) {
		return `https://vidsrc-embed.ru/embed/movie?imdb=${id}`;
	}

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
		watchedStore.init(params.id, 0, true);
		watchedStore.setEntries(params.id, {
			title,
			posterUrl: movie?.primaryImage?.url ?? '',
			genres: genres ?? [],
			rating: rating ?? 0,
			titleType: 'movie',
			totalSeasons: 0,
			totalEpisodes: 0,
			releaseYear: year ?? null,
			runtime: movie?.runtime?.seconds ?? 0,
		});
	});
</script>

<svelte:head>
	<title>BossFlix • {title}</title>
</svelte:head>

<svelte:window onmessage={(event) => {}} />

<div class="container mx-auto flex flex-col justify-center py-4">
	<header class="self-center">
		<a href="/">
			<h1 class="mb-4 justify-self-start font-Chewy text-5xl font-bold tracking-wider">BossFlix</h1>
		</a>
	</header>
	<div class="relative aspect-video w-full rounded-lg bg-surface">
		<iframe
			title={`${title}${year ? ` (${year})` : ''} — player`}
			src={iframeSrc}
			class="h-full w-full"
			loading="lazy"
			referrerpolicy="no-referrer"
			allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
			allowfullscreen
		></iframe>
		<div
			class="pointer-events-none"
			{@attach outsideClick(() => {
				isServersMenuActive = false;
			})}
		>
			<button
				class="pointer-events-auto absolute top-3 right-3 flex cursor-pointer items-center gap-x-1 rounded-md bg-brand-primary-150/15 px-2.5 py-1.5
           text-xs text-white ring-1 ring-white/20 backdrop-blur hover:bg-brand-primary-150/25"
				onclick={() => (isServersMenuActive = !isServersMenuActive)}
				aria-haspopup="menu"
				aria-expanded={isServersMenuActive}
			>
				<Icon.Linear.Server class="size-6 shrink-0 fill-brand-primary-150/75" />
				Servers
			</button>

			{#if isServersMenuActive}
				<div
					role="menu"
					class="pointer-events-auto absolute top-14 right-3 z-10 w-48 overflow-hidden rounded-lg
             bg-brand-primary-150/15 shadow-2xl ring-2 ring-white/10 backdrop-blur-2xl"
				>
					{#each Object.keys(SourceBuilder.ORIGINS) as key (key)}
						<button
							role="menuitem"
							class="w-full cursor-pointer rounded-md p-3 px-3 py-2 text-left text-sm hover:bg-brand-primary-150/25"
							onclick={() => {
								defaultSource = key as keyof typeof SourceBuilder.ORIGINS;

								isServersMenuActive = false;
							}}
						>
							{capitalize(key)}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
	<div class="mt-6 flex gap-x-4">
		<MediaCard
			posterUrl={data.movie.primaryImage.url ?? ''}
			{title}
			genres={data.movie.titleGenres.genres
				.map((g) => g.genre.text)
				.slice(0, 3)
				.join(' • ')}
			rating={data.movie?.ratingsSummary?.aggregateRating ?? `N/A`}
		/>

		<article class="space-y-2 text-sm text-primary">
			<header>
				<h1 class="text-4xl font-bold">{title}</h1>
				<ul class="ml-1 flex gap-x-2">
					<li class="font-medium">Directed by:</li>
					{#each directors as director (director.node.name.nameText.text)}
						{@const directorName = director.node.name.nameText.text}

						<li class="text-white">{directorName}</li>
					{/each}
				</ul>
			</header>
			<section class="ml-1">
				<p>
					{#if plotText?.length}
						{plotText}
					{:else}
						<Loader class="mt-2 ml-12" />
					{/if}
				</p>
			</section>
		</article>
	</div>
</div>
