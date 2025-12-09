<script lang="ts">
	import type { AdvancedSearchTitlesVariables } from '$lib/graphql/types/variables';
	import { page } from '$app/state';
	import { fly } from 'svelte/transition';
	import { clickOutsideOfNode } from '$lib/core/actions/clickOutside';
	import { Icon } from '$lib/icons';

	const SORT_OPTIONS = [
		{ label: 'Popularity (Most)', sortBy: 'POPULARITY', sortOrder: 'ASC' },
		{ label: 'Popularity (Least)', sortBy: 'POPULARITY', sortOrder: 'DESC' },
		{ label: 'Release Date (Newest)', sortBy: 'RELEASE_DATE', sortOrder: 'DESC' },
		{ label: 'Release Date (Oldest)', sortBy: 'RELEASE_DATE', sortOrder: 'ASC' },
		{ label: 'Rating (Highest)', sortBy: 'USER_RATING', sortOrder: 'DESC' },
		{ label: 'Rating (Lowest)', sortBy: 'USER_RATING', sortOrder: 'ASC' },
	] as const;

	let isMenuOpen = $state(false);

	const currentSortBy = $derived(page.url.searchParams.get('sortBy') || 'POPULARITY');
	const currentSortOrder = $derived(page.url.searchParams.get('sortOrder') || 'ASC');
	const activeOption = $derived(
		SORT_OPTIONS.find((opt) => opt.sortBy === currentSortBy && opt.sortOrder === currentSortOrder) || SORT_OPTIONS[0],
	);

	function getSortUrl(
		sortBy: NonNullable<AdvancedSearchTitlesVariables['sortBy']>,
		sortOrder: NonNullable<AdvancedSearchTitlesVariables['sortOrder']>,
	): string {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('sortBy', sortBy);
		params.set('sortOrder', sortOrder);
		params.delete('page');

		return page.url.pathname + '?' + params.toString();
	}

	function isActive(sortBy: string, sortOrder: string): boolean {
		return currentSortBy === sortBy && currentSortOrder === sortOrder;
	}
</script>

<div
	class="relative"
	{@attach clickOutsideOfNode(() => {
		isMenuOpen = false;
	})}
>
	<button
		class="flex h-10 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-neutral-850 bg-brand-primary-150/7.5 px-4 text-sm leading-normal font-bold tracking-[0.015em] text-white transition-colors hover:bg-brand-primary-150/10"
		onclick={() => {
			isMenuOpen = !isMenuOpen;
		}}
		aria-expanded={isMenuOpen}
		aria-haspopup="true"
	>
		<span>Sort: {activeOption.label}</span>
		<Icon.Linear.ChevronUp class="size-4 fill-white/70 transition-transform {isMenuOpen ? '' : 'rotate-180'}" />
	</button>

	{#if isMenuOpen}
		<div
			class="absolute top-full right-0 z-10 mt-2 w-64 origin-top-right rounded-xl border border-neutral-850 bg-surface p-2 shadow-lg"
			transition:fly={{ y: -10, duration: 200 }}
		>
			{#each SORT_OPTIONS as option}
				{@const active = isActive(option.sortBy, option.sortOrder)}
				<a
					class="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors {active
						? 'bg-brand-primary-100/20 text-brand-primary-100'
						: 'text-primary hover:bg-neutral-850/50'}"
					href={getSortUrl(option.sortBy, option.sortOrder)}
					onclick={() => {
						isMenuOpen = false;
					}}
				>
					<span>{option.label}</span>
					{#if active}
						<Icon.Linear.Check class="size-5 fill-brand-primary-100" />
					{/if}
				</a>
			{/each}
		</div>
	{/if}
</div>
