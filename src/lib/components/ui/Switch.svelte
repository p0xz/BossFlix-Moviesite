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
		class="flex cursor-pointer items-center gap-x-2 rounded-md bg-brand-primary-150/15 p-3 text-sm"
	>
		<p>{@render children?.()}</p>

		{#if condition}
			<span class="font-medium text-brand-primary-200">On</span>
		{:else}
			<span class="font-medium text-brand-red-200">Off</span>
		{/if}
	</label>
</button>
