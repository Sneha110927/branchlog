
export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    default_branch: string;
    owner: {
        login: string;
    };
}

export interface GitHubBranch {
    name: string;
    commit: {
        sha: string;
    };
}

export interface GitHubCommit {
    sha: string;
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
    html_url: string;
}

const BASE_URL = "https://api.github.com";

export async function fetchUserRepos(token: string): Promise<GitHubRepo[]> {
    const res = await fetch(`${BASE_URL}/user/repos?sort=updated&per_page=100`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
        },
    });
    if (!res.ok) throw new Error("Failed to fetch repos");
    return res.json();
}

export async function fetchBranches(token: string, owner: string, repo: string): Promise<GitHubBranch[]> {
    const res = await fetch(`${BASE_URL}/repos/${owner}/${repo}/branches`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
        },
    });
    if (!res.ok) throw new Error("Failed to fetch branches");
    return res.json();
}

export async function fetchCommits(token: string, owner: string, repo: string, branch: string): Promise<GitHubCommit[]> {
    const res = await fetch(`${BASE_URL}/repos/${owner}/${repo}/commits?sha=${branch}&per_page=20`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
        },
    });
    if (!res.ok) throw new Error("Failed to fetch commits");
    return res.json();
}

export async function fetchCommitDiff(token: string, owner: string, repo: string, sha: string): Promise<string> {
    const res = await fetch(`${BASE_URL}/repos/${owner}/${repo}/commits/${sha}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3.diff",
        },
    });
    if (!res.ok) throw new Error("Failed to fetch diff");
    return res.text();
}
