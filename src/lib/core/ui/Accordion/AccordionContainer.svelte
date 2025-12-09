<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props {
		children: Snippet;
		class?: HTMLAttributes<HTMLUListElement>['class'];
	}

	let { children, class: className }: Props = $props();
</script>

<ul role="list" class={['accordion-container', className]}>
	{@render children?.()}
</ul>
