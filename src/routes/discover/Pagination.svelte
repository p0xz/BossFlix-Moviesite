<script lang="ts">
	import { page } from '$app/state';
	import { Icon } from '$lib/icons';
	import { MAX_RESULT_WINDOW } from '$lib/utils/imdb';

	interface Props {
		totalCount: number;
		pageSize?: number;
		currentPage: number;
	}

	let { totalCount, pageSize = 20, currentPage }: Props = $props();

	const totalPages = $derived.by(() => {
		const theoreticalPages = Math.ceil(totalCount / pageSize);
		const apiLimitPages = Math.floor(MAX_RESULT_WINDOW / pageSize);
		return Math.min(theoreticalPages, apiLimitPages);
	});

	const pages = $derived.by(() => {
		const delta = 1;
		const range: (number | string)[] = [];
		const rangeWithDots: (number | string)[] = [];
		let length: number | undefined;

		for (let index = 1; index <= totalPages; index++) {
			if (index === 1 || index === totalPages || (index >= currentPage - delta && index <= currentPage + delta)) {
				range.push(index);
			}
		}

		for (const index of range) {
			if (length) {
				if (Number(index) - length === 2) {
					rangeWithDots.push(length + 1);
				} else if (Number(index) - length !== 1) {
					rangeWithDots.push('...');
				}
			}
			rangeWithDots.push(index);
			length = Number(index);
		}

		return rangeWithDots;
	});

	function getPageUrl(targetPage: number | string) {
		if (targetPage === '...') return null;

		const url = new URL(page.url);
		url.searchParams.set('page', String(targetPage));

		return url.pathname + url.search;
	}

	const hasPreviousPage = $derived(currentPage > 1);
	const hasNextPage = $derived(currentPage < totalPages);
</script>

{#if totalPages > 1}
	<div class="flex items-center justify-center gap-2 py-8">
		<!-- PREVIOUS -->
		<a
			href={hasPreviousPage ? getPageUrl(currentPage - 1) : undefined}
			class="flex size-10 items-center justify-center rounded-lg transition-colors
                   {hasPreviousPage
				? 'hover:bg-surface-dark cursor-pointer text-brand-primary-90'
				: 'pointer-events-none cursor-not-allowed text-neutral-700'}"
			aria-disabled={!hasPreviousPage}
			aria-label="Previous Page"
		>
			<Icon.Linear.ChevronLeft class="size-5 fill-current" />
		</a>

		{#each pages as page}
			{#if page === '...'}
				<span class="flex size-10 items-center justify-center font-medium text-brand-primary-90">...</span>
			{:else}
				{@const isCurrent = page === currentPage}
				<a
					href={isCurrent ? undefined : getPageUrl(page)}
					class="flex size-10 items-center justify-center rounded-lg text-sm font-bold transition-colors
                        {isCurrent ? 'cursor-default bg-brand-primary-100 text-body' : 'cursor-pointer text-white hover:bg-surface'}"
				>
					{page}
				</a>
			{/if}
		{/each}

		<!-- NEXT -->
		<a
			href={hasNextPage ? getPageUrl(currentPage + 1) : undefined}
			class="flex size-10 items-center justify-center rounded-lg transition-colors
                   {hasNextPage
				? 'hover:bg-surface-dark cursor-pointer text-brand-primary-90'
				: 'pointer-events-none cursor-not-allowed text-neutral-700'}"
			aria-disabled={!hasNextPage}
			aria-label="Next Page"
		>
			<Icon.Linear.ChevronRight class="size-5 fill-current" />
		</a>
	</div>
{/if}
