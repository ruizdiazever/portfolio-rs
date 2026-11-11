import dayjs from "dayjs";
import { getPosts } from "$lib/common/getPosts";
import { getProjectsFromJson } from "$lib/common/getProjectCards";

export interface OgContent {
    kicker: string;
    title: string;
    description: string;
    footer: string;
}

const home: OgContent = {
    kicker: "Software engineer in Rome",
    title: "Ever Ruiz Diaz",
    description: "Selected work, writing, and reading, in one quiet place.",
    footer: "Rome, Italy",
};

const staticPages: Record<string, OgContent> = {
    home,
    "sections/about": {
        kicker: "About",
        title: "Ever Ruiz Diaz",
        description:
            "Software engineer, tinkerer, and Rust evangelist in Rome.",
        footer: "Rome, Italy",
    },
    "sections/contact": {
        kicker: "Contact",
        title: "Let's talk",
        description:
            "A systems problem, a Rust project, or a role in mind. Tell me what you are building.",
        footer: "Rome, Italy",
    },
    "sections/books": {
        kicker: "Reading",
        title: "Reading",
        description: "Books, papers, and comics I keep within reach.",
        footer: "Books, papers, comics",
    },
    "sections/cv": {
        kicker: "CV",
        title: "Ever Ruiz Diaz",
        description:
            "Software engineer in Rome. The current CV lives on LinkedIn.",
        footer: "linkedin.com/in/everdev",
    },
    "blog/articles": {
        kicker: "Writing",
        title: "Writing",
        description:
            "Notes on Rust, systems, and the craft of building software.",
        footer: "Rust, systems, design",
    },
};

export async function getOgContent(key: string): Promise<OgContent> {
    const normalized = key.replace(/^\/+|\/+$/g, "") || "home";

    if (staticPages[normalized]) return staticPages[normalized];

    const posts = await getPosts();
    const post = posts.find((entry) => entry.url === `/${normalized}`);
    if (post) {
        const tagCount = post.tags.length;
        return {
            kicker: "Writing",
            title: post.title.en,
            description: post.description.en,
            footer: `${dayjs(post.date).format("MMM YYYY")} · ${tagCount} ${tagCount === 1 ? "tag" : "tags"}`,
        };
    }

    const projects = await getProjectsFromJson();
    const project = projects.find((entry) => entry.url === `/${normalized}`);
    if (project) {
        return {
            kicker: "Selected work",
            title: project.title,
            description: project.description.en,
            footer: "In progress",
        };
    }

    return home;
}
