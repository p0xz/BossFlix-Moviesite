<script lang="ts">
	import type { PageProps } from './$types';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import { debounce, arraysEqual } from '$lib';
	import { enhance } from '$app/forms';
	import { Icon } from '$lib/icons';

	let formElement: HTMLFormElement;
	let searchElement: HTMLInputElement;

	let { form }: PageProps = $props();

	let searchResults = $state<NonNullable<typeof form>['search']>([]);

	const submitDebounced = debounce(() => formElement?.requestSubmit(), 300);

	const handleInput = (event: Event) => {
		const fieldValue = (event.currentTarget as HTMLInputElement).value.trim();

		if (fieldValue.length < 3) {
			searchResults = [];
			return;
		}

		submitDebounced();
	};

	$effect(() => {
		console.log(form?.search);
		if (!form?.search) return;

		const areArraysEqual = arraysEqual(form?.search, searchResults, (oldSearch, newSearch) => {
			return oldSearch.id === newSearch.id;
		});

		if (!areArraysEqual && searchElement.value.length >= 3) {
			searchResults = form?.search ?? [];
		}
	});
</script>

<svelte:head>
	<title>BossFlix • Home</title>
</svelte:head>

<header class="flex min-h-screen flex-col items-center justify-center py-8">
	<h1 class="justify-self-start font-Chewy text-5xl font-bold tracking-wider">BossFlix</h1>
	<form
		bind:this={formElement}
		method="POST"
		use:enhance={() => {
			return async ({ update }) => {
				await update({ reset: false });
			};
		}}
		class="flex flex-col items-center justify-center gap-y-2 py-6"
	>
		<!-- svelte-ignore a11y_autofocus -->
		<input
			bind:this={searchElement}
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
			class="min-h-12 w-sm rounded-lg bg-zinc-800 px-4 ring-0 transition-colors duration-300 outline-none placeholder:font-semibold placeholder:text-white/60 focus:border-white max-md:max-w-[90%]"
		/>
		<p class="text-sm text-white/70">
			we recommend using <a
				href="https://chromewebstore.google.com/detail/adguard-adblocker/bgnkhhnnamicmpeenaelnjfhikgbkllg?hl=en"
				target="_blank"
				class="underline">ADGUARD</a
			> extension
		</p>
	</form>

	{#if searchResults.length > 0}
		<ul
			class="grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
			in:slide|local={{ duration: 280, easing: quintOut }}
			out:slide|local={{ duration: 220, easing: quintOut }}
		>
			{#each searchResults as searchResult (searchResult.id)}
				<li class="w-fit text-center transition-transform hover:scale-105">
					<a
						href={`/${searchResult.type}/${searchResult.id}${searchResult.type === 'series' ? `/?season=1&episode=1` : ''}`}
					>
						<img
							src={searchResult.imageUrl}
							loading="lazy"
							alt={searchResult.title}
							class="h-112 w-xs rounded-lg object-cover"
							class:hidden={!searchResult.imageUrl}
						/>
						<div
							class={`${searchResult.imageUrl && 'hidden'} flex h-112 w-78 items-center justify-center rounded-lg bg-white/5`}
						>
							<Icon.Linear.FilmTape class="fill-white/10" />
						</div>
						<h3 class="mt-1 text-center">{searchResult.title}</h3>
					</a>
					<p class="text-sm text-white/70">
						{searchResult.type}
						<span class:hidden={!searchResult.release}> ({searchResult.release})</span>
					</p>
				</li>
			{/each}
		</ul>
	{/if}
</header>
