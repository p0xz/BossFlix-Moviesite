<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Accordion } from '$lib/core/ui/Accordion';
	import { Icon } from '$lib/icons';
	import { preventNonDigitInput } from '$lib/core/utils/dom';
	import { filterStore } from '$lib/features/discovery/stores/filter.store.svelte';
	import { GENRES_MAP, TITLE_TYPES_MAP, type GenreKey, type TitleKey } from '$lib/core/constants/media.filters';
	import { DEFAULT_DATE_RANGES } from '$lib/features/discovery/config/filter.config';

	const genresToShow = $derived(filterStore.genresUIList);
	const activeGenresString = $derived(filterStore.activeGenresString);
	const activeTitlesString = $derived(filterStore.activeTitlesString);
	const ratingProgress = $derived((filterStore.rating / 10) * 100);
	const buttonText = $derived(filterStore.showAllGenres ? 'Show Less' : `Show All ${Object.keys(GENRES_MAP).length}`);

	function clearFilters() {
		filterStore.reset();
		goto('/discover', { keepFocus: true });
	}

	onMount(() => {
		filterStore.updateFromURL(page.url.searchParams);
	});
</script>

<aside class="sticky flex h-full flex-col border-r border-r-brand-primary-150/20 p-4">
	<article class="border-b border-b-brand-primary-150/20 pb-4">
		<h2 class="text-xl font-bold">Filters</h2>
		<p class="text-sm text-primary">Refine your search</p>
	</article>
	<form action="/discover">
		<input type="hidden" name="genres" value={activeGenresString} />
		<input type="hidden" name="titles" value={activeTitlesString} />
		<Accordion.Container
			class="accordion-spacer w-full space-y-4 pt-3 pb-4 *:not-last:border-b *:not-last:border-b-brand-primary-150/20 *:not-last:pb-2"
		>
			<!-- Title Filter -->
			<Accordion.Item open={true}>
				{#snippet title()}
					<span class="text-lg font-semibold">Title Type</span>
				{/snippet}
				<section class="mt-4 grid grid-cols-2 gap-x-5 gap-y-2">
					{#each Object.entries(filterStore.titleTypes) as [key, value] (key)}
						<label class="flex cursor-pointer items-center gap-2 select-none">
							<input
								type="checkbox"
								bind:checked={filterStore.titleTypes[key as keyof typeof filterStore.titleTypes]}
								class="rounded border-0 bg-brand-primary-200 text-brand-primary-200 focus:ring-0 focus:ring-offset-0"
							/>
							<span class="hover:text-white/80">{TITLE_TYPES_MAP[key as TitleKey]}</span>
						</label>
					{/each}
				</section>
			</Accordion.Item>
			<!-- Genre Filter -->
			<Accordion.Item open={true}>
				{#snippet title()}
					<span class="text-lg font-semibold">Genre</span>
				{/snippet}
				<section class="mt-4 grid grid-cols-2 gap-x-5 gap-y-2">
					{#each genresToShow as genre (genre.key)}
						<label class="flex cursor-pointer items-center gap-2 select-none">
							<input
								type="checkbox"
								bind:checked={filterStore.genres[genre.key as GenreKey]}
								class="rounded border-0 bg-brand-primary-200 text-brand-primary-200 focus:ring-0 focus:ring-offset-0"
							/>
							<span class="hover:text-white/80">{GENRES_MAP[genre.key as GenreKey]}</span>
						</label>
					{/each}
				</section>
				<button
					onclick={() => (filterStore.showAllGenres = !filterStore.showAllGenres)}
					class="mt-4 cursor-pointer text-sm font-semibold text-brand-primary-90 hover:text-brand-primary-80"
					type="button"
				>
					{buttonText}
				</button>
			</Accordion.Item>
			<!-- Release Year Filter -->
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
							value={DEFAULT_DATE_RANGES.from.year}
							spellcheck="false"
							class="w-full rounded-lg border-0 bg-brand-primary-150/7.5 text-sm font-medium text-primary outline-none placeholder:font-normal placeholder:text-brand-primary-90 focus:ring-2 focus:ring-brand-primary-90"
							maxlength="4"
							placeholder="e.g 1980"
							onkeydown={preventNonDigitInput}
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
							value={DEFAULT_DATE_RANGES.to.year}
							spellcheck="false"
							class="w-full rounded-lg border-0 bg-brand-primary-150/7.5 text-sm font-medium text-primary outline-none placeholder:font-normal placeholder:text-brand-primary-90 focus:ring-2 focus:ring-brand-primary-90"
							placeholder="e.g 2024"
							maxlength="4"
							onkeydown={preventNonDigitInput}
						/>
					</label>
				</section>
			</Accordion.Item>
			<!-- Rating Filter -->
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
							bind:value={filterStore.rating}
						/>
						<div class="mt-2 flex items-center justify-between">
							<span class="text-sm text-primary">Any rating</span>
							<p class="inline-block rounded-lg bg-brand-primary-150/7.5 p-1 px-2 font-semibold text-white">
								{filterStore.rating}
								<span class={{ hidden: filterStore.rating === 10 }}>+</span>
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
