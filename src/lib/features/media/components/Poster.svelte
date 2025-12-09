<script lang="ts">
	import { getResponsiveImage } from '$lib/features/media/logic/image';

	interface Props {
		src: string;
		alt: string;
		class?: string;
		sizes?: string;
		loading?: 'lazy' | 'eager';
		aspectRatio?: string;
		defaultWidth?: number;
		quality?: number;
		objectPosition?: string;
	}

	let {
		src: imageUrl,
		alt,
		class: className = '',
		sizes = '(min-width: 1280px) 20vw, (min-width: 768px) 40vw, 90vw',
		loading = 'lazy',
		aspectRatio = '2/3',
		defaultWidth = 640,
		objectPosition = 'center',
	}: Props = $props();

	let imageLoaded = $state(false);
	let imageError = $state(false);

	// Reactive: Re-calculate if inputs change
	const { src, srcset } = $derived(getResponsiveImage(imageUrl, defaultWidth));
</script>

<!-- Container uses style for aspect-ratio to support arbitrary values -->
<div class={'relative overflow-hidden bg-neutral-900 ' + className} style:aspect-ratio={aspectRatio}>
	{#if !imageLoaded && !imageError}
		<!-- Skeleton Loader -->
		<div class="absolute inset-0 z-10 bg-[#171717]">
			<div
				class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent"
			></div>
		</div>
	{/if}

	{#if imageError}
		<!-- Error State -->
		<div class="absolute inset-0 flex items-center justify-center bg-neutral-800 text-neutral-600">
			<svg class="h-10 w-10 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
				/>
			</svg>
		</div>
	{:else}
		<img
			{src}
			{alt}
			{srcset}
			{sizes}
			{loading}
			decoding="async"
			draggable="false"
			onload={() => (imageLoaded = true)}
			onerror={() => (imageError = true)}
			class={'will-change-opacity h-full w-full object-cover transition-opacity duration-500' +
				(imageLoaded ? ' opacity-100' : ' opacity-0')}
			style:object-position={objectPosition}
		/>
	{/if}
</div>
