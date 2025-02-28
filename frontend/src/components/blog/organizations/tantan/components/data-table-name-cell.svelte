<script lang="ts">
    import { iconData } from "../data/data";
    import ArrowUpRight from "lucide-svelte/icons/arrow-up-right";

    export const labels = [
        {
            value: "platinum",
            label: "Platinum",
        },
        {
            value: "founder",
            label: "Founder",
        },
        {
            value: "gold",
            label: "Gold",
        },
        {
            value: "silver",
            label: "Silver",
        },
    ];

    let {
        value,
        labelValue,
        url,
        id,
    }: { value?: string; labelValue?: string; url?: string; id?: string } =
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
            class="group flex items-center hover:text-[#68b5fc] duration-200 cursor-pointer font-semibold"
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
        <span class="max-w-[500px] truncate font-medium">
            {value}
        </span>
    {/if}
    {#if icon}
        <div class="tooltip" title={icon.title}>
            <icon.icon class={icon.color} size={16} />
        </div>
    {/if}
</div>
