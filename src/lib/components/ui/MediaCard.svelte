<script lang="ts">
	interface Props {
		posterUrl: string;
		title: string;
		genres: string;
		rating: number;
		labels?: Array<string>;
		maskPercentage?: number;
	}

	let { posterUrl, title, genres, rating, labels = [], maskPercentage = 80 }: Props = $props();
</script>

<div
	class="relative aspect-2/3 w-80 overflow-hidden rounded-3xl bg-neutral-900 shadow-xl transition-transform hover:scale-105"
>
	<img
		src={posterUrl}
		loading="lazy"
		alt={title}
		class="absolute inset-0 h-full w-full object-cover"
	/>

	<div
		class="pointer-events-none absolute inset-x-0 bottom-0 h-1/2
              bg-linear-to-t from-body via-body/40 to-transparent"
	></div>

	<div
		class="absolute inset-x-2 bottom-2 rounded-2xl border border-white/12
           bg-white/6 p-4 text-white/90 backdrop-blur-lg"
		style={`mask-image: linear-gradient(to top, #000000 ${maskPercentage}%, transparent);`}
	>
		<h3 class="leading-tight font-semibold text-white">{title}</h3>

		<p class="mt-1 text-sm text-white/70">
			{genres}
		</p>

		<div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
			<span class="rounded-md bg-black/30 px-2 py-0.5">★ {rating}</span>
			{#each labels as label, index (index)}
				<span class="rounded-md bg-black/30 px-2 py-0.5">{label}</span>
			{/each}
		</div>
	</div>
</div>
