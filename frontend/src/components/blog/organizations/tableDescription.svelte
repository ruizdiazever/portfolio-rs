<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import { iconData } from "./tantan/data/data";
</script>

<h1 id="icon" class="blog-content-title my-3">
    <a href="#icon">Meaning of icons</a>
</h1>

<Table.Root
    class="border rounded w-full text-sm md:text-md bg-white dark:bg-black"
>
    <Table.Header>
        <Table.Row class="h-8 py-2">
            <Table.Head class="py-2">Icon</Table.Head>
            <Table.Head class="py-2">Description</Table.Head>
        </Table.Row>
    </Table.Header>
    <Table.Body>
        {#each iconData as { icon, color, description }}
            <Table.Row class="h-8 py-2">
                <Table.Cell class="py-2"
                    ><svelte:component
                        this={icon}
                        class={color}
                        size={16}
                    /></Table.Cell
                >
                <Table.Cell class="py-2">{description}</Table.Cell>
            </Table.Row>
        {/each}
    </Table.Body>
</Table.Root>
