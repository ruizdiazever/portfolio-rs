<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import Heart from "lucide-svelte/icons/heart";
    import Smile from "lucide-svelte/icons/smile";
    import Meh from "lucide-svelte/icons/meh";
    import Frown from "lucide-svelte/icons/frown";
    import Loader from "lucide-svelte/icons/loader";
    import Send from "lucide-svelte/icons/send";
    import { postFeedback } from "$lib/common/postFeedback";
    import { toast } from "svelte-sonner";

    interface Props {
        id: string;
        title: string;
        language: string;
    }
    let { id, title, language }: Props = $props();

    let showFeedback = $state(false);
    let selectedReaction = $state(0);
    let message = $state("");
    let error = $state("");
    let loading = $state(false);
    const maxLength = 500;

    const openFeedback = (reaction: number) => {
        selectedReaction = reaction;
        showFeedback = true;
    };

    const validate = () => {
        if (message.length < 1) {
            error = "Please enter your feedback";
            return false;
        }
        if (message.length > maxLength) {
            error = `Feedback must be ${maxLength} characters or less`;
            return false;
        }
        error = "";
        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        loading = true;
        const success = await postFeedback(
            id,
            selectedReaction,
            message,
            title,
            language,
        );

        if (success) {
            toast.success("Feedback submitted successfully");
            showFeedback = false;
            message = "";
        } else {
            toast.error("Failed to submit feedback");
        }
        loading = false;
    };
</script>

<div
    class="flex items-center mx-auto justify-center px-6 py-1 w-fit text-sm mt-10 gap-x-4 bg-background shadow-sm rounded-full border border-border"
>
    <p class="text-muted-foreground">Was this helpful?</p>
    <div class="flex items-center">
        <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 hover:bg-[#35c758] hover:text-white rounded-full dark:hover:bg-[#35c758]/80 transition-all duration-300 ease-in-out transform hover:scale-110"
            onclick={() => openFeedback(4)}
        >
            <Heart class="h-5 w-5" />
        </Button>

        <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 hover:bg-[#32ade6] hover:text-white rounded-full dark:hover:bg-[#32ade6]/80 transition-all duration-300 ease-in-out transform hover:scale-110"
            onclick={() => openFeedback(3)}
        >
            <Smile class="h-5 w-5" />
        </Button>

        <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 hover:bg-[#ffcc01] hover:text-white rounded-full dark:hover:bg-[#ffcc01]/80 transition-all duration-300 ease-in-out transform hover:scale-110"
            onclick={() => openFeedback(2)}
        >
            <Meh class="h-5 w-5" />
        </Button>

        <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 hover:bg-[#ff3c2f] hover:text-white rounded-full dark:hover:bg-[#ff3c2f]/80 transition-all duration-300 ease-in-out transform hover:scale-110"
            onclick={() => openFeedback(1)}
        >
            <Frown class="h-5 w-5" />
        </Button>
    </div>
</div>

<Dialog.Root bind:open={showFeedback}>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title class="text-xl font-normal">Feedback</Dialog.Title>
        </Dialog.Header>

        <div class="space-y-4 mb-4">
            <div class="relative">
                <Textarea
                    bind:value={message}
                    placeholder="Enter your feedback"
                    class="min-h-[100px] resize-none"
                    maxlength={maxLength}
                    oninput={validate}
                />
                <span
                    class="absolute bottom-2 right-2 text-sm text-muted-foreground"
                >
                    {message.length}/{maxLength}
                </span>
            </div>
            {#if error}
                <p class="text-sm text-red-500">{error}</p>
            {/if}
        </div>

        <Dialog.Footer>
            <Button onclick={handleSubmit} class="text-md" disabled={loading}>
                {#if loading}
                    <Loader class="h-4 w-4 mr-1 animate-spin" />
                {:else}
                    <Send class="h-4 w-4 mr-1" />
                {/if}
                Submit
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
