<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import * as m from "@paraglide/messages.js";
</script>

<Tabs.Root value="welcome" class="h-[200px] text-lg mt-6">
    <Tabs.List>
        <Tabs.Trigger class="text-xs font-mono" value="welcome"
            >Welcome</Tabs.Trigger
        >
        <Tabs.Trigger class="text-xs font-mono" value="about"
            >About</Tabs.Trigger
        >
        <Tabs.Trigger class="text-xs font-mono" value="contact"
            >Contact</Tabs.Trigger
        >
    </Tabs.List>
    <div class="px-2">
        <Tabs.Content value="welcome">
            {m.meTitle()}
            <br />
            {m.meDescription()}
        </Tabs.Content>
        <Tabs.Content value="about">About</Tabs.Content>
        <Tabs.Content value="contact">Contact</Tabs.Content>
    </div>
</Tabs.Root>
