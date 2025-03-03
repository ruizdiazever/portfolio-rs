export interface ContributionDay {
  date: string;
  contributionCount: number;
}

export interface Week {
  contributionDays: ContributionDay[];
}

export interface GitHubContributionsResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        weeks: Week[];
        totalContributions: number;
      };
    };
  };
}
