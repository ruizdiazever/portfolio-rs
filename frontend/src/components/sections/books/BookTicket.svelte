<script lang="ts">
    import { onMount } from "svelte";
    import { Dialog as DialogPrimitive } from "bits-ui";
    import X from "@lucide/svelte/icons/x";

    interface BookPayload {
        index: number;
        title: string;
        author: string;
        description: string;
        genre: string;
        year: number;
        type: string;
        format: string;
        coverSrc: string;
        coverAvif: string;
        coverWebp: string;
    }

    interface Labels {
        by: string;
        published: string;
        type: string;
        format: string;
        genre: string;
        notes: string;
        book: string;
        close: string;
        tapToFlip: string;
        tapToCover: string;
    }

    let { labels }: { labels: Labels } = $props();

    let open = $state(false);
    let book = $state<BookPayload | null>(null);
    let flipped = $state(false);
    let reduce = $state(false);
    let lastTrigger: HTMLButtonElement | null = null;

    let stageEl: HTMLDivElement;
    let tiltEl: HTMLDivElement;
    let ticketEl: HTMLDivElement;
    let glareEl: HTMLDivElement;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const clamp = (value: number, min: number, max: number) =>
        Math.min(max, Math.max(min, value));

    function openBook(payload: BookPayload) {
        book = payload;
        flipped = false;
        targetX = 0;
        targetY = 0;
        currentX = 0;
        currentY = 0;
        if (tiltEl) tiltEl.style.transform = "rotateX(0deg) rotateY(0deg)";
        if (ticketEl) {
            ticketEl.style.setProperty("--ox", "0px");
            ticketEl.style.setProperty("--oy", "0px");
        }
        if (glareEl) {
            glareEl.style.setProperty("--go", "0.35");
            glareEl.style.setProperty("--gx", "50%");
            glareEl.style.setProperty("--gy", "30%");
        }
        open = true;
    }

    function flip() {
        flipped = !flipped;
    }

    $effect(() => {
        if (open || !lastTrigger) return;
        const trigger = lastTrigger;
        lastTrigger = null;
        requestAnimationFrame(() => trigger.focus());
    });

    let frame = 0;

    function loop() {
        if (tiltEl && !reduce) {
            currentX += (targetX - currentX) * 0.14;
            currentY += (targetY - currentY) * 0.14;
            tiltEl.style.transform = `rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;
            if (ticketEl) {
                ticketEl.style.setProperty("--ox", `${(currentY * 0.6).toFixed(2)}px`);
                ticketEl.style.setProperty("--oy", `${(-currentX * 0.6).toFixed(2)}px`);
            }
        }
        frame = requestAnimationFrame(loop);
    }

    $effect(() => {
        if (!open) {
            cancelAnimationFrame(frame);
            frame = 0;
            return;
        }
        frame = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(frame);
            frame = 0;
        };
    });

    function handleKeydown(event: KeyboardEvent) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        flip();
    }

    function handlePointerMove(event: PointerEvent) {
        if (reduce || !stageEl || !ticketEl) return;

        const rect = stageEl.getBoundingClientRect();
        const nx = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
        const ny = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);

        targetX = -ny * 10;
        targetY = nx * 12;

        if (glareEl) {
            glareEl.style.setProperty("--gx", `${(nx + 1) * 50}%`);
            glareEl.style.setProperty("--gy", `${(ny + 1) * 50}%`);
            glareEl.style.setProperty("--go", "0.85");
        }
    }

    function handlePointerLeave() {
        targetX = 0;
        targetY = 0;
        if (glareEl) glareEl.style.setProperty("--go", "0.35");
    }

    onMount(() => {
        const media = matchMedia("(prefers-reduced-motion: reduce)");
        const syncMotion = () => {
            reduce = media.matches;
            if (reduce) {
                targetX = 0;
                targetY = 0;
                currentX = 0;
                currentY = 0;
                if (tiltEl) tiltEl.style.transform = "none";
                if (ticketEl) {
                    ticketEl.style.setProperty("--ox", "0px");
                    ticketEl.style.setProperty("--oy", "0px");
                }
            }
        };
        syncMotion();
        media.addEventListener("change", syncMotion);

        const onClick = (event: Event) => {
            const trigger = event.currentTarget as HTMLButtonElement;
            const data = trigger.dataset.book;
            if (!data) return;
            lastTrigger = trigger;
            try {
                openBook(JSON.parse(data) as BookPayload);
            } catch {
                // Ignore malformed card payloads.
            }
        };

        const triggers = Array.from(
            document.querySelectorAll<HTMLButtonElement>(".book-card-open"),
        );
        triggers.forEach((trigger) => trigger.addEventListener("click", onClick));
        document.documentElement.dataset.bookTicketReady = "true";

        return () => {
            triggers.forEach((trigger) =>
                trigger.removeEventListener("click", onClick),
            );
            media.removeEventListener("change", syncMotion);
            cancelAnimationFrame(frame);
            delete document.documentElement.dataset.bookTicketReady;
        };
    });
</script>

<DialogPrimitive.Root bind:open>
    <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
            class="data-open:animate-in data-closed:animate-out data-open:fade-in-0 data-closed:fade-out-0 fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm duration-200"
        />
        <DialogPrimitive.Content
            class="fixed top-1/2 left-1/2 z-[70] w-[min(86vw,360px,56vh)] -translate-x-1/2 -translate-y-1/2 outline-none"
        >
            <DialogPrimitive.Close
                aria-label={labels.close}
                class="absolute -top-12 right-0 z-20 grid size-9 place-items-center rounded-md border border-white/15 bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
                <X class="h-4 w-4" />
            </DialogPrimitive.Close>

            {#if book}
                <DialogPrimitive.Title class="sr-only">
                    {book.title}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description class="sr-only">
                    {book.description}
                </DialogPrimitive.Description>

                <div
                    class="stage"
                    bind:this={stageEl}
                    onpointermove={handlePointerMove}
                    onpointerleave={handlePointerLeave}
                >
                    <div class="tilt" bind:this={tiltEl}>
                        <div
                            class="ticket"
                            bind:this={ticketEl}
                            role="button"
                            tabindex="0"
                            aria-pressed={flipped}
                            aria-label={`${book.title}. ${labels.tapToFlip}`}
                            onclick={flip}
                            onkeydown={handleKeydown}
                            data-book-ticket
                        >
                            <div
                                class="flip"
                                class:flipped
                                class:reduced={reduce}
                            >
                                <div class="face front">
                                    <div class="cover">
                                        <picture>
                                            <source
                                                type="image/avif"
                                                srcset={book.coverAvif}
                                                sizes="(min-width: 400px) 360px, 86vw"
                                            />
                                            <source
                                                type="image/webp"
                                                srcset={book.coverWebp}
                                                sizes="(min-width: 400px) 360px, 86vw"
                                            />
                                            <img
                                                src={book.coverSrc}
                                                alt=""
                                                loading="eager"
                                                decoding="async"
                                            />
                                        </picture>
                                        <div class="front-shade"></div>
                                        <div class="glare" bind:this={glareEl}></div>
                                    </div>

                                    <span class="flip-hint">{labels.tapToFlip}</span>

                                    <div class="front-copy">
                                        <span class="front-badge">
                                            {labels.book}
                                            {String(book.index).padStart(2, "0")}
                                        </span>
                                        <div class="front-title">{book.title}</div>
                                        <div class="front-meta">
                                            {labels.by}{book.author}
                                            <span class="dot">·</span>
                                            {book.year}
                                        </div>
                                    </div>
                                </div>

                                <div class="face back">
                                    <div class="back-scroll">
                                        <div class="back-head">
                                            <span>{labels.notes}</span>
                                            <span>
                                                {labels.book}
                                                {String(book.index).padStart(2, "0")}
                                            </span>
                                        </div>
                                        <div class="back-title">{book.title}</div>
                                        <p class="byline">
                                            {labels.by}{book.author}
                                        </p>
                                        <p class="description">{book.description}</p>

                                        <dl class="meta">
                                            <div>
                                                <dt>{labels.published}</dt>
                                                <dd>{book.year}</dd>
                                            </div>
                                            <div>
                                                <dt>{labels.type}</dt>
                                                <dd>{book.type}</dd>
                                            </div>
                                            <div>
                                                <dt>{labels.format}</dt>
                                                <dd>{book.format}</dd>
                                            </div>
                                            <div>
                                                <dt>{labels.genre}</dt>
                                                <dd>{book.genre}</dd>
                                            </div>
                                        </dl>

                                        <div class="barcode" aria-hidden="true"></div>
                                        <p class="back-hint">{labels.tapToCover}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
</DialogPrimitive.Root>

<style>
    .stage {
        width: 100%;
        perspective: 1100px;
    }

    .tilt {
        transform-style: preserve-3d;
        will-change: transform;
    }

    .ticket {
        position: relative;
        width: 100%;
        aspect-ratio: 3 / 4;
        border-radius: 24px;
        transform-style: preserve-3d;
        cursor: pointer;
        outline: none;
        will-change: transform;
    }

    .flip {
        position: absolute;
        inset: 0;
        transform-style: preserve-3d;
        transition: transform 640ms cubic-bezier(0.34, 1.35, 0.64, 1);
    }

    .flip.flipped {
        transform: rotateY(180deg);
    }

    .flip.reduced {
        transition: none;
    }

    .face {
        position: absolute;
        inset: 0;
        overflow: hidden;
        border-radius: 24px;
        background: var(--card);
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        box-shadow: inset 0 0 0 1px var(--border);
    }

    .back {
        transform: rotateY(180deg);
    }

    .cover {
        position: absolute;
        inset: 0;
        overflow: hidden;
        border-radius: inherit;
    }

    .cover picture,
    .cover img {
        display: block;
        width: 100%;
        height: 100%;
    }

    .cover img {
        object-fit: cover;
        transform: translate(calc(var(--ox, 0px) * 0.35), calc(var(--oy, 0px) * 0.35))
            scale(1.04);
    }

    .front-shade {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.08) 0%,
            transparent 38%,
            rgba(0, 0, 0, 0.62) 70%,
            rgba(0, 0, 0, 0.95) 100%
        );
    }

    .glare {
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: var(--go, 0.35);
        background: radial-gradient(
            220px circle at var(--gx, 50%) var(--gy, 30%),
            rgba(255, 255, 255, 0.24),
            transparent 65%
        );
        mix-blend-mode: screen;
        transition: opacity 200ms ease;
    }

    .flip-hint {
        position: absolute;
        top: 14px;
        right: 14px;
        z-index: 2;
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.48);
        padding: 4px 9px;
        color: rgba(255, 255, 255, 0.86);
        font-size: 11px;
        font-weight: 510;
        letter-spacing: 0.09em;
        line-height: 1.2;
        text-transform: uppercase;
        backdrop-filter: blur(8px);
    }

    .front-badge {
        display: inline-flex;
        margin-bottom: 8px;
        color: rgba(255, 255, 255, 0.62);
        font-size: 11px;
        font-weight: 510;
        letter-spacing: 0.1em;
        line-height: 1.2;
        text-transform: uppercase;
    }

    .front-copy {
        position: absolute;
        right: 20px;
        bottom: 20px;
        left: 20px;
        z-index: 2;
        color: #fff;
        transform: translate(
            calc(var(--ox, 0px) * 0.8),
            calc(var(--oy, 0px) * 0.8)
        );
    }

    .front-title {
        display: -webkit-box;
        overflow: hidden;
        font-size: clamp(22px, 6.4vw, 30px);
        font-weight: 510;
        letter-spacing: -0.022em;
        line-height: 1.02;
        text-wrap: balance;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }

    .front-meta {
        display: flex;
        align-items: center;
        gap: 7px;
        margin-top: 8px;
        color: rgba(255, 255, 255, 0.78);
        font-size: 12px;
        line-height: 1.3;
    }

    .dot {
        opacity: 0.5;
    }

    .back-scroll {
        display: flex;
        height: 100%;
        flex-direction: column;
        overflow-y: auto;
        overscroll-behavior: contain;
        padding: 22px;
        color: var(--card-foreground);
        scrollbar-width: none;
    }

    .back-scroll::-webkit-scrollbar {
        display: none;
    }

    .back-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        color: var(--muted-foreground);
        font-size: 11px;
        font-weight: 510;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }

    .back-title {
        margin-top: 22px;
        color: var(--foreground);
        font-size: clamp(20px, 5.8vw, 26px);
        font-weight: 510;
        letter-spacing: -0.022em;
        line-height: 1.12;
    }

    .byline {
        margin-top: 6px;
        color: var(--muted-foreground);
        font-size: 12px;
        line-height: 1.4;
    }

    .description {
        margin-top: 18px;
        color: var(--card-foreground);
        font-size: 13px;
        line-height: 1.6;
    }

    .meta {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px 16px;
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid var(--border);
    }

    .meta dt {
        color: var(--muted-foreground);
        font-size: 10px;
        font-weight: 510;
        letter-spacing: 0.09em;
        line-height: 1.3;
        text-transform: uppercase;
    }

    .meta dd {
        margin: 2px 0 0;
        color: var(--foreground);
        font-size: 12px;
        line-height: 1.4;
    }

    .barcode {
        height: 22px;
        margin-top: auto;
        background: repeating-linear-gradient(
            90deg,
            currentColor 0 1px,
            transparent 1px 3px,
            currentColor 3px 4px,
            transparent 4px 7px
        );
        background-clip: content-box;
        color: var(--muted-foreground);
        opacity: 0.55;
    }

    .back-hint {
        margin-top: 12px;
        color: var(--muted-foreground);
        font-size: 11px;
        line-height: 1.4;
        text-align: center;
    }

    @media (prefers-reduced-motion: reduce) {
        .glare {
            display: none;
        }
    }
</style>
