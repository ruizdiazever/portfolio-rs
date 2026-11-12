<script>
    import { onMount } from "svelte";
    import { Toaster } from "svelte-sonner";

    let theme = $state("light");

    onMount(() => {
        const root = document.documentElement;
        const sync = () => {
            theme = root.classList.contains("dark") ? "dark" : "light";
        };
        sync();

        const observer = new MutationObserver(sync);
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });

        return () => observer.disconnect();
    });
</script>

<Toaster {theme} closeButton />
