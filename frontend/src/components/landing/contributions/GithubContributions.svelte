<script lang="ts">
    import type { ActivityOverview, Week } from "./types";
    import { getLocale } from "@paraglide/runtime";
    import * as m from "@paraglide/messages.js";
    import { slide } from "svelte/transition";
    import { prefersReducedMotion } from "svelte/motion";
    import * as Collapsible from "$lib/components/ui/collapsible/index.js";
    import ActivityRadar from "./ActivityRadar.svelte";

    interface Props {
        weeks: Week[];
        totalContributions: number;
        activity: ActivityOverview;
    }

    let { weeks, totalContributions, activity }: Props = $props();

    const locale = getLocale() === "zh" ? "zh-CN" : "en-US";
    const numberFormatter = new Intl.NumberFormat(locale);
    const formattedTotal = numberFormatter.format(totalContributions);
    const dayFormatter = new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
    });
    const monthFormatter = new Intl.DateTimeFormat(locale, { month: "short" });
    const weekdayFormatter = new Intl.DateTimeFormat(locale, {
        weekday: "short",
    });
    const columnCount = Math.max(weeks.length, 1);
    const cellSize = 9;
    const cellGap = 3;
    const cellPitch = cellSize + cellGap;
    const graphWidth = columnCount * cellPitch;
    const githubProfileUrl = "https://github.com/ruizdiazever";
    const learnMoreUrl =
        "https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/viewing-contributions-on-your-profile";

    let activityOpen = $state(false);

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

    const weekdayLabels = [1, 3, 5].map((day, index) => ({
        label: weekdayFormatter.format(new Date(Date.UTC(2024, 0, day))),
        row: index * 2 + 2,
    }));

    const levels = [0, 1, 2, 3, 4] as const;
    const levelFor = (count: number) => {
        if (count === 0) return 0;
        if (count < 5) return 1;
        if (count < 10) return 2;
        if (count < 20) return 3;
        return 4;
    };
    const levelColor = (level: number) =>
        level === 0
            ? "transparent"
            : `rgba(38, 166, 65, ${[0, 0.22, 0.42, 0.68, 1][level]})`;

    const activityTotal = $derived(
        activity.commits +
            activity.pullRequests +
            activity.issues +
            activity.reviews,
    );

    const topRepositories = $derived(activity.repositories.slice(0, 3));
    const otherRepositoryCount = $derived(
        Math.max(activity.repositories.length - topRepositories.length, 0),
    );

    const allOwners = $derived(
        Array.from(
            new Map(
                activity.repositories.map((repository) => [
                    repository.owner.login,
                    repository.owner,
                ]),
            ).values(),
        ),
    );
    const owners = $derived(allOwners.slice(0, 3));
    const repositorySeparator = getLocale() === "zh" ? "、" : ", ";
</script>

<div
    class="border rounded-lg bg-card relative overflow-hidden"
    data-contributions
