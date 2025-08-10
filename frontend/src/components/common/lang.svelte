<script lang="ts">
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import Languages from "@lucide/svelte/icons/languages";
    import { cn } from "$lib/common/utils";
    import { getLocale, locales, setLocale } from "@paraglide/runtime";
  
    let value = $state(getLocale());
  
    function handleLanguageChange(lang: "en" | "zh") {
      setLocale(lang);
      value = lang;
    }
  </script>
  
  <DropdownMenu.Root>
    <DropdownMenu.Trigger
      role="button"
      aria-label="Language"
      class={`${buttonVariants({ variant: "ghost", size: "icon" })} cursor-pointer`}
    >
      <div class="flex items-center">
        <Languages class="h-4 w-4" />
      </div>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content preventScroll={false} align="start" class="mt-2">
      <DropdownMenu.RadioGroup bind:value class="flex flex-col gap-[6px]">
        {#each locales as lang}
          <DropdownMenu.RadioItem
            value={lang}
            class={cn(
              "flex items-center gap-3 cursor-pointer ease-in duration-150",
              getLocale() === lang && "bg-secondary",
            )}
            onclick={() => handleLanguageChange(lang)}
          >
            {#if lang === "en"}
              <p>English</p>
            {:else if lang === "zh"}
              <p>中文</p>
            {/if}
          </DropdownMenu.RadioItem>
        {/each}
      </DropdownMenu.RadioGroup>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
  