<script>
    import Sun from "@lucide/svelte/icons/sun";
    import MoonStar from "@lucide/svelte/icons/moon-star";
    import Laptop from "@lucide/svelte/icons/laptop";
    import { resetMode, setMode } from "mode-watcher";
    import { Button } from "$lib/components/ui/button/index.ts";
    import { onMount } from "svelte";

    let storedMode = $state();
    let selected =
        "border border-gray-200 dark:border-gray-800 rounded-full text-gray-900 dark:text-gray-100";
    let noSelect = "text-gray-500 dark:text-gray-600";

    onMount(() => {
        storedMode = localStorage.getItem("mode-watcher-mode") || "system";
    });

    function updateMode(mode) {
        storedMode = mode;
        localStorage.setItem("mode-watcher-mode", mode);
        if (mode === "system") {
            resetMode();
        } else {
            setMode(mode);
        }
    }
</script>

<div
    class="flex max-w-fit items-center rounded-2xl border border-gray-200 dark:border-gray-800 gap-1"
>
    <span class="sr-only">Display theme selector</span>
    <Button
        class="size-6 p-1 hover:scale-110 transition-all cursor-pointer
        {storedMode === 'system' ? selected : noSelect}"
        onclick={() => updateMode("system")}
        variant="ghost"
    >
        <Laptop />
    </Button>
    <Button
        class="size-6 p-1 hover:scale-110 transition-all cursor-pointer
        {storedMode === 'light' ? selected : noSelect}"
        onclick={() => updateMode("light")}
        variant="ghost"
    >
        <Sun />
    </Button>
    <Button
        class="size-6 p-1 hover:scale-110 transition-all cursor-pointer
        {storedMode === 'dark' ? selected : noSelect}"
        onclick={() => updateMode("dark")}
        variant="ghost"
    >
        <MoonStar />
    </Button>
</div>
