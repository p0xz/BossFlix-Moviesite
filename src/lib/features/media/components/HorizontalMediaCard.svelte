<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props {
		imageUrl: string;
		title: string;
		subtitle?: string;
		rating?: number;
		ranking?: number; // For Top 10 display (1-10)
		href: string;
		class?: HTMLAttributes<HTMLAnchorElement>['class'];
	}

	let { imageUrl, title, subtitle, rating, ranking, href, class: className }: Props = $props();

	let isHovered = $state(false);
</script>

<a
	{href}
	class={[
		'group relative block aspect-video w-full overflow-hidden rounded-lg bg-neutral-900 transition-all duration-300',
		'hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-brand-primary-100/20',
		className,
	]}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	<!-- Ranking Badge for Top 10 -->
	{#if ranking}
		<div class="absolute left-0 top-0 z-20 flex h-full items-center">
			<div
				class="font-Inter text-[12rem] font-black leading-none text-white/10 transition-all duration-300 group-hover:text-white/20"
				style="text-stroke: 3px rgba(255, 255, 255, 0.3); -webkit-text-stroke: 3px rgba(255, 255, 255, 0.3);"
			>
				{ranking}
			</div>
		</div>
	{/if}

	<!-- Background Image -->
	<img
		src={imageUrl}
		alt={title}
		loading="lazy"
		class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
	/>

	<!-- Gradient Overlay -->
	<div
		class="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100"
	></div>

	<!-- Content -->
	<div
		class="absolute inset-x-0 bottom-0 p-4 transition-all duration-300"
		class:translate-y-2={!isHovered}
		class:opacity-0={!isHovered}
		class:translate-y-0={isHovered}
		class:opacity-100={isHovered}
	>
		<h3 class="font-Inter mb-1 text-lg font-bold leading-tight text-white">
			{title}
		</h3>

		{#if subtitle}
			<p class="font-Inter mb-2 text-sm text-gray-300">{subtitle}</p>
		{/if}

		{#if rating}
			<div class="flex items-center gap-2">
				<span class="font-Inter text-sm font-semibold text-brand-primary-100">★ {rating.toFixed(1)}</span>
			</div>
		{/if}
	</div>

	<!-- Hover Glow Effect -->
	<div
		class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
		style="box-shadow: inset 0 0 60px rgba(124, 135, 247, 0.2);"
	></div>
</a>
