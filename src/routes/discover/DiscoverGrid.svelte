<script lang="ts">
	import type { AdvancedSearchTitlesResponse } from '$lib/graphql/types/responses';
	import MediaCard from '$lib/features/media/components/MediaCard.svelte';
	import MediaCardSkeleton from '$lib/features/media/components/MediaSkeleton.svelte';
	import { DEFAULT_PAGE_SIZE } from '$lib/core/config/pagination.config';
	import { transformAdvancedSearchToUI } from '$lib/features/media/logic/transformer';
	import { page } from '$app/state';
	import Pagination from './Pagination.svelte';
	import { Icon } from '$lib/icons';
	import SortDropdownMenu from './SortDropdownMenu.svelte';

	interface Props {
		data: Promise<AdvancedSearchTitlesResponse>;
	}

	let { data }: Props = $props();

	const currentPage = $derived(Number(page.url.searchParams.get('page')) || 1);

	const advancedSearchData = $derived.by(async () => {
		return (await data).advancedTitleSearch;
	});

	const advancedSearchUI = $derived.by(async () => {
		const searchData = await advancedSearchData;
		return transformAdvancedSearchToUI(searchData.edges);
	});
</script>

<main class="px-8 py-16">
	<article class="mb-8 flex items-center justify-between leading-8">
		<section>
			<h1 class="text-5xl font-bold">Discover</h1>
			<p class="text-primary">Browse through thousands of titles</p>
		</section>

		<SortDropdownMenu />
	</article>
	<ul class="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-4">
		{#await advancedSearchUI}
			{#each { length: DEFAULT_PAGE_SIZE }}
				<li>
					<MediaCardSkeleton class="w-full!" />
				</li>
			{/each}
		{:then searchData}
			{#each searchData as searchItem (searchItem.id)}
				<li class="transition-transform hover:scale-105">
					<a href={searchItem.href}>
						<MediaCard
							class="w-full!"
							posterUrl={searchItem.posterUrl}
							title={searchItem.title}
							genres={searchItem.genres}
							rating={searchItem.rating}
							labels={searchItem.labels}
						/>
					</a>
				</li>
			{/each}
		{/await}
	</ul>
	<div class="mt-12 flex items-center justify-center gap-2">
		{#await advancedSearchData then searchData}
			{#if searchData && searchData.total > 0}
				<Pagination totalCount={searchData.total} {currentPage} />
			{/if}
		{/await}
	</div>
</main>
