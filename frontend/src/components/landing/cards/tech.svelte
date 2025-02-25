<script lang="ts">
    import * as Popover from "$lib/components/ui/popover/index.js";
    import type { Snippet } from "svelte";

    interface Props {
        name: string;
        description: string;
        icon?: Snippet;
        link?: Snippet;
    }

    let { name, description, icon, link }: Props = $props();
</script>

<Popover.Root>
    <Popover.Trigger>{@render icon?.()}</Popover.Trigger>
    <Popover.Content class="max-w-[300px] p-4 space-y-3">
        <p class="flex items-center gap-2 text-xl">{name} {@render icon?.()}</p>
        <hr />
        <p class="text-md text-muted-foreground">{description}</p>
        <br>
        {@render link?.()}
    </Popover.Content>
</Popover.Root>
