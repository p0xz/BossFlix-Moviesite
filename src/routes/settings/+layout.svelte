<script lang="ts">
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<div>
	{@render children()}
</div>

<style>
</style>
