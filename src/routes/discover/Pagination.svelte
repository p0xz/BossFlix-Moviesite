<script lang="ts">
	import { page } from '$app/state';
	import { Icon } from '$lib/icons';
	import { getPaginationConfig, DEFAULT_PAGE_SIZE } from '$lib/core/config/pagination.config';
	interface Props {
		totalCount: number;
		pageSize?: number;
		currentPage: number;
	}

	let { totalCount, currentPage }: Props = $props();

	const PAGINATION_CONFIG = getPaginationConfig(DEFAULT_PAGE_SIZE);

	const totalPages = $derived.by(() => {
		const theoreticalPages = Math.ceil(totalCount / DEFAULT_PAGE_SIZE);
		return Math.min(theoreticalPages, PAGINATION_CONFIG.MAX_PAGES);
	});

	const pages = $derived.by(() => {
		const VISIBLE_RANGE = 1;
		const pageNumbers: (number | string)[] = [];

		// Always show first page
		pageNumbers.push(1);

		// Calculate visible range around current page
		const rangeStart = Math.max(2, currentPage - VISIBLE_RANGE);
		const rangeEnd = Math.min(totalPages - 1, currentPage + VISIBLE_RANGE);

		// Add ellipsis after first page if needed
		if (rangeStart > 2) {
			pageNumbers.push('...');
		}

		// Add pages in visible range
		for (let index = rangeStart; index <= rangeEnd; index++) {
			pageNumbers.push(index);
		}

		// Add ellipsis before last page if needed
		if (rangeEnd < totalPages - 1) {
			pageNumbers.push('...');
		}

		// Always show last page (if it exists and isn't page 1)
		if (totalPages > 1) {
			pageNumbers.push(totalPages);
		}

		return pageNumbers;
	});

	function getPageUrl(targetPage: number | string) {
		if (targetPage === '...') return null;
		const params = new URLSearchParams(page.url.searchParams);

		params.set('page', String(targetPage));

		return page.url.pathname + '?' + params.toString();
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
