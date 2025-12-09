<script lang="ts">
	import '$lib/css/fontfaces.css';
	import '../app.css';
	import { onMount, type Component } from 'svelte';
	import { historyStorage } from '$lib/features/history/stores/history.store.svelte';
	import { Icon } from '$lib/icons';
	import { page } from '$app/state';
	import { onNavigate } from '$app/navigation';

	let { children } = $props();

	onMount(() => {
		historyStorage.load();
	});

	const routes = [
		{
			href: '/',
			label: 'Home',
		},
		{
			href: '/discover',
			label: 'Discover',
		},

		{
			href: '/history',
			label: 'History',
		},
	] as const;

	onNavigate(() => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(() => resolve());
		});
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
	<meta name="description" content="Watch your favourite shows and movies free online" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://bossflix.org/" />
	<meta property="og:title" content="BossFlix - watch your favourite shows and movies free online" />
	<meta property="og:description" content="Watch your favourite shows and movies free online" />
	<meta property="og:image" content="/og-image-bossflix.png" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://bossflix.org/" />
	<meta name="twitter:title" content="BossFlix - watch your favourite shows and movies free online" />
	<meta name="twitter:description" content="BossFlix - watch your favourite shows and movies free online" />
	<meta name="twitter:image" content="/og-image-bossflix.png" />

	<meta name="keywords" content="streaming, movies, tv shows, free, online, watch, bossflix, boss flix, bossflix.org" />
</svelte:head>

<svelte:window
	onbeforeunload={() => {
		historyStorage.save();
	}}
/>

{#snippet Link(href: string, label: string, icon?: Component<Record<string, any>, {}, ''>)}
	{@const Component = icon}
	<a {href} aria-label={label} class="flex items-center justify-center gap-2">
		<span class="hidden sm:inline"> {label} </span>
	</a>
{/snippet}

<header class="flex w-full border-b border-b-brand-primary-150/20 p-5 px-12 transition-all duration-600 outline-none">
	<ul class=" flex w-full items-center gap-x-10 text-sm font-medium">
		<li>
			<a href="/" class="font-Chewy text-4xl text-white">BossFlix</a>
		</li>

		{#each routes as link (link.href)}
			<li class="nav-list-item" aria-current={page.url.pathname === link.href ? 'page' : undefined}>
				{@render Link(link.href, link.label)}
			</li>
		{/each}
	</ul>

	<form action="/search">
		<label for="navigation-search" class="relative flex items-center">
			<Icon.Linear.Search class="absolute ml-2 size-6 cursor-pointer fill-brand-primary-90" />
			<input
				type="text"
				name="q"
				autocomplete="on"
				placeholder="Search for a show, movie..."
				data-sveltekit-keepfocus
				spellcheck="false"
				class="w-sm rounded-lg border-0 bg-brand-primary-150/7.5 px-5 pl-10 text-sm font-medium text-primary outline-none placeholder:font-normal placeholder:text-brand-primary-90 focus:ring-2 focus:ring-brand-primary-90"
			/>
		</label>
	</form>
</header>

<main>
	{@render children?.()}
</main>

<style lang="postcss">
	@reference 'tailwindcss';

	.nav-list-item {
		position: relative;
	}

	.nav-list-item[aria-current='page']::after {
		content: '';

		position: absolute;
		left: 0;
		bottom: -4px;

		width: 100%;
		height: 2px;

		background-color: #98a4f7;
		view-transition-name: indicator;
	}
</style>
