<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { getLocale } from "@paraglide/runtime";

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

    const words = getLocale() === "zh" ? wordsZh : wordsEn;

    let index = 0;
    let currentWord = $state(words[index]);
    let visible = $state(false);
    let animate = $state(false);

    function changeWord() {
        index = (index + 1) % words.length;
        currentWord = words[index];
    }

    onMount(() => {
        visible = true;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        animate = true;
        const interval = setInterval(changeWord, 10000);
        return () => clearInterval(interval);
    });
</script>

{#if visible}
    {#if animate}
        {#key currentWord}
            <div>
                <div class="centered" out:fly={{ y: -10, duration: 250 }}>
                    {#each currentWord as char, i}
                        <span
                            in:fade|global={{ delay: i * 20, duration: 250 }}
                        >
                            {char}
                        </span>
                    {/each}
                </div>
            </div>
        {/key}
    {:else}
        <div class="centered">{currentWord}</div>
    {/if}
{/if}

<style>
    .centered span {
        will-change: filter;
    }
</style>
