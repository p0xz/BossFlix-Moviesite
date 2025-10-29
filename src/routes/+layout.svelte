<script lang="ts">
	import { Icon } from '$lib/icons';
	import '../app.css';

	let { children } = $props();
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

<header
	class="group/navbar fixed z-10 flex h-full w-16 items-center border-r border-r-brand-primary-150/20 bg-surface px-4 py-6 transition-all duration-600 outline-none hover:w-40"
>
	<ul class="flex h-full flex-col gap-y-4 text-primary">
		<li>
			<a href="/" class="font-Chewy text-4xl text-white">BF</a>
		</li>

		<li>
			<a href="/" class="flex items-center gap-2 hover:text-white hover:[&>svg]:fill-white">
				<Icon.Linear.FilmTape class="inline-block size-7 shrink-0 fill-[#c9d3ee]" />
				<span class="link-text"> Movies </span>
			</a>
		</li>

		<li>
			<a href="/" class="flex items-center gap-2 hover:text-white hover:[&>svg]:fill-white">
				<Icon.Linear.TV class="inline-block size-7 shrink-0 fill-[#c9d3ee]" />
				<span class="link-text"> TV Series </span>
			</a>
		</li>

		<li class="mt-auto">
			<a href="/" class="flex items-center gap-2 hover:text-white hover:[&>svg]:fill-white">
				<Icon.Linear.Gear class="inline-block size-7 shrink-0 fill-[#c9d3ee]" />
				<span class="link-text"> Settings </span>
			</a>
		</li>
	</ul>
</header>

<main>
	{@render children?.()}
</main>

<style>
	@reference "tailwindcss";
	.link-text {
		@apply ml-2 max-w-0 translate-x-1 overflow-hidden font-medium text-nowrap opacity-0 transition-all duration-600 ease-out group-hover/navbar:max-w-full group-hover/navbar:translate-x-0 group-hover/navbar:opacity-100;
	}
</style>
