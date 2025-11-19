<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props {
		class?: HTMLAttributes<HTMLDivElement>['class'];
	}

	let { class: className }: Props = $props();
</script>

<div
	class={['relative aspect-2/3 w-80 animate-pulse overflow-hidden rounded-3xl border border-white/5 bg-neutral-900 shadow-xl', className]}
>
	<div class="absolute inset-0 bg-white/5"></div>

	<div class="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-body via-body/40 to-transparent opacity-50"></div>

	<div class="absolute inset-x-2 bottom-2 rounded-2xl border border-white/5 bg-white/5 p-4">
		<div class="mb-2 h-5 w-3/4 rounded bg-white/20"></div>

		<div class="mb-4 h-3 w-1/2 rounded bg-white/10"></div>

		<div class="flex gap-2">
			<div class="h-5 w-12 rounded bg-white/10"></div>
			<div class="h-5 w-16 rounded bg-white/10"></div>
		</div>
	</div>
</div>
