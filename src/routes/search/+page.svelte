<script lang="ts">
	import MediaCard from '$lib/features/media/components/MediaCard.svelte';
	import { page } from '$app/state';

	let { data } = $props();

	const query = $derived(page.url.searchParams.get('q') || '');
</script>

<div class="container mx-auto py-4">
	<div class="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-6">
		{#each data.search as media (media.id)}
			<a href={media.href}>
				<MediaCard
					class="w-72! shrink-0 transition-transform duration-300 hover:scale-105"
					genres={media.genres}
					rating={media.rating}
					labels={media.labels}
					posterUrl={media.posterUrl}
					title={media.title}
				/>
			</a>
		{:else}
			<div class="flex flex-col items-center justify-center py-20 text-center opacity-80">
				<div class="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
					<svg class="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						></path></svg
					>
				</div>
				<h3 class="text-2xl font-bold text-white mb-2">No results found</h3>
				<p class="text-gray-400 max-w-md">
					We couldn't find any matches for "{query}". <br /> Try adjusting your search keywords or filters.
				</p>
			</div>
		{/each}
	</div>
</div>
