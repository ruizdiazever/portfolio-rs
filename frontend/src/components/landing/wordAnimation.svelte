<script>
    import { fade, fly } from "svelte/transition";
    import { languageTag } from "@paraglide/runtime";

    const wordsEn = [
        "Rust Developer",
        "Design Enthusiast",
        "Dev",
        "Software Engineer",
    ];

    const wordsZh = [
        "Rust 开发者",
        "设计爱好者",
        "开发者",
        "软件工程师",
        "企业家",
        "创始人",
    ];

    const words = languageTag() === "zh" ? wordsZh : wordsEn;

    let index = Math.floor(Math.random() * words.length);
    let currentWord = $state(words[index]);
    let visible = $state(false);

    function changeWord() {
        index = (index + 1) % words.length;
        currentWord = words[index];
    }
    $effect(() => {
        visible = true;
        const interval = setInterval(changeWord, 10000);
        return () => clearInterval(interval);
    });
</script>

{#key currentWord}
    {#if visible}
        <div>
            <div class="centered" out:fly={{ y: -20, duration: 1000 }}>
                {#each currentWord as char, i}
                    <span
                        in:fade|global={{ delay: 200 + i * 150, duration: 800 }}
                    >
                        {char}
                    </span>
                {/each}
            </div>
        </div>
    {/if}
{/key}

<style>
    .centered span {
        will-change: filter;
    }
</style>
