<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import Heart from "@lucide/svelte/icons/heart";
    import Smile from "@lucide/svelte/icons/smile";
    import Meh from "@lucide/svelte/icons/meh";
    import Frown from "@lucide/svelte/icons/frown";
    import Loader from "@lucide/svelte/icons/loader";
    import Send from "@lucide/svelte/icons/send";
    import XIcon from "@lucide/svelte/icons/x";
    import * as m from "@paraglide/messages.js";
    import { postFeedback } from "$lib/common/postFeedback";
    import { toast } from "svelte-sonner";

    interface Props {
        id: string;
        title: string;
        language: string;
    }
    let { id, title, language }: Props = $props();

    let showFeedback = $state(false);
    let dialogEl = $state<HTMLDialogElement | null>(null);
    let selectedReaction = $state(0);
    let message = $state("");
    let error = $state("");
    let loading = $state(false);
    const maxLength = 500;

    $effect(() => {
        if (!dialogEl) return;
        if (showFeedback && !dialogEl.open) {
            dialogEl.showModal();
        } else if (!showFeedback && dialogEl.open) {
            dialogEl.close();
        }
    });

    const openFeedback = (reaction: number) => {
        selectedReaction = reaction;
        showFeedback = true;
    };

    const handleDialogClose = () => {
        showFeedback = false;
    };

    $effect(() => {
        const dialog = dialogEl;
        if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;

        const outside = (event: PointerEvent) => {
            const rect = dialog.getBoundingClientRect();
            return (
                event.clientX < rect.left ||
                event.clientX > rect.right ||
                event.clientY < rect.top ||
                event.clientY > rect.bottom
            );
        };

        let pressedOutside = false;
        const onPointerDown = (event: PointerEvent) => {
            pressedOutside = outside(event);
        };
        const onPointerUp = (event: PointerEvent) => {
            if (pressedOutside && outside(event)) dialog.close();
            pressedOutside = false;
        };

        dialog.addEventListener("pointerdown", onPointerDown);
        dialog.addEventListener("pointerup", onPointerUp);
        return () => {
            dialog.removeEventListener("pointerdown", onPointerDown);
            dialog.removeEventListener("pointerup", onPointerUp);
        };
    });

    const validate = () => {
        if (message.length < 1) {
            error = m.feedbackEnterError();
            return false;
        }
        if (message.length > maxLength) {
            error = m.feedbackLengthError();
            return false;
        }
        error = "";
        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            document.getElementById("feedback-message")?.focus();
            return;
        }

        loading = true;
        const success = await postFeedback(
            id,
            selectedReaction,
            message,
            title,
            language,
        );

        if (success) {
            toast.success(m.feedbackSubmitted());
            showFeedback = false;
            message = "";
        } else {
            toast.error(m.feedbackError());
        }
        loading = false;
    };
</script>

<div
    class="flex items-center mx-auto justify-center px-6 py-1 w-fit text-sm mt-10 gap-x-4 bg-background rounded-full border border-border"
>
    <p class="text-muted-foreground">{m.feedbackLegend()}</p>
    <div class="flex items-center">
        <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 hover:bg-muted hover:text-foreground rounded-full transition-[background-color,color,transform] duration-200 ease-out hover:scale-105"
            onclick={() => openFeedback(4)}
            aria-label={m.reactionLove()}
        >
            <Heart class="h-5 w-5" />
        </Button>

        <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 hover:bg-muted hover:text-foreground rounded-full transition-[background-color,color,transform] duration-200 ease-out hover:scale-105"
            onclick={() => openFeedback(3)}
            aria-label={m.reactionHappy()}
        >
            <Smile class="h-5 w-5" />
        </Button>

        <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 hover:bg-muted hover:text-foreground rounded-full transition-[background-color,color,transform] duration-200 ease-out hover:scale-105"
            onclick={() => openFeedback(2)}
            aria-label={m.reactionNeutral()}
        >
            <Meh class="h-5 w-5" />
        </Button>

        <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 hover:bg-muted hover:text-foreground rounded-full transition-[background-color,color,transform] duration-200 ease-out hover:scale-105"
            onclick={() => openFeedback(1)}
            aria-label={m.reactionSad()}
        >
            <Frown class="h-5 w-5" />
        </Button>
    </div>
</div>

<dialog
    bind:this={dialogEl}
    closedby="any"
    aria-labelledby="feedback-title"
    onclose={handleDialogClose}
    class="feedback-dialog m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-lg border bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10"
>
    <Button
        variant="ghost"
        type="button"
        size="icon-sm"
        class="absolute top-2 right-2"
        aria-label={m.close()}
        onclick={() => dialogEl?.close()}
    >
        <XIcon />
    </Button>

    <h2 id="feedback-title" class="text-xl font-medium tracking-[-0.012em]">
        {m.feedback()}
    </h2>

    <form
        method="dialog"
        class="mt-4 grid gap-4"
        onsubmit={(event) => {
            event.preventDefault();
            handleSubmit();
        }}
    >
        <div class="space-y-4">
            <div class="relative">
                <label for="feedback-message" class="sr-only">{m.feedback()}</label>
                <Textarea
                    id="feedback-message"
                    name="feedback"
                    autocomplete="off"
                    autofocus
                    bind:value={message}
                    placeholder={m.feedbackPlaceholder()}
                    class="min-h-[100px] resize-none"
                    maxlength={maxLength}
                    aria-invalid={error ? "true" : undefined}
                    aria-describedby={error ? "feedback-error" : undefined}
                    oninput={validate}
                />
                <span
                    class="absolute right-2 bottom-2 text-sm text-muted-foreground"
                >
                    {message.length}/{maxLength}
                </span>
            </div>
            <div class="h-6">
                {#if error}
                    <p
                        id="feedback-error"
                        role="alert"
                        class="text-sm text-destructive"
                    >
                        {error}
                    </p>
                {/if}
            </div>
        </div>

        <div class="flex justify-end">
            <Button type="submit" disabled={loading}>
                {#if loading}
                    <Loader class="mr-1 h-4 w-4 animate-spin" />
                {:else}
                    <Send class="mr-1 h-4 w-4" />
                {/if}
                {m.submit()}
            </Button>
        </div>
    </form>
</dialog>

<style>
    .feedback-dialog:modal {
        overscroll-behavior: contain;
    }

    .feedback-dialog::backdrop {
        background: rgb(0 0 0 / 0.8);
        backdrop-filter: blur(4px);
        overflow: hidden;
        overscroll-behavior: contain;
    }

    .feedback-dialog[open] {
        animation: feedback-dialog-in 200ms var(--ease-out);
    }

    @keyframes feedback-dialog-in {
        from {
            opacity: 0;
            transform: scale(0.96);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .feedback-dialog[open] {
            animation: none;
        }
    }
</style>
