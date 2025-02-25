<script lang="ts">
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import * as m from "@paraglide/messages.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import Languages from "lucide-svelte/icons/languages";
    import { setLang } from "$lib/common/cookies";

    let position = $state("bottom");
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger
        role="button"
        aria-label={m.language()}
        title={m.language()}
        class={buttonVariants({ variant: "ghost", size: "icon" })}
    >
        <div class="flex items-center">
            <Languages class="h-4 w-4" />
        </div>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-fit">
        <DropdownMenu.RadioGroup bind:value={position}>
            <DropdownMenu.Item
                class="cursor-pointer ease-in duration-150"
                onclick={() => setLang("en")}
            >
                {m.english()}
            </DropdownMenu.Item>
            <DropdownMenu.Item
                class="cursor-pointer ease-in duration-150"
                onclick={() => setLang("zh")}
            >
                {m.chinese()}
            </DropdownMenu.Item>
        </DropdownMenu.RadioGroup>
    </DropdownMenu.Content>
</DropdownMenu.Root>
