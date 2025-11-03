<script lang="ts">
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { quintIn, quintOut } from 'svelte/easing';
	import { formatRuntime, watchedStore, debounce } from '$lib';
	import { REQUIRED_LENGTH_TO_SUBMIT } from '$lib/constants';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import MediaCard from '$lib/components/ui/MediaCard.svelte';

	let { data } = $props();

	let previousInputValue = '';

	const submitDebounced = debounce((form) => form.requestSubmit(), 300);

	function handleInput(event: Event) {
		const currentTarget = event.currentTarget as HTMLInputElement;
		const query = currentTarget.value.trim();

		if (!query.trim().length) return;

		if (query.length < REQUIRED_LENGTH_TO_SUBMIT || query === previousInputValue) {
			previousInputValue = query;

			page.url.searchParams.set('query', '');
			goto(page.url.pathname + page.url.search, {
				invalidateAll: true,
			});
			return;
		}
		previousInputValue = query;
		submitDebounced(currentTarget.form);
	}
</script>

<svelte:head>
	<title>BossFlix • Home</title>
</svelte:head>

<div class="flex min-h-full flex-col items-center justify-center py-8">
	<h1 class="relative font-Chewy text-5xl font-bold tracking-wider">
		BossFlix
		<span
			class="bg-beta absolute bottom-0 ml-1 rounded px-2 py-0.5 font-Poppins text-sm font-medium"
		>
			beta
		</span>
	</h1>
	<form
		data-sveltekit-keepfocus
		action="/"
		class="relative flex flex-col items-center justify-center gap-y-2 py-6"
	>
		<!-- svelte-ignore a11y_autofocus -->
		<input
			type="text"
			name="query"
			autocomplete="on"
			autofocus
			placeholder="Movies, series, shows..."
			data-sveltekit-keepfocus
			oninput={handleInput}
			spellcheck="false"
			class="min-h-13 w-sm rounded-lg border-2 border-brand-primary-150/20 bg-brand-primary-150/10 px-5 ring-0 outline-none placeholder:font-light placeholder:text-neutral-300 focus:border-white max-md:max-w-[90%]"
		/>

		<p class="text-sm text-primary/80">
			we recommend checking <a href="/info" class="text-primary underline">INFO</a>
		</p>
	</form>

	<ul
		class="grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 2lg:grid-cols-[repeat(4,20rem)]"
	>
		{#each data?.search?.edges?.filter((edge) => edge.node.entity?.primaryImage?.url) as searchResult (searchResult.node.entity.id)}
			{@const entity = searchResult.node.entity}
			{@const titleType = entity.titleType.id}
			{@const lastWatched = watchedStore.lastWatched(entity.id)}
			{@const totalSeasons = entity.episodes?.displayableSeasons?.total}
			<li
				animate:flip={{ duration: 700 }}
				in:fly={{ y: 18, opacity: 0, duration: 220, easing: quintIn }}
				out:fly={{ y: -8, opacity: 0, duration: 160, easing: quintOut }}
				class="w-fit text-center wrap-break-word transition-transform hover:scale-105"
			>
				<a
					href={`/${titleType === 'movie' || titleType === 'tvMovie' ? 'movie' : 'series'}/${searchResult.node.entity.id}${titleType === 'tvSeries' ? `/?season=${lastWatched[0]}&episode=${lastWatched[1]}` : ''}`}
				>
					<MediaCard
						posterUrl={entity.primaryImage?.url ?? ''}
						title={entity.titleText.text}
						genres={entity.titleGenres?.genres
							.map((g) => g.genre.text)
							.slice(0, 3)
							.join(' • ')}
						rating={entity.ratingsSummary?.aggregateRating ?? 0}
						labels={[
							`${totalSeasons ? `${totalSeasons} season${totalSeasons > 1 ? 's' : ''}` : formatRuntime(entity?.runtime?.seconds || 0)}`,
						]}
					/>
				</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	.bg-beta {
		background: linear-gradient(353deg, #4449a9 17.51%, #7c87f7 183.08%);
		box-shadow: 0px 1px 3px 0px rgba(255, 255, 255, 0.25) inset;
	}
</style>
