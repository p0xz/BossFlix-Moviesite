<script lang="ts">
	import { Icon } from '$lib/icons';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>BossFlix • Info</title>
</svelte:head>

<div class="container mx-auto text-center">
	<h1 class="pt-8 font-Chewy text-5xl font-bold tracking-wider">Roadmap</h1>

	<article>
		<h2 class="mt-1 mb-4">(Feature / Priority)</h2>
		<!-- TODO: Refactor this into svelte entries -->
		<p class="flex flex-col items-start">
			<span title="In work">
				<Icon.Linear.Slash class="inline-block size-6 fill-brand-red-200" /> Add custom player unifying all the sources (low [might move up later])
			</span>
			<span title="In work">
				<Icon.Linear.Slash class="inline-block size-6 fill-brand-red-200" /> Add watch2gether feature (low [might move up later])
			</span>
			<span title="In work"> <Icon.Linear.Slash class="inline-block size-6 fill-brand-red-200" /> Add Movies & Series pages (low) </span>
			<span title="In work">
				<Icon.Linear.Slash class="inline-block size-6 fill-brand-red-200" /> Add transfer of watched / favourite (low)
			</span>
			<span title="In work">
				<Icon.Linear.Slash class="inline-block size-6 fill-brand-red-200" /> Add option to show recommendation (low)
			</span>
			<span title="In work">
				<Icon.Linear.Slash class="inline-block size-6 fill-brand-red-200" /> Add filters for homepage search (mid)
			</span>
			<span title="In work">
				<Icon.Linear.Slash class="inline-block size-6 fill-brand-red-200" /> Add settings with default subtitles language option (mid)
			</span>
			<span title="In work">
				<Icon.Linear.Slash class="inline-block size-6 fill-brand-red-200" /> Add library sourced from opensubtitles so that users can attach
				another subtitles to their movie/show if the current list isn't working properly (mid)
			</span>
			<span title="In work">
				<Icon.Linear.Slash class="inline-block size-6 fill-brand-red-200" /> Add status to series if it's airing or ended (high)
			</span>
			<span title="In work">
				<Icon.Linear.Slash class="inline-block size-6 fill-brand-red-200" /> As with more sources for medias there's a need to sync all settings
				i.e: automatic subtitles & auto next feature (releasing soon [experimental])
			</span>
			<span title="In work">
				<Icon.Linear.Check class="inline-block size-6 fill-brand-primary-200" /> Add more sources for medias (very high)
			</span>
			<span title="Implemented">
				<Icon.Linear.Check class="inline-block size-6 fill-brand-primary-200" /> Add automatic subtitles option in series (experimental)
			</span>
			<span title="Implemented">
				<Icon.Linear.Check class="inline-block size-6 fill-brand-primary-200" /> Add last watched (season & episode) of show
			</span>
			<span title="Implemented">
				<Icon.Linear.Check class="inline-block size-6 fill-brand-primary-200" /> Add automatic next option in series
			</span>
		</p>
	</article>

	<h1 class="pt-8 font-Chewy text-5xl font-bold tracking-wider">Notes</h1>
	<article class="mt-4 text-start">
		There are currently known issues with Auto Next, Auto Play and Auto Subtitles feature. <br /> Since I'm not the owner of the streaming
		services there are limits to what can be done, but I'm working to make those feature be 100% working. <br />
		Also about ADS there are going to be probably ads added later, BUT they're not gonna be any ADS as popus in term of when you're navigating
		through the page so it won't disrupt your interactions. The ADS on the videas are from streaming services not myself. <br />

		I personally recommend using adblocks like: <strong>ADGUARD</strong> or <strong>UBlock</strong>
	</article>
</div>
