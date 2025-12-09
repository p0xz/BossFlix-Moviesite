<script lang="ts">
	import { getResizedImage } from '$lib/features/media/logic/image';
	import type { HTMLAttributes } from 'svelte/elements';
	import PosterImage from './Poster.svelte';

	interface Props {
		posterUrl: string;
		title: string;
		genres: string;
		rating: number | string;
		labels?: Array<string | number>;
		maskPercentage?: number;
		class?: HTMLAttributes<HTMLDivElement>['class'];
	}

	let { posterUrl, title, genres, rating, labels = [], maskPercentage = 80, class: className }: Props = $props();
</script>

<div class={['relative aspect-2/3 w-80 overflow-hidden rounded-3xl bg-neutral-900 shadow-xl', className]}>
	<div class="absolute inset-0 h-full w-full">
		<PosterImage src={posterUrl} alt={title} />
	</div>

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
		<p class="mt-1 text-sm text-white/70">{genres}</p>
		<div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
			<span class="rounded-md bg-black/30 px-2 py-0.5">★ {rating}</span>
			{#each labels as label, index (index)}
				{#if label}
					<span class="rounded-md bg-black/30 px-2 py-0.5">{label}</span>
				{/if}
			{/each}
		</div>
	</div>
</div>

<!-- <img
	alt="Jacob Elordi in Frankenstein (2025)"
	class="ipc-image"
	loading="lazy"
	src="https://m.media-amazon.com/images/M/MV5BYzYzNDYxMTQtMTU4OS00MTdlLThhMTQtZjI4NGJmMTZmNmRiXkEyXkFqcGc@._V1_QL75_UX90_CR0,0,90,133_.jpg"
	srcset="https://m.media-amazon.com/images/M/MV5BYzYzNDYxMTQtMTU4OS00MTdlLThhMTQtZjI4NGJmMTZmNmRiXkEyXkFqcGc@._V1_QL75_UX90_CR0,0,90,133_.jpg 90w, https://m.media-amazon.com/images/M/MV5BYzYzNDYxMTQtMTU4OS00MTdlLThhMTQtZjI4NGJmMTZmNmRiXkEyXkFqcGc@._V1_QL75_UX135_CR0,0,135,200_.jpg 135w, https://m.media-amazon.com/images/M/MV5BYzYzNDYxMTQtMTU4OS00MTdlLThhMTQtZjI4NGJmMTZmNmRiXkEyXkFqcGc@._V1_QL75_UX180_CR0,0,180,266_.jpg 180w"
	sizes="50vw, (min-width: 480px) 34vw, (min-width: 600px) 26vw, (min-width: 1024px) 16vw, (min-width: 1280px) 16vw"
	width="90"
/> -->
