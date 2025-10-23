<script lang="ts">
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
	<meta
		property="og:description"
		content="Automate DMs, target the right audience, and grow your main profile on autopilot with DMify."
	/>
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

<main>
	{@render children?.()}
</main>
