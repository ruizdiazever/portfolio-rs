<script lang="ts">
    import type { Week } from "./types";
    import type { Snippet } from "svelte";
    import { getLocale } from "@paraglide/runtime";
    import * as m from "@paraglide/messages.js";

    interface Props {
        weeks: Week[];
        totalContributions: number;
        gitHubIcon?: Snippet;
    }

    let { weeks, totalContributions, gitHubIcon }: Props = $props();

    const locale = getLocale() === "zh" ? "zh-CN" : "en-US";
    const numberFormatter = new Intl.NumberFormat(locale);
    const formattedTotal = numberFormatter.format(totalContributions);
    const dayFormatter = new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
    });
    const monthFormatter = new Intl.DateTimeFormat(locale, {
        month: "short",
    });
    const columnCount = Math.max(weeks.length, 1);

    const parseDay = (dateString: string) => new Date(`${dateString}T00:00:00`);
    const formatDate = (dateString: string) => dayFormatter.format(parseDay(dateString));

    const contributionLabel = (day: Week["contributionDays"][number]) =>
        getLocale() === "zh"
            ? `${day.contributionCount}个贡献于${formatDate(day.date)}`
            : `${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"} on ${formatDate(day.date)}`;

    const months = new Map<string, number>();
    weeks.forEach((week, index) => {
        const firstDay = week.contributionDays[0]?.date;
        if (!firstDay) return;
        const month = monthFormatter.format(parseDay(firstDay));
        if (!months.has(month)) months.set(month, index);
    });
    const monthLabels = Array.from(months).map(([month, offset]) => ({
        month,
        offset,
    }));
</script>

<div
    class="border rounded-lg bg-card p-4 sm:p-5 relative mt-3"
    data-contributions
>
    <div class="flex justify-between items-center mb-5">
        <div
            class="text-sm font-medium text-foreground text-center sm:text-left tabular-nums"
        >
            {formattedTotal}
            {getLocale() === "zh"
                ? "个贡献在过去一年"
                : "contributions in the last year"}
        </div>
        <a
            href="https://github.com/ruizdiazever"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={getLocale() === "zh" ? "GitHub 主页" : "GitHub profile"}
            class="inline-flex size-7 items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
            {@render gitHubIcon?.()}
        </a>
    </div>

    {#if weeks.length === 0}
        <p class="flex h-[100px] items-center justify-center text-sm text-muted-foreground">
            {m.contributionsUnavailable()}
        </p>
    {:else}
        <div class="relative">
            <div class="contributions-scroller overflow-x-auto [scrollbar-width:thin]">
                <div class="relative min-w-[560px]">
                    <div
                        class="grid grid-flow-col grid-rows-7 gap-1 sm:gap-1.5"
                        style={`grid-template-columns: repeat(${columnCount}, minmax(0, 1fr))`}
                        role="img"
                        aria-label={getLocale() === "zh" ? `${formattedTotal} 个贡献在过去一年` : `${formattedTotal} contributions in the last year`}
                    >
                        {#each weeks as week}
                            {#each week.contributionDays as day}
                                <div
                                    class="aspect-square w-full rounded-sm border"
                                    class:opacity-50={day.contributionCount === 0}
                                    style="background-color: rgba(38, 166, 65, {Math.min(
                                        day.contributionCount / 10,
                                        1,
                                    )})"
                                    title={contributionLabel(day)}
                                    aria-hidden="true"
                                ></div>
                            {/each}
                        {/each}
                    </div>

                    <div
                        class="relative mt-2 h-4 text-xs text-muted-foreground"
                    >
                        {#each monthLabels as label}
                            <span
                                class="absolute whitespace-nowrap"
                                style={`left: ${(label.offset / columnCount) * 100}%`}
                            >
                                {label.month}
                            </span>
                        {/each}
                    </div>
                </div>
            </div>
            <div
                class="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-background to-transparent sm:hidden"
                aria-hidden="true"
            ></div>
        </div>
        <p class="mt-2 text-xs text-muted-foreground sm:hidden">
            {m.swipeContributions()}
        </p>
        <div class="mt-3 flex items-center justify-end gap-2 text-xs text-muted-foreground">
            <span>{m.contributionsLess()}</span>
            <div class="flex items-center gap-1" aria-hidden="true">
                {#each [0, 1, 2, 3, 4] as level}
                    <span
                        class="size-2.5 rounded-sm border"
                        class:opacity-50={level === 0}
                        style="background-color: rgba(38, 166, 65, {level / 4})"
                    ></span>
                {/each}
            </div>
            <span>{m.contributionsMore()}</span>
        </div>
    {/if}
</div>

<style>
    @media (max-width: 639px) {
        .contributions-scroller {
            mask-image: linear-gradient(
                to right,
                black calc(100% - 2rem),
                transparent
            );
        }
    }

    .contributions-scroller::-webkit-scrollbar {
        height: 4px;
    }

    .contributions-scroller::-webkit-scrollbar-thumb {
        border-radius: 999px;
        background: var(--border);
    }

    .contributions-scroller::-webkit-scrollbar-track {
        background: transparent;
    }
</style>
