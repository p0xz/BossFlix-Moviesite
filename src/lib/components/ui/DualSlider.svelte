<script lang="ts">
	import { quintOut } from 'svelte/easing';
	// 1. Import 'Tween' instead of 'tweened'
	import { Tween } from 'svelte/motion';

	// --- PROPS ---
	let {
		min = 1900,
		max = 2024,
		step = 1,
		// Use $bindable for two-way binding on the values
		values = $bindable([1950, 2000]),
	}: {
		min?: number;
		max?: number;
		step?: number;
		values: [number, number];
	} = $props();

	// --- REFS ---
	let trackRef: HTMLDivElement;

	// --- INTERNAL STATE ---
	// 2. Use 'new Tween()' instead of 'tweened()'
	const minVal = new Tween(values[0], { duration: 100, easing: quintOut });
	const maxVal = new Tween(values[1], { duration: 100, easing: quintOut });
	// This effect syncs the component if the prop is changed externally
	$effect(() => {
		minVal.set(values[0], { duration: 0 });
		maxVal.set(values[1], { duration: 0 });
	});

	// --- DERIVED STATE for CSS ---
	// These calculate the 'left' percentages for the thumbs and fill
	// This logic remains the same
	const minPercent = $derived.by(() => ((minVal.current - min) / (max - min)) * 100);
	const maxPercent = $derived.by(() => ((maxVal.current - min) / (max - min)) * 100);

	// --- CORE LOGIC ---

	/** Calculates the new value from a pointer event (mouse/touch) */
	function getValueFromPointer(e: PointerEvent): number {
		if (!trackRef) return 0;
		const rect = trackRef.getBoundingClientRect();
		const clickX = e.clientX - rect.left; // X position relative to track
		const percent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));

		let value = min + (percent / 100) * (max - min);

		// Snap to the nearest step
		return min + Math.round((value - min) / step) * step;
	}

	/** Handles the start of a drag on one of the thumbs */
	function handlePointerDown(e: PointerEvent, thumb: 'min' | 'max') {
		e.preventDefault(); // Prevent text selection
		(e.target as HTMLElement).setPointerCapture(e.pointerId);

		const onPointerMove = (moveEvent: PointerEvent) => {
			const newValue = getValueFromPointer(moveEvent);

			if (thumb === 'min') {
				// Prevent crossing or getting closer than one step
				if (newValue > maxVal.current - step) {
					minVal.set(maxVal.current - step);
					return;
				}
				minVal.set(newValue); // Update the tweened value
			} else {
				// Prevent crossing or getting closer than one step
				if (newValue < minVal.current + step) {
					maxVal.set(minVal.current + step);
					return;
				}
				maxVal.set(newValue);
			}
		};

		const onPointerUp = () => {
			(e.target as HTMLElement).releasePointerCapture(e.pointerId);
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerup', onPointerUp);

			// --- IMPORTANT ---
			// Update the bindable 'values' prop *only on release*
			// This syncs the state with the parent component.
			values = [minVal.current, maxVal.current];
		};

		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', onPointerUp);
	}

	/** Handles a click on the track to jump the nearest thumb */
	function handleTrackClick(e: PointerEvent) {
		if (!trackRef) return;
		// Don't do anything if we clicked a thumb
		if ((e.target as HTMLElement).role === 'slider') return;

		const newValue = getValueFromPointer(e);
		const distToMin = Math.abs(newValue - minVal.current);
		const distToMax = Math.abs(newValue - maxVal.current);

		if (distToMin <= distToMax) {
			// Use <= to handle equidistant clicks
			// Click is closer to min thumb
			const finalNewMin = Math.min(newValue, maxVal.current - step); // Enforce step gap
			minVal.set(finalNewMin);
			values = [finalNewMin, maxVal.current];
		} else {
			// Click is closer to max thumb
			const finalNewMax = Math.max(newValue, minVal.current + step); // Enforce step gap
			maxVal.set(finalNewMax);
			values = [minVal.current, finalNewMax];
		}
	}
</script>

<!-- 
  The component's HTML.
  It's styled with Tailwind and uses your theme's colors.
-->
<div class="flex w-full flex-col items-center px-2">
	<!-- 1. Display Labels -->
	<div class="flex w-full justify-between text-sm font-medium text-brand-primary-90">
		<span>{minVal.current.toFixed(0)}</span>
		<span>{maxVal.current.toFixed(0)}</span>
	</div>

	<!-- 2. Slider Track -->
	<div bind:this={trackRef} class="relative my-2 h-2 w-full cursor-pointer rounded-full bg-neutral-850" onpointerdown={handleTrackClick}>
		<!-- 3. Range Fill (the blue part) -->
		<div class="absolute h-2 rounded-full bg-brand-primary-100" style="left: {minPercent}%; width: {maxPercent - minPercent}%;"></div>

		<!-- 4. Min Thumb -->
		<button
			type="button"
			role="slider"
			aria-label="Minimum year"
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={minVal.current}
			class="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white shadow-lg focus:ring-2 focus:ring-brand-primary-100 focus:outline-none"
			style="left: {minPercent}%;"
			onpointerdown={(e) => handlePointerDown(e, 'min')}
		>
		</button>

		<!-- 5. Max Thumb -->
		<button
			type="button"
			role="slider"
			aria-label="Maximum year"
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={maxVal.current}
			class="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white shadow-lg focus:ring-2 focus:ring-brand-primary-100 focus:outline-none"
			style="left: {maxPercent}%;"
			onpointerdown={(e) => handlePointerDown(e, 'max')}
		>
		</button>
	</div>
</div>
