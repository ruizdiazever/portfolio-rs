use crate::layouts::clean::CleanLayout;
use leptos::*;

#[component]
pub fn Test() -> impl IntoView {
    view! {
        <CleanLayout>
            <div class="relative min-h-screen">
            <article class="prose prose-gray max-w-3xl mx-auto px-4 py-12 md:px-6 md:py-16 lg:py-20">
                <div class="space-y-2 not-prose">
                <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl">The Joke Tax Chronicles</h1>
                <div class="flex items-center space-x-4 text-muted-foreground">
                    <div>
                    <span class="font-medium">John Doe</span>
                    </div>
                    <div class="text-sm">
                    <time dateTime="2023-06-23">June 23, 2023</time>
                    </div>
                </div>
                </div>
                <p>
                Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on his throne. One
                day, his advisors came to him with a problem: the kingdom was running out of money.
                </p>
                <p>
                Jokester began sneaking into the castle in the middle of the night and leaving jokes all over the place: under
                the king&apos;s pillow, in his soup, even in the royal toilet. The king was furious, but he couldn&apos;t seem
                to stop Jokester.
                </p>
                <p>
                And then, one day, the people of the kingdom discovered that the jokes left by Jokester were so funny that
                they couldn&apos;t help but laugh. And once they started laughing, they couldn&apos;t stop.
                </p>
                <figure class="lg:-mx-12 xl:-mx-20">
                <img
                    src="/placeholder.svg"
                    alt="Cover image"
                    width={1250}
                    height={340}
                    class="aspect-video overflow-hidden rounded-lg object-cover"
                />
                <figcaption class="text-center">Image caption goes here</figcaption>
                </figure>
                <p>
                The king thought long and hard, and finally came up with <a href="#">a brilliant plan</a>: he would tax the
                jokes in the kingdom.
                </p>
                <blockquote>
                &ldquo;After all,&rdquo; he said, &ldquo;everyone enjoys a good joke, so it&apos;s only fair that they should
                pay for the privilege.&rdquo;
                </blockquote>
                <h3>The Joke Tax</h3>
                <p>The king&apos;s subjects were not amused. They grumbled and complained, but the king was firm:</p>
                <ul>
                <li>1st level of puns: 5 gold coins</li>
                <li>2nd level of jokes: 10 gold coins</li>
                <li>3rd level of one-liners : 20 gold coins</li>
                </ul>
                <p>
                As a result, people stopped telling jokes, and the kingdom fell into a gloom. But there was one person who
                refused to let the king&apos;s foolishness get him down: a court jester named Jokester.
                </p>
            </article>
            <div class="fixed bottom-4 left-1/2 -translate-x-1/2 md:bottom-8 md:left-auto md:right-8 md:-translate-x-0">
                <a
                href="#"
                class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
                >
                Back
                </a>
            </div>
            </div>
        </CleanLayout>
    }
}
