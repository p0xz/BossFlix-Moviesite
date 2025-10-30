<script lang="ts">
	import { page } from '$app/state';
</script>

<h1 class="flex h-full flex-col items-center justify-center text-5xl font-medium">
	{page.status}
	<span class="font-Chewy">{page.error?.message}</span>
</h1>