>
    <div class="flex items-start justify-between gap-3 p-4 pb-3 sm:items-center">
        <p
            class="text-md font-medium text-foreground tabular-nums sm:text-base"
        >
            {formattedTotal}
            {getLocale() === "zh"
                ? "个贡献在过去一年"
                : "contributions in the last year"}
        </p>
        <a
            href={githubProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={m.viewGithubProfile()}
            class="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
        >
            <svg
                viewBox="0 0 24 24"
                class="size-4"
                fill="currentColor"
                aria-hidden="true"
            >
                <path
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                />
            </svg>
            <span class="hidden sm:inline">{m.viewGithubProfile()}</span>
        </a>
    </div>

    <div class="px-4 pb-4">
        {#if weeks.length === 0}
            <p
                class="flex h-[100px] items-center justify-center text-sm text-muted-foreground"
            >
                {m.contributionsUnavailable()}
            </p>
        {:else}
            <div class="flex gap-2">
                <div
                    class="w-6 shrink-0 pt-5 text-[10px] leading-none text-muted-foreground"
                    aria-hidden="true"
                >
                    <div
                        class="grid gap-[3px]"
                        style="grid-template-rows: repeat(7, 9px)"
                    >
                        {#each weekdayLabels as label}
                            <span style={`grid-row: ${label.row}`}>{label.label}</span>
                        {/each}
                    </div>
                </div>

                <div class="min-w-0 flex-1">
                    <div
                        class="contributions-scroller overflow-x-auto [scrollbar-width:thin]"
                    >
                        <div
                            class="relative"
                            style={`min-width: ${graphWidth}px`}
                        >
                            <div class="relative h-5 text-[11px] text-muted-foreground">
                                {#each monthLabels as label}
                                    <span
                                        class="absolute top-0 whitespace-nowrap"
                                        style={`left: ${label.offset * cellPitch}px`}
                                    >
                                        {label.month}
                                    </span>
                                {/each}
                            </div>
                            <div
                                class="grid grid-flow-col grid-rows-7 gap-[3px]"
                                style={`grid-template-columns: repeat(${columnCount}, ${cellSize}px)`}
                                role="img"
                                aria-label={getLocale() === "zh"
                                    ? `${formattedTotal} 个贡献在过去一年`
                                    : `${formattedTotal} contributions in the last year`}
                            >
                                {#each weeks as week}
                                    {#each week.contributionDays as day}
                                        {@const level = levelFor(
                                            day.contributionCount,
                                        )}
                                        <div
                                            class="size-[9px] rounded-[2px] border border-border"
                                            style={`background-color: ${levelColor(level)}`}
                                            title={contributionLabel(day)}
                                            aria-hidden="true"
                                        ></div>
                                    {/each}
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="mt-3 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
            >
                <a
                    href={learnMoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-fit text-secondary-foreground underline decoration-border underline-offset-4 hover:text-foreground"
                >
                    {m.learnHowWeCount()}
                </a>
                <div class="flex items-center justify-end gap-2">
                    <span>{m.contributionsLess()}</span>
                    <div class="flex items-center gap-1" aria-hidden="true">
                        {#each levels as level}
                            <span
                                class="size-2.5 rounded-[2px] border border-border"
                                style={`background-color: ${levelColor(level)}`}
                            ></span>
                        {/each}
                    </div>
                    <span>{m.contributionsMore()}</span>
                </div>
            </div>
            <p class="mt-2 text-xs text-muted-foreground sm:hidden">
                {m.swipeContributions()}
            </p>
        {/if}
    </div>

    <Collapsible.Root bind:open={activityOpen}>
        <Collapsible.Trigger
            class="flex w-full items-center justify-between gap-3 border-t border-border px-4 py-3 text-left transition-colors duration-150 hover:bg-muted/40"
        >
            <span class="flex min-w-0 items-center gap-2">
                <svg
                    viewBox="0 0 24 24"
                    class="size-4 shrink-0 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                >
                    <path d="M3 12h4l2-7 4 14 2-7h6" />
                </svg>
                <span class="text-sm font-medium text-foreground"
                    >{m.activityOverview()}</span
                >
                <span
                    class="hidden truncate text-xs font-normal text-muted-foreground sm:inline"
                >
                    {activityTotal > 0
                        ? m.publicContributions({ count: activityTotal })
                        : m.noContributionActivity()}
                </span>
            </span>
            <svg
                viewBox="0 0 24 24"
                class={`size-4 shrink-0 text-muted-foreground transition-transform duration-150 ${activityOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
                <path d="m6 9 6 6 6-6" />
            </svg>
        </Collapsible.Trigger>
        <Collapsible.Content forceMount>
            {#if activityOpen}
                <div
                    transition:slide={{
                        duration: $prefersReducedMotion ? 0 : 180,
                    }}
                >
                    <div class="border-t border-border px-4 pb-5 pt-4">
                        {#if activityTotal === 0 && activity.repositories.length === 0}
                            <p class="text-sm text-muted-foreground">
                                {m.noContributionActivity()}
                            </p>
                        {:else}
                            <div class="flex flex-wrap gap-2">
                                {#each owners as owner}
                                    <a
                                        href={`https://github.com/${owner.login}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-background px-2 text-sm text-foreground transition-colors hover:bg-muted"
                                    >
                                        <span
                                            class="relative inline-flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-[2px] border border-border bg-muted text-[10px] font-medium uppercase text-muted-foreground"
                                            aria-hidden="true"
                                        >
                                            {owner.login.slice(0, 1)}
                                            <img
                                                src={owner.avatarUrl}
                                                alt=""
                                                width="20"
                                                height="20"
                                                loading="lazy"
                                                class="absolute inset-0 size-full object-cover"
                                                onerror={(event) =>
                                                    event.currentTarget.remove()}
                                            />
                                        </span>
                                        <span class="max-w-[12rem] truncate"
                                            >@{owner.login}</span
                                        >
                                    </a>
                                {/each}
                                {#if allOwners.length > owners.length}
                                    <a
                                        href={githubProfileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="inline-flex h-8 items-center rounded-md border border-border bg-background px-3 text-sm text-secondary-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    >
                                        {m.more()}
                                    </a>
                                {/if}
                            </div>

                            <div
                                class="mt-5 grid gap-6 md:grid-cols-[minmax(0,1fr)_300px] md:items-start md:gap-6"
                            >
                                <div class="min-w-0 space-y-3">
                                    <p class="text-sm leading-6 text-secondary-foreground">
                                        {#if topRepositories.length > 0}
                                            <span class="text-muted-foreground"
                                                >{m.contributedTo()}</span
                                            >
                                            {#each topRepositories as repository, index}
                                                <a
                                                    href={repository.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    class="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                                                    >{repository.nameWithOwner}</a
                                                >{#if index < topRepositories.length - 1}{repositorySeparator}{/if}
                                            {/each}
                                            {#if otherRepositoryCount === 1}
                                                {m.andOneOtherRepository()}
                                            {:else if otherRepositoryCount > 1}
                                                {m.andOtherRepositories({
                                                    count: otherRepositoryCount,
                                                })}
                                            {/if}
                                        {:else}
                                            {m.noContributionActivity()}
                                        {/if}
                                    </p>
                                    <p class="text-xs text-muted-foreground">
                                        {m.activityPublicNote()}
                                    </p>
                                    <dl class="grid grid-cols-2 gap-2">
                                        {#each [
                                            { label: m.commits(), value: activity.commits },
                                            { label: m.pullRequests(), value: activity.pullRequests },
                                            { label: m.issues(), value: activity.issues },
                                            { label: m.codeReview(), value: activity.reviews },
                                        ] as stat}
                                            <div
                                                class="rounded-md border border-border bg-muted/20 px-2.5 py-2"
                                            >
                                                <dt class="text-xs text-muted-foreground">
                                                    {stat.label}
                                                </dt>
                                                <dd class="text-md font-medium tabular-nums text-foreground">
                                                    {numberFormatter.format(stat.value)}
                                                </dd>
                                            </div>
                                        {/each}
                                    </dl>
                                </div>

                                <div
                                    class="min-w-0 md:border-l md:border-border md:pl-6"
                                >
                                    {#if activityTotal > 0}
                                        <ActivityRadar
                                            commits={activity.commits}
                                            pullRequests={activity.pullRequests}
                                            issues={activity.issues}
                                            reviews={activity.reviews}
                                        />
                                    {/if}
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
            {/if}
        </Collapsible.Content>
    </Collapsible.Root>
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
