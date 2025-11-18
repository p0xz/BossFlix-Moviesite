<script lang="ts">
	import type { PageProps } from './$types';
	import { formatRuntime, historyStorage, isReleased } from '$lib';
	import { MediaCard, Accordion, DualSlider } from '$lib/components/ui';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { quintIn, quintOut } from 'svelte/easing';
	import { GENRES } from '$lib/utils/constants';

	let { data }: PageProps = $props();

	let genres = $state<(keyof typeof GENRES)[]>([]);

	const moviesForView = $derived.by(async () => {
		return (await data.movies).data.advancedTitleSearch.edges.map((movie) => {
			const entity = movie.node.title;
			const titleType = entity.titleType.id;

			const genres = entity.titleGenres?.genres
				.map((g) => g.genre.text)
				.slice(0, 3)
				.join(' • ');

			const labels = [
				formatRuntime(entity?.runtime?.seconds || 0),
				isReleased(entity.releaseDate || {}) ? '' : 'upcoming',
				entity.releaseDate?.year,
			];

			let href = `/${titleType === 'movie' || titleType === 'tvMovie' ? 'movie' : 'series'}/${entity.id}`;

			if (titleType === 'tvSeries') {
				const [lastWatchedSeason, lastWatchedEpisode] = historyStorage.lastWatched(entity.id);
				href += `/?season=${lastWatchedSeason}&episode=${lastWatchedEpisode}`;
			}

			return {
				id: entity.id,
				title: entity.originalTitleText.text,
				posterUrl: entity.primaryImage?.url,
				rating: entity.ratingsSummary?.aggregateRating ?? 'N/A',
				genres: genres,
				labels: labels,
				href: href,
			};
		});
	});

	let showAllGenres = $state(false);
	const popularCutoff = 10;

	const genresToShow = $derived.by(() => {
		const allGenres = Object.entries(GENRES);
		if (showAllGenres) {
			return allGenres;
		}
		return allGenres.slice(0, popularCutoff);
	});

	const buttonText = $derived(showAllGenres ? 'Show Less' : `Show All ${Object.entries(GENRES).length}`);

	function toggleShowAll() {
		showAllGenres = !showAllGenres;
	}

	let releaseYearRange = $state<[number, number]>([2000, 2024]);
</script>

<svelte:head>
	<title>BossFlix • Discover</title>
</svelte:head>

<div class="grid h-full grid-cols-[20rem_1fr]">
	<aside class="flex h-full flex-col border-r border-r-brand-primary-150/20 p-5">
		<article>
			<h2 class="text-xl font-bold">Filters</h2>
			<p class="text-sm text-primary">Refine your search</p>
		</article>
		<Accordion.Container class="mt-4 w-full space-y-4 ">
			<Accordion.Item open={true}>
				{#snippet title()}
					<span class="text-lg font-semibold">Genre</span>
				{/snippet}

				<section class="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
					{#each genresToShow as [key, value] (key)}
						<label class="flex cursor-pointer items-center gap-2 select-none">
							<input
								type="checkbox"
								onchange={() => {
									if (genres.includes(key as keyof typeof GENRES)) {
										genres.splice(genres.indexOf(key as keyof typeof GENRES), 1);
									} else {
										genres.push(key as keyof typeof GENRES);
									}
								}}
								name={key}
								class="rounded border-0 bg-brand-primary-200 text-brand-primary-200 focus:ring-0 focus:ring-offset-0"
							/>
							<span class="hover:text-white/80">{value}</span>
						</label>
					{/each}
				</section>

				<button
					onclick={toggleShowAll}
					class="mt-4 cursor-pointer text-sm font-semibold text-brand-primary-90 hover:text-brand-primary-80"
					type="button"
				>
					{buttonText}
				</button>
			</Accordion.Item>

			<Accordion.Item>
				{#snippet title()}
					<span class="text-lg font-semibold">Release Year</span>
				{/snippet}

				<section class="">
					<DualSlider bind:values={releaseYearRange} min={1900} max={2024} step={1} />
				</section>
			</Accordion.Item>
		</Accordion.Container>
	</aside>
	<main class="px-8 py-16">
		<article class="mb-8 leading-8">
			<h1 class="text-5xl font-bold">Discover</h1>
			<p class="text-primary">Browse through thousands of titles</p>
		</article>
		<ul class="grid grid-cols-5 place-items-center gap-y-4">
			{#await moviesForView then movies}
				{#each movies as movie (movie.id)}
					<li
						animate:flip={{ duration: 700 }}
						in:fly={{ y: 18, opacity: 0, duration: 220, easing: quintIn }}
						out:fly={{ y: -8, opacity: 0, duration: 160, easing: quintOut }}
						class="transition-transform hover:scale-105"
					>
						<a href={movie.href}>
							<MediaCard
								class="w-72!"
								posterUrl={movie.posterUrl}
								title={movie.title}
								genres={movie.genres}
								rating={movie.rating}
								labels={movie.labels}
							/>
						</a>
					</li>
				{/each}
			{/await}
		</ul>
	</main>
</div>

<!-- <img
	alt="Jacob Elordi in Frankenstein (2025)"
	class="ipc-image"
	loading="lazy"
	src="https://m.media-amazon.com/images/M/MV5BYzYzNDYxMTQtMTU4OS00MTdlLThhMTQtZjI4NGJmMTZmNmRiXkEyXkFqcGc@._V1_QL75_UX90_CR0,0,90,133_.jpg"
	srcset="https://m.media-amazon.com/images/M/MV5BYzYzNDYxMTQtMTU4OS00MTdlLThhMTQtZjI4NGJmMTZmNmRiXkEyXkFqcGc@._V1_QL75_UX90_CR0,0,90,133_.jpg 90w, https://m.media-amazon.com/images/M/MV5BYzYzNDYxMTQtMTU4OS00MTdlLThhMTQtZjI4NGJmMTZmNmRiXkEyXkFqcGc@._V1_QL75_UX135_CR0,0,135,200_.jpg 135w, https://m.media-amazon.com/images/M/MV5BYzYzNDYxMTQtMTU4OS00MTdlLThhMTQtZjI4NGJmMTZmNmRiXkEyXkFqcGc@._V1_QL75_UX180_CR0,0,180,266_.jpg 180w"
	sizes="50vw, (min-width: 480px) 34vw, (min-width: 600px) 26vw, (min-width: 1024px) 16vw, (min-width: 1280px) 16vw"
	width="90"
/> -->

<style>
</style>
