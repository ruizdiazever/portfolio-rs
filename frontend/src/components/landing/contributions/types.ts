export interface ContributionDay {
    date: string;
    contributionCount: number;
}

export interface Week {
    contributionDays: ContributionDay[];
}

export interface ContributionOwner {
    login: string;
    avatarUrl: string;
}

export interface ActivityRepository {
    nameWithOwner: string;
    url: string;
    owner: ContributionOwner;
    contributions: number;
}

export interface ActivityOverview {
    commits: number;
    pullRequests: number;
    issues: number;
    reviews: number;
    repositories: ActivityRepository[];
}

export interface GitHubContributionsResponse {
    user: {
        contributionsCollection: {
            contributionCalendar: {
                weeks: Week[];
                totalContributions: number;
            };
            commitContributionsByRepository: {
                contributions: { totalCount: number };
                repository: {
                    nameWithOwner: string;
                    url: string;
                    owner: ContributionOwner;
                };
            }[];
            pullRequestContributions: { totalCount: number };
            issueContributions: { totalCount: number };
            pullRequestReviewContributions: { totalCount: number };
        };
    };
}
