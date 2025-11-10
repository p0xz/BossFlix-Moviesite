<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet<[]>;
		event: (
			event: MouseEvent & {
				currentTarget: EventTarget & HTMLButtonElement;
			},
		) => void;
		condition: boolean;
	}

	let { event, condition, children, ...props }: Props = $props();
</script>

<button type="button" onclick={event} {...props}>
	<div
		class="flex h-10 w-full cursor-pointer gap-x-2
			       rounded-md bg-brand-primary-150/15 px-3 py-2 text-sm text-primary shadow-lg
			       ring-1 ring-white/10 backdrop-blur-md hover:bg-brand-primary-150/25 hover:text-neutral-100"
	>
		<p>{@render children?.()}</p>

		{#if condition}
			<span class="font-medium text-brand-primary-200">On</span>
		{:else}
			<span class="font-medium text-brand-red-200">Off</span>
		{/if}
	</div>
</button>
