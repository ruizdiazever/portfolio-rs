import type { Week } from "$lib/components/landing/contributions/types";

const TTL = 15 * 60 * 1000;

type Snapshot = {
    at: number;
    weeks: Week[];
    totalContributions: number;
};

let snapshot: Snapshot | undefined;
let inFlight: Promise<Snapshot> | undefined;

async function fetchSnapshot(token: string): Promise<Snapshot> {
    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `{
                user(login: "ruizdiazever") {
                    contributionsCollection {
                        contributionCalendar {
                            weeks {
                                contributionDays {
                                    date
                                    contributionCount
                                }
                            }
                            totalContributions
                        }
                    }
                }
            }`,
        }),
        signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) throw new Error(`GitHub ${response.status}`);

    const { data } = await response.json();
    const calendar =
        data?.user?.contributionsCollection?.contributionCalendar;

    return {
        at: Date.now(),
        weeks: calendar?.weeks ?? [],
        totalContributions: calendar?.totalContributions ?? 0,
    };
}

export async function getGithubContributions(
    token: string,
): Promise<Snapshot> {
    if (snapshot && Date.now() - snapshot.at < TTL) return snapshot;
    if (inFlight) return inFlight;

    inFlight = fetchSnapshot(token)
        .then((next) => {
            snapshot = next;
            return next;
        })
        .catch((error) => {
            console.error("Error fetching GitHub contributions:", error);
            return snapshot ?? { at: 0, weeks: [], totalContributions: 0 };
        })
        .finally(() => {
            inFlight = undefined;
        });

    return inFlight;
}
