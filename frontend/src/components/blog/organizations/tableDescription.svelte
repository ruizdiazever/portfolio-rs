<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import { iconData } from "./tantan/data/data";
    import { languageTag } from "@paraglide/runtime";
    import * as m from "@paraglide/messages.js";
</script>

<h1 id="icon" class="blog-content-title my-3">
    <a href="#icon">{m.meaningOfIcons()}</a>
</h1>

<Table.Root class="border rounded w-full text-sm bg-white dark:bg-black">
    <Table.Header>
        <Table.Row class="h-8 py-2 text-md">
            <Table.Head class="py-2">{m.icon()}</Table.Head>
            <Table.Head class="py-2">{m.description()}</Table.Head>
        </Table.Row>
    </Table.Header>
    <Table.Body>
        {#each iconData as { icon, color, description }}
            <Table.Row class="h-8 py-2">
                <Table.Cell class="py-1"
                    ><svelte:component
                        this={icon}
                        class={color}
                        size={16}
                    /></Table.Cell
                >
                <Table.Cell class="py-1"
                    >{description[languageTag()]}</Table.Cell
                >
            </Table.Row>
        {/each}
    </Table.Body>
</Table.Root>
