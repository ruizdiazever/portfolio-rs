import type {
    ActivityOverview,
    ActivityRepository,
    Week,
} from "$lib/components/landing/contributions/types";

const TTL = 15 * 60 * 1000;

type Snapshot = {
    at: number;
    weeks: Week[];
    totalContributions: number;
    activity: ActivityOverview;
};

const emptyActivity: ActivityOverview = {
    commits: 0,
    pullRequests: 0,
    issues: 0,
    reviews: 0,
    repositories: [],
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
                        commitContributionsByRepository(maxRepositories: 100) {
                            contributions(first: 1) {
                                totalCount
                            }
                            repository {
                                nameWithOwner
                                url
                                owner {
                                    login
                                    avatarUrl
                                }
                            }
                        }
                        pullRequestContributions(first: 1) {
                            totalCount
                        }
                        issueContributions(first: 1) {
                            totalCount
                        }
                        pullRequestReviewContributions(first: 1) {
                            totalCount
                        }
                    }
                }
            }`,
        }),
        signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) throw new Error(`GitHub ${response.status}`);

    const { data } = await response.json();
    const collection = data?.user?.contributionsCollection;
    const calendar = collection?.contributionCalendar;

    const repositories: ActivityRepository[] = (
        collection?.commitContributionsByRepository ?? []
    )
        .map(
            (entry: {
                contributions: { totalCount: number };
                repository: {
                    nameWithOwner: string;
                    url: string;
                    owner: { login: string; avatarUrl: string };
                };
            }) => ({
                nameWithOwner: entry.repository.nameWithOwner,
                url: entry.repository.url,
                owner: entry.repository.owner,
                contributions: entry.contributions.totalCount,
            }),
        )
        .filter((entry: ActivityRepository) => entry.contributions > 0)
        .sort(
            (a: ActivityRepository, b: ActivityRepository) =>
                b.contributions - a.contributions,
        );

    return {
        at: Date.now(),
        weeks: calendar?.weeks ?? [],
        totalContributions: calendar?.totalContributions ?? 0,
        activity: {
            commits: repositories.reduce(
                (total: number, entry: ActivityRepository) =>
                    total + entry.contributions,
                0,
            ),
            pullRequests:
                collection?.pullRequestContributions?.totalCount ?? 0,
            issues: collection?.issueContributions?.totalCount ?? 0,
            reviews:
                collection?.pullRequestReviewContributions?.totalCount ?? 0,
            repositories,
        },
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
            return (
                snapshot ?? {
                    at: 0,
                    weeks: [],
                    totalContributions: 0,
                    activity: emptyActivity,
                }
            );
        })
        .finally(() => {
            inFlight = undefined;
        });

    return inFlight;
}
