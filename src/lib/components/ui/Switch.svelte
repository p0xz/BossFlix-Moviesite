<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet<[]>;
		event: (
			event: MouseEvent & {
				currentTarget: EventTarget & HTMLButtonElement;
			}
		) => void;
		condition: boolean;
	}

	let { event, condition, children }: Props = $props();
</script>

<button type="button" onclick={event}>
	<label
		for="autonext-check"
		class="flex cursor-pointer items-center gap-x-2 rounded-md bg-secondary p-3 text-sm"
	>
		<p>{@render children?.()}</p>

		{#if condition}
			<span class="font-medium text-accent-hover">On</span>
		{:else}
			<span class="font-medium text-accent-error">Off</span>
		{/if}
	</label>
</button>
