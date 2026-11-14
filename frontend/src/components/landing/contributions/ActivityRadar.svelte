<script lang="ts">
    import { getLocale } from "@paraglide/runtime";
    import * as m from "@paraglide/messages.js";

    interface Props {
        commits: number;
        pullRequests: number;
        issues: number;
        reviews: number;
    }

    let { commits, pullRequests, issues, reviews }: Props = $props();

    const total = $derived(commits + pullRequests + issues + reviews);
    const percentages = $derived.by(() => {
        const values = [reviews, issues, pullRequests, commits];
        if (total === 0) return [0, 0, 0, 0];
        const raw = values.map((value) => (value / total) * 100);
        const rounded = raw.map(Math.floor);
        let remaining = 100 - rounded.reduce((sum, value) => sum + value, 0);
        const byFraction = raw
            .map((value, index) => ({ index, fraction: value - rounded[index] }))
            .sort((a, b) => b.fraction - a.fraction);
        for (let index = 0; index < remaining; index++) {
            rounded[byFraction[index % byFraction.length].index] += 1;
        }
        return rounded;
    });

    const reviewsPercent = $derived(percentages[0]);
    const issuesPercent = $derived(percentages[1]);
    const pullRequestsPercent = $derived(percentages[2]);
    const commitsPercent = $derived(percentages[3]);

    const center = { x: 150, y: 130 };
    const axes = $derived([
        {
            label: m.codeReview(),
            value: reviewsPercent,
            end: { x: 150, y: 30 },
            labelAt: { x: 150, y: 10, anchor: "middle" as const },
            valueAt: { x: 150, y: 26, anchor: "middle" as const },
        },
        {
            label: m.issues(),
            value: issuesPercent,
            end: { x: 250, y: 130 },
            labelAt: { x: 292, y: 120, anchor: "end" as const },
            valueAt: { x: 292, y: 136, anchor: "end" as const },
        },
        {
            label: m.pullRequests(),
            value: pullRequestsPercent,
            end: { x: 150, y: 230 },
            labelAt: { x: 150, y: 276, anchor: "middle" as const },
            valueAt: { x: 150, y: 260, anchor: "middle" as const },
        },
        {
            label: m.commits(),
            value: commitsPercent,
            end: { x: 50, y: 130 },
            labelAt: { x: 8, y: 120, anchor: "start" as const },
            valueAt: { x: 8, y: 136, anchor: "start" as const },
        },
    ]);

    const point = (end: { x: number; y: number }, value: number) => ({
        x: center.x + (end.x - center.x) * (value / 100),
        y: center.y + (end.y - center.y) * (value / 100),
    });

    const polygon = $derived(
        axes
            .map((axis) => {
                const p = point(axis.end, axis.value);
                return `${p.x},${p.y}`;
            })
            .join(" "),
    );

    const ariaLabel = $derived(
        getLocale() === "zh"
            ? `公开贡献活动：提交 ${commitsPercent}%，拉取请求 ${pullRequestsPercent}%，议题 ${issuesPercent}%，代码审查 ${reviewsPercent}%`
            : `Public contribution activity: ${commitsPercent}% commits, ${pullRequestsPercent}% pull requests, ${issuesPercent}% issues, ${reviewsPercent}% code review`,
    );
</script>

<svg
    viewBox="0 0 300 282"
    role="img"
    aria-label={ariaLabel}
    class="mx-auto h-auto w-full max-w-[300px] text-muted-foreground"
>
    {#each axes as axis}
        <line
            x1={center.x}
            y1={center.y}
            x2={axis.end.x}
            y2={axis.end.y}
            class="text-border"
            stroke="currentColor"
            stroke-width="1"
        />
    {/each}

    {#if total > 0}
        <polygon
            points={polygon}
            fill="rgba(38, 166, 65, 0.18)"
            stroke="rgba(38, 166, 65, 0.95)"
            stroke-width="1.5"
            stroke-linejoin="round"
        />
        <circle cx={center.x} cy={center.y} r="2" fill="rgba(38, 166, 65, 0.95)" />
        {#each axes as axis}
            {@const p = point(axis.end, axis.value)}
            <circle cx={p.x} cy={p.y} r="2.4" fill="rgba(38, 166, 65, 0.95)" />
        {/each}
    {/if}

    {#each axes as axis}
        <text
            x={axis.labelAt.x}
            y={axis.labelAt.y}
            text-anchor={axis.labelAt.anchor}
            class="fill-muted-foreground text-xs"
        >
            {axis.label}
        </text>
        <text
            x={axis.valueAt.x}
            y={axis.valueAt.y}
            text-anchor={axis.valueAt.anchor}
            class="fill-foreground text-sm font-medium tabular-nums"
        >
            {axis.value}%
        </text>
    {/each}
</svg>
