use crate::utils::config::{get_projects_from_json, get_posts_from_json, get_experience_from_json};
use crate::components::blog::card::CardPostBlog;
use crate::components::experience::entry::Experience;
use crate::components::project::card::ProjectCard;
use crate::layouts::layout::Layout;
use leptos::*;

const DESCRIPTION: &str =
    "Hello, I'm Ever, a Senior Software Engineer.";

const SUB_DESCRIPTION: &str = "I am passionate about cutting-edge technology, design and science and I like to combine them to create innovative solutions.";

#[component]
pub fn Home() -> impl IntoView {
    let posts = get_posts_from_json();
    let projects = get_projects_from_json();
    let experiences = get_experience_from_json();

    // Projects
    let project_cards = projects.into_iter().map(|project| {
        view! {
            <ProjectCard
                github=false
                human_id=project.human_id
                title=project.title
                description=project.description
                url=project.url
                repository="https://github.com/ruizdiazever/portfolio-rs".to_string()
                blank=false
            />
        }
    }).collect::<Vec<_>>();

    // Blog posts
    let posts_cards = posts.into_iter().map(|post| {
        view! {
            <CardPostBlog
                id=post.id.to_string()
                title=post.title
                description=post.description
                url=post.url
                readtime=post.readtime
                date=post.date
                tags=post.tags
            />
        }
    }).collect::<Vec<_>>();

    // Experiences
    let experiences_entries = experiences.into_iter().map(|ex| {
        view! {
            <Experience
                date=ex.date
                title=ex.title
                company=ex.company
                description=ex.description
                url=ex.url
            />
        }
    }).collect::<Vec<_>>();

    view! {
        <Layout>
            // Childrens
            <p class="text-gray-600 text-lg text-left">
                {DESCRIPTION}
                <br/>
                {SUB_DESCRIPTION}
            </p>

            // Blog
            <h1 class="text-2xl font-medium mt-6">Blog</h1>
            {posts_cards}

            // Projects
            <h1 class="text-2xl font-medium mt-6">Projects</h1>
            <div class="grid gap-4 grid-cols-1 md:grid-cols-2 place-items-center">
                {project_cards}
            </div>

            // Experience
            <h1 class="text-2xl font-medium mt-6">Experience</h1>
            <div class="relative flex flex-col gap-4">
                  <div class="after:absolute after:inset-y-0 after:w-px after:bg-gray-500/20 relative pl-6 after:left-0 grid gap-10">
                    {experiences_entries}
                  </div>
            </div>
        </Layout>
    }
}
