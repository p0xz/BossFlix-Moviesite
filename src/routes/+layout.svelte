<script lang="ts">
	import { onMount } from 'svelte';
	import { watchedStore } from '$lib';
	import { Icon } from '$lib/icons';
	import '../app.css';

	let { children } = $props();

	onMount(() => {
		const bfWatched = localStorage.getItem('bf-watched');
		if (bfWatched) watchedStore.fromJSON(JSON.parse(bfWatched));
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
	<meta name="description" content="Watch your favourite shows and movies free online" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="http://bossflix.org/" />
	<meta
		property="og:title"
		content="BossFlix - watch your favourite shows and movies free online"
	/>
	<meta property="og:description" content="Watch your favourite shows and movies free online" />
	<meta property="og:image" content="http://bossflix.org/og-image-bossflix.png" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="http://bossflix.org/" />
	<meta
		name="twitter:title"
		content="BossFlix - watch your favourite shows and movies free online"
	/>
	<meta
		name="twitter:description"
		content="BossFlix - watch your favourite shows and movies free online"
	/>
	<meta name="twitter:image" content="http://bossflix.org/og-image-bossflix.png" />

	<meta
		name="keywords"
		content="streaming, movies, tv shows, free, online, watch, bossflix, boss flix, bossflix.org"
	/>
</svelte:head>

<svelte:window
	onbeforeunload={() => {
		localStorage.setItem('bf-watched', JSON.stringify(watchedStore.toJSON()));
	}}
/>

<main>
	{@render children?.()}
</main>

<header
	class="group/navbar flex w-full border-t border-t-brand-primary-150/20 bg-surface px-4 py-6 transition-all duration-600 outline-none"
>
	<ul class="container mx-auto flex h-full w-full items-center gap-4 text-primary">
		<li class="mr-auto">
			<a href="/" class="font-Chewy text-4xl text-white">BF</a>
		</li>

		<li>
			<a
				href="/movies"
				class="flex items-center gap-2 hover:text-white max-sm:pr-2 max-xs:flex-col hover:[&>svg]:fill-white"
			>
				<Icon.Linear.FilmTape class="inline-block size-7 shrink-0 fill-[#c9d3ee]" />
				<span class="link-text"> Movies </span>
			</a>
		</li>

		<li>
			<a
				href="/tv-series"
				class="flex items-center gap-2 hover:text-white max-sm:pl-2 max-xs:flex-col hover:[&>svg]:fill-white"
			>
				<Icon.Linear.TV class="inline-block size-7 shrink-0 fill-[#c9d3ee]" />
				<span class="link-text"> TV Series </span>
			</a>
		</li>

		<li>
			<a
				href="/history"
				class="flex items-center gap-2 hover:text-white max-sm:pl-2 max-xs:flex-col hover:[&>svg]:fill-white"
			>
				<Icon.Linear.Eye class="inline-block size-7 shrink-0 fill-[#c9d3ee]" />
				<span class="link-text">History</span>
			</a>
		</li>

		<li class="ml-auto">
			<a
				href="/"
				class="flex items-center gap-2 hover:text-white max-xs:flex-col hover:[&>svg]:fill-white"
			>
				<Icon.Linear.Gear class="inline-block size-7 shrink-0 fill-[#c9d3ee]" />
				<span class="link-text"> Settings </span>
			</a>
		</li>
	</ul>
</header>
