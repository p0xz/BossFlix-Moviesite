<script lang="ts">
	import MediaCard from '$lib/features/media/components/MediaCard.svelte';
	import type { transformHomeToUI } from '$lib/features/media/logic/transformer';
	import type { ComponentProps } from 'svelte';
	import { Icon } from '$lib/icons';

	interface Props {
		rowTitle: string;
		medias: ReturnType<typeof transformHomeToUI>;
	}

	let { rowTitle, medias }: Props = $props();

	let scrollContainer = $state<HTMLElement | null>(null);
	let showLeftArrow = $state(false);
	let showRightArrow = $state(true);

	function updateScrollState() {
		if (!scrollContainer) return;
		const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
		const offset = 10;

		showLeftArrow = scrollLeft > offset;
		showRightArrow = scrollLeft < scrollWidth - clientWidth - offset;
	}

	function scroll(direction: 'left' | 'right') {
		if (!scrollContainer) return;
		const scrollAmount = scrollContainer.clientWidth * 0.8;
		scrollContainer.scrollBy({
			left: direction === 'left' ? -scrollAmount : scrollAmount,
			behavior: 'smooth',
		});
	}
</script>

<section class="group/section relative py-4">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-lg font-bold text-white md:text-2xl">{rowTitle}</h2>
		<!-- <button class="text-brand text-xs transition-colors hover:text-white hover:underline">View All</button> -->
	</div>

	<div class="relative">
		{#if showLeftArrow}
			<button
				class="absolute top-1/2 -left-15 z-20 hidden -translate-y-1/2 transform cursor-pointer items-center
                       justify-center rounded-full border border-white/10 bg-surface p-3 text-white
                       shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110
                       hover:border-white/30 hover:bg-black/80 md:flex"
				onclick={() => scroll('left')}
				aria-label="Scroll Left"
			>
				<Icon.Linear.ChevronLeft class="size-6 fill-brand-primary-100" />
			</button>
		{/if}

		<div
			bind:this={scrollContainer}
			onscroll={updateScrollState}
			class="no-scrollbar flex gap-x-6 overflow-x-auto scroll-smooth pb-4"
		>
			{#each medias as media (media.id)}
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
			{/each}
		</div>

		{#if showRightArrow}
			<button
				class="absolute top-1/2 -right-15 z-20 hidden -translate-y-1/2 transform cursor-pointer items-center
                       justify-center rounded-full border border-white/10 bg-surface p-3 text-white
                       shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110
                       hover:border-white/30 hover:bg-black/80 md:flex"
				onclick={() => scroll('right')}
				aria-label="Scroll Right"
			>
				<Icon.Linear.ChevronRight class="size-6 fill-brand-primary-100" />
			</button>
		{/if}
	</div>
</section>

<style>
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
</style>
