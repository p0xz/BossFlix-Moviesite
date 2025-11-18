<script lang="ts">
	import { Icon } from '$lib/icons';
	import type { PageProps } from './$types';

	const ROADMAP_STATUS = {
		IN_WORK: 'in work',
		IMPLEMENTED: 'implemented',
	} as const;

	const roadmap = [
		{
			feature: 'Introduce a unified custom player that consolidates all media sources',
			status: ROADMAP_STATUS.IN_WORK,
		},
		{
			feature: 'Implement Watch2Gether real-time co-watching functionality',
			status: ROADMAP_STATUS.IN_WORK,
		},
		{
			feature: 'Launch dedicated Movies and Series detail pages',
			status: ROADMAP_STATUS.IN_WORK,
		},
		{
			feature: 'Enable transfer of watched history and favourites across devices',
			status: ROADMAP_STATUS.IN_WORK,
		},

		{
			feature: 'Introduce advanced filtering options for homepage search',
			status: ROADMAP_STATUS.IN_WORK,
		},
		{
			feature: 'Add settings for selecting a default subtitle language',
			status: ROADMAP_STATUS.IN_WORK,
		},
		{
			feature:
				'Integrate OpenSubtitles library to allow users to attach alternative subtitles if existing ones are inaccurate or unavailable',
			status: ROADMAP_STATUS.IN_WORK,
		},
		{
			feature: 'Display series status (Airing / Ended) on the series page',
			status: ROADMAP_STATUS.IN_WORK,
		},
		{
			feature: 'Synchronize autoplay, automatic subtitles, and other playback settings across all sources',
			status: ROADMAP_STATUS.IN_WORK,
		},
		{
			feature: 'Expand the number of available media sources',
			status: ROADMAP_STATUS.IMPLEMENTED,
		},
		{
			feature: 'Add automatic subtitle selection for series',
			status: ROADMAP_STATUS.IMPLEMENTED,
		},
		{
			feature: 'Store and restore last watched season and episode for each series',
			status: ROADMAP_STATUS.IMPLEMENTED,
		},
		{
			feature: 'Add automatic “Next Episode” playback for series',
			status: ROADMAP_STATUS.IMPLEMENTED,
		},
	];
</script>

<svelte:head>
	<title>BossFlix • Info</title>
</svelte:head>

<div class="container mx-auto text-center">
	<h1 class="pt-8 font-Chewy text-5xl font-bold tracking-wider">Roadmap</h1>

	<article>
		<p class="flex flex-col items-start gap-y-4">
			{#each roadmap as roadmapItem (roadmapItem.feature)}
				{#if roadmapItem.status === ROADMAP_STATUS.IN_WORK}
					<span
						title="In work"
						class="space-x-1 rounded-md bg-brand-primary-150/15 px-3 py-2 text-sm text-primary shadow-lg ring-1 ring-white/10"
					>
						<Icon.Linear.Slash class="inline-block size-6 fill-brand-red-200" />
						<span class="inline-block align-middle"> {roadmapItem.feature} </span>
					</span>
				{:else if roadmapItem.status === ROADMAP_STATUS.IMPLEMENTED}
					<span
						title="Implemented"
						class="space-x-1 rounded-md bg-brand-primary-150/15 px-3 py-2 text-sm text-primary shadow-lg ring-1 ring-white/10"
					>
						<Icon.Linear.Check class="inline-block size-6 fill-brand-primary-200" />
						<span class="inline-block align-middle"> {roadmapItem.feature} </span>
					</span>
				{/if}
			{/each}
		</p>
	</article>

	<h1 class="pt-8 font-Chewy text-5xl font-bold tracking-wider">Notes</h1>
	<article class="my-4 rounded-md bg-brand-primary-150/15 px-3 py-2 text-start text-primary shadow-lg ring-1 ring-white/10">
		<p>
			There are currently known issues affecting the Auto Next, Auto Play, and Auto Subtitles features. Because I do not own the streaming
			sources themselves, some limitations are out of my control. However, I'm actively working to make all these features function as
			reliably as possible.
		</p>

		<br />

		<p>
			Regarding advertisements: some ads may appear in the video player, but these are provided by the streaming services—never by BossFlix.
			If ads are ever added to the site itself in the future, they will <strong>not</strong> include pop-ups or anything that disrupts your browsing
			experience.
		</p>

		<br />

		<p>
			For the best viewing experience, I recommend using an ad blocker such as
			<strong>AdGuard</strong> or <strong>uBlock Origin</strong>.
		</p>
	</article>
</div>
