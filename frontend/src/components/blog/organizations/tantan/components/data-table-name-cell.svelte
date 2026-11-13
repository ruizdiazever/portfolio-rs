<script lang="ts">
    import { iconData } from "../data/data";
    import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";
    import { getLocale } from "@paraglide/runtime";

    let {
        value,
        labelValue,
        url,
        id,
    }: { value?: string | number; labelValue?: string; url?: string; id?: string } =
        $props();

    const icon = $derived(
        labelValue === "founder"
            ? iconData[0]
            : labelValue === "platinum"
              ? iconData[1]
              : labelValue === "gold"
                ? iconData[2]
                : labelValue === "silver"
                  ? iconData[3]
                  : null,
    );
</script>

<div class="flex items-center space-x-2">
    {#if id === "name"}
        <a
            class="group flex items-center hover:underline duration-150 cursor-pointer font-medium"
            href={url}
            rel="noopener"
            target="_blank"
        >
            {value}
            <ArrowUpRight
                name="arrow-up-right"
                size="1rem"
                class="duration-200 group-hover:translate-x-[1.5px]"
            />
        </a>
    {:else}
        <span class="max-w-[500px] truncate font-medium" title={typeof value === "string" ? value : undefined}>
            {value}
        </span>
    {/if}
    {#if icon}
        <div class="tooltip" title={icon.title[getLocale()]}>
            <icon.icon class={icon.color} size={16} />
        </div>
    {/if}
</div>
