<script lang="ts">
	import '../lib/css/fontfaces.css';
	import '../app.css';
	import { onMount, type Component } from 'svelte';
	import { watchedStore } from '$lib';
	import { Icon } from '$lib/icons';

	let { children } = $props();

	onMount(() => {
		const bfWatched = localStorage.getItem('bf-watched');
		if (bfWatched) watchedStore.fromJSON(JSON.parse(bfWatched));
	});

	const links = [
		{
			href: '/movie',
			label: 'Movies',
			icon: Icon.Linear.FilmTape,
		},
		{
			href: '/series',
			label: 'TV Series',
			icon: Icon.Linear.TV,
		},
		{
			href: '/history',
			label: 'History',
			icon: Icon.Linear.Eye,
		},
		{
			href: '/settings',
			label: 'Settings',
			icon: Icon.Linear.Gear,
		},
	] as const;
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
	<meta name="description" content="Watch your favourite shows and movies free online" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="http://bossflix.org/" />
	<meta property="og:title" content="BossFlix - watch your favourite shows and movies free online" />
	<meta property="og:description" content="Watch your favourite shows and movies free online" />
	<meta property="og:image" content="http://bossflix.org/og-image-bossflix.png" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="http://bossflix.org/" />
	<meta name="twitter:title" content="BossFlix - watch your favourite shows and movies free online" />
	<meta name="twitter:description" content="BossFlix - watch your favourite shows and movies free online" />
	<meta name="twitter:image" content="http://bossflix.org/og-image-bossflix.png" />

	<meta name="keywords" content="streaming, movies, tv shows, free, online, watch, bossflix, boss flix, bossflix.org" />
</svelte:head>

<svelte:window
	onbeforeunload={() => {
		localStorage.setItem('bf-watched', JSON.stringify(watchedStore.toJSON()));
	}}
/>

{#snippet Link(href: string, label: string, icon: Component<Record<string, any>, {}, ''>)}
	{@const Component = icon}
	<a {href} aria-label={label} class="flex items-center justify-center gap-2 hover:text-neutral-200 hover:[&>svg]:fill-white">
		<Component class="inline-block size-7 shrink-0 fill-[#c9d3ee]" />
		<span class="hidden sm:inline"> {label} </span>
	</a>
{/snippet}

<main>
	{@render children?.()}
</main>

<header class="flex w-full border-t border-t-brand-primary-150/20 bg-surface px-4 py-6 transition-all duration-600 outline-none">
	<ul class="container mx-auto flex h-full w-full items-center gap-x-10 text-primary">
		<li class="mr-auto">
			<a href="/" class="font-Chewy text-4xl text-white">BF</a>
		</li>

		{#each links as link (link.href)}
			<li class="first:pl-8 last:ml-auto">
				{@render Link(link.href, link.label, link.icon)}
			</li>
		{/each}
	</ul>
</header>
