<script lang="ts" module>
    type TData = unknown;
</script>

<script lang="ts" generics="TData">
    import Settings2 from "@lucide/svelte/icons/settings-2";
    import type { Table } from "@tanstack/table-core";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as m from "@paraglide/messages.js";

    let { table }: { table: Table<TData> } = $props();
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger
        class={buttonVariants({
            variant: "outline",
            size: "sm",
            class: "ml-auto hidden h-8 lg:flex",
        })}
    >
        <Settings2 />
        {m.view()}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Group>
            <DropdownMenu.GroupHeading>{m.columns()}</DropdownMenu.GroupHeading>
            <DropdownMenu.Separator />
            {#each table
                .getAllColumns()
                .filter((col) => typeof col.accessorFn !== "undefined" && col.getCanHide()) as column}
                <DropdownMenu.CheckboxItem
                    bind:checked={
                        () => column.getIsVisible(),
                        (v) => column.toggleVisibility(!!v)
                    }
                >
                    {#if column.id === "name"}
                        {m.name()}
                    {:else if column.id === "founded"}
                        {m.founded()}
                    {:else if column.id === "industry"}
                        {m.industry()}
                    {:else if column.id === "country"}
                        {m.country()}
                    {:else}
                        {column.id}
                    {/if}
                </DropdownMenu.CheckboxItem>
            {/each}
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>
