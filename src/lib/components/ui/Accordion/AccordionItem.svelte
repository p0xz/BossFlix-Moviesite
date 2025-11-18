<script lang="ts">
	import { Icon } from '$lib/icons';
	import type { Snippet } from 'svelte';

	interface Props {
		title: Snippet;
		children: Snippet;
		name?: string;
		open?: boolean;
	}

	let { title, children, name, open = false }: Props = $props();

	let isOpen = $state(false);
</script>

<li role="listitem" class="w-full">
	<details ontoggle={() => (isOpen = !isOpen)} class="accordion-details" {name} {open}>
		<summary class="flex cursor-pointer items-center justify-between gap-2 font-medium select-none">
			{@render title?.()}

			<Icon.Linear.ArrowUp class={['size-5 fill-white transition-transform duration-500', isOpen ? 'rotate-180' : 'rotate-0']} />
		</summary>

		<div class="ml-px">
			{@render children?.()}
		</div>
	</details>
</li>

<style>
	.accordion-details::details-content {
		overflow: hidden;
		height: 0;
		transition:
			height 0.5s,
			content-visibility 0.5s;

		transition-behavior: allow-discrete;
	}

	.accordion-details[open]::details-content {
		height: auto;
	}
</style>
