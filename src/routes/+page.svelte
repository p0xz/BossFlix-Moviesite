<script lang="ts">
	import type { Snapshot } from './$types';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { type Imdb } from '$lib';

	import { debounce, arraysEqual } from '$lib';
	import { applyAction, enhance } from '$app/forms';
	import { Icon } from '$lib/icons';

	let { form } = $props();

	// oxlint-disable-next-line no-unassigned-vars
	let formElement: HTMLFormElement;
	let searchResults = $state<Imdb.Search.Edge[]>([]);

	function sameEdges(a: Imdb.Search.Edge[], b: Imdb.Search.Edge[]) {
		if (a === b) return true;
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) {
			if (a[i].node.entity.id !== b[i].node.entity.id) return false;
		}
		return true;
	}

	const submitDebounced = debounce(() => formElement?.requestSubmit(), 300);

	function handleInput(event: Event) {
		const currentTarget = event.currentTarget as HTMLInputElement;
		const query = currentTarget.value.trim();
		if (query.length < 3) {
			searchResults = [];
			return;
		}

		submitDebounced();
	}

	// export const snapshot: Snapshot<Imdb.Search.Edge[]> = {
	// 	capture: () => searchResults,
	// 	restore: (value) => (searchResults = value)
	// };
</script>

<svelte:head>
	<title>BossFlix • Home</title>
</svelte:head>

<header class="flex min-h-screen flex-col items-center justify-center py-8">
	<h1 class="font-Chewy text-5xl font-bold tracking-wider">BossFlix</h1>
	<form
		bind:this={formElement}
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					const incoming = ((result.data as NonNullable<typeof form>)?.search?.edges ??
						[]) as Imdb.Search.Edge[];
					if (!sameEdges(searchResults, incoming)) {
						searchResults = incoming;
					}
				}

				await applyAction(result);
			};
		}}
		class="relative flex flex-col items-center justify-center gap-y-2 py-6"
	>
		<!-- svelte-ignore a11y_autofocus -->
		<input
			type="text"
			name="media"
			autocomplete="on"
			placeholder="Movies, series, shows..."
			data-sveltekit-keepfocus
			autofocus
			onkeydown={(event) => {
				if (event.key === 'Enter') event.preventDefault();
			}}
			oninput={handleInput}
			spellcheck="false"
			class="min-h-13 w-sm rounded-lg border-2 border-brand-primary-150/20 bg-brand-primary-150/10 px-5 ring-0 outline-none placeholder:font-light placeholder:text-neutral-300 focus:border-white max-md:max-w-[90%]"
		/>

		<p class="text-sm text-primary/80">
			we recommend checking <a href="/info" class="text-primary underline">INFO</a>
		</p>
	</form>

	{#if searchResults?.length > 0}
		<ul
			class="grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 2lg:grid-cols-[repeat(4,20rem)]"
			in:slide|local={{ duration: 280, easing: quintOut }}
			out:slide|local={{ duration: 220, easing: quintOut }}
		>
			{#each searchResults as searchResult (searchResult.node.entity.id)}
				{@const entity = searchResult.node.entity}
				{@const titleType = entity.titleType.id}
				<li class="w-fit text-center wrap-break-word transition-transform hover:scale-105">
					<a
						href={`/${titleType === 'movie' || titleType === 'tvMovie' ? 'movie' : 'series'}/${searchResult.node.entity.id}${titleType === 'tvSeries' ? `/?season=1&episode=1` : ''}`}
					>
						<img
							src={entity.primaryImage?.url}
							loading="lazy"
							alt={entity.titleText.text}
							class="mx-auto h-112 w-xs rounded-lg object-cover"
							class:hidden={!entity.primaryImage?.url}
						/>
						<div
							class={`${entity.primaryImage?.url && 'hidden'} flex h-112 w-78 items-center justify-center rounded-lg bg-white/5`}
						>
							<Icon.Linear.FilmTape class="fill-white/10" />
						</div>
						<h3 class="mt-1 text-center">{entity.titleText.text}</h3>
					</a>
					<p class="text-sm text-[#C9D3EE]">
						{entity.titleType.text}
						<span class:hidden={!entity.releaseYear?.year}> ({entity.releaseYear?.year})</span>
					</p>
				</li>
			{/each}
		</ul>
	{/if}
</header>
