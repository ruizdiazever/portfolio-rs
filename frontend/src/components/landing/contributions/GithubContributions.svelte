<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import type { Week } from "./types";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import dayjs from "dayjs";
    import advancedFormat from "dayjs/plugin/advancedFormat";
    import type { Snippet } from "svelte";
    import { getLocale } from "@paraglide/runtime";
    import "dayjs/locale/zh";

    interface Props {
        weeks: Week[];
        totalContributions: number;
        gitHubIcon?: Snippet;
    }

    let { weeks, totalContributions, gitHubIcon }: Props = $props();

    dayjs.extend(advancedFormat);

    // Set locale based on language tag
    dayjs.locale(getLocale() === "zh" ? "zh" : "en");

    let monthLabels: { month: string; offset: number }[] = $state([]);
    let visible = $state(false);

    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format(
            getLocale() === "zh" ? "M月D日" : "MMM Do",
        );
    };

    const contributionLabel = (day: Week["contributionDays"][number]) =>
        getLocale() === "zh"
            ? `${day.contributionCount}个贡献于${formatDate(day.date)}`
            : `${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"} on ${formatDate(day.date)}`;

    const calculateMonths = () => {
        const months = new Map<string, number>();
        weeks.forEach((week, index) => {
            const firstDay = week.contributionDays[0]?.date;
            if (firstDay) {
                const month = dayjs(firstDay).format(
                    getLocale() === "zh" ? "M月" : "MMM",
                );
                if (!months.has(month)) {
                    months.set(month, index);
                }
            }
        });
        return Array.from(months).map(([month, offset]) => ({ month, offset }));
    };

    onMount(() => {
        monthLabels = calculateMonths();
        visible = true;
    });
</script>

<div
    class="border rounded-lg px-2 sm:px-6 py-3 relative mt-3 h-[170px] md:h-[220px]"
    transition:fade={{ duration: prefersReducedMotion ? 0 : 300 }}
>
    <div
        class="flex justify-between items-center mb-4"
        transition:fly={{ y: prefersReducedMotion ? 0 : 20, duration: prefersReducedMotion ? 0 : 400 }}
    >
        <div
            class="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center sm:text-left"
        >
            {totalContributions}
            {getLocale() === "zh"
                ? "个贡献在过去一年"
                : "contributions in the last year"}
        </div>
        <a
            href="https://github.com/ruizdiazever"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            class="text-muted-foreground hover:text-primary transition-[color,transform]
            duration-200 ease-in-out hover:scale-110 focus:scale-110"
        >
            {@render gitHubIcon?.()}
        </a>
    </div>

    {#if visible}
        <div class="overflow-x-auto">
        <div class="relative min-w-[560px]" transition:fade={{ duration: prefersReducedMotion ? 0 : 500 }}>
            <Tooltip.Provider>
                <div
                    class="grid grid-flow-col grid-rows-7 gap-1 sm:gap-1.5"
                    style="grid-template-columns: repeat(51, minmax(0, 1fr))"
                >
                    {#each weeks as week}
                        {#each week.contributionDays as day}
                            <Tooltip.Root>
                                <Tooltip.Trigger aria-label={contributionLabel(day)}>
                                    <div
                                        class="w-2 h-2 sm:w-3 sm:h-3 rounded-sm cursor-pointer relative transition-transform hover:scale-125 border"
                                        class:opacity-50={day.contributionCount ===
                                            0}
                                        style="background-color: rgba(38, 166, 65, {Math.min(
                                            day.contributionCount / 10,
                                            1,
                                        )})"
                                    ></div>
                                </Tooltip.Trigger>
                                <Tooltip.Content side="top" sideOffset={4}>
                                    <p>{contributionLabel(day)}</p>
                                </Tooltip.Content>
                            </Tooltip.Root>
                        {/each}
                    {/each}
                </div>
            </Tooltip.Provider>

            <div
                class="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400 h-4"
            >
                {#each monthLabels as label}
                    <div
                        class="first:ml-0 ml-[-{(label.offset * 100) / 51}%]"
                        style="flex: 0 0 {100 / monthLabels.length}%"
                    >
                        {label.month}
                    </div>
                {/each}
            </div>
        </div>
        </div>
    {/if}
</div>
