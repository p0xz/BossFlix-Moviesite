<script lang="ts">
	import type { PageProps } from './$types';
	import { formatRuntime, historyStorage, inputCharacterLimit, isReleased, nonDigitInputPrevent } from '$lib';
	import { DEFAULT_RELEASE_YEAR, GENRES_LIST } from './constants';
	import { MediaCard, MediaCardSkeleton, Accordion } from '$lib/components/ui';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { quintIn, quintOut } from 'svelte/easing';
	import Pagination from './Pagination.svelte';
	import { Icon } from '$lib/icons';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { PAGE_SIZE } from '$lib/utils/imdb';

	let { data }: PageProps = $props();

	const popularCutoff = 16;

	let genres = $state(GENRES_LIST);
	let showAllGenres = $state(false);

	let rating = $derived(parseFloat(page.url.searchParams.get('rating') || '') || 0);
	let releaseYear = $derived.by(() => {
		const from = parseInt(page.url.searchParams.get('releaseYearFrom') || '') || DEFAULT_RELEASE_YEAR.from;
		const to = parseInt(page.url.searchParams.get('releaseYearTo') || '') || DEFAULT_RELEASE_YEAR.to;

		return { from, to };
	});

	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);
	const ratingProgress = $derived((rating / 10) * 100);
	const buttonText = $derived(showAllGenres ? 'Show Less' : `Show All ${Object.keys(GENRES_LIST).length}`);

	const activeGenresString = $derived(
		Object.entries(genres)
			.filter(([_, val]) => val.state)
			.map(([_, val]) => val.label)
			.join(' '),
	);
	const advancedSearchData = $derived.by(async () => {
		return (await data.advancedSearch).data.advancedTitleSearch;
	});

	const advancedSearchUI = $derived.by(async () => {
		return (await advancedSearchData).edges.map((movie) => {
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

	const genresToShow = $derived.by(() => {
		const allGenres = Object.entries(genres);
		if (showAllGenres) {
			return allGenres;
		}
		return allGenres.slice(0, popularCutoff);
	});

	function clearFilters() {
		genres = GENRES_LIST;
		rating = 0;
		releaseYear = DEFAULT_RELEASE_YEAR;

		goto('/discover', {
			keepFocus: true,
		});
	}

	onMount(() => {
		const searchParams = page.url.searchParams;

		if (searchParams.get('genres')) {
			const genreParams = searchParams.get('genres')?.split(' ') || [];

			for (const key in genres) {
				if (genreParams.includes(genres[key as keyof typeof genres].label)) {
					genres[key as keyof typeof genres].state = true;
				} else {
					genres[key as keyof typeof genres].state = false;
				}
			}
		}
	});
</script>

<svelte:head>
	<title>BossFlix • Discover</title>
</svelte:head>

<div class="grid h-full grid-cols-[20rem_1fr]">
	<aside class="sticky flex h-full flex-col border-r border-r-brand-primary-150/20 p-4">
		<article class="border-b border-b-brand-primary-150/20 pb-4">
			<h2 class="text-xl font-bold">Filters</h2>
			<p class="text-sm text-primary">Refine your search</p>
		</article>
		<form action="/discover">
			<input type="hidden" name="genres" value={activeGenresString} />

			<Accordion.Container
				class="accordion-spacer w-full space-y-4 pt-3 pb-4 *:not-last:border-b *:not-last:border-b-brand-primary-150/20 *:not-last:pb-2"
			>
				<Accordion.Item open={true}>
					{#snippet title()}
						<span class="text-lg font-semibold">Genre</span>
					{/snippet}

					<section class="mt-4 grid grid-cols-2 gap-x-5 gap-y-2">
						{#each genresToShow as [key, value] (key)}
							<label class="flex cursor-pointer items-center gap-2 select-none">
								<input
									type="checkbox"
									bind:checked={genres[key as keyof typeof genres].state}
									class="rounded border-0 bg-brand-primary-200 text-brand-primary-200 focus:ring-0 focus:ring-offset-0"
								/>
								<span class="hover:text-white/80">{value.label}</span>
							</label>
						{/each}
					</section>

					<button
						onclick={() => (showAllGenres = !showAllGenres)}
						class="mt-4 cursor-pointer text-sm font-semibold text-brand-primary-90 hover:text-brand-primary-80"
						type="button"
					>
						{buttonText}
					</button>
				</Accordion.Item>

				<Accordion.Item open={true}>
					{#snippet title()}
						<span class="text-lg font-semibold">Release Year</span>
					{/snippet}

					<section class="my-4 grid w-full grid-cols-2 gap-x-4 px-px">
						<label>
							<span class="text-sm font-medium text-primary">From</span>
							<input
								type="text"
								pattern="[0-9]*"
								name="releaseYearFrom"
								inputmode="numeric"
								value={releaseYear.from}
								spellcheck="false"
								class="w-full rounded-lg border-0 bg-brand-primary-150/7.5 text-sm font-medium text-primary outline-none placeholder:font-normal placeholder:text-brand-primary-90 focus:ring-2 focus:ring-brand-primary-90"
								maxlength="4"
								placeholder="e.g 1980"
								onkeydown={nonDigitInputPrevent}
							/>
						</label>
						<label>
							<span class="text-sm font-medium text-primary">To</span>
							<input
								type="text"
								pattern="[0-9]*"
								max={new Date().getFullYear() + 5}
								name="releaseYearTo"
								inputmode="numeric"
								value={releaseYear.to}
								spellcheck="false"
								class="w-full rounded-lg border-0 bg-brand-primary-150/7.5 text-sm font-medium text-primary outline-none placeholder:font-normal placeholder:text-brand-primary-90 focus:ring-2 focus:ring-brand-primary-90"
								placeholder="e.g 2024"
								maxlength="4"
								onkeydown={nonDigitInputPrevent}
							/>
						</label>
					</section>
				</Accordion.Item>
				<Accordion.Item open={true}>
					{#snippet title()}
						<span class="text-lg font-semibold">Rating</span>
					{/snippet}

					<section class="my-4">
						<label for="rating">
							<input
								type="range"
								name="rating"
								id="rating"
								class="h-2 w-full appearance-none rounded-full bg-[#1e2434] select-none [&::-webkit-slider-thumb]:p-1"
								style="background: linear-gradient(to right, var(--color-brand-primary-90) {ratingProgress}%, #1e2434 {ratingProgress}%);"
								min="0.0"
								max="10"
								step="0.5"
								bind:value={rating}
							/>
							<div class="mt-2 flex items-center justify-between">
								<span class="text-sm text-primary">Any rating</span>
								<p class="inline-block rounded-lg bg-brand-primary-150/7.5 p-1 px-2 font-semibold text-white">
									{rating}
									<span class={{ hidden: rating === 10 }}>+</span>
								</p>
							</div>
						</label>
					</section>
				</Accordion.Item>
			</Accordion.Container>

			<button
				type="submit"
				class="w-full cursor-pointer rounded-lg bg-brand-primary-100 py-3 font-semibold tracking-wide text-body transition-colors hover:bg-brand-primary-100/75"
			>
				Apply Filters
			</button>

			<button
				type="button"
				class="mt-2 flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-brand-primary-150/7.5 py-3 font-semibold tracking-wide text-brand-primary-90 transition-colors hover:bg-brand-primary-150/10"
				onclick={clearFilters}
			>
				<Icon.Linear.Trash class="inline-block size-5 fill-brand-primary-90" />
				Clear All
			</button>
		</form>
	</aside>
	<main class="px-8 py-16">
		<article class="mb-8 leading-8">
			<h1 class="text-5xl font-bold">Discover</h1>
			<p class="text-primary">Browse through thousands of titles</p>
		</article>
		<ul class="grid grid-cols-5 place-items-center gap-y-4">
			{#await advancedSearchUI}
				{#each { length: PAGE_SIZE }}
					<li>
						<MediaCardSkeleton class="w-72!" />
					</li>
				{/each}
			{:then movies}
				{#each movies as movie (movie.id)}
					<li class="transition-transform hover:scale-105">
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
		<div class="mt-12 flex items-center justify-center gap-2">
			{#await advancedSearchData then searchData}
				{#if searchData && searchData.total > 0}
					<Pagination totalCount={searchData.total} pageSize={PAGE_SIZE} {currentPage} />
				{/if}
			{/await}
		</div>
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
	/* --- WebKit (Chrome, Safari, Edge) --- */

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;

		/* 1. Define Size */
		height: 1.25rem;
		width: 1.25rem;
		border-radius: 50%;

		background: #ffffff;

		border: 0.2rem solid var(--color-brand-primary-90);

		transition: transform 0.1s ease;
	}

	/* --- Firefox --- */
	input[type='range']::-moz-range-thumb {
		height: 1.25rem;
		width: 1.25rem;
		border-radius: 50%;
		background: #ffffff;

		border: 0.2rem solid var(--color-brand-primary-90);

		transition: transform 0.1s ease;
	}

	input[type='range']:active::-webkit-slider-thumb {
		transform: scale(1.1);
	}
	input[type='range']:active::-moz-range-thumb {
		transform: scale(1.1);
	}
</style>
