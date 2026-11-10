<script lang="ts">
	import { Questionnaire as QuestionnairePrimitive } from "@shadcn-svelte/primitives/questionnaire";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: QuestionnairePrimitive.ItemProps = $props();
</script>

<QuestionnairePrimitive.Item
	bind:ref
	data-slot="questionnaire-item"
	class={cn("flex flex-col gap-4 min-w-0 border-0 p-0 outline-none", className)}
	{...restProps}
/>
